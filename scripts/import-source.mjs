import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {load} from 'cheerio';
import sanitizeHtml from 'sanitize-html';

const origin='https://cash4goldanddiamond.com';
const source=path.resolve('migration/source-evidence');
const records=JSON.parse(await fs.readFile(path.join(source,'crawl.json'),'utf8'));
await fs.mkdir('src/data',{recursive:true});await fs.mkdir('public/media',{recursive:true});
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const assets=new Map(), backgrounds=new Map(), styles=new Map();
const same=u=>{try{return ['cash4goldanddiamond.com','www.cash4goldanddiamond.com'].includes(new URL(u,origin).hostname)}catch{return false}};
const absolute=u=>new URL(u,origin).href;
function addAsset(u){try{u=absolute(u);if(same(u)&&/\.(?:jpe?g|png|webp|gif|svg|avif|pdf)(?:\?|$)/i.test(u)&&!assets.has(u))assets.set(u,{url:u,path:'/media/'+sha(u).slice(0,12)+'-'+decodeURIComponent(new URL(u).pathname.split('/').pop()).replace(/[^a-zA-Z0-9._-]/g,'-')});}catch{}}
async function batch(items,fn,size=5){for(let i=0;i<items.length;i+=size)await Promise.all(items.slice(i,i+size).map(fn));}
await batch([...new Set(records.flatMap(r=>r.elementorStyles||[]))],async u=>{try{let text;try{text=await fs.readFile(path.join(source,sha(u)+'.css'),'utf8')}catch{const res=await fetch(u,{signal:AbortSignal.timeout(25000)});if(!res.ok)return;text=await res.text();await fs.writeFile(path.join(source,sha(u)+'.css'),text)}styles.set(u,text);for(const m of text.matchAll(/([^{}]+)\{([^{}]*background-image\s*:[^{}]*)\}/g)){const url=/url\(["']?([^"')]+)["']?\)/.exec(m[2])?.[1];if(url){addAsset(url);const ids=[...m[1].matchAll(/\.elementor-element-([a-zA-Z0-9]+)/g)];if(ids.length)backgrounds.set(ids.at(-1)[1],absolute(url));}}}catch(e){console.log('Style unavailable',u,e.message)}});
for(const r of records){for(const img of r.images||[]){if(img.src)addAsset(img.src);for(const part of (img.srcset||'').split(',')){const u=part.trim().split(/\s+/)[0];if(u)addAsset(u)}}for(const link of r.links||[])addAsset(link.href);const $=load(r.mainHtml||'');$('[data-settings]').each((i,e)=>{const value=$(e).attr('data-settings');for(const m of value.matchAll(/https?[^"\s]+?\.(?:webp|png|jpe?g|svg)/g))addAsset(m[0].replaceAll('\\/','/'));});}
let done=0;await batch([...assets.values()],async a=>{try{const dest='public'+a.path;try{const stat=await fs.stat(dest);if(stat.size){a.downloaded=true;return}}catch{}const res=await fetch(a.url,{headers:{'User-Agent':'Mozilla/5.0'},signal:AbortSignal.timeout(30000)});a.status=res.status;if(res.ok){const buffer=Buffer.from(await res.arrayBuffer());await fs.writeFile(dest,buffer);a.bytes=buffer.length;a.sha256=sha(buffer);a.downloaded=true;}}catch(e){a.error=e.message}finally{done++;if(done%40===0)console.log('Assets',done,'/',assets.size)}});
const localAsset=u=>{try{const a=assets.get(absolute(u));return a?.downloaded?a.path:u}catch{return u}};
const issues=[];
const knownPaths=new Set(records.filter(r=>r.status===200&&r.mainHtml).map(r=>new URL(r.finalUrl).pathname));
const aliases=Object.fromEntries(records.filter(r=>r.redirected&&same(r.finalUrl)).map(r=>[r.sourcePath,new URL(r.finalUrl).pathname]));
function localLink(u){try{const x=new URL(u,origin);if(same(x.href)){if(assets.has(x.href))return localAsset(x.href);if(knownPaths.has(x.pathname)||aliases[x.pathname])return x.pathname+x.search+x.hash;}return u}catch{return u}}
function clean(html,pagePath){const $=load(html||'',{},false);
 $('script,style,noscript,svg,.elementor-background-overlay,.elementor-shape').remove();
 $('#calendly-container,.calendly-inline-widget').each((i,e)=>{const url=$(e).attr('data-url')||'https://calendly.com/calidiamond310/30min';issues.push({path:pagePath,type:'appointment-link-preserved-not-booking-tested',url});$(e).replaceWith('<div class="appointment-link"><p><a class="elementor-button" href="'+url.replaceAll('&','&amp;')+'" target="_blank" rel="noopener noreferrer">Choose an appointment time</a></p><p>Scheduling opens on Calendly.</p></div>')});
 $('.elementor-hidden-desktop.elementor-hidden-tablet.elementor-hidden-mobile').each((i,e)=>{issues.push({path:pagePath,type:'hidden-source-content',text:$(e).text().trim()});$(e).remove()});
 $('form').each((i,e)=>{issues.push({path:pagePath,type:'form-integration-pending'});$(e).replaceWith('<aside class="integration-notice"><p>The contact form is not connected in this local preview.</p><a href="tel:3106631340">Call 310-663-1340</a></aside>')});
 $('iframe').each((i,e)=>{const src=$(e).attr('src');issues.push({path:pagePath,type:'embed-needs-review',src});$(e).replaceWith(src?.includes('google.com/maps')?'<p><a href="https://www.google.com/maps/search/?api=1&query=Cash+4+Gold+and+Diamonds+617+S+Hill+Street+Los+Angeles">View location on Google Maps</a></p>':'<p class="integration-notice">Appointment service connection pending.</p>')});
 $('.elementor-accordion-item').each((i,e)=>{const title=$(e).find('.elementor-accordion-title').first().text();const body=$(e).find('.elementor-tab-content').first().html();$(e).replaceWith('<details><summary>'+sanitizeHtml(title,{allowedTags:[]})+'</summary><div>'+(body||'')+'</div></details>')});
 $('.elementor-tab-title,.elementor-accordion-icon').remove();
 $('img').each((i,e)=>{const image=$(e);const src=image.attr('data-src')||image.attr('src');if(src)image.attr('src',localAsset(src));const set=image.attr('srcset')||image.attr('data-srcset');if(set)image.attr('srcset',set.split(',').map(x=>{const [u,size]=x.trim().split(/\s+/);return localAsset(u)+(size?' '+size:'')}).join(', '));image.attr('loading','lazy').attr('decoding','async');});
 $('a[href]').each((i,e)=>{const a=$(e);a.attr('href',localLink(a.attr('href')));if(a.attr('target')==='_blank')a.attr('rel','noopener noreferrer')});
 $('[data-id]').each((i,e)=>{const el=$(e),id=el.attr('data-id');el.attr('id','source-'+id);const bg=backgrounds.get(id);if(bg){const img=localAsset(bg);el.addClass('source-background');el.prepend('<img class="background-photo" src="'+img+'" alt="" loading="lazy" decoding="async">')}});
 $('[class]').each((i,e)=>{const el=$(e);const cls=(el.attr('class')||'').split(/\s+/).filter(c=>/^(?:elementor-(?:top-section|section|container|column|row|widget-wrap|widget-(?:heading|text-editor|image|button|icon-box|testimonial|image-box|icon-list)|button|icon-box|image-box|testimonial|icon-list)|e-con(?:-inner)?$|source-|background-photo|integration-notice)/.test(c));el.attr('class',cls.join(' '));});
 $('#source-1e744420>.background-photo').attr('loading','eager').attr('fetchpriority','high');
 return sanitizeHtml($.html(),{allowedTags:sanitizeHtml.defaults.allowedTags.concat(['img','details','summary','section','aside','figure','figcaption']),allowedAttributes:{'*':['id','class'],a:['href','name','target','rel'],img:['src','srcset','sizes','alt','width','height','loading','decoding','fetchpriority'],td:['colspan','rowspan'],th:['colspan','rowspan','scope'],time:['datetime']},allowedSchemes:['https','http','mailto','tel'],disallowedTagsMode:'discard'});
}
const pages=[], inventory=[];
for(const r of records){const finalPath=r.finalUrl?new URL(r.finalUrl).pathname:r.sourcePath;inventory.push({sourceUrl:r.url,targetPath:finalPath,status:r.status,redirectNeeded:r.redirected,contentVerified:false,seoMetadataVerified:false,migrationStatus:r.status===200?'Imported for review':'Source request failed',sourceSha256:r.sourceSha256});if(r.status!==200||!r.mainHtml||pages.some(p=>p.path===finalPath))continue;
 const full=load(await fs.readFile(path.join(source,'html',r.originalFile),'utf8'));const raw=load(r.mainHtml||'');raw('script,style,noscript').remove();
 const sections=raw('body').children().map((i,e)=>({id:raw(e).attr('data-id')||'section-'+i,html:clean(raw.html(e),finalPath)})).get();
 const html=clean(r.mainHtml,finalPath);const heading=r.h1?.[0]||full('h1').first().text().trim()||r.title;
 const page={path:finalPath,title:r.title,heading,description:r.description,canonical:r.canonical,robots:r.robots,meta:r.meta,schema:r.schema,html,sections,sourceText:raw.text().replace(/\s+/g,' ').trim(),sourceSha256:r.sourceSha256,images:(r.images||[]).map(x=>({...x,src:localAsset(x.src)})),sourceUrl:r.url,formsPending:(r.forms||[]).length>0,publishedAt:r.meta?.find(m=>m.name==='article:published_time')?.content,modifiedAt:r.meta?.find(m=>m.name==='article:modified_time')?.content,isArticle:full('body').hasClass('single-post'),author:full('.meta-author,.author-name,[rel=author]').first().text().trim(),categories:full('.meta-cat a,[rel="category tag"]').map((i,e)=>full(e).text()).get()};
 pages.push(page);
}
const {applyAddressCorrections,assertAddressIntegrity}=await import('../src/lib/address-integrity.mjs');
let preserved=new Map();
try{const current=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));const revisions=JSON.parse(await fs.readFile('migration/editorial-revisions.json','utf8'));const edited=new Set(revisions.map(r=>r.path));preserved=new Map(current.filter(p=>edited.has(p.path)).map(p=>[p.path,p]));}catch{}
const correctedPages=applyAddressCorrections(pages.map(p=>preserved.get(p.path)||p));assertAddressIntegrity(correctedPages);
await fs.writeFile('src/data/pages.json',JSON.stringify(correctedPages));
await fs.writeFile('src/data/redirects.json',JSON.stringify(aliases,null,2));
await fs.writeFile('migration/inventory.json',JSON.stringify(inventory,null,2));
await fs.writeFile('migration/assets.json',JSON.stringify([...assets.values()],null,2));
await fs.writeFile('migration/import-issues.json',JSON.stringify(issues,null,2));
console.log('Imported',pages.length,'unique pages;',assets.size,'assets;',issues.length,'review items');
