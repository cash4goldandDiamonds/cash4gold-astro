import fs from 'node:fs/promises';
const file='reports/requirements.json';
const report=JSON.parse(await fs.readFile(file,'utf8'));
const unresolved=report.requirements.filter(r=>r.phase==='prelaunch'&&!['PASS','FIXED AND VERIFIED'].includes(r.status));
if(unresolved.length){console.error('NOT READY: '+unresolved.length+' mandatory prelaunch requirements remain unresolved. See PRE_DEPLOYMENT_AUDIT.md.');process.exitCode=1;}else console.log('Requirement evidence has no unresolved prelaunch rows; exact release approval and fresh external checks are still required.');
