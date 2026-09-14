import fs from 'node:fs/promises';
import {load} from 'cheerio';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const paths=['/about-us-sell-gold-and-diamonds-online/','/contact-us/'];
try{await fs.writeFile('migration/mobile-overflow-before.json',JSON.stringify(pages.filter(p=>paths.includes(p.path))),{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;}
const about=pages.find(p=>p.path===paths[0]),contact=pages.find(p=>p.path===paths[1]);
const stray='https://hm0.746.myftpupload.com/wp-content/uploads/2024/04/1471360_People_Fashion_1280x720.mp4';
const clean=html=>html.replace(stray,'').replace(/[\u202f\u00a0]/g,' ');
about.html=clean(about.html);about.heading=clean(about.heading);about.sections=about.sections.map(s=>({...s,html:clean(s.html)}));
const $=load(contact.html,{},false);$('h1').text('Contact Cash 4 Gold & Diamonds');contact.html=$.html();contact.sections=[];contact.heading='Contact Cash 4 Gold & Diamonds';
contact.title='Contact Cash 4 Gold & Diamonds | Downtown Los Angeles';contact.description='Visit Cash 4 Gold & Diamonds at 617 S. Hill Street, Los Angeles, CA 90014. Call 310-663-1340 to arrange a gold, diamond, jewelry or watch evaluation.';
for(const prefix of ['og:','twitter:'])for(const [key,value]of [['title',contact.title],['description',contact.description]]){const name=prefix+key;contact.meta=contact.meta.filter(m=>m.name!==name);contact.meta.push({name,content:value});}
contact.schema=contact.schema.map(raw=>{const doc=JSON.parse(raw);const visit=x=>{if(!x||typeof x!=='object')return;if(['WebPage','ContactPage'].includes(x['@type'])){x.name=contact.heading;x.description=contact.description;}for(const value of Object.values(x))visit(value);};visit(doc);return JSON.stringify(doc);});
const revisions=JSON.parse(await fs.readFile('migration/editorial-revisions.json','utf8'));for(const path of paths)if(!revisions.some(r=>r.path===path&&r.type==='mobile-text-cleanup'))revisions.push({path,type:'mobile-text-cleanup',reason:path===paths[0]?'Remove a stray imported video URL from visible prose and normalize nonbreaking heading spaces; raw source retained.':'Replace unbreakable imported contact heading with a readable business heading and matching metadata.',sourceArchive:'migration/mobile-overflow-before.json'});
await fs.writeFile('src/data/pages.json',JSON.stringify(pages));await fs.writeFile('migration/editorial-revisions.json',JSON.stringify(revisions,null,2));
console.log(JSON.stringify({edited:paths,cssWrappingCoverage:['Imported prose','Page titles','Breadcrumbs'],straySourceReferenceArchived:true}));
