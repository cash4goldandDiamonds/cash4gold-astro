import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createClient} from '@sanity/client';
import {editorFilters,pageTemplates} from '../studio/structure.js';

const session=JSON.parse(await fs.readFile(process.env.SANITY_SESSION_FILE||'.cache/sanity-staging/session.json','utf8'));
assert.equal(session.projectId,'gisdw6qa');assert.equal(session.dataset,'migration-staging');
const client=createClient({...session,apiVersion:'2026-09-09',useCdn:false,perspective:'published'});
const report={startedAt:new Date().toISOString(),status:'BLOCKED',scope:'Read-only execution of actual Studio GROQ filters against private published content; no document creation or publishing',remoteWrites:0};
try{
 assert.ok((await client.datasets.list()).some(d=>d.name===session.dataset&&d.aclMode==='private'));
 const query='{'+Object.entries(editorFilters).map(([name,filter])=>JSON.stringify(name)+':*['+filter+']._id').join(',')+',"all":*[_type=="page"]._id,"services":count(*[_type=="service"]),"categories":count(*[_type=="category"]),"uploadedImages":count(*[_type=="sanity.imageAsset"])}';
 const result=await client.fetch(query);
 const grouped=[...result.pages,...result.articles,...result.archives];
 assert.equal(result.all.length,198);
 assert.equal(new Set(grouped).size,grouped.length,'Content categories overlap');
 assert.deepEqual([...grouped].sort(),[...result.all].sort(),'A published page is missing from the new categories');
 assert.equal(result.articles.length,111);
 assert.equal(result.services,5);assert.equal(result.categories,8);
 report.counts=Object.fromEntries(Object.entries(result).map(([key,value])=>[key,Array.isArray(value)?value.length:value]));
 report.newContentDefaults=pageTemplates.map(template=>({id:template.id,kind:template.value.kind,reviewState:template.value.reviewState,contentVerified:template.value.contentVerified,seoVerified:template.value.seoVerified}));
 assert.ok(pageTemplates.every(template=>template.value.reviewState==='draft'&&!template.value.contentVerified&&!template.value.seoVerified));
 report.notProven=['Role enforcement','Hosted draft preview','Actual creation using each new-document template','Complete media replacement and library workflow'];
 report.status='PASS';
}catch(error){report.failure={code:error.code||'NAVIGATION_VERIFICATION_FAILED',type:error.name,causeCode:error.cause?.code||null,httpStatus:error.statusCode||null,assertion:error.code==='ERR_ASSERTION'?error.message:undefined};process.exitCode=1;}
report.completedAt=new Date().toISOString();
await fs.writeFile('migration/pre-deployment/studio-navigation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
