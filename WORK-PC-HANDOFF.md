> Historical checkpoint, superseded September 10, 2026. Continue from `MIGRATION-STATUS.md` and `reports/INSPECTION_2026-09-10.md`. The current audit has 198 pages, 111 articles, 15 redirects and 431 prepared CMS documents. All 111 article reviews are recorded; do not restart earlier passes. Both local copies remain preserved. Protected staging is authorized; launch requires separate explicit owner approval.

# Continue the same project on the work PC

This is a fresh computer setup of the existing Cash 4 Gold & Diamonds project. **Do not recreate the website or start from the old scaffold.** The transfer snapshot includes the current implementation, content, images, prepared CMS documents, source evidence, and remaining requirements.

## Checkpoint and transfer

- Source repository: https://github.com/cash4goldandDiamonds/cash4gold-astro.git (verified private).
- Original base commit: `ed8571bd28de71525eec46b14f56956934e26410`.
- Intended transfer branch: `transfer/work-pc-2026-09-09`.
- Read the accompanying transfer manifest for the final snapshot commit, ZIP SHA-256, and whether a remote upload succeeded. A local branch or ZIP is not evidence of a successful push.
- Git HTTPS access from the source environment failed to connect to github.com:443. No network restriction was bypassed. A complete local ZIP is the independent transfer route.
- No production release, DNS change, purchase, repository visibility change, or collaborator change is authorized by this handoff.

## Fresh Windows setup

Install Git for Windows, Node.js 24 LTS, and pnpm 11.19.0 from their official distributions. This snapshot was built with Node 24.19, pnpm 11.19, Astro 7.3.2 and Sanity 6.13. Node 24 is the recommended matching runtime; although the package supports Node 22.12+, the design verification uses Node's native TypeScript support.

1. Transfer the complete ZIP to a normal writable folder, then extract it. Open the folder containing `package.json`, `src`, `public`, and this file. Do not open only the old GitHub scaffold.
2. If the manifest confirms a successful push, you may instead clone the private repository and select the exact transfer branch/commit named in the manifest. Authenticate with the owner's GitHub account. Do not make the repository public.
3. Open a PowerShell terminal in that project folder and run:

```powershell
node --version
pnpm --version
pnpm install --frozen-lockfile
if (!(Test-Path .env)) { Copy-Item .env.example .env }
$env:ASTRO_TELEMETRY_DISABLED = '1'
pnpm dev
```

Open http://127.0.0.1:4321/. Leave all Sanity variables blank for the complete local snapshot. No CMS token is required to view this version.

Use a second terminal in the same project folder for validation:

```powershell
$env:ASTRO_TELEMETRY_DISABLED = '1'
pnpm build
pnpm verify
pnpm verify:design
pnpm verify:editorial
pnpm verify:schema
```

Astro 7 may start its dev server in the background. The normal server controls are `pnpm exec astro dev status`, `pnpm exec astro dev logs`, and `pnpm exec astro dev stop`. Keep the preview bound to 127.0.0.1 while it is private. For local production-build testing, run `pnpm preview --host 127.0.0.1 --port 4322` after building; this does not publish the site.

The dependency installation requires normal internet access. If pnpm is not installed, install the pinned version using your normal approved Node tooling (`npm install --global pnpm@11.19.0`). Do not copy another computer's `node_modules` or runtime folders.

## What is complete at this checkpoint

- 196 captured content pages, 14 redirect aliases, and a 404 page: 211 generated outputs.
- All 109 articles received the first metadata, keyword/topic, image, link and technical SEO pass. They contain 218 inspected/local article-image placements.
- 105 preferred articles are discoverable in the blog library. Four near-identical article pairs use preferred canonical URLs while preserving all public paths.
- 267 article listings across 74 archive pages were updated to current titles, descriptions, and images.
- The homepage prioritizes gold buying. The main gold service page is substantially rebuilt.
- Five priority articles were rewritten: scrap gold; 14K/Cuban chains; 14K necklace value; gold/silver coin collections; and preparing a Downtown LA gold-jewelry sale. The later, deeper article-by-article rewrite pass is **queued, not complete**.
- Gold and estate menu imagery has been improved. The watch image is an actual Rolex Daytona photograph. Gallery categories use distinct photos.
- The responsive menu, keyboard controls, optional hover/focus sound, and lightweight Web Audio behavior are retained. Sound is off until enabled by the visitor.
- The owner-confirmed address was corrected in text and location metadata. The final scan of all 196 pages found no conflicting address references.
- Static build, page/redirect checks, 109-article checks, image/link checks, and navigation/sound tests passed. Manual all-page browser review and measured desktop/mobile lab performance have **not** been completed.
- 780 structured Sanity documents were prepared locally. No content import took place.

