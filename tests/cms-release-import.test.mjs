import test from 'node:test';
import assert from 'node:assert/strict';
import {assertContentEnvironment, assertCmsPages} from '../src/lib/cms-release-gates.mjs';
import {documentFingerprint, planImport, retryTransient} from '../src/lib/migration-import.mjs';

test('production requires the published production CMS; snapshot exception is isolated', () => {
  assert.throws(() => assertContentEnvironment({SITE_ENV: 'production'}));
  assert.throws(() => assertContentEnvironment({SITE_ENV: 'production', SANITY_PROJECT_ID: 'project', SANITY_DATASET: 'migration-staging'}));
  assert.throws(() => assertContentEnvironment({SITE_ENV: 'production', ISOLATED_PRODUCTION_AUDIT: 'true', ASTRO_OUT_DIR: 'dist'}));
  assert.equal(assertContentEnvironment({SITE_ENV: 'production', ISOLATED_PRODUCTION_AUDIT: 'true', ASTRO_OUT_DIR: '.cache/production-audit'}).isolatedSnapshotAudit, true);
  assert.doesNotThrow(() => assertContentEnvironment({SITE_ENV: 'production', SANITY_PROJECT_ID: 'project', SANITY_DATASET: 'production'}));
});
test('duplicate, missing, incomplete and unreviewed CMS pages block releases', () => {
  const page = {_id: 'page-home', path: '/', title: 'Home', seo: {title: 'Home', description: 'Business information'}};
  assert.throws(() => assertCmsPages([page, page], ['/']));
  assert.throws(() => assertCmsPages([page], ['/', '/contact/']));
  assert.throws(() => assertCmsPages([page], ['/'], {production: true}));
  assert.doesNotThrow(() => assertCmsPages([{...page, reviewState: 'approved', contentVerified: true, seoVerified: true, reviewedBy: {_ref: 'reviewer'}, reviewerDocument:{_id:'reviewer',name:'Website reviewer'}, reviewedAt: '2026-09-10'}], ['/'], {production: true}));
});
test('production applies the same reviewer and actual-date rules as Studio', () => {
  const page = {_id:'page-home',path:'/',title:'Home',seo:{title:'Home',description:'Business information'},reviewState:'approved',contentVerified:true,seoVerified:true,reviewedBy:{_ref:'reviewer'},reviewerDocument:{_id:'reviewer',name:'Website reviewer'},reviewedAt:'2026-09-10T00:00:00Z'};
  for(const edit of [
    {reviewedAt:'not-a-date'},
    {reviewedAt:'2099-01-01T00:00:00Z'},
    {reviewedBy:{_ref:'drafts.reviewer'}},
    {reviewedBy:{_ref:'   '}},
    {contentVerified:'true'},
    {seoVerified:1},
  ]) assert.throws(()=>assertCmsPages([{...page,...edit}],['/'],{production:true}),/valid recorded content\/SEO review approval/);
  assert.doesNotThrow(()=>assertCmsPages([page],['/'],{production:true}));
  for(const reviewerDocument of [null,{_id:'another-reviewer',name:'Website reviewer'},{_id:'reviewer',name:''}]) assert.throws(()=>assertCmsPages([{...page,reviewerDocument}],['/'],{production:true}),/reviewer must resolve/);
});
test('import is deterministic, resumable and never overwrites a conflicting document', () => {
  const a = {_id: 'page-a', _type: 'page', title: 'A', related: {_type: 'reference', _ref: 'page-b'}};
  const b = {_id: 'page-b', _type: 'page', title: 'B'};
  assert.equal(planImport([a,b]).create.length, 2);
  assert.equal(planImport([a,b], [{...b, _rev: 'new-system-rev'}]).create.length, 1);
  assert.equal(planImport([a,b], [a,b]).unchanged.length, 2);
  assert.equal(documentFingerprint(b), documentFingerprint({...b, _updatedAt: 'different'}));
  const conflict = planImport([a,b], [{...a, title: 'Owner edit'},b]);
  assert.equal(conflict.safeToExecute, false);
  assert.equal(conflict.conflicts.length, 1);
  assert.throws(() => planImport([a]));
  assert.throws(() => planImport([b,b]));
});
test('only transient provider failures receive bounded retries', async () => {
  let calls = 0;
  assert.equal(await retryTransient(async () => {if (++calls < 3) throw {statusCode: 503}; return 'ok';}, {pause: async () => {}}), 'ok');
  assert.equal(calls, 3);
  calls = 0;
  await assert.rejects(retryTransient(async () => {calls++; throw {statusCode: 401};}, {pause: async () => {}}));
  assert.equal(calls, 1);
});
