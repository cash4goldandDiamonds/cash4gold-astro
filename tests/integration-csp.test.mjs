import test from 'node:test';
import assert from 'node:assert/strict';
import {hostHeaders,releasePolicy} from '../src/lib/release-policy.mjs';

function csp(headers){
 const line=headers.split('\n').find(value=>value.trim().startsWith('Content-Security-Policy:'));
 assert.ok(line,'A content security policy must be emitted');
 return Object.fromEntries(line.trim().slice('Content-Security-Policy:'.length).trim().split(';').filter(value=>value.trim()).map(value=>{const [directive,...sources]=value.trim().split(/\s+/);return [directive,sources];}));
}

test('optional analytics hosts stay blocked unless the feature is the literal boolean true',()=>{
 for(const features of [{},{analytics:false},{analytics:'true'},{analytics:1},{analytics:null}]){
  const headers=hostHeaders(releasePolicy(),features),rules=csp(headers);
  assert.doesNotMatch(headers,/googletagmanager\.com|google-analytics\.com|analytics\.google\.com/);
  for(const directive of ['script-src','connect-src'])assert.ok(rules[directive].includes('https://challenges.cloudflare.com'));
  assert.deepEqual(rules['frame-src'],['https://challenges.cloudflare.com']);
 }
});

test('the Cloudflare Web Analytics beacon stays blocked unless its feature is the literal boolean true',()=>{
 for(const features of [{},{cloudflareBeacon:false},{cloudflareBeacon:'true'},{cloudflareBeacon:1},{cloudflareBeacon:null}]){
  const headers=hostHeaders(releasePolicy(),features);
  assert.doesNotMatch(headers,/cloudflareinsights\.com/);
 }
});

test('enabling the Cloudflare beacon adds only its own narrow script-src/connect-src hosts',()=>{
 const off=csp(hostHeaders(releasePolicy(),{})),on=csp(hostHeaders(releasePolicy(),{cloudflareBeacon:true}));
 assert.ok(on['script-src'].includes('https://static.cloudflareinsights.com'));
 assert.ok(on['connect-src'].includes('https://cloudflareinsights.com'));
 assert.ok(!off['script-src'].includes('https://static.cloudflareinsights.com'));
 assert.ok(!off['connect-src'].includes('https://cloudflareinsights.com'));
 for(const directive of Object.keys(on))if(!['script-src','connect-src'].includes(directive))assert.deepEqual(on[directive],off[directive],directive);
 for(const unsafe of ["'unsafe-inline'","'unsafe-eval'",'data:','*'])assert.ok(!on['script-src'].includes(unsafe),unsafe);
});

test('analytics consent support does not loosen form submission or executable-content safeguards',()=>{
 const rules=csp(hostHeaders(releasePolicy(),{analytics:true}));
 assert.ok(rules['script-src'].includes('https://www.googletagmanager.com'));
 for(const host of ['https://www.google-analytics.com','https://region1.google-analytics.com']){
  assert.ok(rules['connect-src'].includes(host));assert.ok(rules['img-src'].includes(host));
 }
 assert.ok(rules['connect-src'].includes('https://analytics.google.com'));
 assert.deepEqual(rules['form-action'],["'self'"]);
 assert.deepEqual(rules['object-src'],["'none'"]);
 assert.deepEqual(rules['base-uri'],["'self'"]);
 assert.deepEqual(rules['frame-ancestors'],["'self'"]);
 assert.deepEqual(rules['frame-src'],['https://challenges.cloudflare.com']);
 for(const unsafe of ["'unsafe-inline'","'unsafe-eval'",'data:','*'])assert.ok(!rules['script-src'].includes(unsafe),unsafe);
});

test('integration flags preserve private staging and the production-only indexing gate',()=>{
 for(const analytics of [false,true]){
  const preview=hostHeaders(releasePolicy(),{analytics});
  const previewGlobal=preview.split('/404.html')[0];
  assert.match(previewGlobal,/X-Robots-Tag: noindex, nofollow, noarchive/);
  assert.match(previewGlobal,/Cache-Control: private, no-store/);
  assert.doesNotMatch(preview,/max-age=31536000|immutable/);
  const production=hostHeaders(releasePolicy({SITE_ENV:'production',ENABLE_PRODUCTION_INDEXING:'true'}),{analytics});
  assert.doesNotMatch(production.split('/404.html')[0],/X-Robots-Tag:/);
  assert.match(production,/Cache-Control: public, max-age=0, must-revalidate/);
  assert.match(production,/\/_astro\/\*\n  Cache-Control: public, max-age=31536000, immutable/);
  assert.match(production,/\/404\.html\n  X-Robots-Tag: noindex, nofollow/);
 }
});
