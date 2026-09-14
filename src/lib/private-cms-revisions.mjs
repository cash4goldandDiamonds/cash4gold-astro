import assert from 'node:assert/strict';

// Rendering uses the requested perspective, but the consistency check must see
// draft IDs and published documents hidden by a draft overlay as well.
export async function readPrivateCmsRevisions(client) {
  const rows = await client.withConfig({perspective:'raw', useCdn:false}).fetch('*[]|order(_id){_id,_rev}');
  assert.ok(Array.isArray(rows), 'CMS revision query did not return an array.');
  const ids = new Set();
  for (const row of rows) {
    assert.ok(typeof row?._id === 'string' && row._id.length && typeof row._rev === 'string' && row._rev.length, 'CMS revision query returned incomplete evidence.');
    assert.ok(!ids.has(row._id), 'CMS revision query returned duplicate document IDs.');
    ids.add(row._id);
  }
  return rows;
}
