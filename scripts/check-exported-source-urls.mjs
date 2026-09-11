import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {load} from 'cheerio';
const origin='https://cash4goldanddiamond.com';
const paths=['/sell-your-gold/','/sell-your-gemstone/','/sell-your-watches/','/best-gold-jewelry-buyers-los-angeles-2026/','/best-gold-buyers-los-angeles/','/loose-diamond-appraisal-downtown-los-angeles/'];
const folder='exports/source-followup/'+new Date().toISOString().replaceAll(':','-');
await fs.mkdir(folder,{recursive:true});
const snapshot=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
async function inspect(path){
 const row={path,chain:[]};let url=origin+path;const seen=new Set();
 try{
  for(let step=0;step<6;step++){
   if(new URL(url).origin!==origin)throw new Error('Unexpected cross-origin redirect');
   if(seen.has(url))throw new Error('Live source redirect cycle detected');seen.add(url);
   const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000),headers:{'User-Agent':'Mozilla/5.0 (compatible; Cash4Gold migration verification)'}});
   const location=response.headers.get('location');row.chain.push({url,status:response.status,location});
   if(response.status>=300&&response.status<400&&location){await response.body?.cancel();url=new URL(location,url).href;continue;}
   const html=await response.text();row.finalUrl=url;row.bytes=Buffer.byteLength(html);row.sha256=crypto.createHash('sha256').update(html).digest('hex');
   if(response.ok&&response.headers.get('content-type')?.includes('text/html')){
    row.rawSourceFile=folder+'/'+crypto.createHash('sha256').update(path).digest('hex').slice(0,16)+'.html';await fs.writeFile(row.rawSourceFile,html);
    const $=load(html);row.title=$('title').text().trim();row.description=$('meta[name=description]').attr('content')||'';row.canonical=$('link[rel=canonical]').attr('href')||'';
    const local=snapshot.find(p=>p.path===path);row.localContentPresent=Boolean(local);if(local)row.metadataMatches={title:row.title===local.title,description:row.description===local.description,canonical:row.canonical===local.canonical};
    row.status='PASS';
   }else row.status='BLOCKED';
   return row;
  }throw new Error('Redirect limit reached');
 }catch(error){row.status='BLOCKED';row.error=error.message;return row;}
}
const rows=[];for(let i=0;i<paths.length;i+=3)rows.push(...await Promise.all(paths.slice(i,i+3).map(inspect)));
const report={checkedAt:new Date().toISOString(),scope:'Read-only HTTP requests to six existing public source URLs. PASS means source retrieval only, not migration approval.',productionWrites:0,rows,recommendation:'NOT READY TO GO LIVE'};
await fs.writeFile('migration/pre-deployment/rank-math-source-url-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
