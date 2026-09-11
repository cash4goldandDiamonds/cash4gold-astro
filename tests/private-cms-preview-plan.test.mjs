import test from 'node:test';
import assert from 'node:assert/strict';
import {privateCmsPreviewPlan} from '../src/lib/private-cms-preview-plan.mjs';
test('published and drafts previews have separate private output and cannot overwrite dist',()=>{
 for(const perspective of ['published','drafts']){
  const plan=privateCmsPreviewPlan({SANITY_PERSPECTIVE:perspective,ASTRO_OUT_DIR:'dist'});
  assert.equal(plan.output,'.cache/cms-preview/'+perspective);
  assert.equal(plan.environment.ASTRO_OUT_DIR,plan.output);
  assert.equal(plan.environment.SITE_ENV,'preview');
  assert.equal(plan.environment.ENABLE_PRODUCTION_INDEXING,'false');
  assert.equal(plan.environment.PUBLIC_ANALYTICS_ENABLED,'false');
 }
 assert.equal(privateCmsPreviewPlan().perspective,'published');
 for(const env of [{SITE_ENV:'production'},{ENABLE_PRODUCTION_INDEXING:'true'},{SANITY_PERSPECTIVE:'raw'}])assert.throws(()=>privateCmsPreviewPlan(env));
});
