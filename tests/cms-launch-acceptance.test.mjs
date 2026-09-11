import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {projectCmsPage} from '../src/lib/cms-page.mjs';

const question = 'What should I bring?';
const oldAnswer = 'Bring the item and existing records.';
const block = (style, text, key) => ({_type:'block', _key:key, style, markDefs:[], children:[{_type:'span', _key:key+'-text', marks:[], text}]});
const old = {
  path:'/test-service/', html:`<h2>Plan an evaluation</h2><p>Discuss the complete item.</p><h3>${question}</h3><p>${oldAnswer}</p>`,
  sections:[], meta:[],
  schema:[JSON.stringify({'@context':'https://schema.org','@graph':[
    {'@type':'Service',name:'Existing evaluation'},
    {'@type':'FAQPage',mainEntity:[{'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:oldAnswer}}]},
  ]})],
};
const doc = {
  path:old.path, title:'Evaluation', kind:'service', contentMode:'richText',
  seo:{title:'Evaluation in Los Angeles',description:'Prepare your items for a purchase evaluation.',canonical:'https://cash4goldanddiamond.com/test-service/',schemaType:'Service'},
  body:[block('h2','Plan an evaluation','intro'),block('normal','Discuss the complete item.','description'),block('h3',question,'question'),block('normal',oldAnswer,'answer')],
  faqs:[{question,answer:'Bring the complete item, spare parts and records you already have.'}],
};
const graph = page => JSON.parse(page.schema[0])['@graph'];

test('a real CMS projection retains the verified Los Angeles entity without invented hours', () => {
  const business = graph(projectCmsPage(doc,old)).find(node=>node['@type']==='JewelryStore');
  assert.deepEqual(business.areaServed,{'@type':'City',name:'Los Angeles'});
  assert.equal(business.address.streetAddress,'617 S. Hill Street');
  assert.equal(business.openingHours,undefined);
  assert.equal(business.openingHoursSpecification,undefined);
  assert.equal(business.priceRange,undefined);
});

test('editing a service FAQ updates visible content and schema together', () => {
  const page=projectCmsPage(doc,old), $=load(page.html);
  const schemas=graph(page).filter(node=>node['@type']==='FAQPage');
  assert.equal(schemas.length,1);
  assert.equal($('h3').next('p').text(),doc.faqs[0].answer);
  assert.equal(schemas[0].mainEntity[0].acceptedAnswer.text,doc.faqs[0].answer);
  assert.equal(schemas[0].mainEntity[0].name,$('h3').text());
  assert.ok(page.sourceText.includes(doc.faqs[0].answer));
  assert.equal(graph(old).find(node=>node['@type']==='FAQPage').mainEntity[0].acceptedAnswer.text,oldAnswer);
});

test('rich-text content does not inherit stale FAQ markup after FAQ references are removed', () => {
  const page=projectCmsPage({...doc,faqs:[]},old);
  assert.equal(graph(page).filter(node=>node['@type']==='FAQPage').length,0);
  assert.equal(load(page.html)('h3').next('p').text(),oldAnswer);
});

test('unresolved, duplicate or invisible FAQ references block a misleading CMS projection', () => {
  assert.throws(()=>projectCmsPage({...doc,faqs:[null]},old),/Incomplete or unresolved CMS FAQ/);
  assert.throws(()=>projectCmsPage({...doc,faqs:[doc.faqs[0],doc.faqs[0]]},old),/Duplicate CMS FAQ/);
  assert.throws(()=>projectCmsPage({...doc,faqs:[{question:'An absent question?',answer:'An answer.'}]},old),/match one visible question and answer/);
  assert.throws(()=>projectCmsPage({...doc,body:[...doc.body,block('h3',question,'duplicate'),block('normal',oldAnswer,'duplicate-answer')]},old),/match one visible question and answer/);
});

test('preserved layout mode keeps its matching repository FAQ content and schema until rich text is selected', () => {
  const page=projectCmsPage({...doc,contentMode:'imported'},old);
  assert.equal(load(page.html)('h3').next('p').text(),oldAnswer);
  assert.equal(graph(page).find(node=>node['@type']==='FAQPage').mainEntity[0].acceptedAnswer.text,oldAnswer);
});
