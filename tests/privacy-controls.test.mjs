import test from 'node:test';
import assert from 'node:assert/strict';
import {initializePrivacyControls} from '../src/scripts/privacy-controls.mjs';
import {CONSENT_STORAGE_KEY,CONSENT_LIFETIME,createConsent} from '../src/lib/privacy-consent.mjs';

function browserFixture(t,{consented=true,storageThrows=false,removalThrows=false,id='G-TESTONLY',age=0}={}){
 let now=Date.parse('2026-09-14T12:00:00Z'),reloads=0,timerId=0;
 const storage=new Map(consented?[[CONSENT_STORAGE_KEY,JSON.stringify(createConsent(true,now-age))]]:[]);
 const windowEvents={},documentEvents={},timers=new Map(),scripts=[],cookieWrites=[];
 const control=()=>({checked:false,textContent:'',listeners:{},addEventListener(name,fn){this.listeners[name]=fn;}});
 const dialog={open:false,showModal(){this.open=true;},close(){this.open=false;}};
 const controls=Object.fromEntries(['data-analytics-choice','data-privacy-status','data-open-privacy','data-close-privacy','data-reject-analytics','data-save-privacy'].map(name=>[name,control()]));
 controls['data-privacy-dialog']=dialog;
 const root={dataset:{analyticsEnabled:'true',analyticsId:id,analyticsEnvironment:'preview',analyticsPath:'/contact-us/'},querySelector:selector=>controls[selector.slice(1,-1)]};
 const localStorage={getItem:key=>storage.get(key)??null,setItem(key,value){if(storageThrows)throw Error('storage_unavailable');storage.set(key,value);},removeItem(key){if(removalThrows)throw Error('storage_unavailable');storage.delete(key);}};
 class Element{constructor(href){this.href=href;}closest(){return this;}}
 const globals={document:globalThis.document,window:globalThis.window,location:globalThis.location,localStorage:globalThis.localStorage,Element:globalThis.Element};
 Object.assign(globalThis,{Element,localStorage,location:{origin:'https://preview.example.invalid',hostname:'preview.example.invalid',href:'https://preview.example.invalid/contact-us/?email=private@example.invalid#private',reload(){reloads++;}},
  document:{referrer:'https://search.example.invalid/private/customer?email=private@example.invalid#private',visibilityState:'visible',querySelector:()=>root,createElement:()=>({dataset:{}}),head:{append:script=>scripts.push(script)},addEventListener:(name,fn)=>{documentEvents[name]=fn;},get cookie(){return '_ga=synthetic; _ga_TESTONLY=synthetic; essential=keep';},set cookie(value){cookieWrites.push(value);}},
  window:{addEventListener:(name,fn)=>{windowEvents[name]=fn;},setTimeout(fn,delay){const id=++timerId;timers.set(id,{fn,delay});return id;},clearTimeout(id){timers.delete(id);}}
 });
 t.after(()=>{for(const [name,value]of Object.entries(globals)){if(value===undefined)delete globalThis[name];else globalThis[name]=value;}});
 t.mock.method(Date,'now',()=>now);
 initializePrivacyControls();
 return {controls,dialog,storage,scripts,cookieWrites,windowEvents,documentEvents,timers,localStorage,
  advance(ms){now+=ms;},get reloads(){return reloads;},
  events(){return (window.dataLayer||[]).map(args=>Array.from(args)).filter(args=>args[0]==='event');},
  link(href){documentEvents.click({target:new Element(href)});},
  save(value){controls['data-analytics-choice'].checked=value;controls['data-save-privacy'].listeners.click();}
 };
}

test('clearing local storage withdraws active consent even while the Google tag is loading',async t=>{
 for(const loaded of [false,true])await t.test(loaded?'loaded':'loading',t=>{
  const fixture=browserFixture(t);assert.equal(fixture.scripts.length,1);
  if(loaded)fixture.scripts[0].onload();
  const before=fixture.events().length;
  fixture.storage.clear();fixture.windowEvents.storage({key:null,storageArea:fixture.localStorage});
  assert.equal(window['ga-disable-G-TESTONLY'],true);assert.equal(fixture.reloads,1);
  assert.ok(fixture.cookieWrites.some(value=>value.startsWith('_ga=; Max-Age=0;')));
  assert.ok(fixture.cookieWrites.every(value=>!value.startsWith('essential=')));
  fixture.link('tel:3106631340');fixture.windowEvents['cash4gold:inquiry-accepted']();
  if(!loaded)fixture.scripts[0].onload();
  assert.equal(fixture.events().length,before,'no queued or new conversion/page-view follows withdrawal');
 });
});

test('session storage clear does not withdraw a saved local-storage choice',t=>{
 const fixture=browserFixture(t);fixture.scripts[0].onload();
 fixture.windowEvents.storage({key:null,storageArea:{}});
 assert.equal(fixture.reloads,0);fixture.link('tel:3106631340');
 assert.equal(fixture.events().at(-1)[1],'phone_click');
});

