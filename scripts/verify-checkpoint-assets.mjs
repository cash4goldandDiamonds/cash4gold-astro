import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';
const tracked=new Set(execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean)),references=new Set(),errors=[];
async function walk(dir){const files=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())files.push(...await walk(file));else if(entry.isFile())files.push(file);}return files;}
function reference(value,base){
 if(!value||/^(?:data:|blob:|#)/.test(value))return;
 let url;try{url=new URL(value,base);}catch{return;}
 if(url.origin!=='https://cash4goldanddiamond.com')return;
 references.add(decodeURIComponent(url.pathname));
}
function cssReferences(css,base){for(const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g))reference(match[1],base);}
const files=await walk('dist');let htmlFiles=0;
for(const file of files){
 const relative=path.relative('dist',file).replaceAll('\\','/'),base='https://cash4goldanddiamond.com/'+relative.replace(/index\.html$/,'');
 if(file.endsWith('.html')){
  htmlFiles++;const $=load(await fs.readFile(file,'utf8'));
  $('[src]').each((i,el)=>reference($(el).attr('src'),base));
  $('[poster]').each((i,el)=>reference($(el).attr('poster'),base));
  $('[srcset]').each((i,el)=>{for(const part of ($(el).attr('srcset')||'').split(','))reference(part.trim().split(/\s+/)[0],base);});
  $('link[rel="stylesheet"],link[rel="icon"],link[rel="preload"],link[rel="modulepreload"]').each((i,el)=>reference($(el).attr('href'),base));
  $('[style]').each((i,el)=>cssReferences($(el).attr('style')||'',base));
  $('style').each((i,el)=>cssReferences($(el).text(),base));
 }else if(file.endsWith('.css'))cssReferences(await fs.readFile(file,'utf8'),base);
}
let publicAssets=0,generatedAssets=0;
for(const url of references){
 if(url.startsWith('/_astro/')){try{await fs.access('dist'+url);generatedAssets++;}catch{errors.push({url,issue:'Generated asset missing'});}continue;}
 const source='public'+url;
 try{await fs.access(source);publicAssets++;if(!tracked.has(source))errors.push({url,issue:'Rendered public asset is excluded from the Git checkpoint'});}catch{errors.push({url,issue:'Public asset has no source file'});}
}
const report={checkedAt:new Date().toISOString(),scope:'All built HTML/CSS local asset references compared with current Git index; not a fresh install/build or remote CI test.',htmlFiles,uniqueLocalAssets:references.size,publicAssets,generatedAssets,errors};
await fs.writeFile('migration/pre-deployment/checkpoint-assets-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(errors.length)process.exitCode=1;