`migration/` contains detailed verification, image, address, keyword, canonical, link-repair and rewrite records. `migration/source-evidence/` contains the **public website capture**, not customer form submissions or an authenticated private export. `migration/editorial-baseline.json` preserves the pre-editorial content. `migration/design-source/` preserves the selected source artwork and prompts. All required local evidence is included in this transfer; scripts no longer require the original computer's sibling work folder.

Generated user reports are written to `outputs/` inside this checkout. They are ignored by Git. Source and editorial regeneration scripts are maintenance tools, not fresh-install steps. **Do not rerun `optimize-editorial.mjs` after making new content edits without deliberately updating its inputs**: it regenerates from the saved baseline and overrides. Preserve new user edits first.

## Confirmed business facts

- Business: Cash 4 Gold & Diamonds.
- Address: **617 S. Hill Street, Los Angeles, CA 90014**. No suite number was supplied; do not invent one.
- Phone: **310-663-1340**.
- Priority market: Downtown Los Angeles and the Jewelry District.
- Highest-priority buying business: gold, scrap gold, Cuban chains and bracelets with or without diamonds, gold coins, silver coins, and substantial quantities.
- Payments: cash, bank wire, or business check. Large quantities and high-value transactions are welcome. Do not invent precise payouts, unlimited cash availability, guarantees, credentials, awards, or reviews.
- Existing live WordPress site: https://cash4goldanddiamond.com/.

## Sanity account and connection

- Existing project: `gisdw6qa` (Cash 4 gold and diamonds).
- Intended staging dataset: **migration-staging**, private.
- Existing **production** dataset is public. Do not import private staging content into it by mistake.
- The account had a Growth trial during setup. Recheck current plan and dataset support before any paid or public change; this handoff authorizes no purchases.
- Local API/OAuth setup failed with outbound `connect EACCES` before an OAuth URL was issued. There was no successful authentication or content upload from this environment.
- No credentials, saved Sanity authentication, machine-specific workaround, or tokens are transferred.

For the initial local preview, keep `.env` blank as described above. To connect later, use the existing owner account and supported Sanity login on the work PC. Put build-only credentials in untracked `.env` or a secure environment; never commit them. Set both `SANITY_PROJECT_ID=gisdw6qa` and `SANITY_DATASET=migration-staging` together, plus a read-only `SANITY_READ_TOKEN` if needed for the private dataset. Studio uses `SANITY_STUDIO_PROJECT_ID=gisdw6qa` and `SANITY_STUDIO_DATASET=migration-staging` with the signed-in user's permissions.

`pnpm export:cms` regenerates the local `migration/sanity-import.ndjson` file; it does not upload it. Images still need a supported Sanity asset upload and reference reconciliation. Check the exact dataset and import behavior before the first remote import. Draft/visual preview, refresh/webhooks, rich-text parity, redirects from CMS, and publishing still require implementation/acceptance checks.

## Remaining work: preserve this scope

### Substantive content, SEO, AEO and GEO

Read the actual body of **every one of the 109 articles** and record retain/improve/rewrite with a specific reason. Rewrite weak, outdated, misleading, generic or repetitive articles into distinct useful prose. Preserve meaningful topic intent, existing public URLs, verified facts, useful details, and user edits. The current automated field checks are not a substitute for this editorial review.

Review all article titles, meta descriptions, H1s, primary intent, natural primary/secondary topics, social metadata, canonical/indexing rules, and schema against visible content. Distinguish pages that compete for the same intent. Reassess the four canonical pairs if their content is differentiated. Use relevant, optimized images with truthful alt text; contextual internal links; authoritative outbound sources adjacent to the factual claims they support; and clear answers and helpful headings/FAQs where useful. Do not stuff keywords, fabricate SEO scores, or change publication dates merely to appear fresh.

AEO means answer engine optimization; GEO means generative engine optimization. Follow current primary guidance rather than inventing special AI markup or ranking guarantees. Relevant Google references:

- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/crawling-indexing/special-tags
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/appearance/snippet

