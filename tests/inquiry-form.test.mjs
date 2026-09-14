import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeInquiryForm} from '../src/scripts/inquiry-form.mjs';

test('ambiguous client retries preserve identity after edit/undo, consent toggles and whitespace normalization',async t=>{
 const original={name:'Synthetic Test',email:'visitor@example.invalid',phone:'310-555-0100',itemType:'gold',message:'Synthetic inquiry about a gold bracelet.',website:'',permission:'on'};
 let values={...original},now=Date.parse('2026-09-14T12:00:00Z'),challengeCallback,nextStatus=502;
 const listeners={},sent=[];
 const controls=Object.keys(original).map(name=>({name,disabled:false}));
 const status={textContent:'',focus(){}},availability={textContent:''},submit={disabled:true,textContent:'Send inquiry'};
 const form={hidden:true,elements:controls,querySelectorAll:selector=>selector==='input,select,textarea'?controls:[],querySelector:()=>null,
  addEventListener:(name,listener)=>{listeners[name]=listener;},setAttribute(){},removeAttribute(){},reset(){values={};}};
 const root={dataset:{},querySelector:selector=>({'[data-inquiry-form]':form,'[data-inquiry-availability]':availability,'[data-inquiry-status]':status,'[data-inquiry-submit]':submit,'[data-turnstile-container]':{}}[selector])};
 const globals={document:globalThis.document,window:globalThis.window,FormData:globalThis.FormData};
 globalThis.document={querySelector:()=>root};
 globalThis.window={turnstile:{render:(container,options)=>{challengeCallback=options.callback;return 'synthetic-widget';},reset(){}},dispatchEvent(){}};
 globalThis.FormData=class{get(name){return values[name]??null;}};
 t.after(()=>{for(const [name,value]of Object.entries(globals)){if(value===undefined)delete globalThis[name];else globalThis[name]=value;}});
 t.mock.method(Date,'now',()=>now);
 t.mock.method(globalThis,'fetch',async(url,options)=>{
  if(url.endsWith('/config/'))return Response.json({enabled:true,siteKey:'synthetic-site-key'});
  sent.push(JSON.parse(options.body));
  return Response.json(nextStatus===202?{ok:true,state:'accepted'}:{ok:false,message:'Synthetic ambiguous outcome'},{status:nextStatus});
 });
 await initializeInquiryForm();now+=2000;
 const send=async()=>{challengeCallback('synthetic-fresh-token');await listeners.submit({preventDefault(){}});};
 const edit=(name,value)=>{values[name]=value;listeners.input({target:controls.find(control=>control.name===name)});};

 await send();
 edit('permission','');edit('permission','on');
 edit('message','Temporary edit');edit('message',original.message);
 await send();
 assert.equal(sent[1].requestId,sent[0].requestId,'edit/undo and permission toggles must not create a second inquiry');
 edit('name','  '+original.name+'  ');await send();
 assert.equal(sent[2].requestId,sent[0].requestId,'the server trims fields, so whitespace-only changes must retain retry identity');

 edit('message','Different synthetic inquiry about a diamond ring.');await send();
 assert.notEqual(sent[3].requestId,sent[2].requestId,'different submitted content needs a new identity');
 nextStatus=202;await send();
 assert.equal(sent[4].requestId,sent[3].requestId,'an unchanged retry must keep its identity through acceptance');
 values={...original,message:sent[4].message};now+=2000;await send();
 assert.notEqual(sent[5].requestId,sent[4].requestId,'a new inquiry after acceptance needs a fresh identity even for identical content');
 assert.equal(controls.every(control=>!control.disabled),true);
});
