import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8')),changes=[];
const descriptionGroups=Object.groupBy(pages,p=>p.description),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const p of pages){if(p.isArticle)continue;const before=p.html,record={path:p.path,changes:[]};
 const $=load(p.html,{},false);
 for(const e of $('img').toArray()){const img=$(e);if(img.attr('width')&&img.attr('height'))continue;const src=img.attr('src');if(!src?.startsWith('/'))continue;const m=await sharp('public'+src).metadata();if(m.width&&m.height){img.attr({width:String(m.width),height:String(m.height)});record.changes.push({type:'image-dimensions',src,width:m.width,height:m.height});}}
 if(p.path==='/about-us-sell-gold-and-diamonds-online/')$('h4').each((i,e)=>{e.tagName=i===0?'p':'h2';record.changes.push({type:'heading-semantics',reason:i===0?'Introductory paragraph was incorrectly a heading.':'Top-level section follows the page heading.'});});
 if(p.path==='/contact-us/'||p.path==='/faqs/')$('h2').first().each((i,e)=>{if(/^(Contact Us|FAQ)$/.test($(e).text().trim())){e.tagName='p';record.changes.push({type:'heading-semantics',reason:'Decorative eyebrow appears before H1.'});}});
 if(p.path==='/sell-estate-jewelry-los-angeles/'){
  $('h1').each((i,e)=>{e.tagName='h2';});$('h2').first().each((i,e)=>{e.tagName='h1';});record.changes.push({type:'heading-semantics',reason:'Place the single H1 on the opening estate-service title; retain the former H1 text as a section heading.'});
 }
 let level=1;for(const e of $('h1,h2,h3,h4,h5,h6')){const current=Number(e.tagName.slice(1)),next=Math.min(current,level+1);if(next!==current){e.tagName='h'+next;record.changes.push({type:'heading-semantics',text:$(e).text().trim(),before:current,after:next});}level=next;}
 if(!p.description?.trim()||p.path.startsWith('/tag/')&&descriptionGroups[p.description]?.length>1){const old=p.description,label=p.title.replace(/\s*(?:[-|–])\s*Cash\s*4\s*Gold.*$/i,'').replace(/\s+/g,' ').trim();p.description=`Browse ${label} guides from Cash 4 Gold & Diamonds, with related reading for gold and jewelry owners in Los Angeles.`.slice(0,170);record.changes.push({type:'description',before:old,after:p.description,reason:'Describe the actual archive topic; retain the source noindex directive.'});for(const m of p.meta||[])if(['og:description','twitter:description'].includes(m.name))m.content=p.description;}
 if(record.changes.length){p.html=$.html();if(p.path!=='/')p.sections=[];p.sourceText=$.text().replace(/\s+/g,' ').trim();p.images=$('img').map((i,e)=>({...e.attribs})).get();record.beforeSha256=hash(before);record.afterSha256=hash(p.html);changes.push(record);}
}
await fs.writeFile('src/data/pages.json',JSON.stringify(pages));await fs.writeFile('migration/pre-deployment/layout-metadata-fixes.json',JSON.stringify({changedAt:new Date().toISOString(),changes,scope:'Non-article semantics, missing dimensions and archive descriptions. All text preserved except logged description changes; existing index/noindex policy and URL paths preserved.'},null,2));console.log(JSON.stringify(changes.map(c=>({path:c.path,changes:c.changes.length}))));