test('consent expiry stops loaded analytics on timers, restored tabs and attempted conversions',async t=>{
 for(const trigger of ['timer','pageshow','visibilitychange','conversion'])await t.test(trigger,t=>{
  const fixture=browserFixture(t,{age:CONSENT_LIFETIME-1000});fixture.scripts[0].onload();
  assert.equal([...fixture.timers.values()][0].delay,1001);
  const before=fixture.events().length;fixture.advance(1001);
  if(trigger==='timer')[...fixture.timers.values()][0].fn();
  else if(trigger==='pageshow')fixture.windowEvents.pageshow();
  else if(trigger==='visibilitychange')fixture.documentEvents.visibilitychange();
  else fixture.link('tel:3106631340');
  assert.equal(window['ga-disable-G-TESTONLY'],true);assert.equal(fixture.reloads,1);
  fixture.windowEvents['cash4gold:inquiry-accepted']();
  assert.equal(fixture.events().length,before);assert.equal(fixture.timers.size,0);
  assert.match(fixture.controls['data-privacy-status'].textContent,/expired/);
 });
});

test('consent expiry while the script is downloading cannot emit a delayed page view',t=>{
 const fixture=browserFixture(t,{age:CONSENT_LIFETIME-1000});fixture.advance(1001);fixture.scripts[0].onload();
 assert.deepEqual(fixture.events(),[]);assert.equal(window['ga-disable-G-TESTONLY'],true);assert.equal(fixture.reloads,1);
});

test('long consent lifetimes use bounded timers and reschedule while still valid',t=>{
 const fixture=browserFixture(t);const first=[...fixture.timers.values()][0];
 assert.equal(first.delay,2_147_483_647);fixture.advance(first.delay);first.fn();
 assert.equal(fixture.timers.size,1);assert.equal([...fixture.timers.values()][0].delay,2_147_483_647);assert.equal(fixture.reloads,0);
});

test('unavailable browser storage keeps the page-only explanation for either choice',async t=>{
 for(const choice of [false,true])await t.test(String(choice),t=>{
  const fixture=browserFixture(t,{consented:false,storageThrows:true});
  assert.equal(fixture.scripts.length,0);assert.equal(window.dataLayer,undefined);
  fixture.save(choice);
  assert.match(fixture.controls['data-privacy-status'].textContent,/Your choice applies to this page\. Browser storage is unavailable\./);
  assert.equal(fixture.scripts.length,choice?1:0);
 });
});

test('preview refuses the established production ID before requesting any script',t=>{
 const fixture=browserFixture(t,{id:'G-149Y3HZKHT'});fixture.save(true);
 assert.equal(fixture.scripts.length,0);assert.equal(window.dataLayer,undefined);
});

test('failed withdrawal storage cannot reload into a previously saved grant',async t=>{
 for(const removalThrows of [false,true])await t.test(removalThrows?'write and removal unavailable':'removal fallback available',t=>{
  const fixture=browserFixture(t,{storageThrows:true,removalThrows});fixture.scripts[0].onload();
  const before=fixture.events().length;fixture.save(false);
  assert.equal(window['ga-disable-G-TESTONLY'],true);fixture.link('tel:3106631340');assert.equal(fixture.events().length,before);
  assert.match(fixture.controls['data-privacy-status'].textContent,/choice applies to this page/);
  assert.equal(fixture.reloads,removalThrows?0:1);
  assert.equal(fixture.storage.has(CONSENT_STORAGE_KEY),removalThrows);
  if(removalThrows){
   fixture.save(true);assert.equal(window['ga-disable-G-TESTONLY'],false);
   fixture.link('tel:3106631340');assert.equal(fixture.events().at(-1)[1],'phone_click');
   assert.equal(fixture.scripts.length,1,'same-page reconsent must not duplicate the Google tag');
  }
 });
});

test('consent-gated events use only the staging destination and sanitized page context',t=>{
 const fixture=browserFixture(t,{consented:false});fixture.link('tel:3106631340');
 assert.deepEqual(fixture.events(),[]);assert.equal(fixture.scripts.length,0);
 fixture.save(true);fixture.scripts[0].onload();
 fixture.link('mailto:cash4goldanddiamond@gmail.com?body=private');fixture.windowEvents['cash4gold:inquiry-accepted']();
 assert.deepEqual(fixture.events().map(args=>args[1]),['page_view','email_click','inquiry_accepted']);
 assert.ok(fixture.events().every(args=>args[2].send_to==='G-TESTONLY'&&args[2].debug_mode===true));
 const config=window.dataLayer.map(args=>Array.from(args)).find(args=>args[0]==='config')[2];
 assert.equal(config.send_page_view,false);assert.equal(config.page_location,'https://preview.example.invalid/contact-us/');assert.equal(config.page_referrer,'https://search.example.invalid');
 assert.doesNotMatch(JSON.stringify(window.dataLayer),/private@|customer|\?body=|#private/);
});
