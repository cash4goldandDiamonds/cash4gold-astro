import fs from 'node:fs/promises';
import {load} from 'cheerio';
import {validateRedirects,editorialChecks} from '../src/lib/editorial-checks.mjs';
import assert from 'node:assert/strict';
import {correctAddressText} from '../src/lib/address-integrity.mjs';
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const aliases=JSON.parse(await fs.readFile('src/data/redirects.json','utf8'));
const source=JSON.parse(await fs.readFile('migration/source-evidence/crawl.json','utf8'));
const additions=JSON.parse(await fs.readFile('migration/pre-deployment/additions.json','utf8'));
const revisions=JSON.parse(await fs.readFile('migration/editorial-revisions.json','utf8'));
const failures=[],warnings=[],results=[];
const paths=new Set([...pages.map(p=>p.path),...Object.keys(aliases)]);
const norm=s=>s.replace(/\s+/g,' ').trim();
const assetExists=async p=>{try{await fs.access('dist'+decodeURIComponent(p));return true}catch{return false}};
assert.deepEqual(validateRedirects([{from:'/a/',to:'/b/'},{from:'/b/',to:'/c/'}]),[]);
assert.ok(validateRedirects([{from:'/a/',to:'/b/'},{from:'/b/',to:'/a/'}]).length);
assert.ok(validateRedirects([{from:'/a/',to:'/b/'},{from:'/a/',to:'/c/'}]).length);
assert.ok(validateRedirects([{from:'/a/',to:'//outside.example/'}]).length);
assert.equal(editorialChecks({}).aeo.score,0);
assert.equal(editorialChecks({body:[{_type:'migratedImage',alt:''}]}).seo.checks.find(c=>c.label==='Images have alternative text').passed,false);
assert.deepEqual(validateRedirects(Object.entries(aliases).map(([from,to])=>({from,to}))),[]);
for(const p of pages){const file='dist'+p.path+'index.html';const html=await fs.readFile(file,'utf8');const $=load(html);const checks={title:$('title').text()===p.title,description:$('meta[name=description]').attr('content')===p.description,canonical:$('link[rel=canonical]').attr('href')===(p.canonical||'https://cash4goldanddiamond.com'+p.path),noindex:$('meta[name=robots]').attr('content')?.includes('noindex'),singleH1:$('main h1').length===1,noForms:$('form').length===0,localNavigationScript:$('script[type=module]').length===1&&$('script[src]').toArray().every(e=>/^\/_astro\/[\w.-]+\.js$/.test($(e).attr('src')))};
 for(const [key,ok] of Object.entries(checks))if(!ok)failures.push({path:p.path,check:key});
 const renderedText=norm($('main').text());const original=source.find(s=>s.url===p.sourceUrl),addition=additions.find(a=>a.path===p.path);let compared=0,missing=[];
 const originalHtml=typeof original?.mainHtml==='string'?original.mainHtml:addition?.originalPage?.html;
 const editorialRevision=revisions.some(r=>r.path===p.path)&&p.path!=='/';
 if(originalHtml||editorialRevision){const raw=load(editorialRevision?p.html:originalHtml);raw('script,style,noscript,form,.elementor-hidden-desktop.elementor-hidden-tablet.elementor-hidden-mobile').remove();raw('h1,h2,h3,h4,h5,h6,p,li,td,th').each((i,e)=>{const text=norm(correctAddressText(raw(e).text(),p.path));if(text.length>8){compared++;if(!renderedText.includes(text))missing.push(text.slice(0,180))}})}else failures.push({path:p.path,check:'source-evidence-missing'});
 if(missing.length)warnings.push({path:p.path,type:'source-text-review',missing});
 const localMissing=[];for(const el of $('img[src],script[src],link[rel=stylesheet]').toArray()){const url=$(el).attr('src')||$(el).attr('href');if(url?.startsWith('/')&&!await assetExists(url))localMissing.push(url)}for(const el of $('[srcset]').toArray()){for(const entry of $(el).attr('srcset').split(',')){const url=entry.trim().split(/\s+/)[0];if(url.startsWith('/')&&!await assetExists(url))localMissing.push(url)}}if(localMissing.length)failures.push({path:p.path,check:'local-assets',missing:localMissing});
 for(const el of $('a[href]').toArray()){const href=$(el).attr('href');if(href.startsWith('/')&&!href.startsWith('//')){const u=new URL(href,'https://local.example');if(!paths.has(u.pathname)&&!await assetExists(u.pathname))warnings.push({path:p.path,type:'unresolved-local-link',href});}else if(href.startsWith('#')&&href.length>1&&!$('[id]').toArray().some(e=>$(e).attr('id')===decodeURIComponent(href.slice(1))))warnings.push({path:p.path,type:'missing-anchor',href});}
 results.push({path:p.path,...checks,textComparisonBasis:editorialRevision?'Current editorial revision; original retained in source archive':'Original source with owner-confirmed address corrections',sourceTextBlocksCompared:compared,sourceTextBlocksMissing:missing.length,htmlBytes:Buffer.byteLength(html)});
}
for(const [from,to] of Object.entries(aliases)){const html=await fs.readFile('dist'+from+'index.html','utf8');const $=load(html);if(!$('meta[http-equiv=refresh]').attr('content')?.includes(to))failures.push({path:from,check:'redirect-target'})}
const report={checkedAt:new Date().toISOString(),pages:pages.length,redirects:Object.keys(aliases).length,checks:'Output routes, source titles/descriptions/canonicals, noindex, H1 count, absence of active forms/third-party scripts, local assets, internal links, source text blocks, redirect targets and cycle validation.',failures,warnings,results};
await fs.writeFile('migration/verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify({pages:pages.length,redirects:Object.keys(aliases).length,failures,warnings:warnings.length,sourceTextMissing:results.reduce((s,r)=>s+r.sourceTextBlocksMissing,0)},null,2));if(failures.length)process.exitCode=1;
