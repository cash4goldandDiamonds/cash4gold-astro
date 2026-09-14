import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {stagingStudioPlan} from '../scripts/build-staging-studio.mjs';

test('staging Studio is opt-in and is excluded from every production plan',()=>{
  assert.equal(stagingStudioPlan({}).enabled,false);
  assert.equal(stagingStudioPlan({SITE_ENV:'production',BUILD_STAGING_STUDIO:'true'}).enabled,false);
  const plan=stagingStudioPlan({SITE_ENV:'preview',BUILD_STAGING_STUDIO:'true'},process.cwd());
  assert.equal(plan.projectId,'gisdw6qa');
  assert.equal(plan.dataset,'migration-staging');
  assert.equal(plan.basePath,'/studio');
  assert.equal(plan.studioOutput,path.join(process.cwd(),'dist','studio'));
});

test('staging Studio refuses client-exposed credentials, indexing and external build paths',()=>{
  const env={SITE_ENV:'preview',BUILD_STAGING_STUDIO:'true'};
  assert.throws(()=>stagingStudioPlan({...env,SANITY_STUDIO_API_TOKEN:'synthetic-test-credential'}),/client-exposed/);
  assert.throws(()=>stagingStudioPlan({...env,ENABLE_PRODUCTION_INDEXING:'true'}),/non-indexable/);
  assert.throws(()=>stagingStudioPlan({...env,ASTRO_OUT_DIR:'../outside-project'}),/inside the project/);
  assert.throws(()=>stagingStudioPlan({...env,ASTRO_OUT_DIR:'.'}),/inside the project/);
});
