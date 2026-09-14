import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {assertStaticReleaseSource} from '../src/lib/static-release-source.mjs';
const identity=assertStaticReleaseSource(process.env);
assert.ok(identity,'Select the explicit reviewed-static production mode.');
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const report=JSON.parse(await fs.readFile('migration/pre-deployment/build-policy.json','utf8'));
assert.equal(report.contentSource,identity.contentSource);
assert.equal(report.sourceCommit,identity.sourceCommit);
assert.equal(report.policy.environment,'production');assert.equal(report.policy.indexable,true);
const out=path.resolve('dist');
for(const denied of ['studio','build-manifest.json','.env'])assert.equal(await fs.stat(path.join(out,denied)).then(()=>true,()=>false),false,'Private or temporary output: '+denied);
const robots=await fs.readFile(path.join(out,'robots.txt'),'utf8');assert.match(robots,/Allow: \//);assert.doesNotMatch(robots,/Disallow: \//);
const headers=await fs.readFile(path.join(out,'_headers'),'utf8');assert.doesNotMatch(headers.split('/404.html')[0],/X-Robots-Tag:\s*noindex/i);
const sitemap=await fs.readFile(path.join(out,'sitemap.xml'),'utf8');
for(const entry of report.sitemap)assert.ok(sitemap.includes('<loc>'+entry.loc+'</loc>'),'Missing sitemap entry '+entry.loc);
const favicon=await fs.readFile(path.join(out,'favicon.ico'));assert.equal(favicon.readUInt16LE(2),1);assert.equal(favicon.readUInt16LE(4),3);
let articles=0;
for(const page of pages){
 const html=await fs.readFile(path.join(out,page.path,'index.html'),'utf8'),$=load(html);if(page.isArticle)articles++;
 assert.equal($('main h1').length,1,page.path+' H1');
 assert.equal($('link[rel=canonical]').attr('href'),page.canonical||'https://cash4goldanddiamond.com'+page.path);
 assert.equal($('link[rel=icon]').attr('href'),'/favicon.ico');
 if(process.env.PUBLIC_ANALYTICS_ENABLED!=='true'){
  assert.equal($('script[src]').filter((i,e)=>/googletagmanager|google-analytics/.test($(e).attr('src'))).length,0,'Unexpected analytics script');
  assert.equal($('[data-analytics-enabled="true"]').length,0,'Unexpected analytics activation');
 }
}
const missing=load(await fs.readFile(path.join(out,'404.html'),'utf8'));assert.equal(missing('main h1').text(),'Page not found');assert.match(missing('meta[name=robots]').attr('content'),/noindex/);
console.log(JSON.stringify({status:'PASS',...identity,pages:pages.length,articles,sitemapEntries:report.sitemap.length,studioExcluded:true,temporaryManifestExcluded:true,analyticsEnabled:process.env.PUBLIC_ANALYTICS_ENABLED==='true',faviconBytes:favicon.length}));
