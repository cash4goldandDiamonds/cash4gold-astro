import {INQUIRY_ENDPOINT,INQUIRY_MAX_BYTES,INQUIRY_MESSAGES,validateInquiry,validEmail,inquiryEmail} from '../../src/lib/inquiry.mjs';
import {handleStagingStudio} from '../../src/lib/staging-studio.mjs';
const jsonHeaders={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"};
const reply=(status,body,extra={})=>new Response(JSON.stringify(body),{status,headers:{...jsonHeaders,...extra}});
export async function limitedText(streamSource,max=INQUIRY_MAX_BYTES){
 const reader=streamSource.body?.getReader();if(!reader)return '';
 let size=0;const chunks=[];
 try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>max)throw Error('body_too_large');chunks.push(value);}}
 catch(error){await reader.cancel().catch(()=>{});throw error;}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 return new TextDecoder('utf-8',{fatal:true}).decode(bytes);
}
function permittedOrigins(env){
 return String(env.INQUIRY_ALLOWED_ORIGINS||'').split(',').map(v=>v.trim()).filter(Boolean).filter(value=>{
  try{const u=new URL(value);return u.origin===value&&(u.protocol==='https:'||(env.SITE_ENV==='preview'&&['localhost','127.0.0.1'].includes(u.hostname)));}catch{return false;}
 });
}
export function inquiryReady(env){
 return env.INQUIRY_ENABLED==='true'&&['preview','production'].includes(env.SITE_ENV)&&env.INQUIRY_PROVIDER==='resend'&&
 Boolean(env.INQUIRY_RESEND_API_KEY)&&validEmail(env.INQUIRY_FROM)&&validEmail(env.INQUIRY_TO)&&
 Boolean(env.INQUIRY_TURNSTILE_SECRET)&&/^[A-Za-z0-9_-]{10,100}$/.test(env.INQUIRY_TURNSTILE_SITE_KEY||'')&&Boolean(env.INQUIRY_RATE_LIMITER?.limit)&&permittedOrigins(env).length>0;
}
const digest=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
export async function verifyChallenge(token,request,env,fetcher=fetch){
 const response=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
  method:'POST',redirect:'manual',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.INQUIRY_TURNSTILE_SECRET,response:token,remoteip:request.headers.get('CF-Connecting-IP')||undefined}),signal:AbortSignal.timeout(10_000),
 });
 if(!response.ok){await response.body?.cancel();return false;}
 const result=JSON.parse(await limitedText(response,16_384));
 return result.success===true&&result.action==='inquiry'&&result.hostname===new URL(request.url).hostname;
}
export async function deliverInquiry(value,env,fetcher=fetch){
 const mail=inquiryEmail(value,{preview:env.SITE_ENV!=='production'});
 // Stable across retries of this exact request. Provider retains idempotency keys for 24 hours.
 // Never automatically retry an ambiguous network outcome with a new key.
 const key='inquiry/'+await digest(JSON.stringify({from:env.INQUIRY_FROM,to:env.INQUIRY_TO,email:value.email,...mail}));
 const response=await fetcher('https://api.resend.com/emails',{
  method:'POST',redirect:'manual',headers:{Authorization:'Bearer '+env.INQUIRY_RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':key},
  body:JSON.stringify({from:env.INQUIRY_FROM,to:[env.INQUIRY_TO],reply_to:value.email,...mail}),signal:AbortSignal.timeout(15_000),
 });
 if(!response.ok){await response.body?.cancel();return {accepted:false};}
 const data=JSON.parse(await limitedText(response,16_384));return {accepted:typeof data.id==='string'&&data.id.length>0};
}
export async function handleInquiry(request,env,{now=Date.now(),fetcher=fetch}={}){
 const url=new URL(request.url),allowed=permittedOrigins(env);
 if(!allowed.includes(url.origin))return reply(403,{ok:false,message:'This inquiry endpoint is unavailable on this origin.'});
 if(url.pathname===INQUIRY_ENDPOINT+'config/'&&request.method==='GET'){
  const enabled=inquiryReady(env);
  return reply(200,{enabled,siteKey:enabled?env.INQUIRY_TURNSTILE_SITE_KEY:'',message:enabled?'':INQUIRY_MESSAGES.unavailable});
 }
 if(url.pathname!==INQUIRY_ENDPOINT)return reply(404,{ok:false,message:'Not found.'});
 if(request.method!=='POST')return reply(405,{ok:false,message:'Use the inquiry form to send a message.'},{Allow:'POST'});
 if(request.headers.get('Origin')!==url.origin||['cross-site','none'].includes(request.headers.get('Sec-Fetch-Site')||''))return reply(403,{ok:false,message:'Please send the inquiry from this website.'});
 if(!inquiryReady(env))return reply(503,{ok:false,message:INQUIRY_MESSAGES.unavailable});
 if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('Content-Type')||''))return reply(415,{ok:false,message:'Unsupported form format.'});
 if(Number(request.headers.get('Content-Length')||0)>INQUIRY_MAX_BYTES)return reply(413,{ok:false,message:'Your inquiry is too long.'});
 try{
  const ip=request.headers.get('CF-Connecting-IP');if(!ip)return reply(503,{ok:false,message:INQUIRY_MESSAGES.unavailable});
  const limit=await env.INQUIRY_RATE_LIMITER.limit({key:await digest('inquiry:'+ip)});
  if(!limit.success)return reply(429,{ok:false,message:INQUIRY_MESSAGES.rate},{'Retry-After':'60'});
 }catch{return reply(503,{ok:false,message:INQUIRY_MESSAGES.unavailable});}
 let input;try{input=JSON.parse(await limitedText(request));}catch(error){return reply(error.message==='body_too_large'?413:400,{ok:false,message:INQUIRY_MESSAGES.invalid});}
 const result=validateInquiry(input,now);if(!result.ok)return reply(400,{ok:false,message:INQUIRY_MESSAGES.invalid,fields:result.fields});
 try{if(!await verifyChallenge(result.value.turnstileToken,request,env,fetcher))return reply(403,{ok:false,message:INQUIRY_MESSAGES.challenge,fields:{turnstile:'Complete the security check again.'}});}
 catch{return reply(503,{ok:false,message:INQUIRY_MESSAGES.challenge});}
 try{
  const delivery=await deliverInquiry(result.value,env,fetcher);
  if(!delivery.accepted)return reply(502,{ok:false,message:INQUIRY_MESSAGES.retry});
  return reply(202,{ok:true,state:'accepted',reference:result.value.requestId,message:INQUIRY_MESSAGES.accepted});
 }catch{return reply(502,{ok:false,message:INQUIRY_MESSAGES.retry});}
}
export default {
 async fetch(request,env){
  if(new URL(request.url).pathname.startsWith('/api/inquiry/'))return handleInquiry(request,env);
  const studio=await handleStagingStudio(request,env);if(studio)return studio;
  if(env.ASSETS?.fetch)return env.ASSETS.fetch(request);
  return new Response('Not found',{status:404,headers:{'X-Robots-Tag':'noindex'}});
 },
};