### Rank Math, Content AI and local ranking measurement

The user confirmed **Rank Math and Content AI** on the WordPress site. Preserve/improve actual exported metadata, focus keywords, schema, canonical/robots/social settings, sitemaps and redirects. Captured public outputs are available; private plugin settings, proprietary scores, original focus-keyword fields and Content AI recommendations have not been recovered from an authorized dashboard/export.

Rank Math's WordPress interface and Content AI ratings do not automatically run in Astro/Sanity. Preserve the agreed architecture and implement supported equivalent controls. Sanity already has editable SEO/topic fields and an editorial completeness checklist; this is not a Rank Math rating or Google score. If original Content AI access becomes available, inspect existing usage before using it and do not buy credits or upgrade.

Official references to review: https://rankmath.com/kb/import-export-settings/ , https://rankmath.com/kb/editing-seo-meta-at-scale/ , https://rankmath.com/kb/headless-cms-support/ , https://rankmath.com/kb/content-ai-setup/ , https://rankmath.com/kb/content-ai-seo-meta-tool/ . A WordPress-dependent headless API is not a replacement for migrating metadata. Verify the documented MCP capability before proposing an integration: https://rankmath.com/blog/rank-math-mcp/ .

The user also requested **Google Maps/local-ranking tracking**. The exact existing tracker/provider, authorized account, geographic grid and keyword baseline remain unverified. Keep Maps/local-pack visibility and organic article rankings separate. Use actual dated results, not invented baseline rankings. No recurring scans, paid subscriptions or new automation have been authorized.

### Sitewide speed, responsiveness and validation

Validate every content page, article, service, category/subcategory, archive, pagination route, alias and 404 behavior. Keep a per-URL record of checks and findings. Check images, dimensions, fragments, outbound destinations, heading/metadata consistency, business identity, schema, canonical/indexability/sitemap consistency and final Sanity parity.

The user explicitly authorized browser validation. Review desktop, narrow and wider phones, and tablets; check every page for rendering/image/overflow issues where tooling permits, plus focused shared-menu, keyboard, touch and conversion tests. Distinguish automated all-URL coverage from manually inspected pages.

Use the web-perf skill and supported tools to establish **production-build local** mobile/desktop measurements, fix bottlenecks, and remeasure under comparable settings. Preserve useful content, menu/sound features and accessibility. Verify image prioritization, offscreen loading, layout stability, minimal scripts/CSS/fonts, and planned host caching/compression. Do not call local lab timing production real-user Core Web Vitals. Keep a measured-URL list; production CDN/TTFB and real-user checks remain post-release work.

### Google indexing after separately authorized launch

The user explicitly requested indexing for every eligible page/article. The revised site is currently private/local and noindexed. **Do not submit unchanged production URLs and claim Google inspected these local changes. Do not publish merely to request indexing.**

Prepare a complete sitemap of canonical, intentionally indexable, HTTP-200 production URLs, with truthful last-modified dates. Exclude redirects, errors, duplicate aliases, private/staging and noindexed utility URLs. Maintain a per-URL record of sitemap coverage, explicit indexing request, actual index status if available, and pending blockers.

After a separately authorized release and verified Search Console access, submit the production sitemap for bulk discovery and make appropriate individual Request indexing submissions within Google's supported quotas. Record submitted/requested/indexed separately. No restricted JobPosting/BroadcastEvent indexing API, quota workarounds, or indexing/ranking guarantees.

References: https://support.google.com/webmasters/answer/9012289?hl=en and https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap .

### Remaining migration connections

Reconcile the public capture against an owner WordPress export without customer submissions. Finish actual contact delivery, appointment acceptance, review integrations, analytics/conversions/consent, CMS media/import/draft preview, private staging access controls, production routing/sitemap/header behavior, backup and rollback. Existing telephone/email/Calendly paths are retained; an unconnected form must not pretend to send successfully.

## Resume instruction for the work PC

Open this exact extracted/cloned project in Codex. Read `WORK-PC-HANDOFF.md`, `MIGRATION-REQUIREMENTS.md`, `LAUNCH-CHECKLIST.md`, the current article data and `migration/` evidence. Validate the snapshot, then continue the queued substantive all-article review and sitewide performance/validation work. Ask only for genuinely missing access or facts. Keep all code/progress; do not initialize a new website. No live release, DNS changes, purchases or repository push for ordinary follow-on work without applicable authorization.
