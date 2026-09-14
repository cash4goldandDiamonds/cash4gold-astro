import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {resolveRedirects} from '../src/lib/redirects.mjs';
const out='.cache/rank-math-preview-build';fs.mkdirSync(out,{recursive:true});
const logDirectory='.cache/rank-math-verification-logs';fs.mkdirSync(logDirectory,{recursive:true});
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sourceBefore=hash('src/data/pages.json');
const env={...process.env,ASTRO_TELEMETRY_DISABLED:'1',ASTRO_OUT_DIR:out,SITE_ENV:'preview',ENABLE_PRODUCTION_INDEXING:'false',SANITY_PROJECT_ID:'',SANITY_DATASET:'',SANITY_READ_TOKEN:'',SANITY_PERSPECTIVE:'published',ISOLATED_PRODUCTION_AUDIT:'false'};
const commands=[];
for(const args of [['scripts/generate-routing.mjs'],['--test','tests/release-policy.test.mjs'],['node_modules/astro/bin/astro.mjs','build'],['scripts/finalize-build.mjs']]){
 const result=spawnSync(process.execPath,args,{env,encoding:'utf8',timeout:180000});
 const log=path.join(logDirectory,'command-'+commands.length+'.log');fs.writeFileSync(log,(result.stdout||'')+(result.stderr||''));
 commands.push({command:'node '+args.join(' '),exitCode:result.status,log});assert.equal(result.status,0,'Failed command: '+args.join(' ')+'; see '+log);
}
const pages=JSON.parse(fs.readFileSync('src/data/pages.json','utf8'));
const aliases=JSON.parse(fs.readFileSync('src/data/redirects.json','utf8'));
const rules=resolveRedirects(aliases,[],pages);
const actual=fs.readFileSync(path.join(out,'_redirects'),'utf8');
const expected=[['/sell-your-gemstone/','/sell-gemstones-for-cash-in-los-angeles/'],['/sell-your-watches/','/sell-luxury-watches-in-los-angeles/'],['/best-gold-buyers-los-angeles/','/best-gold-jewelry-buyers-los-angeles-2026/']];
for(const [from,to] of expected){assert.ok(actual.split('\n').includes(`${from} ${to} 301`));assert.ok(fs.existsSync(path.join(out,to,'index.html')));assert.equal(aliases[to],undefined,'Destination must not redirect back');}
assert.match(fs.readFileSync(path.join(out,'_headers'),'utf8'),/X-Robots-Tag: noindex/);
assert.equal(fs.readFileSync(path.join(out,'robots.txt'),'utf8'),'User-agent: *\nDisallow: /\n');
assert.equal(hash('src/data/pages.json'),sourceBefore,'Preserved content was modified');
const report={checkedAt:new Date().toISOString(),status:'PASS',scope:'Local preview build and generated redirect destinations only; deployed HTTP behavior NOT TESTED',commands,totalValidatedRedirects:rules.length,addedRules:expected.map(([from,to])=>({from,to,status:301})),contentFileUnchanged:true,contentSha256:sourceBefore,stagingNoindexRetained:true,liveWordPressWrites:0,remaining:['Owner review of canonical/content policy for the existing live redirect cycle','Deployed 301/404/query-string behavior','CMS editing of newly added redirect records'],recommendation:'NOT READY TO GO LIVE'};
fs.writeFileSync('migration/pre-deployment/rank-math-followup-verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
