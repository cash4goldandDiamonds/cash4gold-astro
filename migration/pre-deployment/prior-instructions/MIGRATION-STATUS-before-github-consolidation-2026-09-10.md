# Migration status

Updated: 2026-09-09

## Work-PC transfer checkpoint — current

Read `WORK-PC-HANDOFF.md` for the authoritative current setup and all pending user requirements. Current totals: 196 content pages, 14 redirects, 211 outputs, 109 articles, 218 article images, 267 synchronized listings on 74 archive pages, and 780 prepared Sanity documents. The gold page and five priority gold articles were rewritten; the newly requested deeper all-article editorial pass is queued. Current address and technical checks passed. No browser performance sweep or public release has occurred.

Sanity project `gisdw6qa` and private `migration-staging` exist; the existing `production` dataset is public. API/OAuth access was blocked by outbound `connect EACCES`; import remains local. GitHub repository privacy was reverified, but the transfer environment cannot reach GitHub:443 with Git. The accompanying transfer manifest records actual ZIP/branch/commit/push status.

The earlier progress and discovery notes below are preserved as history and are superseded by this checkpoint and the handoff document.

## Current local implementation

- Real private GitHub clone on `main`; local Git authentication works. No pushes or remote edits.
- Astro 7.3.2 local implementation: 196 distinct captured pages, 14 redirect aliases and a 404 page; 211 generated routes.
- Local preview: http://127.0.0.1:4321/ (loopback only).
- 215 public URLs requested, including 122 sitemap entries. No discovered crawl queue remains. Coverage has not been reconciled with a WordPress export.
- 480 media assets captured. 335 smaller WebP variants generated, reducing those files from approximately 86 MB to 12 MB; originals retained.
- Source text blocks and titles/descriptions/canonicals match generated pages in automated checks. Local assets, internal routes, H1 count, noindex and redirect outputs passed. See `migration/verification.json`.
- Native FAQ disclosures, navigation, source service pages, article/archive routes, telephone/email links and the existing Calendly scheduling link are implemented. No booking was submitted.
- Sanity: 13 schema types compile; 209 structured documents prepared locally. Build-time page and business/navigation readers are implemented but not connected to an account.
- Contact-form delivery, dynamic review widgets, analytics/conversions, CMS asset upload, draft/visual preview, and publishing remain unconnected or unverified.
- Existing JSON-LD is preserved for review. Complete automated generation from structured CMS data, site-wide business-text propagation and CMS redirect publication remain to be finished.
- Public sitemap and remote staging are intentionally not enabled. Private hosting access control and eventual production release remain separate work.

### Source issues confirmed

`/best-gold-buyers-los-angeles/` and `/best-gold-jewelry-buyers-los-angeles-2026/` form a 301 redirect loop on the current site. `/3727/` and `/author/` returned 404. `locations.kml` is XML, not an HTML page. See `migration/source-redirect-chains.json` and `migration/crawl-summary.json`.

### Required next inputs

Owner-controlled private Sanity project/dataset and authorized access; WordPress content/media/SEO/redirect export without customer submissions; contact-form delivery and tracking configuration. Cloudflare account access is needed for private hosted staging later, not for this local preview. Representative browser/device testing and full launch acceptance are still outstanding.

The sections below are historical discovery notes. Their environment limitations were resolved by the current implementation above.

## Verified

- Repository: cash4goldandDiamonds/cash4gold-astro, private.
- GitHub ChatGPT Codex Connector installed with access to this repository only.
- Source website: https://cash4goldanddiamond.com/
- Homepage was readable in the browser during initial discovery.
- Source homepage title: Los Angeles Gold & Diamond Sales for Top Dollar.
- Source H1: Gold Buyer Los Angeles | Cash 4 Gold & Diamonds.
- Displayed phone: 310-663-1340.
- Displayed address: 617 S. Hill Street, Los Angeles, CA 90014.
- Requirements recovered from Platform recommendation research.
- Owner requires review and explicit approval before launch.

## Initial URL seeds — not a complete inventory

The following links were visible on the homepage. Their status, redirects, content and metadata have NOT yet been audited.

| Source path | Target path | Status |
| --- | --- | --- |
| / | / | Homepage observed; not migrated |
| /about-us-sell-gold-and-diamonds-online/ | Preserve pending crawl | Not migrated |
| /start-selling-gold-and-diamonds/ | Preserve pending crawl | Not migrated |
| /reviews/ | Preserve pending crawl | Not migrated |
| /faqs/ | Preserve pending crawl | Not migrated |
| /contact-us/ | Preserve pending crawl | Not migrated |
| /sell-your-diamond/ | Preserve pending crawl | Not migrated |
| /sell-luxury-watches-in-los-angeles/ | Preserve pending crawl | Not migrated |
| /sell-your-golds/ | Preserve pending crawl | Not migrated |
| /sell-gemstones-for-cash-in-los-angeles/ | Preserve pending crawl | Not migrated |
| /about/ | Verify existing redirect behavior | Not audited |
| /faq/ | Verify existing redirect behavior | Not audited |
| /start-selling/ | Verify existing redirect behavior | Not audited |
| /privacy-policy/ | Preserve pending crawl | Not migrated |

Navigation and footer use different About, FAQ, and Start Selling URLs. Record actual HTTP redirect chains before deciding which URLs to retain or redirect. Do not assume these are broken.

## Required access and inputs

1. WordPress read/export access or a complete export including pages, posts, media, Rank Math metadata, redirects and relevant configuration. Do not export customer form submissions into this repository.
2. Sanity owner account/project and staging dataset. Not yet connected.
3. Cloudflare owner account and staging deployment access. Not yet connected.
4. Existing form and appointment provider configuration.
5. GA4/GTM, conversion events, Search Console verification and relevant advertising configuration.
6. A full private backup and restoration method before any production change.

## Environment limitations observed

- Bundled Git failed to clone because its HTTPS helper is missing.
- Command-based source retrieval failed; network escalation was rejected by the session approval policy.
- GitHub connector installation is verified, but this task does not currently expose callable GitHub repository tools.
- No dependency install, Astro build, content import, preview deployment or full crawl has succeeded.

## Next sequence

1. Obtain a complete source inventory and preserve originals.
2. Record per-URL metadata, text, schema, links, image references and redirect chains.
3. Confirm source totals against WordPress exports and sitemaps.
4. Scaffold and test Astro/Sanity in a build-capable environment.
5. Import content into private staging, tracking every source item.
6. Implement SEO, redirects, schema, forms, appointments and tracking.
7. Run the acceptance checklist and provide evidence to the owner.
8. Request explicit production launch approval only after staging is complete.

No claim of migration completeness or production readiness has been made.

