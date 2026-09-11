import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

// Read-only validation of a restored Git bundle. This does not prove that a
// WordPress database, customer uploads, Sanity dataset or deployed site restores.
const [bundlePath, expectedRevision] = process.argv.slice(2);
if (!bundlePath || !/^[a-f0-9]{40}$/.test(expectedRevision || '')) {
  throw new Error('Provide the existing bundle path and full expected Git revision.');
}
const git = process.env.GIT_EXECUTABLE || 'git';
const command = (...args) => execFileSync(git, args, {encoding: 'utf8', maxBuffer: 20 * 1024 * 1024});
const startedAt = new Date().toISOString();
const started = performance.now();
const revision = command('rev-parse', 'HEAD').trim();
if (revision !== expectedRevision) throw new Error('The restored revision does not match the expected backup.');
command('fsck', '--full');
command('bundle', 'verify', path.resolve(bundlePath));
const entries = command('ls-tree', '-r', '-z', revision).split('\0').filter(Boolean);
const discrepancies = [];
let restoredBytes = 0;
for (const entry of entries) {
  const [, mode, type, expectedHash, file] = entry.match(/^(\d+) (\w+) ([a-f0-9]+)\t([\s\S]+)$/) || [];
  if (type !== 'blob' || !['100644', '100755'].includes(mode)) {
    discrepancies.push({file, reason: 'Unsupported Git object: requires separate verification'});
    continue;
  }
  try {
    const bytes = await fs.readFile(file);
    restoredBytes += bytes.length;
    const hash = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    if (hash !== expectedHash) discrepancies.push({file, reason: 'Restored bytes differ from saved Git object'});
  } catch {
    discrepancies.push({file, reason: 'Restored file could not be read'});
  }
}
const bundle = await fs.readFile(bundlePath);
const report = {
  startedAt, checkedAt: new Date().toISOString(), durationMs: Math.round(performance.now() - started),
  status: discrepancies.length ? 'BLOCKED' : 'PASS',
  scope: 'Actual isolated Git bundle restoration and byte-for-byte verification of tracked source files only',
  revision, bundlePath: path.resolve(bundlePath), bundleBytes: bundle.length,
  bundleSha256: createHash('sha256').update(bundle).digest('hex'),
  restoredDirectory: process.cwd(), restoredFiles: entries.length, restoredBytes,
  gitObjectIntegrity: 'PASS', bundleIntegrity: 'PASS', discrepancies,
  notProven: ['WordPress database/uploads restore', 'Sanity dataset/assets restore', 'Live deployment rollback', 'Remote disaster recovery', 'Dependency installation from backup'],
};
await fs.mkdir('migration/pre-deployment', {recursive: true});
await fs.writeFile('migration/pre-deployment/source-restore-verification.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({status: report.status, revision, restoredFiles: report.restoredFiles, restoredBytes, discrepancies: discrepancies.length}));
if (discrepancies.length) process.exitCode = 1;
