import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {assertReleaseReview,createReleaseCandidate,releaseFingerprint,renderingSourceFingerprint} from '../src/lib/cms-release-fingerprint.mjs';

const bundle={projectId:'gisdw6qa',dataset:'production',sourceFingerprint:'source-v1',pages:[{path:'/',html:'<h1>Sell gold</h1>',schema:['FAQ answer one']}],settings:{navigation:[{href:'/',label:'Home'}],business:{phone:'310-663-1340'}},redirects:[],features:{analyticsEnabled:'false'}};
const approve=b=>({...createReleaseCandidate(b),approved:true,reviewedBy:'Owner review record',reviewedAt:'2026-09-10T12:00:00Z'});
test('release candidates never approve themselves and missing or malformed approval fails closed',()=>{
 assert.equal(createReleaseCandidate(bundle).approved,false);
 for(const value of [undefined,'not json',createReleaseCandidate(bundle),{...approve(bundle),reviewedAt:'2099-01-01'},{...approve(bundle),reviewedBy:'pending'}])assert.throws(()=>assertReleaseReview(bundle,value));
 assert.equal(assertReleaseReview(bundle,JSON.stringify(approve(bundle))),true);
 assert.equal(releaseFingerprint({a:1,b:2}),releaseFingerprint({b:2,a:1}));
});
test('old approval cannot authorize changed projected copy, FAQ, preserved source, shared settings, redirects or tracking',()=>{
 const approval=approve(bundle);
 const edits=[{pages:[{...bundle.pages[0],html:'<h1>Changed offer</h1>'}]},{pages:[{...bundle.pages[0],schema:['Changed FAQ answer']}]},{sourceFingerprint:'changed-rendering-source'},{settings:{...bundle.settings,business:{phone:'different'}}},{settings:{...bundle.settings,navigation:[{href:'/new/',label:'New'}]}},{redirects:[{from:'/old/',to:'/',status:301}]},{features:{analyticsEnabled:'true'}},{dataset:'migration-staging'}];
 for(const edit of edits)assert.throws(()=>assertReleaseReview({...bundle,...edit},approval),/current human-approved fingerprint/);
});
test('rendering source fingerprint includes preserved content, media and build code while ignoring local build output',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'cash4gold-release-test-'));
 try{
  for(const dir of ['src','public','studio','scripts','workers'])fs.mkdirSync(path.join(root,dir));
  for(const file of ['package.json','pnpm-lock.yaml','astro.config.mjs','sanity.config.js','sanity.cli.js','wrangler.preview.jsonc'])fs.writeFileSync(path.join(root,file),'fixture');
  fs.writeFileSync(path.join(root,'src','pages.json'),'preserved');
  fs.writeFileSync(path.join(root,'public','image.webp'),'image');
  const files=['package.json','pnpm-lock.yaml','astro.config.mjs','sanity.config.js','sanity.cli.js','wrangler.preview.jsonc','src/pages.json','public/image.webp'];
  const fingerprint=()=>renderingSourceFingerprint(root,files);
  const before=fingerprint();
  fs.mkdirSync(path.join(root,'dist'));fs.writeFileSync(path.join(root,'dist','index.html'),'ignored build');
  assert.equal(fingerprint(),before);
  fs.writeFileSync(path.join(root,'src','pages.json'),'changed preserved content');assert.notEqual(fingerprint(),before);
  const content=fingerprint();fs.writeFileSync(path.join(root,'public','image.webp'),'changed image');assert.notEqual(fingerprint(),content);
 }finally{assert.equal(path.dirname(path.resolve(root)),path.resolve(os.tmpdir()));assert.ok(path.basename(root).startsWith('cash4gold-release-test-'));fs.rmSync(root,{recursive:true,force:true});}
});
