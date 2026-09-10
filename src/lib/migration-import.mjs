import {createHash} from 'node:crypto';
const systemKeys = new Set(['_rev', '_createdAt', '_updatedAt']);
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).filter(key => !systemKeys.has(key) && value[key] !== undefined).sort().map(key => [key, canonical(value[key])])) : value;
export const documentFingerprint = doc => createHash('sha256').update(JSON.stringify(canonical(doc))).digest('hex');

export function planImport(source, existing = []) {
  const sourceIds = new Set(), remote = new Map(existing.map(doc => [doc._id, doc]));
  for (const doc of source) {
    if (!/^[A-Za-z0-9_-]+$/.test(doc._id || '') || !doc._type || sourceIds.has(doc._id)) throw new Error('Missing, invalid or duplicate migration document ID.');
    sourceIds.add(doc._id);
  }
  function checkReferences(value, id) {
    if (!value || typeof value !== 'object') return;
    if (value._type === 'reference' && !sourceIds.has(value._ref) && !remote.has(value._ref)) throw new Error('Unresolved migration reference in ' + id + ': ' + value._ref);
    for (const child of Object.values(value)) if (child && typeof child === 'object') checkReferences(child, id);
  }
  const create = [], unchanged = [], conflicts = [];
  for (const doc of source) {
    checkReferences(doc, doc._id);
    const prior = remote.get(doc._id), sourceHash = documentFingerprint(doc);
    if (!prior) create.push({_id: doc._id, sourceHash});
    else if (sourceHash === documentFingerprint(prior)) unchanged.push(doc._id);
    else conflicts.push({_id: doc._id, sourceHash, existingHash: documentFingerprint(prior), decision: 'STOP: preserve existing document; review and reconcile in staging before rerunning'});
  }
  const bytes = Buffer.byteLength(JSON.stringify({mutations: source.filter(doc => create.some(row => row._id === doc._id)).map(doc => ({createIfNotExists: doc}))}));
  if (bytes > 3_500_000) throw new Error('Atomic import exceeds the conservative request budget. Prepare a separately reviewed batch plan; no partial import attempted.');
  return {sourceDocuments: source.length, create, unchanged, conflicts, transactionBytes: bytes, safeToExecute: conflicts.length === 0};
}

export async function retryTransient(operation, {attempts = 3, pause = ms => new Promise(resolve => setTimeout(resolve, ms))} = {}) {
  for (let attempt = 0; ; attempt++) {
    try { return await operation(); }
    catch (error) {
      if (attempt + 1 >= attempts || ![408, 429, 500, 502, 503, 504].includes(error.statusCode)) throw error;
      await pause(250 * 2 ** attempt);
    }
  }
}
