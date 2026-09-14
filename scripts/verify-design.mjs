import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import sharp from 'sharp';
import {initializeMenuSound} from '../src/lib/menu-sound.ts';

const $=load(await fs.readFile('dist/index.html','utf8'));
assert.equal($('.selling-card').length,4);
assert.equal($('.mega-category').length,5);
assert.equal($('.mobile-category').length,5);
const gallery=$('.collection-tile img').toArray().map(e=>$(e).attr('src'));
assert.equal(gallery.length,5);
assert.equal(new Set(gallery).size,5,'Each gallery category needs a distinct image');
assert.match($('.selling-card[href="/sell-luxury-watches-in-los-angeles/"] img').attr('src'),/rolex-daytona/);
assert.equal($('.selling-card').first().attr('href'),'/sell-your-golds/');
assert.match($('.collection-tile').eq(4).find('img').attr('src'),/necklace/);
assert.equal($('main img[src*="luxury-watch-"]').length,0,'Do not use generated generic watch');
const moduleBytes=Buffer.byteLength($('script[type=module]').text());
assert.ok(moduleBytes<5000,'Keep menu and sound interaction under 5 KB');
const assets=new Set($('img[src*="/editorial/"]').toArray().map(e=>$(e).attr('src')));
for(const src of assets){const meta=await sharp('public'+src).metadata();assert.ok(meta.width>0&&meta.height>0);}

class Surface{
 handlers=new Map();attributes=new Map();hidden=true;
 addEventListener(name,fn){const list=this.handlers.get(name)||[];list.push(fn);this.handlers.set(name,list);}
 async fire(name,event={}){for(const fn of this.handlers.get(name)||[])await fn(event);}
 setAttribute(name,value){this.attributes.set(name,value);}
 matches(){return true;}
}
let starts=0,contexts=0,now=1000;
const param={setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}};
class MockAudioContext{
 state='suspended';currentTime=0;destination={};
 constructor(){contexts++;}
 async resume(){this.state='running';}
 async suspend(){this.state='suspended';}
 createOscillator(){return {type:'',frequency:param,connect(){},disconnect(){},start(){starts++;},stop(){},onended:null};}
 createGain(){return {gain:param,connect(){},disconnect(){}};}
}
const saved=new Map();
globalThis.window={AudioContext:MockAudioContext};globalThis.AudioContext=MockAudioContext;
globalThis.document=new Surface();document.hidden=false;
globalThis.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
Object.defineProperty(globalThis,'performance',{value:{now:()=>now},configurable:true});
const toggle=new Surface(),item=new Surface();
initializeMenuSound({querySelector:()=>toggle,querySelectorAll:()=>[item]});
assert.equal(contexts,0,'No audio work before visitor turns sounds on');
await item.fire('pointerenter',{pointerType:'mouse'});assert.equal(starts,0);
await toggle.fire('click');assert.equal(toggle.attributes.get('aria-pressed'),'true');assert.equal(starts,1);
now+=150;await item.fire('pointerenter',{pointerType:'mouse'});assert.equal(starts,2);
await item.fire('pointerenter',{pointerType:'mouse'});assert.equal(starts,2,'Rapid pointer movements should not stack sounds');
now+=150;await item.fire('pointerenter',{pointerType:'touch'});assert.equal(starts,2);
await item.fire('focus');assert.equal(starts,3,'Keyboard focus has the same sound affordance');
now+=150;document.hidden=true;await item.fire('pointerenter',{pointerType:'mouse'});assert.equal(starts,3);
document.hidden=false;await toggle.fire('click');assert.equal(toggle.attributes.get('aria-pressed'),'false');
now+=150;await item.fire('pointerenter',{pointerType:'mouse'});assert.equal(starts,3,'Mute suppresses later hover sounds');
assert.equal(saved.get('cash4gold-menu-sound'),'off');
const report={passed:true,galleryCategories:gallery.length,uniqueGalleryImages:new Set(gallery).size,watch:'Actual source-site Rolex Daytona photograph',navigationAndSoundBytes:moduleBytes,imageAssetsVerified:assets.size,soundChecks:['No audio until enabled','Toggle feedback','Hover sound','Rapid hover limit','No touch hover','Keyboard focus sound','Hidden-page silence','Mute and saved preference'],browserTestingPerformed:false};
await fs.writeFile('migration/design-verification.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
