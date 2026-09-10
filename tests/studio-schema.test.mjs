import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {schemaTypes} from '../studio/schema.js';
import {renderCmsBody} from '../src/lib/cms-page.mjs';
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
