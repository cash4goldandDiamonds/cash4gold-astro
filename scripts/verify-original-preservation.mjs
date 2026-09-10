import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const original='C:/Users/judit/Documents/Codex/2026-09-09/cash-for-gold/cash4gold-astro',baseline=JSON.parse(await fs.readFile('migration/pre-deployment/baseline.json','utf8')),changed=[],missing=[];
for(const item of baseline.files){try{const data=await fs.readFile(path.join(original,item.path)),sha=crypto.createHash('sha256').update(data).digest('hex');if(sha!==item.sha256)changed.push(item.path);}catch(error){missing.push({path:item.path,error:error.code});}}
const report={checkedAt:new Date().toISOString(),original,baseline:'migration/pre-deployment/baseline.json',filesCompared:baseline.files.length,changed,missing,scope:'Read-only comparison of pre-audit original files; no original file was modified by this script.'};await fs.writeFile('migration/pre-deployment/original-preservation-check.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(changed.length||missing.length)process.exitCode=1;
