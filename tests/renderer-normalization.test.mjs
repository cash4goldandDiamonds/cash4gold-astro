import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {createLegacyAnchorNormalizer} from '../src/lib/legacy-anchor-links.mjs';
import {schemaWithSocialProfiles} from '../src/lib/social-profiles.mjs';

const rules=Object.freeze([
 Object.freeze({from:'/old/',to:'/middle/',status:301}),
 Object.freeze({from:'/middle/',to:'/final/',status:301}),
 Object.freeze({from:'/faq/',to:'/faqs/',status:301})
]);
const normalize=createLegacyAnchorNormalizer(rules,'/articles/example/');
test('known aliases flatten directly; original query/fragment values and all other markup survive',()=>{
 const before='<P data-url="/old/" data-note="A &amp; B"><A HREF = "/old/?a=1&amp;b=x%2Fy+z#part%201" target="_blank" rel="noopener"><b>Original &amp; anchor</b></A><!-- /old/ --><img src="/old/"><script>const s="/old/";</script></P>';
 const expected=before.replace('HREF = "/old/?','HREF = "/final/?');
 assert.equal(normalize(before),expected);
 assert.equal(load(normalize(before))('a').attr('href'),'/final/?a=1&b=x%2Fy+z#part%201');
 assert.deepEqual(rules,[{from:'/old/',to:'/middle/',status:301},{from:'/middle/',to:'/final/',status:301},{from:'/faq/',to:'/faqs/',status:301}]);
});
test('relative, absolute apex/www, HTTP, and protocol-relative known aliases resolve to final paths',()=>{
 const before='<a href="../../old">relative</a><a href="http://www.cash4goldanddiamond.com/old/?q=1#x">www</a><a href="https://cash4goldanddiamond.com/old/">apex</a><a href="//cash4goldanddiamond.com/faq/">protocol relative</a>';
 const $=load(normalize(before));
 assert.deepEqual($('a').map((_,a)=>$(a).attr('href')).get(),['/final/','https://cash4goldanddiamond.com/final/?q=1#x','https://cash4goldanddiamond.com/final/','https://cash4goldanddiamond.com/faqs/']);
});
test('unmatched HTML is returned byte-for-byte, including external/unknown/query/fragment URLs',()=>{
 const before=`<!doctype html><p CLASS='Keep'>Unchanged &copy;</p><a href="https://external.example/old/">external</a><a href="https://cash4goldanddiamond.com.evil.example/old/">lookalike</a><a href="https://user:pass@cash4goldanddiamond.com/old/">credentials</a><a href="https://cash4goldanddiamond.com:8443/old/">port</a><a href="/unknown/">unknown</a><a href="/final/">current</a><a href="#old">fragment</a><a href="?next=/old/">query</a><a href="mailto:test@example.com">mail</a><a href="tel:+13106631340">phone</a><script>const x='<a href="/old/">';</script><!-- <a href="/old/"> -->`;
 assert.equal(normalize(before),before);
 assert.equal(createLegacyAnchorNormalizer([])(before),before);
});
test('changed href escaping is safe without serializing neighboring attributes or text',()=>{
 const before=`<a data-x='a &amp; b' href='/old/?q=a&quot;b&amp;k=one#x'>Quote</a><a href=/faq/ class=test>FAQ</a>`;
 const after=normalize(before),$=load(after);
 assert.equal(after,`<a data-x='a &amp; b' href='/final/?q=a%22b&amp;k=one#x'>Quote</a><a href=/faqs/ class=test>FAQ</a>`);
 assert.equal($('a').first().attr('href'),'/final/?q=a%22b&k=one#x');
 assert.equal(normalize(after),after);
});
test('cycles fail closed rather than emit another alias',()=>{
 assert.throws(()=>createLegacyAnchorNormalizer([{from:'/old/',to:'/middle/'},{from:'/middle/',to:'/old/'}]),/Redirect loop/);
});
test('temporary redirects and permanent chains encountering a temporary hop remain untouched',()=>{
 const render=createLegacyAnchorNormalizer([
  {from:'/temporary/',to:'/destination/',status:302},
  {from:'/permanent/',to:'/temporary/',status:301},
  {from:'/safe/',to:'/final/',status:301}
 ]);
 const before='<a href="/temporary/?keep=1#x">temporary</a><a href="/permanent/">through temporary</a><a href="/safe/">safe</a>';
 assert.equal(render(before),before.replace('href="/safe/"','href="/final/"'));
});
test('only exact owned display fields normalize; schema IDs, URLs, text and different legal names survive',()=>{
 const encoded='Cash 4 Gold &amp; Diamonds',correct='Cash 4 Gold & Diamonds';
 const graph=[
  {'@id':'https://cash4goldanddiamond.com/#organization',name:correct,legalName:encoded,url:'https://cash4goldanddiamond.com/?a=1&b=2',description:'Keep <script> &amp; text',logo:{caption:encoded}},
  {'@id':'https://cash4goldanddiamond.com/#website',name:encoded,alternateName:encoded},
  {'@id':'https://other.example/#organization',name:encoded,legalName:encoded},
  {'@id':'https://cash4goldanddiamond.com/#organization',legalName:'Different registered legal name'}
 ];
 const raw=JSON.stringify({'@context':'https://schema.org','@graph':graph}),profiles=[{href:'https://www.instagram.com/cash4goldanddiamond/'}];
 const expected=structuredClone(graph);
 expected[0].legalName=correct;expected[0].sameAs=profiles.map(p=>p.href);expected[1].name=correct;expected[3].sameAs=profiles.map(p=>p.href);
 const output=schemaWithSocialProfiles(raw,profiles);
 assert.deepEqual(JSON.parse(output)['@graph'],expected);
 assert.equal(output.includes('<'),false);assert.ok(output.includes('\\u003cscript>'));
 assert.equal(JSON.stringify({'@context':'https://schema.org','@graph':graph}),raw);
 const single={'@id':'https://cash4goldanddiamond.com/#website',name:encoded};
 assert.deepEqual(JSON.parse(schemaWithSocialProfiles(JSON.stringify(single),profiles)),{...single,name:correct});
});
