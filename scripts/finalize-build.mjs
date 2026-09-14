import fs from 'node:fs/promises';
import path from 'node:path';
import {hostHeaders,robotsTxt,sitemapXml,siteOrigin} from '../src/lib/release-policy.mjs';
import {analyticsSettings} from '../src/lib/privacy-consent.mjs';
const out=path.resolve(process.env.ASTRO_OUT_DIR||'dist');
const manifest=JSON.parse(await fs.readFile(path.join(out,'build-manifest.json'),'utf8'));
await fs.writeFile(path.join(out,'_headers'),hostHeaders(manifest.policy,{analytics:analyticsSettings({enabled:process.env.PUBLIC_ANALYTICS_ENABLED,id:process.env.PUBLIC_GA4_MEASUREMENT_ID,environment:process.env.PUBLIC_ANALYTICS_ENV,siteEnvironment:manifest.policy.environment}).enabled}));
await fs.writeFile(path.join(out,'_redirects'),manifest.redirects.map(r=>`${r.from} ${r.to} ${r.status}`).join('\n')+'\n');
await fs.writeFile(path.join(out,'robots.txt'),robotsTxt(manifest.policy));
const entries=manifest.sitemap;
if(entries.length>45000){
 const chunks=[];for(let i=0;i<entries.length;i+=45000){const name=`sitemap-${chunks.length+1}.xml`;await fs.writeFile(path.join(out,name),sitemapXml(entries.slice(i,i+45000)));chunks.push(name);}
 await fs.writeFile(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+chunks.map(n=>`<sitemap><loc>${siteOrigin}/${n}</loc></sitemap>`).join('')+'</sitemapindex>');
}else await fs.writeFile(path.join(out,'sitemap.xml'),sitemapXml(entries));
await fs.unlink(path.join(out,'build-manifest.json'));
await fs.mkdir('migration/pre-deployment',{recursive:true});
const reportName=process.env.ISOLATED_PRODUCTION_AUDIT==='true'?'production-audit-policy.json':'build-policy.json';
await fs.writeFile('migration/pre-deployment/'+reportName,JSON.stringify({checkedAt:new Date().toISOString(),outputDirectory:out,...manifest},null,2));
console.log(JSON.stringify({environment:manifest.policy.environment,redirects:manifest.redirects.length,sitemapEntries:entries.length,indexable:manifest.policy.indexable}));
