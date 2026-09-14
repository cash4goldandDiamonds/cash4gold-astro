import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {documentFingerprint} from '../src/lib/migration-import.mjs';

// Read-only: this script has no provider client, network call or write mutation.
// A fresh private dataset export can be supplied for revision comparison.
const files=['migration/final-seo-audit/cms-update-proposal.json','migration/article-reuse-2026-09-11/cms-update-proposal.json'];
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const byPath=new Map(pages.map(page=>[page.path,page]));
const proposals=new Map(),groups=[];
for(const file of files){
  const proposal=JSON.parse(await fs.readFile(file,'utf8'));
  assert.equal(proposal.applied,false,'Proposal must remain unapplied until hosted reconciliation.');
  const pageDocs=proposal.documents.filter(doc=>doc._type==='page');
  assert.equal(pageDocs.length,proposal.pages,'Proposal page count is stale.');
  for(const doc of proposal.documents){
    if(proposals.has(doc._id))assert.equal(documentFingerprint(proposals.get(doc._id)),documentFingerprint(doc),'Overlapping proposals disagree.');
    proposals.set(doc._id,doc);
    if(doc._type!=='page')continue;
    const page=byPath.get(doc.path);
    assert.ok(page,'Proposed page has no preserved website route.');
    assert.equal(doc.title,page.heading,'Proposed heading is stale: '+doc.path);
    assert.equal(doc.seo.title,page.title,'Proposed SEO title is stale: '+doc.path);
    assert.equal(doc.seo.description,page.description,'Proposed description is stale: '+doc.path);
    assert.equal(doc.seo.canonical,page.canonical,'Proposed canonical is stale: '+doc.path);
    assert.equal(doc.contentVerified,false);
    assert.equal(doc.seoVerified,false);
    assert.notEqual(doc.reviewState,'approved');
  }
  groups.push({file,pages:pageDocs.length,documents:proposal.documents.length});
}
const args=process.argv.slice(2);
assert.ok(args.length<=1,'Usage: node scripts/verify-cms-update-proposals.mjs [fresh-private-export.ndjson]');
const report={checkedAt:new Date().toISOString(),status:'LOCAL_PROPOSALS_VALID',groups,uniqueDocuments:proposals.size,uniquePages:[...proposals.values()].filter(doc=>doc._type==='page').length,remoteWrites:0,approvalFlagsChanged:0,hostedReconciliation:'NOT_RUN: provide a fresh private migration-staging dataset export outside Git.',comparisons:[]};
if(args[0]){
  const text=await fs.readFile(path.resolve(args[0]),'utf8');
  const docs=text.trimStart().startsWith('[')?JSON.parse(text):text.trim().split(/\r?\n/).filter(Boolean).map(JSON.parse);
  const existing=new Map(docs.map(doc=>[doc._id,doc]));
  assert.equal(existing.size,docs.length,'Export contains duplicate document IDs.');
  for(const [id,proposed] of proposals){
    const published=existing.get(id),draft=existing.get('drafts.'+id);
    if(published)assert.equal(typeof published._rev,'string','Use a fresh server export with revision IDs, not the historical seed.');
    if(draft)assert.equal(typeof draft._rev,'string','Draft export lacks revision evidence.');
    report.comparisons.push({id,...(proposed.path?{path:proposed.path}:{}),proposedSha256:documentFingerprint(proposed),published:published?{state:documentFingerprint(published)===documentFingerprint(proposed)?'MATCH':'REVIEW_DIFFERENCE',revision:published._rev,sha256:documentFingerprint(published)}:{state:'MISSING'},draft:draft?{state:'PRESERVE_AND_REVIEW',revision:draft._rev}:{state:'ABSENT'}});
  }
  report.status='HOSTED_EXPORT_COMPARED';
  report.hostedReconciliation='Read-only export comparison completed; differences and every draft require deliberate review. No import is performed.';
  report.publishedMatches=report.comparisons.filter(row=>row.published.state==='MATCH').length;
  report.publishedDifferences=report.comparisons.filter(row=>row.published.state==='REVIEW_DIFFERENCE').length;
  report.missingPublished=report.comparisons.filter(row=>row.published.state==='MISSING').length;
  report.draftsToPreserve=report.comparisons.filter(row=>row.draft.state==='PRESERVE_AND_REVIEW').length;
}
await fs.mkdir('.cache',{recursive:true});
await fs.writeFile('.cache/cms-update-proposal-review.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,comparisons:undefined,report:'.cache/cms-update-proposal-review.json'}));
