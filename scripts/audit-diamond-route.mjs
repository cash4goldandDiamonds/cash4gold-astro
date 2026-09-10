import fs from 'node:fs/promises';
import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const old='/uncut-diamond-buyers-los-angeles/',next='/large-diamond-buyer-los-angeles/';
const p=pages.find(p=>p.path===next);
console.log(JSON.stringify({page:p&&{path:p.path,title:p.title,heading:p.heading,description:p.description,canonical:p.canonical,editorial:p.editorial,images:p.images}},null,2));
for(const page of pages){
 const $=load(page.html,{},false);
 const linkFindings=$('a[href]').toArray().filter(e=>($(e).attr('href')||'').includes(old)||/uncut diamond (?:evaluation|buyer)|rough diamond (?:evaluation|buyer)/i.test($(e).text())).map(e=>({href:$(e).attr('href'),text:$(e).text()}));
 const schemaFindings=[];
 function walk(v,key=''){if(typeof v==='string'&&/uncut diamond (?:evaluation|buyer)|rough diamond (?:evaluation|buyer)|Uncut Diamond Evaluation|Uncut Diamond Buyers/i.test(v))schemaFindings.push({key,value:v});else if(v&&typeof v==='object')for(const [k,x] of Object.entries(v))walk(x,key+'.'+k);}
 for(const s of page.schema||[])walk(JSON.parse(s));
 if(linkFindings.length||schemaFindings.length)console.log(JSON.stringify({path:page.path,linkFindings,schemaFindings},null,2));
}
