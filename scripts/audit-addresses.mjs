import fs from 'node:fs/promises';
import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const records=[];
const addressPattern=/\b\d{1,6}\s+(?:(?:N|S|E|W|North|South|East|West)\.?\s+)?(?:[A-Za-z0-9'.-]+\s+){0,4}(?:Street|St\.?|Avenue|Ave\.?|Boulevard|Blvd\.?|Road|Rd\.?|Drive|Dr\.?|Lane|Ln\.?|Place|Court|Broadway|Plaza)\b[^\n;!?]{0,85}/gi;
const clean=s=>s.replace(/\s+/g,' ').trim();
function scan(text,path,field){
 text=clean(text);
 for(const match of text.matchAll(addressPattern)){if(text[match.index-1]==='$')continue;records.push({path,field,address:match[0].slice(0,115),context:text.slice(Math.max(0,match.index-130),match.index+match[0].length+130)});}
}
function walk(value,path,field){
 if(Array.isArray(value))return value.forEach((v,i)=>walk(v,path,`${field}[${i}]`));
 if(value&&typeof value==='object'){
  if(value.streetAddress||value.postalCode)records.push({path,field,structuredAddress:value});
  for(const [key,v]of Object.entries(value))walk(v,path,`${field}.${key}`);
 }else if(typeof value==='string')scan(value,path,field);
}
for(const page of pages){
 const $=load(page.html);scan($('body').text(),page.path,'body');
 for(const e of $('a[href],iframe[src],img[alt]').toArray()){
  const raw=$(e).attr('href')||$(e).attr('src')||$(e).attr('alt')||'';
  let value=raw;try{value=decodeURIComponent(raw).replace(/\+/g,' ');}catch{}
  scan(value,page.path,'link-or-image');
 }
 for(const key of ['title','heading','description','meta'])walk(page[key],page.path,key);
 for(const [i,schema]of (page.schema||[]).entries()){try{walk(JSON.parse(schema),page.path,`schema[${i}]`);}catch{scan(schema,page.path,`schema[${i}]`);}}
}
await fs.writeFile('migration/address-audit-after.json',JSON.stringify(records,null,2));
const groups=new Map();
for(const r of records){const key=r.structuredAddress?JSON.stringify(r.structuredAddress):r.address;const g=groups.get(key)||{address:key,count:0,pages:new Set(),examples:[]};g.count++;g.pages.add(r.path);if(g.examples.length<2)g.examples.push({field:r.field,context:r.context,path:r.path});groups.set(key,g);}
console.log(JSON.stringify({pages:pages.length,totalMatches:records.length,otherAddressReferences:[...groups.values()].filter(g=>!g.address.includes('617')).map(g=>({...g,pages:[...g.pages]}))},null,2));
