import fs from 'node:fs/promises';
import path from 'node:path';
import {createClient} from '@sanity/client';
import {planImport, retryTransient} from '../src/lib/migration-import.mjs';

const execute = process.argv.includes('--execute');
const source = (await fs.readFile('migration/sanity-import.ndjson', 'utf8')).trim().split(/\r?\n/).map(JSON.parse);
const projectId = process.env.SANITY_PROJECT_ID, dataset = process.env.SANITY_DATASET, token = process.env.SANITY_WRITE_TOKEN;
let client, existing = [], connected = false;
if (projectId && dataset && token) {
  if (dataset !== 'migration-staging') throw new Error('This importer only permits the private migration-staging dataset.');
  client = createClient({projectId, dataset, token, apiVersion: '2026-09-09', useCdn: false});
  const datasets = await client.datasets.list();
  if (!datasets.some(item => item.name === dataset && item.aclMode === 'private')) throw new Error('Private staging visibility could not be verified.');
  existing = await retryTransient(() => client.fetch('*[!(_id in path("_.**"))]'));
  connected = true;
}
const plan = planImport(source, existing), checkedAt = new Date().toISOString();
await fs.mkdir('migration/pre-deployment', {recursive: true});
await fs.writeFile('migration/pre-deployment/import-plan.json', JSON.stringify({checkedAt, connected, mode: execute ? 'execute-requested' : 'dry-run', evidence: connected ? 'Authenticated comparison with private staging' : 'Offline source validation only; empty comparison is a simulation, not evidence of remote state', ...plan}, null, 2));
if (!execute) {
  console.log(JSON.stringify({mode: 'dry-run', connected, documents: source.length, create: plan.create.length, unchanged: plan.unchanged.length, conflicts: plan.conflicts.length, bytes: plan.transactionBytes}));
} else {
  if (!connected) throw new Error('Execution needs scoped SANITY_WRITE_TOKEN and verified private staging. No writes occurred.');
  if (!plan.safeToExecute) throw new Error('Conflicts require a recorded reconciliation. Existing documents were preserved.');
  const backup = path.join('.cache', 'cms-backups', checkedAt.replace(/[:.]/g, '-'));
  await fs.mkdir(backup, {recursive: true});
  await fs.writeFile(path.join(backup, 'before.ndjson'), existing.map(doc => JSON.stringify(doc)).join('\n') + '\n');
  await fs.writeFile(path.join(backup, 'source.ndjson'), source.map(doc => JSON.stringify(doc)).join('\n') + '\n');
  const ids = new Set(plan.create.map(row => row._id));
  if (ids.size) await retryTransient(() => {
    const tx = client.transaction();
    for (const doc of source) if (ids.has(doc._id)) tx.createIfNotExists(doc);
    return tx.commit({visibility: 'sync'});
  });
  const after = await retryTransient(() => client.fetch('*[!(_id in path("_.**"))]'));
  const reconciliation = planImport(source, after);
  await fs.writeFile(path.join(backup, 'after.ndjson'), after.map(doc => JSON.stringify(doc)).join('\n') + '\n');
  await fs.writeFile('migration/pre-deployment/import-result.json', JSON.stringify({checkedAt: new Date().toISOString(), projectId, dataset, backup, created: ids.size, remaining: reconciliation.create, conflicts: reconciliation.conflicts}, null, 2));
  if (reconciliation.create.length || reconciliation.conflicts.length) throw new Error('Post-import reconciliation did not pass; backup retained. Do not release.');
  console.log(JSON.stringify({privateStagingImport: 'verified', documents: source.length, backup, productionAffected: false}));
}
