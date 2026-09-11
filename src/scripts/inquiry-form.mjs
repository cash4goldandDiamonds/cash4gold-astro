import {INQUIRY_ENDPOINT,INQUIRY_MESSAGES,validateInquiry} from '../lib/inquiry.mjs';
function loadTurnstile(){
 if(window.turnstile)return Promise.resolve(window.turnstile);
 return new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
  script.onload=()=>window.turnstile?resolve(window.turnstile):reject(Error('challenge_unavailable'));script.onerror=()=>reject(Error('challenge_unavailable'));document.head.append(script);
 });
}
export async function initializeInquiryForm(){
 const root=document.querySelector('[data-inquiry-component]');if(!root||root.dataset.ready)return;root.dataset.ready='true';
 const form=root.querySelector('[data-inquiry-form]'),availability=root.querySelector('[data-inquiry-availability]'),status=root.querySelector('[data-inquiry-status]'),submit=root.querySelector('[data-inquiry-submit]');
 let startedAt=Date.now(),requestId=crypto.randomUUID(),token='',busy=false,widget,turnstile;
 const showStatus=message=>{status.textContent=message;};
 const showErrors=fields=>{
  form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));form.querySelectorAll('[data-field-error]').forEach(el=>{el.textContent='';});
  for(const [key,message]of Object.entries(fields||{})){
   const field=Array.from(form.elements).find(el=>el.name===key),error=Array.from(form.querySelectorAll('[data-field-error]')).find(el=>el.dataset.fieldError===key);
   if(error)error.textContent=String(message);if(field)field.setAttribute('aria-invalid','true');if(key==='form')showStatus(String(message));
  }
 };
 const resetChallenge=()=>{token='';submit.disabled=true;if(turnstile&&widget!==undefined)turnstile.reset(widget);};
 try{
  const response=await fetch(INQUIRY_ENDPOINT+'config/',{headers:{Accept:'application/json'},cache:'no-store',credentials:'same-origin',signal:AbortSignal.timeout(10_000)});
  if(!response.ok)throw Error('configuration_unavailable');const config=await response.json();if(config.enabled!==true||typeof config.siteKey!=='string')throw Error('configuration_unavailable');
  availability.textContent='Complete the form and security check below. Phone and email remain available if you prefer.';form.hidden=false;
  turnstile=await loadTurnstile();
  // Compact is 150 by 140 pixels and fits the contact card at 320-pixel phone widths.
  widget=turnstile.render(root.querySelector('[data-turnstile-container]'),{sitekey:config.siteKey,action:'inquiry',size:'compact',theme:'auto',callback:value=>{token=value;submit.disabled=busy;},'expired-callback':()=>{token='';submit.disabled=true;},'error-callback':()=>{token='';submit.disabled=true;showStatus(INQUIRY_MESSAGES.challenge);}});
 }catch{availability.textContent=INQUIRY_MESSAGES.unavailable;form.hidden=true;return;}
 form.addEventListener('input',()=>{if(!busy){requestId=crypto.randomUUID();showStatus('');}});
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;showErrors({});showStatus('');
  const fields=new FormData(form),input=Object.fromEntries(['name','email','phone','itemType','message','website'].map(key=>[key,String(fields.get(key)||'')]));
  Object.assign(input,{permission:fields.get('permission')==='on',startedAt,requestId,turnstileToken:token});
  const checked=validateInquiry(input);if(!checked.ok){showStatus(INQUIRY_MESSAGES.invalid);showErrors(checked.fields);form.querySelector('[aria-invalid=true]')?.focus();return;}
  busy=true;submit.disabled=true;submit.textContent='Sending…';form.setAttribute('aria-busy','true');
  const controls=Array.from(form.querySelectorAll('input,select,textarea')).map(control=>({control,disabled:control.disabled}));controls.forEach(({control})=>{control.disabled=true;});
  try{
   const response=await fetch(INQUIRY_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'same-origin',body:JSON.stringify(input),signal:AbortSignal.timeout(30_000)});
   const result=await response.json();
   if(response.status===202&&result.ok===true&&result.state==='accepted'){
    showStatus(INQUIRY_MESSAGES.accepted);form.reset();startedAt=Date.now();requestId=crypto.randomUUID();
    // No inquiry fields or customer identifiers are attached to this event.
    window.dispatchEvent(new Event('cash4gold:inquiry-accepted'));
   }else{showStatus(typeof result.message==='string'?result.message:INQUIRY_MESSAGES.retry);showErrors(result.fields||{});}
  }catch{showStatus(INQUIRY_MESSAGES.retry);}
  finally{controls.forEach(({control,disabled})=>{control.disabled=disabled;});busy=false;submit.textContent='Send inquiry';form.removeAttribute('aria-busy');resetChallenge();status.focus();}
 });
}
