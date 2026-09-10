import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {load} from 'cheerio';

const origin='https://cash4goldanddiamond.com';
const audit=process.argv.includes('--audit');
const out=path.resolve(audit?'migration/pre-deployment/live-source':'migration/source-evidence');
await fs.mkdir(path.join(out,'html'),{recursive:true});
await fs.mkdir('migration',{recursive:true});
const headers={'User-Agent':'Mozilla/5.0 (compatible; Cash4GoldMigration/1.0; owner-authorized content inventory)'};
const seen=new Set(), queue=[origin+'/'], records=[], sitemapUrls=new Set(), sitemapRecords=[];
if(audit){const prior=JSON.parse(await fs.readFile('migration/source-evidence/crawl.json','utf8'));queue.push(...prior.map(p=>p.url));}
if(process.argv.includes('--retry')){
 const previous=JSON.parse(await fs.readFile(path.join(out,'crawl.json'),'utf8'));
 for(const r of previous){if(r.error){queue.push(r.url)}else{records.push(r);seen.add(r.url)}}
}
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const same=u=>['cash4goldanddiamond.com','www.cash4goldanddiamond.com'].includes(new URL(u).hostname);
function normalize(value,base=origin){try{const u=new URL(value,base);if(!same(u.href)||!['https:','http:'].includes(u.protocol)||u.search||/\.(?:xml|jpe?g|png|webp|gif|svg|pdf|zip|css|js|ico|mp4|woff2?)$/i.test(u.pathname)||/^\/(?:wp-json|wp-admin|wp-content|wp-includes|feed)(?:\/|$)/.test(u.pathname)||u.pathname.endsWith('/feed/'))return null;u.hash='';u.protocol='https:';u.hostname='cash4goldanddiamond.com';return u.href;}catch{return null}}
async function request(url){const res=await fetch(url,{headers,signal:AbortSignal.timeout(30000)});return {res,text:await res.text()};}
async function sitemap(url){if(sitemapRecords.some(x=>x.url===url))return;const item={url};sitemapRecords.push(item);try{const {res,text}=await request(url);item.status=res.status;await fs.writeFile(path.join(out,hash(url)+'.xml'),text);if(!res.ok)return;const $=load(text,{xmlMode:true});const urls=$('loc').map((i,e)=>$(e).text()).get();if($('sitemapindex').length){for(const u of urls)if(same(u))await sitemap(u);}else for(const u of urls){const n=normalize(u);if(n){sitemapUrls.add(n);queue.push(n)}}}catch(e){item.error=e.message}}
try{const {res,text}=await request(origin+'/robots.txt');await fs.writeFile(path.join(out,'robots.txt'),text);console.log('robots',res.status);for(const m of text.matchAll(/^Sitemap:\s*(\S+)/gmi))await sitemap(m[1]);}catch(e){console.log('robots error',e.message)}
await sitemap(origin+'/sitemap_index.xml');
await sitemap(origin+'/wp-sitemap.xml');
async function crawl(url){const record={url,sourcePath:new URL(url).pathname,requestedAt:new Date().toISOString(),sitemap:sitemapUrls.has(url)};try{
 const {res,text}=await request(url);Object.assign(record,{status:res.status,finalUrl:res.url,redirected:res.redirected,contentType:res.headers.get('content-type'),sourceSha256:hash(text)});
 const file=hash(url)+'.html';await fs.writeFile(path.join(out,'html',file),text);record.originalFile=file;
 if(!res.ok||!record.contentType?.includes('text/html')){records.push(record);return}
 const $=load(text);let main=$('[data-elementor-type="wp-page"]').first();if(!main.length)main=$('article .entry-content').first();if(!main.length)main=$('main').first();if(!main.length)main=$('body');
 Object.assign(record,{title:$('title').text().trim(),description:$('meta[name=description]').attr('content')||'',canonical:$('link[rel=canonical]').attr('href')||'',robots:$('meta[name=robots]').attr('content')||'',h1:$('main h1').map((i,e)=>$(e).text().trim()).get(),headings:main.find('h1,h2,h3,h4,h5,h6').map((i,e)=>({tag:e.tagName,text:$(e).text().trim()})).get(),meta:$('meta[property],meta[name]').map((i,e)=>({name:$(e).attr('property')||$(e).attr('name'),content:$(e).attr('content')})).get(),schema:$('script[type="application/ld+json"]').map((i,e)=>$(e).text()).get(),images:$('img').map((i,e)=>({src:$(e).attr('data-src')||$(e).attr('src'),srcset:$(e).attr('srcset')||$(e).attr('data-srcset'),alt:$(e).attr('alt')||'',width:$(e).attr('width'),height:$(e).attr('height')})).get(),links:$('a[href]').map((i,e)=>({href:new URL($(e).attr('href'),res.url).href,text:$(e).text().trim()})).get(),forms:$('form').map((i,e)=>({action:$(e).attr('action'),method:$(e).attr('method'),fields:$(e).find('input,select,textarea').map((j,f)=>({name:$(f).attr('name'),type:$(f).attr('type')})).get()})).get(),embeds:$('iframe').map((i,e)=>$(e).attr('src')).get(),scriptSources:$('script[src]').map((i,e)=>$(e).attr('src')).get(),mainHtml:main.html(),mainText:main.text().replace(/\s+/g,' ').trim(),elementorStyles:$('link[rel=stylesheet]').map((i,e)=>$(e).attr('href')).get().filter(u=>u.includes('/uploads/elementor/'))});
 for(const link of record.links){const n=normalize(link.href);if(n&&!seen.has(n))queue.push(n)}
 }catch(e){record.error=e.message}records.push(record);console.log(records.length,record.status||'ERROR',url);}
while(queue.length&&seen.size<1500){const batch=[];while(queue.length&&batch.length<3){const u=queue.shift();if(!seen.has(u)){seen.add(u);batch.push(u)}}await Promise.all(batch.map(crawl));await fs.writeFile(path.join(out,'crawl.json'),JSON.stringify(records,null,2));}
await fs.writeFile(path.join(out,'sitemaps.json'),JSON.stringify(sitemapRecords,null,2));
const summary={capturedAt:new Date().toISOString(),requests:records.length,successfulHtml:records.filter(x=>x.status===200&&x.mainHtml).length,sitemapUrls:sitemapUrls.size,remainingQueue:queue.length,failures:records.filter(x=>x.status!==200).map(({url,status,error})=>({url,status,error})),scope:'Public HTML, sitemap and linked-page discovery. Not reconciled against an authenticated WordPress export.'};
await fs.writeFile(audit?path.join(out,'summary.json'):'migration/crawl-summary.json',JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
