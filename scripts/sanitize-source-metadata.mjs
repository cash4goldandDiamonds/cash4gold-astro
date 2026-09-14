import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

// Account verification belongs in deployment configuration, not captured fixtures.
// Originals are retained under ignored backups/ before any local transformation.
const checkOnly=process.argv.includes('--check');
const verification=/^(?:google-site-verification|msvalidate\.01|facebook-domain-verification|p:domain_verify|yandex-verification|norton-safeweb-site-verification)$/i;
const embedded=/(?:google-site-verification|msvalidate\.01|facebook-domain-verification|p:domain_verify|yandex-verification|norton-safeweb-site-verification)/i;
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const files=[];
async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else if(/\.(?:json|ndjson)$/.test(entry.name))files.push(file);}}
await walk('src/data');await walk('migration');
const changes=[];
for(const file of files){
 const original=await fs.readFile(file,'utf8');let removed=0;
 const record=value=>value&&typeof value==='object'&&!Array.isArray(value)&&verification.test(String(value.name||value.property||''));
 function clean(value){
  if(Array.isArray(value))return value.filter(item=>{if(record(item)){removed++;return false;}return true;}).map(clean);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>{if(verification.test(key)){removed++;return false;}return true;}).map(([key,item])=>[key,clean(item)]));
  if(typeof value==='string')return value.replace(/<meta\b[^>]*>/gi,tag=>{if(embedded.test(tag)){removed++;return '';}return tag;}).replace(/\bgoogle-site-verification=[A-Za-z0-9_-]+/g,()=>{removed++;return '[site verification configured outside source]';});
  return value;
 }
 const ndjson=file.endsWith('.ndjson');
 const parsed=ndjson?original.trim().split('\n').map(JSON.parse):JSON.parse(original);
 const sanitized=clean(parsed);if(!removed)continue;
 const relative=file.replaceAll('\\','/');
 const backup='backups/source-metadata/'+stamp+'/'+relative;
 changes.push({file:relative,removedVerificationRecords:removed,originalSha256:crypto.createHash('sha256').update(original).digest('hex'),localBackup:backup});
 if(!checkOnly){await fs.mkdir(path.dirname(backup),{recursive:true});await fs.writeFile(backup,original,{flag:'wx'});await fs.writeFile(file,ndjson?sanitized.map(v=>JSON.stringify(v)).join('\n')+'\n':JSON.stringify(sanitized,null,/\n\s+"/.test(original)?2:undefined));}
}
if(!checkOnly){await fs.mkdir('reports',{recursive:true});await fs.writeFile('reports/SOURCE_METADATA_SANITIZATION.json',JSON.stringify({checkedAt:new Date().toISOString(),scope:'Removed account-verification records from repository captures. Original data remains in ignored local backups. Public business contact details and substantive page content are retained.',changes},null,2));}
console.log(JSON.stringify({mode:checkOnly?'check':'sanitize',affectedFiles:changes.length,removedVerificationRecords:changes.reduce((n,r)=>n+r.removedVerificationRecords,0)}));
if(checkOnly&&changes.length)process.exitCode=1;
