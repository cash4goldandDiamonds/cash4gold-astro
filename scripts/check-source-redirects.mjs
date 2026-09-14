import fs from 'node:fs/promises';
const records=JSON.parse(await fs.readFile('migration/source-evidence/crawl.json','utf8'));
const result=[];
for(const r of records.filter(r=>r.redirected||r.error)){const chain=[];let url=r.url;const seen=new Set();try{while(url&&chain.length<12){if(seen.has(url)){chain.push({url,error:'Redirect loop detected on source website'});break}seen.add(url);const res=await fetch(url,{redirect:'manual',headers:{'User-Agent':'Mozilla/5.0'},signal:AbortSignal.timeout(15000)});const location=res.headers.get('location');chain.push({url,status:res.status,location});await res.body?.cancel();url=location&&res.status>=300&&res.status<400?new URL(location,url).href:null;}}catch(e){chain.push({url,error:e.message,cause:e.cause?.message})}result.push({url:r.url,chain});}
await fs.writeFile('migration/source-redirect-chains.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result.filter(r=>r.chain.some(c=>c.error)),null,2));
