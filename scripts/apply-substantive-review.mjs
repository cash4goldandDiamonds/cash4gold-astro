import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {load} from 'cheerio';
import {assertAddressIntegrity} from '../src/lib/address-integrity.mjs';
import {migrations,currentPath,originalPath,rewritePublicLinks,migratePageReferences} from '../src/lib/route-migrations.mjs';
import {applyArticleImageAssignments} from '../src/lib/article-image-assignments.mjs';

const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const proseHash=html=>{const $=load(rewritePublicLinks(html),{},false);$('.article-related,figure').remove();return hash($.html());};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const file='src/data/pages.json';
const pages=JSON.parse(await fs.readFile(file,'utf8'));
const baseline='migration/substantive-review-baseline.json';
try{await fs.access(baseline);}catch{await fs.copyFile(file,baseline);}
const before=JSON.parse(await fs.readFile(baseline,'utf8'));
for(const p of pages)p.path=currentPath(p.path);
const original=new Map(before.map(p=>[p.path,p]));
let previous={rows:[]};try{previous=JSON.parse(await fs.readFile('migration/substantive-review.json','utf8'));}catch{}
const recorded=new Map(previous.rows.map(r=>[currentPath(r.path),{...r,path:currentPath(r.path)}]));
const reviewDir='src/data/article-reviews';
const reviews=(await Promise.all((await fs.readdir(reviewDir)).filter(f=>f.endsWith('.mjs')).sort().map(async f=>(await import(pathToFileURL(path.resolve(reviewDir,f)).href)).default))).flat().map(r=>({...r,path:currentPath(r.path),...(r.related?{related:r.related.map(currentPath)}:{})}));
if(new Set(reviews.map(r=>r.path)).size!==reviews.length)throw new Error('Duplicate review path');
const now=new Date().toISOString();let changed=0;
for(const r of reviews){
 const p=pages.find(p=>p.path===r.path),old=r.baselineFile?JSON.parse(await fs.readFile(r.baselineFile,'utf8')).find(p=>p.path===r.path):original.get(originalPath(r.path)),prior=recorded.get(r.path);
 if(!p?.isArticle||!old)throw new Error('Unknown article '+r.path);
 if(!r.findings?.length||!['retain','improve','rewrite'].includes(r.decision))throw new Error('Missing substantive decision '+r.path);
 if(hash(old.html)!==r.beforeHtmlSha256)throw new Error('Review must match captured prose '+r.path);
 const specHash=hash(JSON.stringify(r)+'renderer-2');
 if(prior?.specHash===specHash&&prior.afterHtmlSha256===hash(p.html))continue;
 if(hash(p.html)!==r.beforeHtmlSha256&&hash(p.html)!==prior?.afterHtmlSha256&&proseHash(p.html)!==proseHash(old.html))throw new Error('Newer article edits need reconciliation '+r.path);
 const $old=load(old.html,{},false),figures=$old('figure').toArray().map(e=>$old.html(e));
 if(figures.length<2)throw new Error('Missing reviewed images '+r.path);
 if(r.imageCaptions){if(r.imageCaptions.length!==figures.length)throw new Error('Caption count must match images '+r.path);for(let i=0;i<figures.length;i++){const $figure=load(figures[i],{},false);$figure('figcaption').text(r.imageCaptions[i]);figures[i]=$figure.html();}}
 const oldIds=$old('[id]').map((i,e)=>$old(e).attr('id')).get();
 let html=r.body;
 if(!html){const $=load(old.html,{},false);$('.article-takeaway,.article-toc,.article-resources,.article-related,.article-next-step,figure').remove();html=$.html();}
 for(const edit of r.replacements||[]){if(!html.includes(edit.from))throw new Error('Review edit target missing '+r.path+': '+edit.from);html=html.replace(edit.from,edit.to);}
 const $=load(html,{},false);
 for(const patch of r.sectionPatches||[]){const h=$('h2').filter((i,e)=>$(e).text().trim()===patch.heading).first();if(!h.length)throw new Error('Missing review section '+patch.heading);let next=h.next();while(next.length&&!/^h[12]$/.test(next[0].name)){const after=next.next();next.remove();next=after;}h.after(patch.html);}
 if($('h1,img,figure').length)throw new Error('Body must use H2+ and preserved media '+r.path);
 const answer=r.answer||old.editorial.answer;
 $.root().prepend(`<p class="article-takeaway">${esc(answer)}</p>`);
 if(r.contextualImage??old.editorial.contextualImage){$('h2').first().next('p').after(figures[0]);}else $('.article-takeaway').after(figures[0]);
 const sections=$('h2').toArray();const anchor=sections[r.imageAfterSection??Math.min(2,sections.length-1)];
 if(anchor){const paragraph=$(anchor).next('p');if(paragraph.length)paragraph.after(figures.slice(1).join(''));else $(anchor).after(figures.slice(1).join(''));}else $.root().append(figures.slice(1).join(''));
 const sources=r.sources||old.editorial.sources,related=(r.related||old.editorial.related).map(currentPath);
 const cta=$old('.article-next-step').first().prop('outerHTML');if(cta)$.root().append(cta);
 $.root().append(`<section class="article-resources"><h2>Sources and further reading</h2><ul>${sources.map(s=>`<li><a href="${esc(s.url)}">${esc(s.title)}</a></li>`).join('')}</ul></section><section class="article-related"><h2>Related guides</h2><ul>${related.map(url=>{const target=pages.find(p=>p.path===url);if(!target)throw new Error('Missing related target '+url);return `<li><a href="${url}">${esc(target.heading)}</a></li>`;}).join('')}</ul></section>`);
 const ids=new Set();$('h2,h3,h4').each((i,e)=>{const base=$(e).attr('id')||slug($(e).text());let id=base,n=1;while(ids.has(id))id=base+'-'+(++n);ids.add(id);$(e).attr('id',id);});
 const toc=$('h2').filter((i,e)=>!$(e).closest('aside,.article-resources,.article-related').length).toArray();
 if(toc.length>=4){const nav=`<nav class="article-toc" aria-label="In this guide"><p>In this guide</p><ul>${toc.map(e=>`<li><a href="#${$(e).attr('id')}">${esc($(e).text())}</a></li>`).join('')}</ul></nav>`;const hero=$('.article-hero');if(hero.length)hero.after(nav);else $('.article-takeaway').after(nav);}
 const aliases=[...new Set(oldIds)].filter(id=>!ids.has(id));if(aliases.length)$('h2').first().before(aliases.map(id=>`<span id="${esc(id)}" class="legacy-anchor" aria-hidden="true"></span>`).join(''));
 const renderedIds=new Set();$('[id]').each((i,e)=>{const id=$(e).attr('id');if(renderedIds.has(id))$(e).removeAttr('id');else renderedIds.add(id);});
 p.html=$.html();p.title=r.title||old.title;p.heading=r.heading||p.title;p.description=r.description||old.description;p.sections=[];
 p.editorial={...old.editorial,title:p.title,description:p.description,answer,topic:r.topic||old.editorial.topic,contextualImage:r.contextualImage??old.editorial.contextualImage,focusKeyword:r.focusKeyword||old.editorial.focusKeyword,secondaryKeywords:r.secondaryKeywords||old.editorial.secondaryKeywords,sources,related};
 const substantiveChange=Boolean(r.body||r.replacements?.length||r.sectionPatches?.length||(r.answer&&r.answer!==old.editorial.answer)||p.title!==old.title||p.description!==old.description);
 p.modifiedAt=substantiveChange?now:old.modifiedAt;p.images=$('img').map((i,e)=>({...e.attribs})).get();p.sourceText=$.text().replace(/\s+/g,' ').trim();
 const setMeta=(name,content)=>{p.meta=p.meta.filter(m=>m.name!==name);p.meta.push({name,content});};
 for(const prefix of ['og:','twitter:']){setMeta(prefix+'title',p.title);setMeta(prefix+'description',p.description);}
 setMeta('og:image:alt',p.images[0].alt);setMeta('article:modified_time',p.modifiedAt);
 p.schema=p.schema.map(s=>{const data=JSON.parse(s);for(const node of data['@graph']||[data]){if(node['@type']==='BlogPosting')Object.assign(node,{headline:p.heading,name:p.heading,description:p.description,dateModified:p.modifiedAt,keywords:[p.editorial.focusKeyword,...p.editorial.secondaryKeywords].join(', ')});if(node['@type']==='BreadcrumbList'){const last=node.itemListElement.at(-1);last.name=p.heading;}}return JSON.stringify(data);});
 recorded.set(r.path,{path:r.path,status:'reviewed',decision:r.decision,findings:r.findings,intent:r.intent,reviewedAt:now,beforeHtmlSha256:r.beforeHtmlSha256,afterHtmlSha256:hash(p.html),specHash,title:p.title,description:p.description,focusKeyword:p.editorial.focusKeyword,sources,canonical:p.canonical,sourceArchive:r.baselineFile||baseline,priorReview:r.priorReview});changed++;
}
// Refresh existing listings without regenerating any unrelated page body.
for(const p of pages)migratePageReferences(p);
const byPath=new Map(pages.map(p=>[p.path,p]));let cards=0;
// Listing structured data must use the same current article names as visible cards.
for(const p of pages)p.schema=(p.schema||[]).map(raw=>{
 const data=JSON.parse(raw);
 const refresh=node=>{if(!node||typeof node!=='object')return;if(node['@type']==='ListItem'&&typeof node.url==='string'){const url=new URL(node.url,'https://cash4goldanddiamond.com');const target=url.hostname==='cash4goldanddiamond.com'&&byPath.get(url.pathname);if(target?.isArticle)node.name=target.heading;}for(const value of Object.values(node))if(value&&typeof value==='object')Array.isArray(value)?value.forEach(refresh):refresh(value);};
 refresh(data);return JSON.stringify(data);
});
for(const p of pages){const $=load(p.html,{},false);let count=0;$('.blog-card').each((i,e)=>{const a=$(e),target=byPath.get(a.attr('href'));if(target?.isArticle){a.find('h3').text(target.heading);a.find('p').text(target.description);count++;}});$('article').each((i,e)=>{const card=$(e),target=byPath.get(card.find('h2 a').first().attr('href'));if(target?.isArticle){card.find('h2 a').text(target.heading);card.find('p').first().text(target.description);count++;}});$('.article-related a').each((i,e)=>{const target=byPath.get($(e).attr('href'));if(target?.isArticle){$(e).text(target.heading);count++;}});if(count){p.html=$.html();p.sections=[];cards+=count;const row=recorded.get(p.path);if(row?.status==='reviewed')row.afterHtmlSha256=hash(p.html);}}
assertAddressIntegrity(pages);
applyArticleImageAssignments(pages);
for(const p of pages){const row=recorded.get(p.path);if(row?.status==='reviewed'){row.afterHtmlSha256=hash(p.html);row.canonical=p.canonical;}}
const redirects=JSON.parse(await fs.readFile('src/data/redirects.json','utf8'));
for(const migration of migrations)redirects[migration.from]=migration.to;
await fs.writeFile('src/data/redirects.json',JSON.stringify(redirects,null,2)+'\n');
const rows=pages.filter(p=>p.isArticle).map(p=>recorded.get(p.path)||{path:p.path,status:'pending',decision:null});
await fs.writeFile(file,JSON.stringify(pages));
const briefs=JSON.parse(await fs.readFile('src/data/article-optimization.json','utf8'));for(const migration of migrations)delete briefs[migration.from];for(const p of pages.filter(p=>p.isArticle))briefs[p.path]=p.editorial;
await fs.writeFile('src/data/article-optimization.json',JSON.stringify(briefs,null,2));
await fs.writeFile('migration/substantive-review.json',JSON.stringify({updatedAt:now,total:rows.length,reviewed:rows.filter(r=>r.status==='reviewed').length,scope:'Actual article prose, intent, metadata and adjacent source support; no ranking or plugin score claimed.',rows},null,2));
console.log(JSON.stringify({changed,reviewed:rows.filter(r=>r.status==='reviewed').length,total:rows.length,listingsRefreshed:cards}));
