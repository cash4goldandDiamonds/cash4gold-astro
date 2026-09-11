import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {createClient} from '@sanity/client';
import {privateCmsPreviewPlan} from '../src/lib/private-cms-preview-plan.mjs';

const plan=privateCmsPreviewPlan(process.env);
const session=JSON.parse(await fs.readFile(process.env.SANITY_SESSION_FILE||'.cache/sanity-staging/session.json','utf8'));
assert.equal(session.projectId,'gisdw6qa'); assert.equal(session.dataset,'migration-staging');
assert.ok(typeof session.token==='string'&&session.token.length>10,'A private local session credential is required.');
const env={...process.env,...plan.environment,ASTRO_TELEMETRY_DISABLED:'1',SANITY_PROJECT_ID:session.projectId,SANITY_DATASET:session.dataset,SANITY_READ_TOKEN:session.token};
const client=createClient({projectId:session.projectId,dataset:session.dataset,token:session.token,apiVersion:'2026-09-09',useCdn:false,perspective:plan.perspective});
const report={startedAt:new Date().toISOString(),status:'BLOCKED',perspective:plan.perspective,output:plan.output,mode:'Actual private Sanity-backed Astro build; local output only, not a Cloudflare deployment',steps:[]};
const revisions=()=>client.fetch('*[]|order(_id){_id,_rev}');
let log='';
try {
  assert.ok((await client.datasets.list()).some(d=>d.name===session.dataset&&d.aclMode==='private'));
  const before=await revisions();
  assert.ok(before.length>=198,'Private dataset is incomplete.');
  const astroPackage=JSON.parse(await fs.readFile('node_modules/astro/package.json','utf8'));
  const binary=typeof astroPackage.bin==='string'?astroPackage.bin:astroPackage.bin.astro;
  for(const [name,args] of [['astro build',[path.resolve('node_modules/astro',binary),'build']],['finalize-build',['scripts/finalize-build.mjs']]]) {
    const result=spawnSync(process.execPath,args,{env,encoding:'utf8',maxBuffer:50*1024*1024});
    log+=`\n${name}\n${result.stdout||''}\n${result.stderr||''}`;
    report.steps.push({command:name,exitCode:result.status});
    assert.equal(result.status,0,`${name} failed`);
  }
  const after=await revisions();
  assert.deepEqual(after,before,'CMS document revisions changed during this build');
  report.documents=before.length;
  report.documentRevisionsSha256=createHash('sha256').update(JSON.stringify(before)).digest('hex');
  let htmlFiles=0,checkedFiles=0;
  async function inspect(directory) {
    for(const entry of await fs.readdir(directory,{withFileTypes:true})) {
      const file=path.join(directory,entry.name);
      if(entry.isDirectory()){await inspect(file);continue;}
      const bytes=await fs.readFile(file); checkedFiles++;
      assert.ok(!bytes.includes(Buffer.from(session.token)),`Credential found in build output: ${file}`);
      if(file.endsWith('.html')) {
        htmlFiles++;
        assert.match(bytes.toString(),/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i,`Missing preview noindex: ${file}`);
      }
    }
  }
  await inspect(plan.output);
  assert.match(await fs.readFile(path.join(plan.output,'robots.txt'),'utf8'),/Disallow:\s*\//);
  assert.match(await fs.readFile(path.join(plan.output,'_headers'),'utf8'),/X-Robots-Tag: noindex/);
  report.htmlFiles=htmlFiles;report.outputFilesScanned=checkedFiles;report.credentialMatches=0;report.status='PASS';
} catch(error) {
  report.failure={code:error.code||'BUILD_FAILED',status:error.statusCode||null,assertion:error.code==='ERR_ASSERTION'?error.message:undefined};
} finally {
  await fs.mkdir('.cache',{recursive:true});
  await fs.writeFile('.cache/private-cms-'+plan.perspective+'.log',log.replaceAll(session.token,'[REDACTED]'));
  report.completedAt=new Date().toISOString();report.log='.cache/private-cms-'+plan.perspective+'.log';
  await fs.writeFile('.cache/private-cms-'+plan.perspective+'.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report));
  if(report.status!=='PASS')process.exitCode=1;
}
