import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash, randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
import {createClient} from '@sanity/client';

const session=JSON.parse(await fs.readFile('.cache/sanity-staging/session.json','utf8'));
assert.equal(session.projectId,'gisdw6qa');
assert.equal(session.dataset,'migration-staging');
const client=createClient({...session,apiVersion:'2026-09-09',useCdn:false,perspective:'raw'});
const report={startedAt:new Date().toISOString(),projectId:session.projectId,dataset:session.dataset,status:'BLOCKED',method:'Actual Sanity Actions API using an isolated synthetic FAQ; not an editor-role or Studio usability test',steps:[],productionWrites:0};
const id='acceptance-probe-'+randomUUID(), draftId='drafts.'+id;
report.probeId=id;
const backup=path.join('.cache','cms-backups','lifecycle-'+Date.now());
report.backupDirectory=backup;
const record=(name,evidence)=>report.steps.push({name,status:'PASS',checkedAt:new Date().toISOString(),...evidence});
const digest=docs=>createHash('sha256').update(JSON.stringify([...docs].sort((a,b)=>a._id.localeCompare(b._id)))).digest('hex');
const readProbe=async()=>client.getDocuments([draftId,id]);
let baseline=[];
try {
  const datasets=await client.datasets.list();
  assert.ok(datasets.some(d=>d.name===session.dataset&&d.aclMode==='private'));
  record('Private dataset verified',{});
  const anonymous=createClient({projectId:session.projectId,dataset:session.dataset,apiVersion:'2026-09-09',useCdn:false,perspective:'published'});
  assert.ok(!anonymous.config().token);
  // Sanity deliberately returns an empty result with HTTP 200 for private
  // queries. Assert absence of data, not an invented 401/403 contract.
  const anonymousResult=await anonymous.fetch('*[!(_id in path("_.**"))]._id');
  assert.deepEqual(anonymousResult,[]);
  record('Unauthenticated query exposes no documents',{returnedDocuments:0,reference:'https://www.sanity.io/docs/content-lake/datasets'});
  baseline=await client.fetch('*[!(_id in path("_.**"))]');
  assert.ok(baseline.length>=430,'Verified import must precede the lifecycle check');
  assert.ok(!baseline.some(d=>[id,draftId].includes(d._id)));
  await fs.mkdir(backup,{recursive:true});
  await fs.writeFile(path.join(backup,'before.ndjson'),baseline.map(d=>JSON.stringify(d)).join('\n')+'\n');
  record('Existing private documents backed up',{documents:baseline.length,sha256:digest(baseline)});
  await client.action({actionType:'sanity.action.document.create',publishedId:id,attributes:{_id:draftId,_type:'faq',question:'Acceptance test — private draft',answer:'Synthetic staging check. Not linked to any website page.'},ifExists:'fail'});
  let [draft,published]=await readProbe();
  assert.ok(draft); assert.equal(published,null);
  const publishedView=client.withConfig({perspective:'published'});
  const draftsView=client.withConfig({perspective:'drafts'});
  assert.equal(await publishedView.fetch('*[_id==$id][0].question',{id}),null);
  assert.equal(await draftsView.fetch('*[_id==$id][0].question',{id}),'Acceptance test — private draft');
  record('Draft created and isolated from published queries',{draftRevision:draft._rev});
  await client.action({actionType:'sanity.action.document.edit',publishedId:id,draftId,patch:{set:{answer:'Synthetic staging check, edited before publishing.'}}});
  [draft,published]=await readProbe();
  assert.equal(draft.answer,'Synthetic staging check, edited before publishing.');
  assert.equal(published,null);
  record('Draft edit persisted',{draftRevision:draft._rev});
  await client.action({actionType:'sanity.action.document.publish',publishedId:id,draftId,ifDraftRevisionId:draft._rev});
  [draft,published]=await readProbe();
  assert.equal(draft,null); assert.ok(published);
  assert.equal(await publishedView.fetch('*[_id==$id][0].answer',{id}),published.answer);
  const recovery={question:published.question,answer:published.answer};
  await fs.writeFile(path.join(backup,'probe-published.json'),JSON.stringify(published,null,2));
  record('Draft published through the Actions API',{publishedRevision:published._rev});
  await client.action({actionType:'sanity.action.document.edit',publishedId:id,draftId,patch:{set:{answer:'Synthetic second revision for recovery verification.'}}});
  [draft,published]=await readProbe();
  assert.equal(published.answer,recovery.answer);
  assert.notEqual(draft.answer,published.answer);
  record('New draft does not replace the published revision',{});
  await client.action({actionType:'sanity.action.document.publish',publishedId:id,draftId,ifDraftRevisionId:draft._rev,ifPublishedRevisionId:published._rev});
  [draft,published]=await readProbe();
  assert.equal(published.answer,'Synthetic second revision for recovery verification.');
  await client.action({actionType:'sanity.action.document.unpublish',publishedId:id,draftId});
  [draft,published]=await readProbe();
  assert.ok(draft); assert.equal(published,null);
  assert.equal(await publishedView.fetch('*[_id==$id][0].answer',{id}),null);
  record('Unpublish removed the published document and retained its draft',{draftRevision:draft._rev});
  // Only our new synthetic record is changed. Existing migrated documents are
  // never overwritten during this recovery demonstration.
  await client.patch(draftId).ifRevisionId(draft._rev).set(recovery).commit({visibility:'sync'});
  [draft,published]=await readProbe();
  assert.equal(draft.answer,recovery.answer); assert.equal(published,null);
  record('Saved probe content restored into an unpublished draft',{draftRevision:draft._rev});
  const after=await client.fetch('*[!(_id in path("_.**"))]');
  const existingAfter=after.filter(d=>![id,draftId].includes(d._id));
  assert.equal(digest(existingAfter),digest(baseline));
  await fs.writeFile(path.join(backup,'after.ndjson'),after.map(d=>JSON.stringify(d)).join('\n')+'\n');
  record('All existing migrated documents unchanged',{documents:existingAfter.length,sha256:digest(existingAfter)});
  report.status='PASS';
  report.retained='One clearly labeled, unlinked synthetic draft; no test document remains published';
} catch(error) {
  report.failure={code:error.code||'LIFECYCLE_FAILED',httpStatus:error.statusCode||null,assertion:error.code==='ERR_ASSERTION'?error.message:undefined};
  // No broad cleanup on failure. Preserve evidence and report the exact probe
  // identifier for a deliberate review of its state.
} finally {
  report.completedAt=new Date().toISOString();
  report.notProven=['Studio browser editing and image upload','Editor/contributor permission boundaries','Full dataset and asset restoration into another private dataset','Protected deployed draft preview','Webhook-triggered build and deployment'];
  await fs.mkdir('migration/pre-deployment',{recursive:true});
  await fs.writeFile('migration/pre-deployment/sanity-lifecycle.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({status:report.status,steps:report.steps.length,probeId:id,failure:report.failure}));
  if(report.status!=='PASS')process.exitCode=1;
}
