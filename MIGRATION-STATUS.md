# Migration status

Updated September 10, 2026. **NOT READY TO GO LIVE.**

## Starting point and preserved work

The [September 10 inspection](reports/INSPECTION_2026-09-10.md) is the authoritative starting point. It found five planning/configuration files on private GitHub main at `ed8571bd28de71525eec46b14f56956934e26410`, plus two local implementations. The original files and requirements remain preserved; older status documents are archived in `migration/pre-deployment/prior-instructions/`.

The latest implementation is in `C:/Users/judit/Documents/Codex/2026-09-09/realtime-voice-chat/cash4gold-audit`, branch `audit/pre-deployment-2026-09-10`. The earlier copy at `C:/Users/judit/Documents/Codex/2026-09-09/cash-for-gold/cash4gold-astro` remains intact. Earlier 196-page/109-article and work-PC transfer counts are historical.

## Verified implementation

- 198 content pages, 111 articles, 107 distinct guide-card images, 15 redirects and 214 generated routes including 404.
- All 111 substantive article reviews recorded, including the two recovered articles; no pending automated review entries.
- 430 prepared Sanity documents; projection checks cover 111 articles, 222 images and 2,688 anchors. The private migration-staging import is now verified. The earlier count of 431 was a documentation error: the committed NDJSON contains 430 records. Two unlinked synthetic unpublished acceptance drafts are separate test data.
- Astro 7.3.2, Sanity 6.13.0, React 19.2.8 and the existing Cloudflare/worker architecture preserved.
- Source, scripts, tests, current images, schema/SEO, redirects, configuration examples, migration evidence and GitHub quality workflow retained.
- Full selected source installation and 12 verification stages passed. All 31 unit tests passed. The fresh optimized build and hosting finalization generated 214 routes.
- Secret scans of source, staged changes and generated output found no remaining secrets. Copied account-verification values were removed from tracked metadata; ignored local originals and empty build settings are preserved.
- No high or critical dependency findings; one moderate finding remains. Eight documented source-text warnings remain for reviewed differences.

Full evidence: [REPOSITORY_SYNC_VALIDATION.json](reports/REPOSITORY_SYNC_VALIDATION.json). About 405 MB of unneeded raw originals, duplicate captures and historical media are excluded from Git and retained locally. Required current media stays in the implementation. See [LOCAL_ONLY_FILES.json](reports/LOCAL_ONLY_FILES.json).

## Consolidation and staging sequence

The complete reviewed implementation is preserved in the existing private GitHub repository at commit `fbd7291c5c48c94660cf0349c167e6f847d66199`, on `audit/pre-deployment-2026-09-10`. The original main commit remains on `main` and `safety/before-consolidation-2026-09-10`. GitHub Actions passed a fresh checkout and build; all 994 files downloaded independently from that commit matched their Git blob hashes and passed all 12 local validation stages. Follow-up Studio corrections and current evidence remain on the same audit branch. See [the consolidation record](reports/GITHUB_CONSOLIDATION_2026-09-10.json).

Protected Cloudflare staging is now explicitly authorized. Use the saved GitHub source, authenticated access and noindex protections. Do not attach the live domain. Zero Trust Free is active. The private Sanity import and a connected preview build are verified; the editor exposed a schema declaration error that is corrected and covered by two regression tests. Cloudflare staging deployment and hosted acceptance remain unfinished. See [current acceptance progress](reports/STAGING_ACCEPTANCE_PROGRESS.md).

## Remaining acceptance work

1. Protected hosted staging and real HTTP behavior: all content/article routes, redirects, canonicals, robots, sitemap policy, schema, assets, internal links, 404s, mobile navigation and headers.
2. Genuine inquiry delivery and appointment journeys using approved test data and recipients; no customer leads as tests.
3. Existing Sanity project `gisdw6qa`, private `migration-staging`: scoped access, import, assets, roles, editing, publishing and protected draft preview. Do not replace or expose the production dataset.
4. Analytics/consent, correct properties and conversion IDs, review integrations and privacy disclosures matching the enabled services.
5. Measured mobile/desktop performance, accessibility and interaction checks. Local static checks do not establish field Core Web Vitals.
6. Complete WordPress/Rank Math/media/redirect export reconciliation, the 222-fetched/223-reported media discrepancy, private backup and isolated restoration evidence, and owner content/business/media approval.
7. Social authorization and real workflow tests remain separate unfinished work; keep schedules paused.

**Stop before DNS, nameserver, GoDaddy or production changes. A separate explicit owner launch approval is required after staging review.**

## Final preservation and acceptance checkpoint

The verified implementation, including the Studio correction, is saved at `fae585056c7d1494a27a22b0ff114c7cdb09467a`; its fresh GitHub Actions checkout passed all configured tests and build checks (run 34542085479). Connected acceptance evidence is now retained in [STAGING_ACCEPTANCE_2026-09-10.md](STAGING_ACCEPTANCE_2026-09-10.md). See [the consolidated launch-status report](reports/PRESERVATION_AND_LAUNCH_STATUS_2026-09-10.md) for full coverage, preservation and remaining gates.

**NOT READY TO GO LIVE. No protected Cloudflare website is deployed and no staging URL is available.** Staging permission review remains pending. The rebuild has no inquiry form or analytics/consent integration; actual booking, hosted draft-preview, accessibility/performance, private SEO/media reconciliation and full-site restore gates remain open. Both original local copies, original remote main and the live WordPress site are preserved. No DNS/nameserver/GoDaddy/production change is authorized without separate explicit launch approval.
