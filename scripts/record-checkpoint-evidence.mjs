import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const base='migration/pre-deployment/',files=(await fs.readdir(base)).filter(file=>file.endsWith('.log')),findings=[],logs=[];
const patterns=[/\bgh[pousr]_[A-Za-z0-9]{36,}\b/,/\bgithub_pat_[A-Za-z0-9_]{60,}\b/,/\bEAA[A-Za-z0-9]{80,}\b/,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/(?:SANITY_(?:READ|WRITE)_TOKEN|INSTAGRAM_ACCESS_TOKEN|FACEBOOK_PAGE_TOKEN|CLOUDFLARE_API_TOKEN)\s*[=:]\s*["']?[a-zA-Z0-9_-]{30,}/];
for(const file of files){const data=await fs.readFile(base+file),text=data[0]===0xff&&data[1]===0xfe?data.toString('utf16le'):data.toString('utf8');if(patterns.some(pattern=>pattern.test(text)))findings.push({file:base+file,issue:'Credential-shaped text; inspect privately before checkpointing'});logs.push({file:base+file,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')});}
await fs.writeFile(base+'evidence-log-check.json',JSON.stringify({checkedAt:new Date().toISOString(),scope:'Known local audit command logs; UTF-8/UTF-16 decoding and high-confidence credential/assignment patterns. Not a complete security certification.',logs,findings},null,2));
if(findings.length)throw Error('Audit logs need private review; do not stage');
const generator='scripts/write-audit-handoff.mjs';let source=await fs.readFile(generator,'utf8');
source=source.replaceAll('all audit changes are an additional working tree checkpoint.','audit changes are preserved on this separate branch. Inspect HEAD and working tree status for the latest checkpoint.');
source=source.replaceAll('plus the audit working tree.','plus preserved changes on the audit branch.');
const extra='\n## Social and source checkpoint checks\n\n- `node --test tests/*.test.mjs`: 29 passed, 0 failed. The 13 social tests use actual SQLite and mocked providers; no live Meta or D1 result is inferred. See `migration/pre-deployment/social-queue-verification.json` and its linked initial failure/rerun logs.\n- `node scripts/verify-original-preservation.mjs`: 1,752 original files compared, none changed or missing. See `migration/pre-deployment/original-preservation-check.json`.\n- `node scripts/verify-checkpoint-assets.mjs`: 214 built HTML files, 434 local asset references (433 tracked public sources and one generated asset), no errors. This is not a fresh clone build or remote CI run.\n- Meta: app/portfolio and Facebook Page ownership, accepted Instagram tester/account ID, and saved Pages-only 60-day login configuration were read back in authenticated browser views. Tokens, API grants, renewal and live posts remain untested.\n';
const marker='// Current source checkpoint evidence; generation does not rerun tests.';
if(!source.includes(marker))source+='\n'+marker+'\nawait fs.appendFile("reports/TEST_EVIDENCE.md",'+JSON.stringify(extra)+');\n';
await fs.writeFile(generator,source);
console.log(JSON.stringify({auditLogs:logs.length,credentialPatternFindings:findings.length}));
