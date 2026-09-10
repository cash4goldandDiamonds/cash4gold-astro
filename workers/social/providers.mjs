export class PublishingError extends Error {
 constructor(code,uncertain=false){super(code);this.code=code;this.uncertain=uncertain;}
}
export async function limitedText(response,max=2_000_000){
 if(Number(response.headers.get('content-length'))>max)throw new Error('response_too_large');
 const reader=response.body?.getReader();if(!reader)return '';
 const chunks=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max)throw new Error('response_too_large');chunks.push(value);}}finally{await reader.cancel();}
 const data=new Uint8Array(size);let offset=0;for(const chunk of chunks){data.set(chunk,offset);offset+=chunk.length;}return new TextDecoder().decode(data);
}
export function connectionHealth(env,channel,now=new Date()){
 const prefix=channel==='facebook'?'FACEBOOK_PAGE':'INSTAGRAM';
 const expiresAt=env[prefix+'_TOKEN_EXPIRES_AT'];
 const expiry=Date.parse(expiresAt||'');
 const token=channel==='facebook'?env.FACEBOOK_PAGE_TOKEN:env.INSTAGRAM_ACCESS_TOKEN;
 const id=channel==='facebook'?env.FACEBOOK_PAGE_ID:env.INSTAGRAM_ACCOUNT_ID;
 let reason=null;
 if(!/^v\d+\.0$/.test(env.META_API_VERSION||''))reason='meta_version_not_configured';
 else if(!/^\d+$/.test(id||'')||!token)reason='account_not_connected';
 else if(!Number.isFinite(expiry))reason='token_expiry_not_verified';
 else if(expiry<=now.getTime()+5*60*1000)reason='token_expired_or_expiring';
 return {channel,ready:reason===null,reason,expiresAt:Number.isFinite(expiry)?new Date(expiry).toISOString():null,renewalDue:Number.isFinite(expiry)&&expiry<=now.getTime()+7*24*60*60*1000};
}
function config(env,channel,now){
 const health=connectionHealth(env,channel,now);
 if(!health.ready)throw new PublishingError(health.reason);
 if(!/^v\d+\.0$/.test(env.META_API_VERSION||''))throw new PublishingError('meta_version_not_configured');
 const id=channel==='facebook'?env.FACEBOOK_PAGE_ID:env.INSTAGRAM_ACCOUNT_ID;
 const token=channel==='facebook'?env.FACEBOOK_PAGE_TOKEN:env.INSTAGRAM_ACCESS_TOKEN;
 if(!/^\d+$/.test(id||'')||!token)throw new PublishingError('account_not_connected');
 // Instagram Login and Facebook Login have distinct tokens/permissions; this adapter uses Instagram Login.
 return {id,token,base:`https://${channel==='facebook'?'graph.facebook.com':'graph.instagram.com'}/${env.META_API_VERSION}`};
}
async function graph(fetcher,cfg,path,method='GET',values={}){
 const url=new URL(cfg.base+'/'+path),options={method,redirect:'error',headers:{Authorization:'Bearer '+cfg.token},signal:AbortSignal.timeout(25_000)};
 if(method==='GET')url.search=new URLSearchParams(values).toString();else options.body=new URLSearchParams(values);
 let response;
 try{response=await fetcher(url,options);}catch{throw new PublishingError('provider_connection_unknown',method==='POST');}
 let body;try{body=JSON.parse(await limitedText(response,250_000));}catch{throw new PublishingError('provider_response_unknown',method==='POST');}
 // Deliberately do not log provider messages, request URLs or tokens.
 if(!response.ok||body.error)throw new PublishingError(`provider_http_${response.status}_code_${Number(body.error?.code)||0}`,method==='POST'&&response.status>=500);
 return body;
}
export async function publishSocial(job,env,{fetcher=fetch,saveContainer=async()=>{},wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),now=new Date()}={}){
 const cfg=config(env,job.channel,now);
 if(job.channel==='facebook'){
  const result=await graph(fetcher,cfg,cfg.id+'/feed','POST',{message:job.caption,link:job.link});
  if(!/^[\d_]+$/.test(result.id||''))throw new PublishingError('published_id_missing',true);
  return {providerId:result.id,providerUrl:'https://www.facebook.com/'+result.id};
 }
 const container=await graph(fetcher,cfg,cfg.id+'/media','POST',{image_url:job.imageUrl,caption:job.caption,alt_text:job.imageAlt});
 if(!/^\d+$/.test(container.id||''))throw new PublishingError('container_id_missing',true);
 await saveContainer(container.id);
 let ready=false;
 for(let attempt=0;attempt<5;attempt++){
  const status=await graph(fetcher,cfg,container.id,'GET',{fields:'status_code'});
  if(status.status_code==='FINISHED'){ready=true;break;}
  if(['ERROR','EXPIRED'].includes(status.status_code))throw new PublishingError('instagram_container_'+status.status_code.toLowerCase());
  if(status.status_code==='PUBLISHED')throw new PublishingError('instagram_container_already_published',true);
  if(attempt<4)await wait(60_000);
 }
 if(!ready)throw new PublishingError('instagram_container_not_ready');
 const published=await graph(fetcher,cfg,cfg.id+'/media_publish','POST',{creation_id:container.id});
 if(!/^\d+$/.test(published.id||''))throw new PublishingError('published_id_missing',true);
 // A permalink read failure must never turn successful publication into a retry.
 let providerUrl=null;
 try{const media=await graph(fetcher,cfg,published.id,'GET',{fields:'permalink'});const url=new URL(media.permalink);if(url.origin==='https://www.instagram.com')providerUrl=url.href;}catch{}
 return {providerId:published.id,providerUrl};
}
