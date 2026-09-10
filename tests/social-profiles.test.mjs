import test from 'node:test';
import assert from 'node:assert/strict';
import {capturedProfiles,normalizeSocialProfiles,schemaWithSocialProfiles} from '../src/lib/social-profiles.mjs';
test('preserved business profiles are safe, deduplicated links',()=>{
 const links=normalizeSocialProfiles();assert.equal(links.length,3);assert.deepEqual(links.map(p=>p.href),capturedProfiles.map(p=>p.href));
 assert.equal(normalizeSocialProfiles([...capturedProfiles,...capturedProfiles]).length,3);
 for(const invalid of ['javascript:alert(1)','https://instagram.com/','https://evil.example/cash4gold','https://facebook.com/login'])assert.throws(()=>normalizeSocialProfiles([invalid]));
});
test('social structured data belongs to the business, not an unrelated author',()=>{
 const author={'@type':'Person','@id':'author'},business={'@type':'JewelryStore','@id':'https://cash4goldanddiamond.com/#organization'};
 const result=JSON.parse(schemaWithSocialProfiles(JSON.stringify({'@graph':[author,business]}),capturedProfiles));
 assert.equal(result['@graph'][0].sameAs,undefined);assert.deepEqual(result['@graph'][1].sameAs,capturedProfiles.map(p=>p.href));
});
