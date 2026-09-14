import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {schemaTypes} from '../studio/schema.js';
import {renderCmsBody} from '../src/lib/cms-page.mjs';
import {validatePageReview} from '../studio/review-validation.js';
const require=createRequire(import.meta.resolve('sanity'));
const {validateSchema,groupProblems}=await import(pathToFileURL(require.resolve('@sanity/schema/_internal')).href);

test('Studio accepts every schema declaration, beyond compilation alone',()=>{
  const errors=groupProblems(validateSchema(schemaTypes).getTypes()).flatMap(group=>group.problems.filter(problem=>problem.severity==='error'));
  assert.deepEqual(errors,[]);
});

test('Imported rich-text section anchors and presentation survive the schema correction',()=>{
  const body=[{_type:'block',_key:'preserved-section',sourceId:'diamond-value',className:'valuation-section',style:'h2',markDefs:[],children:[{_type:'span',_key:'text',marks:[],text:'Diamond valuation factors'}]}];
  const before=JSON.stringify(body);
  assert.equal(renderCmsBody(body),'<h2 id="diamond-value" class="valuation-section">Diamond valuation factors</h2>');
  assert.equal(JSON.stringify(body),before);
});

test('Studio blocks unreviewed publication even when review fields are prefilled',()=>{
  const complete={reviewState:'approved',contentVerified:true,seoVerified:true,reviewedBy:{_ref:'author-reviewed'},reviewedAt:'2026-01-01T12:00:00Z'};
  for(const reviewState of [undefined,'draft','inReview'])assert.notEqual(validatePageReview({...complete,reviewState}),true);
  assert.notEqual(validatePageReview(undefined),true);
});

test('Studio requires meaningful review evidence and does not mutate content',()=>{
  const complete={reviewState:'approved',contentVerified:true,seoVerified:true,reviewedBy:{_ref:'author-reviewed'},reviewedAt:'2026-01-01T12:00:00Z'};
  for(const missing of ['contentVerified','seoVerified','reviewedBy','reviewedAt'])assert.notEqual(validatePageReview({...complete,[missing]:undefined}),true);
  for(const invalid of [{contentVerified:'true'},{seoVerified:'true'},{reviewedBy:{_ref:' '}},{reviewedBy:{_ref:'drafts.author-reviewed'}},{reviewedAt:'not-a-date'},{reviewedAt:'2999-01-01T12:00:00Z'}])assert.notEqual(validatePageReview({...complete,...invalid}),true);
  const before=JSON.stringify(complete);
  assert.equal(validatePageReview(complete),true);
  assert.equal(JSON.stringify(complete),before);
});
