import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createClient} from '@sanity/client';
import {validatePageReview} from '../studio/review-validation.js';
const session=JSON.parse(await fs.readFile(process.env.SANITY_SESSION_FILE||'.cache/sanity-staging/session.json','utf8'));
assert.equal(session.projectId,'gisdw6qa');assert.equal(session.dataset,'migration-staging');
const client=createClient({...session,apiVersion:'2026-09-09',useCdn:false,perspective:'raw'});
const probe=JSON.parse(await fs.readFile('migration/pre-deployment/studio-body-probe.json','utf8'));
const id=probe.probeId||probe.id;
assert.ok(id.startsWith('acceptance-editor-'));
const report={startedAt:new Date().toISOString(),status:'BLOCKED',method:'Read-only API readback after actual Studio draft edit while Publish is blocked',projectId:session.projectId,dataset:session.dataset,probeId:id,remoteWritesByThisScript:0};
try{
  assert.ok((await client.datasets.list()).some(d=>d.name===session.dataset&&d.aclMode==='private'));
  const result=await client.fetch('{"draft":*[_id==$draft][0],"published":*[_id==$id][0]}',{id,draft:'drafts.'+id});
  assert.ok(result.draft);
  assert.equal(result.draft.excerpt,'Synthetic unpublished review-gate check. No customer data.');
  assert.equal(result.draft.reviewState,'draft');
  assert.equal(result.draft.contentVerified,false);assert.equal(result.draft.seoVerified,false);
  assert.equal(result.published,null);
  assert.notEqual(validatePageReview(result.draft),true);
  report.checks={draftSaved:true,unreviewedStateRetained:true,publishedVersionExists:false,validationBlocksPublication:true};
  report.notProven=['Reviewer role authorization or separation of duties','Server-side API validation (Sanity schema rules run in Studio)','Approval freshness after later edits','Hosted pipeline and production publication'];
  report.status='PASS';
}catch(error){report.failure={code:error.code||'REVIEW_GUARD_FAILED',type:error.name,httpStatus:error.statusCode||null,assertion:error.code==='ERR_ASSERTION'?error.message:undefined};process.exitCode=1;}
report.completedAt=new Date().toISOString();
await fs.writeFile('migration/pre-deployment/studio-review-guard.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
