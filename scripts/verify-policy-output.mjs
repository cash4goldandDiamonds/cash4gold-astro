import fs from 'node:fs/promises';
import {load} from 'cheerio';
import {assertContentEnvironment} from '../src/lib/cms-release-gates.mjs';
import {releasePolicy,sitemapEntries} from '../src/lib/release-policy.mjs';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8')),errors=[];
const results=[];
for(const [folder,production] of [['dist',false],['.cache/production-audit',true]]){
 const robots=await fs.readFile(folder+'/robots.txt','utf8'),headers=await fs.readFile(folder+'/_headers','utf8'),xml=load(await fs.readFile(folder+'/sitemap.xml','utf8'),{xmlMode:true}),urls=xml('loc').map((i,e)=>xml(e).text()).get(),expected=sitemapEntries(pages,{indexable:production});
 if(JSON.stringify(urls)!==JSON.stringify(expected.map(e=>e.loc)))errors.push(folder+': sitemap mismatch');
 if(production?!robots.includes('Allow: /')||headers.includes('X-Robots-Tag: noindex, nofollow, noarchive'):!robots.includes('Disallow: /')||!headers.includes('private, no-store'))errors.push(folder+': robots/headers mismatch');
 for(const p of pages){const $=load(await fs.readFile(folder+p.path+'index.html','utf8')),indexable=!($('meta[name=robots]').attr('content')||'').includes('noindex');if(!production&&indexable)errors.push('Preview indexable: '+p.path);if($('link[rel=canonical]').attr('href')!==(p.canonical||'https://cash4goldanddiamond.com'+p.path))errors.push(folder+': canonical '+p.path);}
 const $404=load(await fs.readFile(folder+'/404.html','utf8'));if(!$404('meta[name=robots]').attr('content')?.includes('noindex'))errors.push(folder+': 404 must be noindex');
 let buildManifestPresent=false;try{await fs.access(folder+'/build-manifest.json');buildManifestPresent=true;}catch{}
 if(buildManifestPresent)errors.push(folder+': internal manifest remains public');
 results.push({folder,contentPages:pages.length,sitemapEntries:urls.length,previewProtectedByRobots:!production,publicAccessControl:'Actual deployed authentication NOT TESTED',internalManifestRemoved:!buildManifestPresent});
}
let releaseBlocked=false;try{releasePolicy({SITE_ENV:'production',ENABLE_PRODUCTION_INDEXING:'true'});assertContentEnvironment({SITE_ENV:'production'});}catch{releaseBlocked=true;}
if(!releaseBlocked)errors.push('Production without approved CMS was not blocked');
const report={checkedAt:new Date().toISOString(),scope:'Real generated preview and isolated production files; no hosting deployment',releaseWithoutCmsBlocked:releaseBlocked,results,errors};await fs.writeFile('migration/pre-deployment/policy-output-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(errors.length)process.exitCode=1;
