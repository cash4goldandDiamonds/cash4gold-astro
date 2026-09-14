import test from 'node:test';
import assert from 'node:assert/strict';
import {assertContentEnvironment} from '../src/lib/cms-release-gates.mjs';
import {assertStaticReleaseSource} from '../src/lib/static-release-source.mjs';
const commit='a'.repeat(40);
const environment=()=>({CONTENT_SOURCE:'reviewed-static',SITE_ENV:'production',ENABLE_PRODUCTION_INDEXING:'true',STATIC_RELEASE_COMMIT:commit});
const cleanGit=args=>args[0]==='rev-parse'?commit:args[0]==='ls-files'&&args.includes('--error-unmatch')?'src/data/pages.json\nsrc/data/redirects.json\nwrangler.production.jsonc':'';

test('reviewed static rejects CMS, audit and Studio mixing',()=>{
  assert.equal(assertContentEnvironment(environment()).reviewedStatic,true);
  for(const change of [
    {CONTENT_SOURCE:'typo'},{SITE_ENV:'preview'},{ENABLE_PRODUCTION_INDEXING:'false'},
    {STATIC_RELEASE_COMMIT:''},{STATIC_RELEASE_COMMIT:'main'},
    {ISOLATED_PRODUCTION_AUDIT:'true'},{ASTRO_OUT_DIR:'.cache/production-audit'},{ASTRO_OUT_DIR:'dist'},
    {BUILD_STAGING_STUDIO:'true'},{SANITY_PROJECT_ID:'gisdw6qa'},{SANITY_DATASET:'production'},
    {SANITY_READ_TOKEN:'synthetic'},{SANITY_AUTH_TOKEN:'synthetic'},{SANITY_WRITE_TOKEN:'synthetic'},
    {SANITY_PERSPECTIVE:'drafts'},{CMS_RELEASE_REVIEW:'synthetic'},
  ]) assert.throws(()=>assertContentEnvironment({...environment(),...change}));
});
test('default CMS gate remains without an implicit static fallback',()=>{
  assert.throws(()=>assertContentEnvironment({SITE_ENV:'production'}));
  assert.throws(()=>assertContentEnvironment({SITE_ENV:'production',CONTENT_SOURCE:'cms',SANITY_PROJECT_ID:'gisdw6qa',SANITY_DATASET:'migration-staging'}));
  assert.doesNotThrow(()=>assertContentEnvironment({SITE_ENV:'production',CONTENT_SOURCE:'cms',SANITY_PROJECT_ID:'gisdw6qa',SANITY_DATASET:'production'}));
  assert.equal(assertStaticReleaseSource({CONTENT_SOURCE:'cms'},{git:()=>{throw Error('must not inspect static source');}}),null);
});
test('reviewed static binds exact commit and refuses modified or unreviewed rendering files',()=>{
  assert.deepEqual(assertStaticReleaseSource(environment(),{git:cleanGit}),{contentSource:'reviewed-static',sourceCommit:commit});
  assert.throws(()=>assertStaticReleaseSource(environment(),{git:args=>args[0]==='rev-parse'?'b'.repeat(40):cleanGit(args)}),/differs/);
  for(const dirty of [' M src/data/pages.json','?? public/unreviewed.html']) assert.throws(()=>assertStaticReleaseSource(environment(),{git:args=>args[0]==='status'?dirty:cleanGit(args)}),/clean tracked/);
  assert.throws(()=>assertStaticReleaseSource(environment(),{git:args=>args[0]==='ls-files'&&args.includes('--ignored')?'public/ignored-secret.env':cleanGit(args)}),/ignored untracked/);
  assert.throws(()=>assertStaticReleaseSource(environment(),{git:args=>{if(args[0]==='ls-files'&&args.includes('--error-unmatch'))throw Error('untracked content');return cleanGit(args);}}),/untracked content/);
});
