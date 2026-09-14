import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const checker=fileURLToPath(new URL('../scripts/verify-accessibility-structure.mjs',import.meta.url));
const document=(body,viewport='width=device-width,initial-scale=1')=>`<!doctype html><html lang="en"><head><title>Test fixture</title><meta name="viewport" content="${viewport}"></head><body><a class="skip-link" href="#main">Skip to content</a><main id="main" tabindex="-1"><h1>Seller inquiry</h1>${body}</main></body></html>`;
async function inspect(html){
 const folder=await fs.mkdtemp(path.join(tmpdir(),'cash4gold-a11y-'));
 try{
  await fs.mkdir(path.join(folder,'src/data'),{recursive:true});
  await fs.mkdir(path.join(folder,'dist'),{recursive:true});
  await fs.writeFile(path.join(folder,'src/data/pages.json'),JSON.stringify([{path:'/'}]));
  await fs.writeFile(path.join(folder,'dist/index.html'),html);
  await fs.writeFile(path.join(folder,'dist/404.html'),document('<p>Page not found.</p>'));
  const result=spawnSync(process.execPath,[checker,'--report=report.json'],{cwd:folder,env:{...process.env,ASTRO_OUT_DIR:'dist'},encoding:'utf8'});
  return {status:result.status,report:JSON.parse(await fs.readFile(path.join(folder,'report.json'),'utf8')),stderr:result.stderr};
 }finally{
  const resolved=path.resolve(folder);
  if(path.dirname(resolved)!==path.resolve(tmpdir())||!path.basename(resolved).startsWith('cash4gold-a11y-'))throw new Error('Unexpected test cleanup path');
  await fs.rm(resolved,{recursive:true,force:true});
 }
}

test('structural accessibility accepts native disclosures and explicitly associated inquiry labels',async()=>{
 const result=await inspect(document('<details><summary aria-controls="services">What we buy</summary><div id="services"><a href="/gold/"><img src="gold.webp" alt="Sell gold" width="320" height="200"></a></div></details><form><label for="email">Your email</label><input id="email" type="email" aria-describedby="email-help"><p id="email-help">We use this to reply.</p><label><input type="checkbox" name="consent">I agree to be contacted.</label><button type="submit">Send inquiry</button></form>'));
 assert.equal(result.status,0,result.stderr);
 assert.deepEqual(result.report.errors,[]);
});

test('structural accessibility rejects ambiguous focus targets and unnamed controls',async()=>{
 const result=await inspect(document('<div id="services"></div><div id="services"></div><button aria-controls="missing-panel"><svg aria-hidden="true"></svg></button><input name="email" type="email"><a href="/contact/" tabindex="3">Contact</a>'));
 assert.equal(result.status,1);
 const types=new Set(result.report.errors.map(error=>error.type));
 for(const type of ['duplicate-id','missing-aria-reference','unnamed-interactive-element','unlabelled-form-control','positive-tabindex'])assert.ok(types.has(type),type);
});

test('structural accessibility rejects disabled zoom and missing image alternatives',async()=>{
 const result=await inspect(document('<a href="/contact/"><img src="contact.webp"></a><iframe src="/booking/"></iframe>','width=device-width,maximum-scale=1,user-scalable=no'));
 assert.equal(result.status,1);
 const types=new Set(result.report.errors.map(error=>error.type));
 for(const type of ['viewport-restricts-zoom','missing-image-alt','missing-image-dimensions','untitled-frame'])assert.ok(types.has(type),type);
});
