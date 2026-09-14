import test from 'node:test';
import assert from 'node:assert/strict';
import {readPrivateCmsRevisions} from '../src/lib/private-cms-revisions.mjs';

test('private preview revision checks detect changes hidden by either rendering perspective', async () => {
  for (const perspective of ['published','drafts']) {
    const rows = [{_id:'drafts.page-one',_rev:'draft-v1'},{_id:'page-one',_rev:'published-v1'}];
    const client = {
      config: {perspective,useCdn:true},
      withConfig(options) {
        assert.deepEqual(options,{perspective:'raw',useCdn:false});
        return {fetch:async query => {
          assert.equal(query,'*[]|order(_id){_id,_rev}');
          return structuredClone(rows);
        }};
      },
      fetch:async () => {throw new Error('Perspective-filtered revision query hides document changes.');},
    };
    const before = await readPrivateCmsRevisions(client);
    rows[perspective==='published'?0:1]._rev = 'changed-while-building';
    const after = await readPrivateCmsRevisions(client);
    assert.notDeepEqual(after,before);
    assert.equal(client.config.perspective,perspective);
  }
});

test('incomplete or duplicate revision evidence fails closed', async () => {
  for (const rows of [null,[{_id:'one'}],[{_id:'one',_rev:''}],[{_id:'one',_rev:'a'},{_id:'one',_rev:'b'}]]) {
    const client = {withConfig:()=>({fetch:async()=>rows})};
    await assert.rejects(readPrivateCmsRevisions(client));
  }
});
