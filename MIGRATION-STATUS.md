# Migration status

Updated September 10, 2026. **NOT READY TO GO LIVE.**

## Starting point and preserved work

The [September 10 inspection](reports/INSPECTION_2026-09-10.md) is the authoritative starting point. It found five planning/configuration files on private GitHub main at `ed8571bd28de71525eec46b14f56956934e26410`, plus two local implementations. The original files and requirements remain preserved; older status documents are archived in `migration/pre-deployment/prior-instructions/`.

The latest implementation is in `C:/Users/judit/Documents/Codex/2026-09-09/realtime-voice-chat/cash4gold-audit`, branch `audit/pre-deployment-2026-09-10`. The earlier copy at `C:/Users/judit/Documents/Codex/2026-09-09/cash-for-gold/cash4gold-astro` remains intact. Earlier 196-page/109-article and work-PC transfer counts are historical.

## Verified implementation

- 198 content pages, 111 articles, 107 distinct guide-card images, 15 redirects and 214 generated routes including 404.
- All 111 substantive article reviews recorded, including the two recovered articles; no pending automated review entries.
- 431 prepared Sanity documents; projection checks cover 111 articles, 222 images and 2,688 anchors. Prepared records do not prove a remote import.
- Astro 7.3.2, Sanity 6.13.0, React 19.2.8 and the existing Cloudflare/worker architecture preserved.
- Source, scripts, tests, current images, schema/SEO, redirects, configuration examples, migration evidence and GitHub quality workflow retained.
- Full selected source installation and 12 verification stages passed. All 29 unit tests passed. The fresh optimized build and hosting finalization generated 214 routes.
- Secret scans of source, staged changes and generated output found no remaining secrets. Copied account-verification values were removed from tracked metadata; ignored local originals and empty build settings are preserved.
- No high or critical dependency findings; one moderate finding remains. Eight documented source-text warnings remain for reviewed differences.

Full evidence: [REPOSITORY_SYNC_VALIDATION.json](reports/REPOSITORY_SYNC_VALIDATION.json). About 405 MB of unneeded raw originals, duplicate captures and historical media are excluded from Git and retained locally. Required current media stays in the implementation. See [LOCAL_ONLY_FILES.json](reports/LOCAL_ONLY_FILES.json).

## Consolidation and staging sequence

GitHub consolidation is in progress in the existing private repository. A remote branch or commit must be verified before claiming the push is complete. After the reviewed source is saved, retrieve that exact GitHub revision into a fresh directory and rerun installation, tests and the full build. Record the final commit and that independent result in the final synchronization/QA report.

Protected Cloudflare staging is now explicitly authorized. Use the saved GitHub source, authenticated access and noindex protections. Do not attach the live domain. Prior account observations of no Cloudflare project and an empty private Sanity staging dataset require fresh verification; they are dated observations, not assumed current state.

## Remaining acceptance work

1. Protected hosted staging and real HTTP behavior: all content/article routes, redirects, canonicals, robots, sitemap policy, schema, assets, internal links, 404s, mobile navigation and headers.
2. Genuine inquiry delivery and appointment journeys using approved test data and recipients; no customer leads as tests.
3. Existing Sanity project `gisdw6qa`, private `migration-staging`: scoped access, import, assets, roles, editing, publishing and protected draft preview. Do not replace or expose the production dataset.
4. Analytics/consent, correct properties and conversion IDs, review integrations and privacy disclosures matching the enabled services.
5. Measured mobile/desktop performance, accessibility and interaction checks. Local static checks do not establish field Core Web Vitals.
6. Complete WordPress/Rank Math/media/redirect export reconciliation, the 222-fetched/223-reported media discrepancy, private backup and isolated restoration evidence, and owner content/business/media approval.
7. Social authorization and real workflow tests remain separate unfinished work; keep schedules paused.

**Stop before DNS, nameserver, GoDaddy or production changes. A separate explicit owner launch approval is required after staging review.**
