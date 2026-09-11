import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
import {gzipSync} from 'node:zlib';
import {pageRobots,releasePolicy,sitemapEntries} from '../src/lib/release-policy.mjs';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const out=process.env.ASTRO_OUT_DIR||'dist';
const policy=releasePolicy({SITE_ENV:'production',ENABLE_PRODUCTION_INDEXING:'true'});
const errors=[],rows=[],titles=new Map(),descriptions=new Map();
const sourceOrigin='https://cash4goldanddiamond.com';
for(const p of pages){
 const html=await fs.readFile(path.join(out,p.path,'index.html'),'utf8'),$=load(html);
 const canonical=p.canonical||sourceOrigin+p.path;
 const indexable=!pageRobots(p,policy).includes('noindex')&&canonical===sourceOrigin+p.path;
 const main=$('main'),text=main.text().replace(/\s+/g,' ').trim();
 const title=$('title').text(),description=$('meta[name="description"]').attr('content')||'';
 const error=type=>errors.push({path:p.path,type});
 if(main.find('h1').length!==1)error('one-h1-required');
 if(!title||!description)error('missing-title-or-description');
 if(/\bappoinment\b|\[\/?(?:repocean_reviews|contact-form-7|elementor)[^\]]*\]/i.test(text))error('misspelling-or-shortcode');
 if(indexable){if(titles.has(title))error('duplicate-title: '+titles.get(title));if(descriptions.has(description))error('duplicate-description: '+descriptions.get(description));titles.set(title,p.path);descriptions.set(description,p.path);}
 if($('link[rel="canonical"]').length!==1||$('link[rel="canonical"]').attr('href')!==canonical)error('canonical-mismatch');
 if(process.env.SITE_ENV==='production'&&$('meta[name="robots"]').attr('content')!==pageRobots(p,policy))error('production-robots-mismatch');
 if($('meta[property="og:title"]').attr('content')!==title||$('meta[property="og:description"]').attr('content')!==description)error('stale-open-graph-text');
 if($('meta[property="og:url"]').length!==1||$('meta[property="og:url"]').attr('content')!==canonical)error('open-graph-url-mismatch');
 if(!$('meta[property="og:image"]').attr('content'))error('missing-social-image');
 if($('img:not([alt])').length)error('missing-alt-attribute');
 if($('script:not([src])').toArray().some(e=>$(e).attr('type')!=='application/ld+json'&&$(e).text().trim()))error('inline-script-blocked-by-host-csp');
 if(!$('.location-bar').text().includes('617 S. Hill Street, Los Angeles, CA 90014'))error('NAP-address');
 if(!$('.location-bar').text().includes('310-663-1340'))error('NAP-phone');
 const graph=$('script[type="application/ld+json"]').toArray().flatMap(e=>{try{const d=JSON.parse($(e).text());return d['@graph']||[d];}catch{error('invalid-jsonld');return[];}});
 if(graph.some(n=>['Review','AggregateRating'].includes(n['@type'])||n.aggregateRating||n.review))error('self-serving-review-schema');
 for(const n of graph.filter(n=>n['@type']==='FAQPage'))for(const q of n.mainEntity||[]){if(!text.includes(String(q.name).replace(/\s+/g,' ').trim())||!text.includes(String(q.acceptedAnswer?.text||'').replace(/\s+/g,' ').trim()))error('FAQ-schema-not-visible');}
 const images=main.find('img');
 rows.push({path:p.path,indexableInApprovedProduction:indexable,robotsInSource:p.robots,renderedRobots:$('meta[name="robots"]').attr('content'),canonical,title,description,h1:main.find('h1').text(),htmlBytes:Buffer.byteLength(html),htmlGzipBytes:gzipSync(html).length,domElements:$('*').length,images:images.length,missingAlt:images.filter(':not([alt])').length,highPriorityImages:images.filter('[fetchpriority="high"]').length,lazyHighPriorityImages:images.filter('[loading="lazy"][fetchpriority="high"]').length,schemaTypes:graph.map(n=>n['@type']),thirdPartyScripts:$('script[src]').map((i,e)=>$(e).attr('src')).get().filter(src=>/^https?:/.test(src)),forms:main.find('form').length});
}
const gold=rows.find(r=>r.path==='/sell-your-golds/');if(!gold.schemaTypes.includes('Service')||!gold.schemaTypes.includes('FAQPage'))errors.push({path:gold.path,type:'missing-gold-schema'});
const sitemap=await fs.readFile(path.join(out,'sitemap.xml'),'utf8'),robots=await fs.readFile(path.join(out,'robots.txt'),'utf8');
const isProduction=process.env.SITE_ENV==='production';
if(isProduction){const expected=sitemapEntries(pages,policy).map(e=>e.loc).sort(),xml=load(sitemap,{xmlMode:true}),actual=xml('url > loc').map((i,e)=>xml(e).text()).get().sort();if(JSON.stringify(actual)!==JSON.stringify(expected))errors.push({path:'/sitemap.xml',type:'production-sitemap-urls'});if(!robots.includes('Allow: /')||robots.includes('Disallow: /'))errors.push({path:'/robots.txt',type:'production-crawl-policy'});}
else {if(!rows.every(r=>r.renderedRobots.includes('noindex')))errors.push({path:'*',type:'preview-indexable'});if(load(sitemap,{xmlMode:true})('url').length!==0||!robots.includes('Disallow: /'))errors.push({path:'*',type:'preview-crawl-policy'});}
const report={checkedAt:new Date().toISOString(),scope:'All built HTML. Production eligibility derives from the explicit release policy; preview remains noindex. File sizes are not measured Core Web Vitals.',environment:isProduction?'isolated-production-audit':'preview',pages:rows.length,indexableCanonicalPages:rows.filter(r=>r.indexableInApprovedProduction).length,errors,rows};
await fs.mkdir('migration/final-seo-audit',{recursive:true});await fs.writeFile('migration/final-seo-audit/'+(isProduction?'production':'preview')+'-checks.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pages:rows.length,indexableCanonicalPages:report.indexableCanonicalPages,errors},null,2));if(errors.length)process.exitCode=1;
