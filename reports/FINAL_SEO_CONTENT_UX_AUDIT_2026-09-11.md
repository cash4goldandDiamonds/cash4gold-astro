# Final SEO, content, conversion and UX audit — September 11, 2026

**NO-GO / NOT READY TO GO LIVE.** The authorized rebuild improvements are implemented and locally validated. Delivery integrations, hosted CMS acceptance, measured performance and other launch gates remain open. Nothing in this report authorizes launch.

This continues the existing private [cash4goldandDiamonds/cash4gold-astro repository](https://github.com/cash4goldandDiamonds/cash4gold-astro), using the [September 10 inspection](INSPECTION_2026-09-10.md) as the authoritative starting point. The initial remote audit head was `0ff4b3cfd81c90af26896fe8b211ef4c8e120968`. Changes are intended for the existing `audit/pre-deployment-2026-09-10` branch and draft PR #1. The final pushed commit and fresh-checkout CI result are recorded in the delivery handoff; this report does not claim that a pending upload has passed CI.

Both original September 9 local copies are preserved. Local safety branch `safety/before-final-seo-2026-09-11` preserves checkpoint `138ce4fc05de1fdd3d51ee8153be5a5cc657f70b` (same source tree as the initial remote head). Main is not merged. No repository was created, and no production site, domain, DNS, nameserver, GoDaddy setting or paid plan was changed.

## 1. Critical problems found

- The gold service lacked the depth and preparation guidance of the diamond/watch benchmarks. Reviews had only about 16 body words and an unsupported five-star claim in metadata. These issues were corrected.
- The diamond service still showed six stale article-card excerpts, including old ranking and payment claims. These now use the current reviewed article titles/descriptions.
- The homepage contained weak trust wording and an absolute privacy claim. The live WordPress homepage still exposes a reviews shortcode. The rebuild contains no visible/crawlable plugin shortcode or “Appoinment” misspelling.
- Astro's small bundled navigation script was inline while the hosting CSP allowed only same-origin script files. The build now emits an external script, with a regression check that rejects executable inline scripts. The security policy was not relaxed.
- Public HTTP and HTTPS `www.cash4goldanddiamond.com` requests returned 403 / Cloudflare error 1000. The non-www HTTP homepage redirected to HTTPS. The two live gold-guide aliases still form a 301 cycle. These production findings were recorded without changing live settings.
- Inquiry delivery and conversion analytics are not connected. A phone/mail link and a Calendly link do not establish successful delivery or attribution.
- Two existing articles carry noindex and four exact duplicate articles point to another canonical. Those settings require deliberate acceptance; they were not silently changed.

## 2. Changes completed

The gold page now covers jewelry, broken pieces, scrap, 10K/14K/18K/22K/24K purity, gold coins, bullion inquiries, estate/inherited and designer jewelry, heavy Cuban links, weight, spot-price context, testing limitations, how the offer is determined, visit preparation, Downtown Los Angeles, eight answer-first FAQs, contextual internal links and clear appointment/phone actions. It explicitly distinguishes a preliminary phone estimate from a final offer after physical verification. Legacy section anchors remain. No competitor comparison table, commission percentages or unsupported selling timelines appear on the page. Testing methods are educational; the copy does not claim the shop uses an unconfirmed instrument.

Homepage headings and copy now distinguish the business's overall jewelry-buying role from the gold service. Contact details and visit preparation are explicit. About, estate, FAQ and start-selling wording was also corrected where it implied unsupported online selling, guaranteed value, absolute privacy or formal appraisal services. The diamond and luxury watch pages remain the main design benchmarks.

Reviews now has substantial location/service context, two brief attributed Google review excerpts and direct source links. The official [Google business profile](https://maps.app.goo.gl/zcu9rXLfB5BWKnKy9) was verified against name, street address, phone and website. Only public display-name attribution is retained; no private customer information, reviewer photographs, ratings or counts were copied. [Review provenance](../migration/final-seo-audit/review-provenance.json) records the source. No Review/AggregateRating markup is emitted.

The contact page has accessible phone, email, directions and Calendly links, accurate appointment spelling and the requested NAP. Persistent mobile actions are Call / Directions / Appointment, with 52-pixel heights. The page accurately explains that an email link opens the visitor's email application.

All 198 routes remain. All 111 article bodies are unchanged from their previously reviewed versions. Required source, media, configuration, scripts, tests, redirects, SEO/schema and GitHub workflows remain preserved.

## 3. Content and decisions requiring owner approval

[The individual article ledger](../migration/final-seo-audit/article-decisions.json) contains all 111 decisions: **84 KEEP, 19 IMPROVE, 4 MERGE, 4 REDIRECT, 0 NOINDEX, 0 REMOVE**. Each entry includes intent, current title/canonical/robots, prior review findings, source support, duplication/claim flags and a specific recommendation. The existing September 10 complete prose-review hashes were verified for every current body. This is not a claim of 111 new manual word-by-word rereads or live search-ranking measurements. KEEP is a content recommendation, not final publication approval.

The 19 improvement candidates include shopper-oriented ring/diamond comparisons, generic overlap with gold/watch services, and gold-bar acceptance. Historical “Best / Top / Ranked” slugs remain to protect URLs; their bodies do not restore unsupported rankings. Search Console traffic/backlink evidence is needed before consolidation.

Confirm the actual gold-testing methods and bullion acceptance before adding store-specific promises. Approve the final service language, article decisions, privacy/consent text, image rights, three historical SEO overrides and the loose-diamond metadata differences documented in the earlier authenticated audit. The old full Sanity seed is historical; the existing export script regenerates it from current source. A [31-document proposal for nine CMS pages](../migration/final-seo-audit/cms-update-proposal.json) is prepared but not imported. It retains unapproved review flags and requires comparison with any newer editor changes.

## 4. Proposed redirects and indexing decisions

**No new article redirects, deletions or noindex rules were applied.** [The proposed map](../migration/final-seo-audit/redirect-proposals.json) lists eight conditional 301s: four exact duplicate “-2” ring articles and four overlapping articles that first need unique-content consolidation and traffic/backlink review. All 18 existing redirect rules remain unchanged, including the existing rebuild-only resolution of the live gold-guide loop.

Preserved article noindex directives: `/how-to-spot-a-fake-rolex/` and `/sell-gold-and-diamonds-online/`. Seventy-four archive routes also remain noindex. If either article is intended to rank, its source/CMS directive must be approved for change and then checked in a new production-equivalent build. Do not remove staging noindex to resolve a production Search Console report.

For “Duplicate, Google chose different canonical,” align the accepted primary URL across links, sitemap, canonical and any approved 301. The four exact duplicates are the first candidates. For “Excluded by noindex,” distinguish the intentionally protected preview, archive policy and the two articles above. Search Console's current indexed canonical and exclusion states have not been independently verified in this pass. [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) and [noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing) support these separate checks.

## 5. SEO / AEO / GEO results

Automated checks pass on all 198 built content routes: one H1, title/description, canonical, synchronized Open Graph text, valid JSON-LD, NAP, image ALT attributes and dimensions, local assets, internal paths and fragments. The 118 eligible canonical production pages have unique titles/descriptions and an exact sitemap match. There are no orphaned indexable canonical pages or heading-level skips. Production robots/canonicals and staging noindex/disallow-all/empty-sitemap behavior were verified in separate builds.

Gold has JewelryStore, Service and visible FAQ schema. Structured answers cover concrete seller questions, with primary educational sources and consistent business/location signals. No invented business rankings or answer-engine placement promises were added. Google's [AI-feature guidance](https://developers.google.com/search/docs/appearance/ai-features) retains the normal foundations of useful, accessible, indexable content. FAQ markup is not a promised Google rich result: Google's [2026 search updates](https://developers.google.com/search/updates) record FAQ rich-result deprecation. Self-serving business reviews are not marked up for review stars, consistent with [Google's review guidance](https://developers.google.com/search/docs/appearance/structured-data/review-snippet).

Gold education references the [World Gold Council](https://www.gold.org/about-gold/about-gold-jewellery), [GIA touchstone guidance](https://www.gia.edu/bench-tip-use-the-touchstone-method-for-testing-purity-karat-gold), and [GIA's gold-plating/XRF example](https://www.gia.edu/gems-gemology/summer-2025-lab-notes-gold-plated-gold0). These do not verify the shop's own equipment.

## 6. Performance results and limits

**Core Web Vitals and Lighthouse are NOT MEASURED.** The required Chrome DevTools profiling tools are unavailable. The applicable web-perf skill explicitly stops profiling in that case. No score, LCP, INP or CLS pass is claimed. This remains a launch blocker.

The table reports actual isolated production-output sizes, not network load times. Image counts are main-content images, including lazy/offscreen assets.

| Page | HTML KiB | Gzip KiB | DOM elements | Images |
|---|---:|---:|---:|---:|
| Homepage | 27.7 | 6.0 | 351 | 13 |
| Gold service | 30.4 | 7.8 | 369 | 2 |
| Diamond service | 43.1 | 9.5 | 483 | 11 |
| Luxury watch service | 39.0 | 9.3 | 460 | 9 |
| Blog index | 118.1 | 21.4 | 743 | 107 |
| 14K article | 24.3 | 6.6 | 283 | 2 |
| Reviews | 16.5 | 4.2 | 224 | 0 |
| Contact | 15.6 | 3.8 | 214 | 0 |

Responsive WebP assets, explicit dimensions and lazy loading remain. Duplicate hero copies were removed and 319 lazy/high-priority conflicts were corrected in non-article source. No third-party scripts or framework hydration islands are loaded. Navigation JavaScript remains functional in a same-origin file allowed by CSP. System font stacks avoid external font requests. The 107-card blog index needs measured mobile profiling before deciding on pagination; its unique guide images and existing archive pagination are preserved. Preview caching is private/no-store; production policy revalidates HTML, caches media for 24 hours and hashed Astro assets for one year. Actual Cloudflare cache/performance behavior still needs measurement.

## 7. Mobile and accessibility QA

Eight representative pages passed 40 local browser checks at actual widths 320, 390, 430, 768 and 1280: no horizontal overflow, one H1 and no visible unloaded image above the fold. Mobile menu/service navigation, Escape-to-close/focus return, gold FAQ expansion and keyboard Skip to content passed. Gold, homepage, contact and attributed review-card layouts were visually inspected. The sticky actions remain visible and legible.

These checks do not certify all screen readers, physical devices, 200%/400% zoom, focus-order combinations or measured layout-shift timing. A comprehensive accessibility and device acceptance pass remains open. [Responsive evidence](../migration/final-seo-audit/responsive-qa.json) states the actual scope.

## 8. Technical validation and remaining launch blockers

**Local validation PASS:** 33 unit tests, schema/security/type checks, fresh Astro build, output finalization, all-route asset/link checks, new SEO/CSP checks, CMS article projection, editorial/substantive checks, source preservation, design checks and dependency audit. Fourteen stages passed. The isolated production build/finalization/SEO check also passed. Dependency audit reports one moderate finding and zero high/critical findings. [Validation evidence](../migration/final-seo-audit/validation.json).

There are 217 generated routes including 198 content pages, 18 redirects and 404. A 220-request local HTTP check passed content statuses, redirects/query preservation, trailing slash, missing-page status, robots and sitemap. It emulates the static hosting rules; authenticated Cloudflare edge headers/statuses are a separate unresolved check. A fresh 222-request public WordPress crawl and [URL-by-URL comparison](../migration/final-seo-audit/url-comparison.json) account for all 198 rebuild paths. The large-diamond replacement route is a deliberate rebuild route and is 404 on live WordPress. Ten source-text comparison warnings reflect 296 changed source blocks; the original wording remains in preserved evidence.

**Full launch parity is not certified.** Remaining gates:

1. A connected, accessible inquiry form with spam protection, success/error behavior and proven recipient delivery. Current CSP intentionally allows no form submissions until an integration is implemented.
2. Completed appointment reservation/cancellation/confirmation and recipient-delivery tests. Calendly date availability alone is insufficient.
3. Approved analytics/consent configuration, tested opt-in/withdrawal and phone/appointment/form conversion attribution. No hidden tracker was introduced.
4. Hosted Sanity editor roles, draft preview, review freshness, publication/media/deletion guards, rebuild and rollback acceptance. Local article projection passes; it does not prove hosted editor acceptance. Non-article rich-text FAQ synchronization still needs explicit acceptance; imported mode currently retains repository schema/layout.
5. Full WordPress files/database/uploads backup and isolated restore; earlier GoDaddy backup-history failure remains unresolved. WXR is not a full backup.
6. Remaining SEO override/canonical/noindex and media-rights/binary acceptance, including attachment 3103 and Search Console/Bing verification ownership.
7. Measured mobile performance, broader accessibility/device QA, final authenticated staging header checks and an approved host/DNS redirect plan that resolves the live www failure.
8. Separate explicit owner approval to launch after the above pass.

## 9. Recommendation

**NO-GO.** Review the updated gold, home, reviews and contact pages on protected staging after the final GitHub-backed build is verified. The next actionable owner inputs are the inquiry/email provider, confirmed testing methods/bullion scope, content/indexing decisions and CMS/backup acceptance. This audit does not change production, and launch must not happen automatically.
