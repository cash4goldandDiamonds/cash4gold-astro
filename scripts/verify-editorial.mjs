import fs from 'node:fs/promises';
import {load} from 'cheerio';
import assert from 'node:assert/strict';
import {assertAddressIntegrity,businessProfile} from '../src/lib/address-integrity.mjs';
import {renderMigratedImage} from '../src/lib/migrated-image.mjs';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const articles=pages.filter(p=>p.isArticle);
const docs=(await fs.readFile('migration/sanity-import.ndjson','utf8')).trim().split('\n').map(JSON.parse);
const pageDocs=docs.filter(d=>d._type==='page');
const pairs=JSON.parse(await fs.readFile('migration/duplicate-article-canonicals.json','utf8'));
const knownPaths=new Set(pages.map(p=>p.path));
const failures=[],rows=[];
const check=(path,name,ok)=>{if(!ok)failures.push({path,check:name});return Boolean(ok);};
assertAddressIntegrity(pages);
const sourceArticles=JSON.parse(await fs.readFile('migration/substantive-review-baseline.json','utf8')).filter(p=>p.isArticle);
const additions=JSON.parse(await fs.readFile('migration/pre-deployment/additions.json','utf8').catch(e=>{if(e.code==='ENOENT')return '[]';throw e;}));
assert.equal(articles.length,sourceArticles.length+additions.filter(a=>a.originalPage.isArticle).length);
assert.equal(pageDocs.length,pages.length);
const renderedImage=load(renderMigratedImage({localPath:'/media/sample.webp',alt:'Gold & jewelry',width:800,height:600,srcset:'/media/sample-400.webp 400w, /media/sample.webp 800w',sizes:'90vw',caption:'<script>untrusted</script>'}));
assert.equal(renderedImage('script').length,0);assert.equal(renderedImage('img').attr('width'),'800');assert.equal(renderedImage('img').attr('srcset'),'/media/sample-400.webp 400w, /media/sample.webp 800w');assert.equal(renderedImage('figcaption').text(),'<script>untrusted</script>');
const exists=async src=>{try{await fs.access('public'+src);return true;}catch{return false;}};
const titleMap=new Map(),focusMap=new Map();
const preferred=p=>new URL(p.canonical).pathname===p.path;
for(const p of articles){
 const $=load(await fs.readFile('dist'+p.path+'index.html','utf8')),body=$('main .imported-content'),doc=pageDocs.find(d=>d.path===p.path),canonicalPath=new URL(p.canonical).pathname;
 const imgs=body.find('img').toArray(),internal=[],external=[];
 for(const e of body.find('a[href]').toArray()){const href=$(e).attr('href');if(href.startsWith('/')){const u=new URL(href,'https://cash4goldanddiamond.com');internal.push(href);check(p.path,'internal destination exists',knownPaths.has(u.pathname)||await exists(u.pathname));if(u.hash&&knownPaths.has(u.pathname)){const target=load(await fs.readFile('dist'+u.pathname+'index.html','utf8'));check(p.path,'destination fragment exists',target('[id]').toArray().some(e=>target(e).attr('id')===decodeURIComponent(u.hash.slice(1))));}}else if(href.startsWith('https://')&&!new URL(href).hostname.endsWith('cash4goldanddiamond.com'))external.push(href);}
 for(const e of imgs){const img=$(e),src=img.attr('src');check(p.path,'local image exists',src.startsWith('/')&&await exists(src));check(p.path,'image has meaningful alt',img.attr('alt')?.trim().length>8);check(p.path,'image dimensions present',Number(img.attr('width'))>0&&Number(img.attr('height'))>0);check(p.path,'responsive image included',Boolean(img.attr('srcset')));}
 const graph=$('script[type="application/ld+json"]').toArray().flatMap(e=>{const s=JSON.parse($(e).text());return s['@graph']||[s];});const article=graph.find(s=>s['@type']==='BlogPosting');
 check(p.path,'one H1',$('main h1').length===1);check(p.path,'at least two unique body images',new Set(imgs.map(e=>$(e).attr('src'))).size>=2);check(p.path,'topic source links rendered',p.editorial.sources.every(s=>external.includes(s.url)));check(p.path,'related guides rendered',p.editorial.related.every(path=>internal.includes(path)));check(p.path,'main service linked',internal.includes(p.editorial.service));
 check(p.path,'canonical page exists',knownPaths.has(canonicalPath));check(p.path,'article schema matches canonical',article?.url===p.canonical&&article?.headline===p.heading);check(p.path,'publication date retained',article?.datePublished===p.publishedAt);check(p.path,'business address visible',$('.location-bar').text().includes(businessProfile.address));
 check(p.path,'CMS focus keyword matches',doc.seo.focusKeyword===p.editorial.focusKeyword);check(p.path,'CMS sources preserved',doc.sources.length===p.editorial.sources.length);check(p.path,'CMS images preserved',doc.body.filter(b=>b._type==='migratedImage').length===imgs.length);check(p.path,'CMS related references',doc.related.length===p.editorial.related.length);check(p.path,'description meaningful',p.description.length>=70&&p.description.length<=170);check(p.path,'natural concise title',p.title.length>=20&&p.title.length<=90);check(p.path,'no stale social title',$('meta[property="og:title"]').attr('content')===p.title);
 if(preferred(p)){check(p.path,'unique canonical article title',!titleMap.has(p.title));titleMap.set(p.title,p.path);check(p.path,'unique focus keyword',!focusMap.has(p.editorial.focusKeyword.toLowerCase()));focusMap.set(p.editorial.focusKeyword.toLowerCase(),p.path);}
 rows.push({path:p.path,title:p.title,focusKeyword:p.editorial.focusKeyword,secondaryKeywords:p.editorial.secondaryKeywords.join('; '),description:p.description,canonical:p.canonical,bodyImages:imgs.length,internalLinks:internal.length,outboundLinks:external.length,sources:p.editorial.sources.map(s=>s.url),service:p.editorial.service,words:body.text().split(/\s+/).length});
}
const library=load(await fs.readFile('dist/blogs/index.html','utf8'));const libraryPaths=new Set(library('.blog-card').toArray().map(e=>library(e).attr('href')));check('/blogs/','all canonical articles discoverable',articles.filter(preferred).every(p=>libraryPaths.has(p.path)));check('/blogs/','canonical duplicate suppression',pairs.every(pair=>!libraryPaths.has(pair.path)));
const gold=load(await fs.readFile('dist/sell-your-golds/index.html','utf8'));for(const text of ['Cuban','scrap gold','gold coins','silver coins','with or without diamonds','cash, bank wire, or business check','large quantities'])check('/sell-your-golds/','gold buying scope: '+text,gold('main').text().toLowerCase().includes(text.toLowerCase()));
for(const id of ['scrap-gold','cuban-chains','gold-coins','silver-coins'])check('/sell-your-golds/','item section: '+id,gold('#'+id).length===1);
const documentIds=new Set(docs.map(d=>d._id));const inspect=(value,path)=>{if(!value||typeof value!=='object')return;if(value._type==='reference')check(path,'CMS reference resolves',documentIds.has(value._ref));Object.values(value).forEach(v=>inspect(v,path));};docs.forEach(d=>inspect(d,d._id));
const report={checkedAt:new Date().toISOString(),articles:articles.length,canonicalArticles:articles.filter(preferred).length,preparedCmsDocuments:docs.length,address:businessProfile.address,failures,rows};
await fs.writeFile('migration/editorial-verification.json',JSON.stringify(report,null,2));
await fs.mkdir('outputs',{recursive:true});
await fs.writeFile('outputs/Blog-optimization-audit.json',JSON.stringify(report,null,2));
const cols=['path','title','focusKeyword','secondaryKeywords','description','canonical','bodyImages','internalLinks','outboundLinks','service','words'];
const csv=cols.join(',')+'\n'+rows.map(r=>cols.map(k=>'"'+String(r[k]).replace(/"/g,'""')+'"').join(',')).join('\n');await fs.writeFile('outputs/Blog-optimization-audit.csv','\ufeff'+csv);
console.log(JSON.stringify({articles:report.articles,canonicalArticles:report.canonicalArticles,preparedCmsDocuments:docs.length,failures},null,2));if(failures.length)process.exitCode=1;
