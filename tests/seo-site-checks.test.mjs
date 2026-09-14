import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectSeoPeers} from '../src/lib/seo-site-checks.mjs';
test('editor checks compare real peer metadata and references without counting itself twice',()=>{
 const a={_id:'drafts.a',path:'/a/',seo:{title:'Title A',description:'Description A',canonical:'https://cash4goldanddiamond.com/a/',focusKeyword:'Selling gold'},body:[{markDefs:[{_type:'internalLink',target:{_ref:'b'}},{_type:'link',href:'/missing/'}]}]};
 const b={_id:'b',path:'/b/',title:'B',seo:{title:'Title A',description:'Different',focusKeyword:'Selling gold'},related:[{_ref:'a'}]};
 const result=inspectSeoPeers(a,[{...a,_id:'a'},b]);
 assert.equal(result.duplicateTitles.length,1);assert.equal(result.duplicateDescriptions.length,0);assert.equal(result.overlappingTopics.length,1);assert.equal(result.inbound[0].path,'/b/');assert.equal(result.brokenReferences[0].path,'/missing/');assert.equal(result.canonicalWarning,'');
 assert.match(inspectSeoPeers({...a,seo:{canonical:'https://staging.example/a/'}},[b]).canonicalWarning,/production origin/);
 assert.match(inspectSeoPeers({...a,seo:{canonical:'https://cash4goldanddiamond.com/b/'}},[b]).canonicalWarning,/another page/);
});
