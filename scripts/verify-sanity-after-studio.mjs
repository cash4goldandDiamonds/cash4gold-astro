import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {createClient} from '@sanity/client';
import {planImport} from '../src/lib/migration-import.mjs';

// Read-only reconciliation after the real Studio save/publish/unpublish tests.
const session=JSON.parse(await fs.readFile(process.env.SANITY_SESSION_FILE||'.cache/sanity-staging/session.json','utf8'));
assert.equal(session.projectId,'gisdw6qa'); assert.equal(session.dataset,'migration-staging');
const lifecycle=JSON.parse(await fs.readFile('migration/pre-deployment/sanity-lifecycle.json','utf8'));
const editor=JSON.parse(await fs.readFile('migration/pre-deployment/studio-body-probe.json','utf8'));
const baseline=(await fs.readFile(lifecycle.backupDirectory+'/before.ndjson','utf8')).trim().split(/\r?\n/).map(line=>JSON.parse(line));
const digest=docs=>createHash('sha256').update(JSON.stringify([...docs].sort((a,b)=>a._id.localeCompare(b._id)))).digest('hex');
const report={startedAt:new Date().toISOString(),status:'BLOCKED',method:'Read-only authenticated reconciliation against the saved pre-lifecycle server documents',projectId:session.projectId,dataset:session.dataset,productionWrites:0};
try{
  const client=createClient({...session,apiVersion:'2026-09-09',useCdn:false,perspective:'raw'});
  const datasets=await client.datasets.list();
  assert.ok(datasets.some(dataset=>dataset.name===session.dataset&&dataset.aclMode==='private'));
  const after=await client.fetch('*[!(_id in path("_.**"))]');
  const ids=new Set(baseline.map(doc=>doc._id));
  const originalAfter=after.filter(doc=>ids.has(doc._id));
  assert.equal(baseline.length,430);
  report.originalDocuments=originalAfter.length;
  report.beforeSha256=digest(baseline); report.afterSha256=digest(originalAfter);
  assert.equal(report.afterSha256,report.beforeSha256,'An imported document changed during acceptance');
  const source=(await fs.readFile('migration/sanity-import.ndjson','utf8')).trim().split(/\r?\n/).map(line=>JSON.parse(line));
  const repeat=planImport(source,after);
  report.repeatImportDryRun={create:repeat.create.length,unchanged:repeat.unchanged.length,conflicts:repeat.conflicts.length,safeToExecute:repeat.safeToExecute,remoteWrites:0};
  assert.equal(repeat.create.length,0);assert.equal(repeat.unchanged.length,430);assert.equal(repeat.conflicts.length,0);
  const expectedDrafts=new Set(['drafts.'+lifecycle.probeId,'drafts.'+(editor.probeId||editor.id)]);
  const extras=after.filter(doc=>!ids.has(doc._id));
  report.rawDocuments=after.length;
  report.additionalDocuments=extras.map(doc=>({_id:doc._id,_type:doc._type,published:!doc._id.startsWith('drafts.')}));
  assert.equal(extras.length,2);
  assert.ok(extras.every(doc=>expectedDrafts.has(doc._id)),'Unexpected additional document');
  const anonymous=createClient({projectId:session.projectId,dataset:session.dataset,apiVersion:'2026-09-09',useCdn:false,perspective:'published'});
  report.anonymousDocuments=(await anonymous.fetch('*[!(_id in path("_.**"))]._id')).length;
  assert.equal(report.anonymousDocuments,0);
  report.status='PASS';
}catch(error){report.failure={code:error.code||'RECONCILIATION_FAILED',httpStatus:error.statusCode||null,assertion:error.code==='ERR_ASSERTION'?error.message:undefined};process.exitCode=1;}
report.completedAt=new Date().toISOString();
await fs.writeFile('migration/pre-deployment/sanity-after-studio.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
