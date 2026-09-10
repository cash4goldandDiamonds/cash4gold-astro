import fs from 'node:fs/promises';
import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
for(const p of pages){
 const $=load(p.html);
 if(process.argv.slice(2).includes(p.path))console.log(JSON.stringify({path:p.path,title:p.title,description:p.description,body:$.text().replace(/\s+/g,' ').trim(),sections:p.sections.map(s=>({id:s.id,html:s.html.slice(0,100)})),h1:$('h1').map((i,e)=>$.html(e)).get()},null,2));
 const matches=$('h1,h2,h3,h4,p,li,a,figcaption').toArray().map(e=>$(e).text().replace(/\s+/g,' ').trim()).filter(t=>/uncut|rough diamond|lab.?grown|laboratory.grown/i.test(t));
 const unique=[...new Set(matches)].filter(t=>!matches.some(other=>t!==other&&other.length<t.length&&t.includes(other)));
 if(unique.length)console.log(JSON.stringify({path:p.path,matches:unique},null,2));
 if(p.path.includes('uncut'))console.log(JSON.stringify({images:p.images,editorial:p.editorial},null,2));
}
