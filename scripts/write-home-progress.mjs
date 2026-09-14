import fs from 'node:fs/promises';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const ledger=await read('migration/substantive-review.json');
const historicalFile='migration/substantive-editorial-review.json';
const history=await read(historicalFile);
for(const row of ledger.rows){
  const old=history.reviews.find(r=>r.path===row.path);
  if(old)row.priorHomeTaskReview={...old,evidence:historicalFile};
}
ledger.uniqueReviewedPaths=ledger.rows.filter(r=>r.status==='reviewed').map(r=>r.path);
ledger.reviewed=ledger.uniqueReviewedPaths.length;
history.historicalRecord=true;
history.currentLedger='migration/substantive-review.json';
history.note='These four reviews are preserved historical evidence. The current deeper review includes those four articles exactly once; do not add four to the current ledger count.';
await fs.writeFile(historicalFile,JSON.stringify(history,null,2));
await fs.writeFile('migration/substantive-review.json',JSON.stringify(ledger,null,2));
const counts=Object.fromEntries(['retain','improve','rewrite'].map(key=>[key,ledger.rows.filter(r=>r.status==='reviewed'&&r.decision===key).length]));
const [pages,articles,substantive,cms,design]=await Promise.all(['verification','editorial-verification','substantive-verification','cms-projection-verification','design-verification'].map(name=>read('migration/'+name+'.json')));
if(pages.failures.length||articles.failures.length||substantive.errors.length||cms.errors.length||!design.passed)throw new Error('A final verification report has failures.');
const knownDifferences=new Map([
  ['/','Updated buying scope, removed unsupported business-history claims and corrected labels.'],
  ['/sell-luxury-watches-in-los-angeles/','Removed an unsupported business-history claim.'],
  ['/start-selling-gold-and-diamonds/','Updated buying scope and removed an unsupported business-history claim.'],
  ['/sell-gemstones-for-cash-in-los-angeles/','Replaced imported competitor/comparison copy with the owner-confirmed gemstone policy.'],
  ['/sell-estate-jewelry-los-angeles/','Placed the new antique diamond necklace illustration and changed the adjacent retail-inventory invitation to estate-jewelry buying and evaluation copy.'],
  ['/privacy-policy/','Removed the unrelated business name and unsupported feature statements; preserved the original and added a factual private-preview notice.'],
]);
for(const warning of pages.warnings)if(warning.type!=='source-text-review'||!knownDifferences.has(warning.path))throw new Error('Unreviewed migration warning: '+JSON.stringify(warning));
await fs.writeFile('migration/final-source-difference-review.json',JSON.stringify({checkedAt:new Date().toISOString(),verificationTimestamp:pages.checkedAt,scope:'Intentional differences from preserved imported text. These remain visible as warnings in the original preservation report.',rows:pages.warnings.map(w=>({path:w.path,removedSourceBlocks:w.missing.length,reason:knownDifferences.get(w.path)}))},null,2));
const text=`# Home-computer website checkpoint

Saved ${new Date().toISOString()}. Work remains in the original Astro/Sanity checkout. The work-PC ZIP and staged copy remain preserved; transfer is deferred. Nothing was pushed, imported into a remote CMS or publicly deployed.

## Completed local content

- ${ledger.reviewed}/${ledger.total} article bodies reviewed: ${counts.rewrite} rewritten, ${counts.improve} improved, ${counts.retain} retained. No substantive reviews remain pending.
- ${articles.canonicalArticles} preferred guides, each with a distinct card photo; ${cms.images} responsive article image placements. The four original near-duplicate article pairs use aligned content and their established preferred canonical URLs. All 109 article locations remain accessible, including the owner-requested redirect, and original publication dates are retained.
- Individual focus and supporting keywords, concise titles, descriptions, heading structure, contextual primary sources, internal links, service links, image alt text, social metadata and article schema are checked. No ranking or traffic result is claimed.
- The former uncut-diamond article is now **Large Diamond Buyer in Downtown Los Angeles**, at /large-diamond-buyer-los-angeles/. The old /uncut-diamond-buyers-los-angeles/ URL redirects. Buying scope: natural, cut and polished diamonds of any size and shape, loose or set in jewelry; no uncut, rough or laboratory-grown diamonds.
- Gold buying emphasizes scrap gold, heavy Cuban chains and bracelets with or without diamonds, gold and silver coins and large quantities. Cash, bank wire or business check are available for agreed purchases.
- Gemstone buying covers only large, high-quality gemstones; Colombian emeralds, Burmese rubies and Ceylon blue sapphires are examples. Certificates are welcome but not required. This size policy is separate from the any-size natural-diamond policy.
- Confirmed address: **617 S. Hill Street, Los Angeles, CA 90014**. Phone: **310-663-1340**. Local import/projection guards reject known retired-route, address and buying-policy conflicts.
- The premium menu, illustrated subcategories, optional synthesized hover/focus sound, actual Rolex gallery photo and distinct gold/estate/gemstone imagery are retained. Four smaller contextual figures display without enlargement.
- Six additional images were created with built-in image_gen: two iced-out Rolex watches, two iced-out Patek Philippe watches, a heavy diamond-set Cuban bracelet and an antique diamond necklace. They appear in six articles and matching guide cards, a three-image homepage feature, a four-image watch gallery, and gold/estate service-page features. The 18 compressed responsive WebP files, full-size originals, prompts and placement records are saved locally; captions identify the images as illustrations.
- The outdated GIA report-lookup URL was replaced with its working landing page. The broken Cartier product reference was removed; relevant official Cartier guidance remains.

## Validation and limitations

The final build generated 212 routes. Local checks passed for ${pages.pages} content pages and ${pages.redirects} configured redirects, all ${articles.articles} articles, local assets and links, 13 CMS content types, and ${articles.preparedCmsDocuments} locally prepared CMS documents. The CMS rich-text projection check passed for ${cms.articles} articles, ${cms.images} images and ${cms.anchors} preserved anchors, including changed metadata/social images and input-safety checks. Check timestamps are recorded in migration/*-verification.json and migration/verification.json.

The ${pages.warnings.length} preservation warnings are intentional rewritten source pages, documented in migration/final-source-difference-review.json. They do not represent broken routes or missing assets. The original source evidence remains preserved.

Actual browser checks confirmed the diamond redirect, current heading and canonical, natural-only policy, corrected source links, mobile navigation, 105 guide cards with 105 distinct photos and no horizontal overflow at the inspected narrow viewport. The sound logic passed eight local behavior checks; these are distinct from an audible listening test. The navigation and sound script is ${design.navigationAndSoundBytes} bytes. No Lighthouse score, production Core Web Vitals or ranking measurement is claimed; the required trace tools were unavailable.

The site is a private noindex local preview. The imported privacy page named an unrelated company and described inactive data-collection features; it now contains factual preview information. Before a public release, the privacy policy must match the actual live services and data practices. Public deployment, remote CMS import, contact delivery, analytics/reviews integrations and Search Console work are outside this local checkpoint.

## Editing and evidence

The authoritative article ledger is migration/substantive-review.json. Historical reviews are counted once. Authored batches are in src/data/article-reviews/. The immutable baseline and original assets remain preserved. Do not run the legacy optimize-editorial.mjs or older four-page generator over the reviewed content.

Apply later approved review edits in this order: scripts/apply-substantive-review.mjs, scripts/align-duplicate-articles.mjs, scripts/apply-owner-buying-policy.mjs, scripts/finish-article-media.mjs, scripts/sync-final-content.mjs, scripts/export-sanity.mjs, then rebuild and run the applicable checks. Selective application refuses to overwrite unrelated newer prose. The sync step confirms current review hashes before refreshing derived briefs.

Image originals and prompt/asset records are saved under migration/source-evidence/owner-approved-images/. Batch manifests include final-distinct-prompts-and-assets.json and iced-jewelry-prompts-and-assets.json; generation mode was built-in image_gen. Optimized WebP variants are in public/media/owner-final/ and public/media/iced-jewelry/. The latest placements are documented in migration/iced-jewelry-placements.json. Blog-level keyword/image/link evidence is in outputs/Blog-optimization-audit.json and .csv. Original migration provenance and prepared CMS documents are preserved locally.
`;
await fs.writeFile('HOME-WORK-STATUS.md',text);
await fs.mkdir('../outputs',{recursive:true});
await fs.writeFile('../outputs/Website-local-checkpoint.md',text);
console.log(JSON.stringify({uniqueReviewed:ledger.reviewed,total:ledger.total,decisions:counts,remaining:ledger.total-ledger.reviewed,canonicalGuides:articles.canonicalArticles,preparedCmsDocuments:articles.preparedCmsDocuments,sourceDifferences:pages.warnings.length}));
