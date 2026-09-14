import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {load} from 'cheerio';
const base='migration/pre-deployment';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const pages=await read('src/data/pages.json'),prior=await read('migration/source-evidence/crawl.json'),live=await read(base+'/live-source/crawl.json'),redirects=await read('src/data/redirects.json');
const pByPath=new Map(pages.map(p=>[p.path,p]));
const revisions=await read('migration/editorial-revisions.json'),ledger=await read('migration/substantive-review.json'),differences=await read('migration/final-source-difference-review.json');
const knownEdits=new Set([...revisions.map(x=>x.path),...ledger.rows.filter(x=>x.status==='reviewed').map(x=>x.path),...differences.rows.map(x=>x.path)]);
const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
const text=s=>{const $=load(s||'');$('script,style,noscript').remove();return norm($.text());};
const resolve=p=>{const seen=new Set();while(redirects[p]&&!seen.has(p)){seen.add(p);p=redirects[p];}return p;};
const rows=[];
for(const r of live){
 const sourcePath=new URL(r.url).pathname,target=resolve(r.finalUrl?new URL(r.finalUrl).pathname:sourcePath),p=pByPath.get(target),$=load(r.mainHtml||''),old=prior.find(x=>x.url===r.url);
 const sourceBlocks=$('h1,h2,h3,h4,h5,h6,p,li,td,th').map((i,e)=>norm($(e).text())).get().filter(x=>x.length>8),body=p?text(p.html):'';
 const missing=sourceBlocks.filter(t=>!body.includes(t));
 rows.push({sourceUrl:r.url,newUrl:p?'https://cash4goldanddiamond.com'+target:null,sourceStatus:r.status||r.error,sourceSitemap:r.sitemap,redirectNeeded:sourcePath!==target,configured301:sourcePath!==target&&redirects[sourcePath]===target,changedSinceCapture:old?text(old.mainHtml)!==text(r.mainHtml):true,status:!p&&r.mainHtml?'BLOCKED':p?'PASS':'NOT TESTED',migrationStatus:!p&&r.mainHtml?'MISSING LIVE PAGE':p?(knownEdits.has(target)?'Existing documented editorial revision':'URL retained'):'Source error/non-HTML needs disposition',contentVerified:p&&missing.length===0,seoMetadataVerified:p&&p.title===r.title&&p.description===r.description&&p.canonical===r.canonical,sourceTextBlocks:sourceBlocks.length,missingExactTextBlocks:missing.length,title:{source:r.title,target:p?.title},description:{source:r.description,target:p?.description},canonical:{source:r.canonical,target:p?.canonical},headings:{source:r.headings,target:p?load(p.html)('h1,h2,h3,h4,h5,h6').map((i,e)=>({tag:e.tagName,text:load(p.html)(e).text()})).get():[]},images:{source:r.images||[],target:p?.images||[]},categories:p?.categories||[],missingTextSamples:missing.slice(0,12)});
}
const findings=[],pageRows=[],incoming=new Map(pages.map(p=>[p.path,new Set()]));
for(const p of pages){
 const $=load(p.html),links=$('a[href]').map((i,e)=>$(e).attr('href')).get();
 for(const href of links){let u;try{u=new URL(href,'https://cash4goldanddiamond.com'+p.path);}catch{findings.push({path:p.path,type:'invalid-link',href});continue;}if(!['cash4goldanddiamond.com','www.cash4goldanddiamond.com'].includes(u.hostname))continue;const target=resolve(u.pathname);if(incoming.has(target)&&target!==p.path)incoming.get(target).add(p.path);if(!pByPath.has(target)){if(!/\.[a-z0-9]+$/i.test(target))findings.push({path:p.path,type:'missing-internal-path',href});continue;}if(u.hash){const dest=load(pByPath.get(target).html);let id;try{id=decodeURIComponent(u.hash.slice(1));}catch{findings.push({path:p.path,type:'invalid-fragment',href});continue;}if(!['main'].includes(id)&&!dest('[id]').toArray().some(e=>dest(e).attr('id')===id))findings.push({path:p.path,type:'missing-fragment',href});}}
 for(const raw of p.schema||[]){try{JSON.parse(raw);}catch{findings.push({path:p.path,type:'invalid-jsonld'});}}
 const claims=norm($.text()).match(/.{0,80}\b(?:certified (?:experts?|professionals?|staff)|highest (?:price|payout)|guarantee(?:d|s)?|since 2007|[0-9]+ years of|get paid instantly)\b.{0,100}/gi)||[];
 const headings=$('h1,h2,h3,h4,h5,h6').map((i,e)=>({level:Number(e.tagName.slice(1)),text:$(e).text()})).get();
 pageRows.push({path:p.path,title:p.title,description:p.description,canonical:p.canonical,robots:p.robots,titleLength:p.title.length,descriptionLength:p.description.length,headings,images:$('img').length,imagesMissingAlt:$('img:not([alt])').length,imagesMissingDimensions:$('img').toArray().filter(e=>!e.attribs.width||!e.attribs.height).length,formsPending:p.formsPending,claimsForOwnerVerification:claims,wordCount:text(p.html).split(/\s+/).length});
}
const docs=(await fs.readFile('migration/sanity-import.ndjson','utf8')).trim().split('\n').map(JSON.parse),ids=new Set(docs.map(d=>d._id)),badRefs=[];
function refs(v,doc){if(!v||typeof v!=='object')return;if(v._type==='reference'&&!ids.has(v._ref)&&!v._ref?.startsWith('image-'))badRefs.push({document:doc,reference:v._ref});for(const x of Object.values(v))if(x&&typeof x==='object')refs(x,doc);}
docs.forEach(d=>refs(d,d._id));
const reports=[];
for(const name of await fs.readdir('migration')){if(!name.endsWith('.json'))continue;try{const j=await read('migration/'+name);reports.push({path:'migration/'+name,bytes:(await fs.stat('migration/'+name)).size,checkedAt:j.checkedAt||j.capturedAt||null,scope:j.scope||j.mode||j.checks||null,errors:j.errors||j.failures||[],warnings:j.warnings||[],summary:Object.fromEntries(Object.entries(j).filter(([k,v])=>v===null||['string','number','boolean'].includes(typeof v)))});}catch(e){reports.push({path:'migration/'+name,parseError:e.message});}}
const duplicate=(field)=>Object.entries(Object.groupBy(pages,p=>p[field])).filter(([key,group])=>key&&group.length>1).map(([value,group])=>({value,paths:group.map(p=>p.path),canonicalGroup:new Set(group.map(p=>p.canonical||'https://cash4goldanddiamond.com'+p.path)).size===1}));
const report={checkedAt:new Date().toISOString(),scope:'Read-only fresh public WordPress capture compared with local source. Exact-text differences are evidence for review, not automatic proof of content loss or approved rewriting. Authenticated WordPress/Rank Math exports remain unavailable.',counts:{liveRequests:live.length,liveSitemap:live.filter(r=>r.sitemap).length,localPages:pages.length,localArticles:pages.filter(p=>p.isArticle).length,redirects:Object.keys(redirects).length,missingLivePages:rows.filter(r=>r.migrationStatus==='MISSING LIVE PAGE').length,preparedCmsDocs:docs.length},missingLivePages:rows.filter(r=>r.migrationStatus==='MISSING LIVE PAGE').map(r=>r.sourceUrl),changedSinceCapture:rows.filter(r=>r.changedSinceCapture).map(r=>r.sourceUrl),duplicateTitles:duplicate('title'),duplicateDescriptions:duplicate('description'),orphanCandidates:[...incoming].filter(([p,from])=>!from.size&&p!=='/').map(([p])=>p),internalLinkFindings:findings,cmsBrokenReferences:badRefs,rows,pageRows};
await fs.writeFile(base+'/migration-comparison.json',JSON.stringify(report,null,2));
await fs.writeFile(base+'/prior-report-inventory.json',JSON.stringify(reports,null,2));
const csv=v=>'"'+String(v??'').replaceAll('"','""')+'"';
await fs.writeFile(base+'/migration-url-matrix.csv',['Existing URL,New URL,Migration Status,Redirect Needed,301 Configured,Content Verified,SEO Metadata Verified',...rows.map(r=>[r.sourceUrl,r.newUrl,r.migrationStatus,r.redirectNeeded,r.configured301,r.contentVerified,r.seoMetadataVerified].map(csv).join(','))].join('\n'));
console.log(JSON.stringify({counts:report.counts,missingLivePages:report.missingLivePages,changed:report.changedSinceCapture.length,duplicateTitles:report.duplicateTitles.length,duplicateDescriptions:report.duplicateDescriptions.length,linkFindings:findings.length,brokenCmsRefs:badRefs.length,orphanCandidates:report.orphanCandidates.length,reportsRead:reports.length,claims:pageRows.filter(p=>p.claimsForOwnerVerification.length).map(p=>({path:p.path,claims:p.claimsForOwnerVerification}))},null,2));
