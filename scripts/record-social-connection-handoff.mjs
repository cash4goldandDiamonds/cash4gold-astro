import fs from 'node:fs/promises';
const root='migration/pre-deployment/';
const observations=JSON.parse(await fs.readFile(root+'account-observations.json','utf8'));
observations.meta.businessPortfolio.verification='Reloaded Business Suite Apps view: Cash4Gold Social Publishing, ID 1771403890678469, Owned by: navid lalezari; Navid Lalezari (You) Full access.';
observations.meta.facebookPage.evidence='Business Suite Pages detail: Cash4goldanddiamonds, ID 107008765832415, Owned by: navid lalezari; Navid Lalezari (You) Full access. Earlier home view verified the Instagram pairing.';
await fs.writeFile(root+'account-observations.json',JSON.stringify(observations,null,2));
function decode(buffer){return buffer[0]===0xff&&buffer[1]===0xfe?buffer.toString('utf16le'):buffer.toString('utf8');}
const unit=decode(await fs.readFile(root+'unit-tests.log')),social=decode(await fs.readFile(root+'social-queue-tests.log'));
if(!/pass\s+29\b/.test(unit)||!/fail\s+0\b/.test(unit)||!/pass\s+13\b/.test(social)||!/fail\s+0\b/.test(social))throw Error('Expected successful test evidence is missing');
await fs.writeFile(root+'social-queue-verification.json',JSON.stringify({recordedAt:new Date().toISOString(),tests:[{command:'node --test tests/social-publishing.test.mjs',passed:13,failed:0,log:root+'social-queue-tests.log'},{command:'node --test tests/*.test.mjs',passed:29,failed:0,log:root+'unit-tests.log'}],initialFailure:{log:root+'social-queue-tests-initial.log',cause:'Timestamp precision caused lexical queue ordering to retain the first batch.',fix:'Normalize synchronized timestamps to ISO milliseconds and preserve the deferral order when payloads do not change.'},verifiedLocally:['Unavailable articles rotate behind unchecked jobs','Individual article timeouts do not stop other candidates','Missing/expired token metadata prevents requests and preserves daily slots','Seven-day renewal warning contains no tokens','Authenticated status errors are sanitized and no-store'],notTested:['Cloudflare D1 runtime','Meta issued tokens and granted scopes','Real publishing','Token refresh and delivered operator alerts'],references:[{url:'https://developers.cloudflare.com/d1/worker-api/prepared-statements/',purpose:'D1 prepared statement interface'},{url:'https://developers.cloudflare.com/workers/best-practices/workers-best-practices/',purpose:'Secret handling, request boundaries and scheduled handler'},{file:'.cache/workers-types-latest/package/index.d.ts',version:'5.20260910.1',purpose:'Current official D1 and scheduled-handler signatures retrieved for review'}]},null,2));
const generator='scripts/write-audit-handoff.mjs';
let text=await fs.readFile(generator,'utf8');
const old='1. Complete any Meta identity/password confirmation directly in Meta, then allow the verified business app to access the intended Instagram/Facebook assets. Never send passwords/tokens in chat.';
const replacement='1. The Facebook and Instagram password steps and Instagram tester acceptance are complete. Respond to the separate request for a login-protected Cloudflare test deployment if you want hosted integration tests to proceed; your earlier no-deployment restriction still applies until answered. Scoped tokens, renewal and API acceptance remain implementation work; do not send passwords/tokens in chat.';
if(text.includes(old))text=text.replace(old,replacement);
else if(!text.includes(replacement))throw Error('Audit owner-action text changed; review before updating');
await fs.writeFile(generator,text);
console.log('Recorded current Meta connection evidence and 29 passing unit tests.');
