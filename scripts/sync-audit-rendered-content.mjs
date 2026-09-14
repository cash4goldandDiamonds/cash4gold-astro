import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
const file='src/data/pages.json',pages=JSON.parse(await fs.readFile(file,'utf8')),changes=[];
const hash=text=>createHash('sha256').update(text).digest('hex');
const home=pages.find(page=>page.path==='/'),$home=load(home.html,{},false);
for(const section of home.sections){
 if(!section.html)continue;
 const id=$home('[id]').toArray().find(element=>[section.id,'source-'+section.id].includes(element.attribs.id));
 if(!id)continue; // Preserve separately composed feature sections.
 const current=$home(id).prop('outerHTML');
 if(current!==section.html){changes.push({path:'/',section:section.id,reason:'Render the already logged, corrected homepage content instead of a stale duplicate section cache',beforeSha256:hash(section.html),afterSha256:hash(current)});section.html=current;}
}
for(const page of pages.filter(page=>!page.isArticle)){
 const $=load(page.html,{},false);
 $('article').each((_,article)=>{
  const card=$(article),paragraph=card.find('p').filter((_,element)=>/19 years of expertise/.test($(element).text())).first();
  if(!paragraph.length)return;
  const href=card.find('header a[href]').attr('href'),target=pages.find(item=>item.path===href);
  if(!target)throw new Error('Cannot reconcile an archive excerpt without its destination.');
  const before=paragraph.text();paragraph.text(target.description);
  changes.push({path:page.path,target:href,reason:'Align stale archive excerpt with the corrected destination; remove unsupported experience and payment claim',before,after:target.description});
 });
 if(changes.some(change=>change.path===page.path&&change.target)){page.html=$.html();page.sourceText=$.text().replace(/\s+/g,' ').trim();}
}
await fs.writeFile(file,JSON.stringify(pages,null,2));
const reportFile='migration/pre-deployment/rendered-content-fixes.json';
let prior=[];try{prior=JSON.parse(await fs.readFile(reportFile,'utf8')).changes;}catch{}
await fs.writeFile(reportFile,JSON.stringify({checkedAt:new Date().toISOString(),approval:'Private proposed corrections; final human editorial approval remains pending',changes:[...prior,...changes]},null,2));
console.log(JSON.stringify({updated:changes.length}));
