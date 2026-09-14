import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const base='migration/pre-deployment',pages=await read('src/data/pages.json'),redirects=await read('src/data/redirects.json'),posts=await read(base+'/wordpress-api/posts.json'),sourcePages=await read(base+'/wordpress-api/pages.json'),coverage=await read(base+'/wordpress-api/report.json');
const resolve=path=>{const seen=new Set();while(redirects[path]){if(seen.has(path))throw Error('Redirect loop');seen.add(path);path=redirects[path];}return path;};
const rows=[...posts.map(post=>({...post,sourceType:'post'})),...sourcePages.map(page=>({...page,sourceType:'page'}))].map(source=>{
 const path=new URL(source.link).pathname,target=resolve(path),page=pages.find(page=>page.path===target);
 return {sourceId:source.id,type:source.sourceType,status:source.status,oldUrl:source.link,sourceModifiedAt:source.modified_gmt,sourceSha256:crypto.createHash('sha256').update(JSON.stringify(source)).digest('hex'),destination:page?'https://cash4goldanddiamond.com'+target:null,routeAccountedFor:Boolean(page),redirect:target!==path?{from:path,to:target,status:301}:null,sourceArchive:base+'/wordpress-api/'+(source.sourceType==='post'?'posts':'pages')+'.json',metadataComparison:'BLOCKED: private Rank Math export unavailable',contentApproval:'BLOCKED: recorded original/proposed differences require human disposition'};
});
const report={checkedAt:new Date().toISOString(),sourcePosts:posts.length,sourcePages:sourcePages.length,missingRoutes:rows.filter(row=>!row.routeAccountedFor),coverage,rows,scope:'Published public REST records and local route mapping only. Does not prove private records, custom types, metadata parity or human approval.'};
await fs.writeFile(base+'/wordpress-reconciliation.json',JSON.stringify(report,null,2));console.log(JSON.stringify({posts:posts.length,pages:sourcePages.length,missingRoutes:report.missingRoutes}));if(report.missingRoutes.length)process.exitCode=1;
