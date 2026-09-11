import test from 'node:test';
import assert from 'node:assert/strict';
import {validateInquiry,INQUIRY_MAX_BYTES,inquiryEmail} from '../src/lib/inquiry.mjs';
import worker,{handleInquiry,deliverInquiry,inquiryReady} from '../workers/inquiry/index.mjs';
const now=Date.parse('2026-09-11T17:00:00Z');
const origin='https://preview.example';
const input=()=>({name:'Synthetic Test',email:'visitor@example.invalid',phone:'310-555-0100',itemType:'gold',message:'Synthetic test inquiry about a gold bracelet.',permission:true,website:'',startedAt:now-5000,requestId:'743a1b1e-51f9-4b58-9bc3-83a23e36f935',turnstileToken:'test-challenge-response'});
const env=()=>({SITE_ENV:'preview',INQUIRY_ENABLED:'true',INQUIRY_PROVIDER:'resend',INQUIRY_RESEND_API_KEY:'test-only-mail-key',INQUIRY_FROM:'sender@example.invalid',INQUIRY_TO:'recipient@example.invalid',INQUIRY_TURNSTILE_SECRET:'test-only-turnstile-key',INQUIRY_TURNSTILE_SITE_KEY:'test-site-key-123',INQUIRY_ALLOWED_ORIGINS:origin,INQUIRY_RATE_LIMITER:{limit:async()=>({success:true})}});
const request=(body=input(),headers={})=>new Request(origin+'/api/inquiry/',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','CF-Connecting-IP':'192.0.2.10',...headers},body:typeof body==='string'?body:JSON.stringify(body)});
const challenge=()=>Response.json({success:true,action:'inquiry',hostname:'preview.example'});
test('inquiry validation rejects malformed fields, unknown properties, header injection and absent permission',()=>{
 assert.equal(validateInquiry(input(),now).ok,true);
 for(const patch of [{name:'A'},{email:'a\r\nBcc:other@example.invalid'},{phone:'abc'},{itemType:'unexpected'},{message:'short'},{message:'x'.repeat(3001)},{permission:false},{website:'spam'},{requestId:'bad-id'},{turnstileToken:''},{extra:'anything'},{startedAt:now+1}])assert.equal(validateInquiry({...input(),...patch},now).ok,false,JSON.stringify(patch).slice(0,100));
 assert.equal(validateInquiry({...input(),phone:''},now).ok,true);
});
test('unconfigured endpoint stays unavailable and public configuration exposes no secrets',async()=>{
 const config=env();delete config.INQUIRY_RESEND_API_KEY;assert.equal(inquiryReady(config),false);
 const result=await handleInquiry(request(),config,{now,fetcher:async()=>{throw Error('must not send');}});assert.equal(result.status,503);
 const ready=await handleInquiry(new Request(origin+'/api/inquiry/config/'),env());const raw=await ready.text();assert.equal(JSON.parse(raw).enabled,true);assert.doesNotMatch(raw,/test-only-mail-key|test-only-turnstile-key|recipient@example/);
});
test('cross-origin, wrong-method, oversized and invalid JSON requests never reach the provider',async()=>{
 const options={now,fetcher:async()=>{throw Error('must not send');}};
 assert.equal((await handleInquiry(request(input(),{Origin:'https://elsewhere.invalid'}),env(),options)).status,403);
 assert.equal((await handleInquiry(new Request(origin+'/api/inquiry/'),env(),options)).status,405);
 assert.equal((await handleInquiry(request('x'.repeat(INQUIRY_MAX_BYTES+1)),env(),options)).status,413);
 assert.equal((await handleInquiry(request('{bad'),env(),options)).status,400);
 assert.equal((await handleInquiry(request(input(),{'Content-Type':'text/plain'}),env(),options)).status,415);
});
test('rate limiting precedes validation and delivery and does not retain raw IP in its key',async()=>{
 const config=env();let key;config.INQUIRY_RATE_LIMITER.limit=async data=>{key=data.key;return {success:false};};
 const result=await handleInquiry(request(),config,{now,fetcher:async()=>{throw Error('must not send');}});
 assert.equal(result.status,429);assert.equal(result.headers.get('Retry-After'),'60');assert.match(key,/^[a-f0-9]{64}$/);assert.doesNotMatch(key,/192\.0\.2/);
});
test('spam fields and challenge hostname/action failure block email',async()=>{
 for(const proof of [{success:false},{success:true,action:'other',hostname:'preview.example'},{success:true,action:'inquiry',hostname:'other.example'}]){
  let calls=0;const result=await handleInquiry(request(),env(),{now,fetcher:async url=>{calls++;assert.match(url,/siteverify$/);return Response.json(proof);}});assert.equal(result.status,403);assert.equal(calls,1);
 }
 let calls=0;const spam=await handleInquiry(request({...input(),website:'filled'}),env(),{now,fetcher:async()=>{calls++;return challenge();}});assert.equal(spam.status,400);assert.equal(calls,0);
});
test('a successful API acceptance is distinct from inbox delivery or appointment confirmation',async()=>{
 const calls=[];const result=await handleInquiry(request(),env(),{now,fetcher:async(url,options)=>{
  calls.push(url);if(url.includes('siteverify'))return challenge();const body=JSON.parse(options.body);assert.equal(body.to[0],'recipient@example.invalid');assert.equal(body.reply_to,'visitor@example.invalid');assert.match(body.subject,/^\[STAGING TEST\]/);assert.doesNotMatch(body.text,/test-challenge-response/);return Response.json({id:'synthetic-provider-id'});
 }});assert.equal(result.status,202);const body=await result.json();assert.equal(body.state,'accepted');assert.match(body.message,/not an appointment confirmation/);assert.match(body.message,/for delivery/);assert.equal(calls.length,2);assert.equal('email'in body,false);assert.equal('name'in body,false);assert.equal(result.headers.get('Cache-Control'),'private, no-store');
});
test('provider failure, malformed response and timeout never return success or retry automatically',async()=>{
 for(const mode of ['reject','malformed','timeout']){
  let sends=0;const result=await handleInquiry(request(),env(),{now,fetcher:async url=>{
   if(url.includes('siteverify'))return challenge();sends++;if(mode==='timeout')throw Error('synthetic timeout with private payload');if(mode==='reject')return new Response('private provider diagnostic',{status:500});return Response.json({});
  }});assert.equal(result.status,502);assert.equal(sends,1);assert.doesNotMatch(await result.text(),/private provider|private payload/);
 }
});
test('manual retry uses the same provider idempotency key for an unchanged inquiry',async()=>{
 const keys=[];const send=async(url,options)=>{keys.push(options.headers['Idempotency-Key']);return Response.json({id:'synthetic-provider-id'});};
 const value=validateInquiry(input(),now).value;await deliverInquiry(value,env(),send);await deliverInquiry({...value,turnstileToken:'fresh-challenge'},env(),send);await deliverInquiry({...value,message:'Different synthetic inquiry'},env(),send);
 assert.equal(keys[0],keys[1]);assert.notEqual(keys[1],keys[2]);assert.doesNotMatch(keys.join(' '),/visitor|Synthetic|192\.0/);
});
test('unrelated page requests retain the static assets handler',async()=>{
 const result=await worker.fetch(new Request(origin+'/sell-your-golds/'),{ASSETS:{fetch:async req=>new Response(new URL(req.url).pathname)}});assert.equal(await result.text(),'/sell-your-golds/');
 assert.match(inquiryEmail(validateInquiry(input(),now).value,{preview:false}).subject,/^Website inquiry/);
});
