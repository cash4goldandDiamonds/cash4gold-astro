# Migration status

## Current status — September 11, 2026

**NOT READY TO GO LIVE.** Protected GitHub-backed staging now exists at https://cash4gold-private-preview.cash4goldanddiamond.workers.dev/. The current source preserves 198 content pages and 111 articles, with 18 redirects and 217 generated routes. All 33 automated tests and the complete local verification/build passed after the three Rank Math redirect fixes. All 198 content routes rendered behind account-only Cloudflare Access. [Current staging QA and launch blockers](reports/PROTECTED_STAGING_QA_2026-09-11.md) supersede earlier statements below that no staging site exists, that only 15 redirects exist, or that authorization is pending. Earlier commit IDs/counts are historical evidence. The audit branch's final uploaded source requires its own exact-head CI/deployment verification, recorded in the final handoff.

Both original local copies and original GitHub main/safety branches are preserved. No production, DNS, nameserver, GoDaddy or paid-service changes were made. Launch requires separate explicit owner approval.

## Earlier checkpoints and supporting evidence

Updated September 10, 2026. **NOT READY TO GO LIVE.**

## Starting point and preserved work

The [September 10 inspection](reports/INSPECTION_2026-09-10.md) is the authoritative starting point. It found five planning/configuration files on private GitHub main at `ed8571bd28de71525eec46b14f56956934e26410`, plus two local implementations. The original files and requirements remain preserved; older status documents are archived in `migration/pre-deployment/prior-instructions/`.

The latest implementation is in `C:/Users/judit/Documents/Codex/2026-09-09/realtime-voice-chat/cash4gold-audit`, local branch `checkpoint/final-source-2026-09-10` at `9e613f4a51c9b5da7e2bcbc042dc3d2609fe6d52`, with the same complete source tree as GitHub audit commit `c4ea1238669f1385e80deb998ae5a09455191dcb`. A separate local documentation checkpoint preserves subsequent inspection records. The earlier copy at `C:/Users/judit/Documents/Codex/2026-09-09/cash-for-gold/cash4gold-astro` remains intact. Earlier 196-page/109-article and work-PC transfer counts are historical.

## Verified implementation

- 198 content pages, 111 articles, 107 distinct guide-card images, 15 redirects and 214 generated routes including 404.
- All 111 substantive article reviews recorded, including the two recovered articles; no pending automated review entries.
- 430 prepared Sanity documents; projection checks cover 111 articles, 222 images and 2,688 anchors. The private migration-staging import is now verified. The earlier count of 431 was a documentation error: the committed NDJSON contains 430 records. Two unlinked synthetic unpublished acceptance drafts are separate test data.
- Astro 7.3.2, Sanity 6.13.0, React 19.2.8 and the existing Cloudflare/worker architecture preserved.
- Source, scripts, tests, current images, schema/SEO, redirects, configuration examples, migration evidence and GitHub quality workflow retained.
- Full selected source installation and 12 verification stages passed. All 33 unit tests passed. The fresh optimized build and hosting finalization generated 214 routes.
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
6. Complete WordPress/Rank Math/media/redirect export reconciliation, binary preservation and rights for the newly identified attachment 3103, three differing explicit SEO overrides and plugin global defaults, private backup and isolated restoration evidence, and owner content/business/media approval.
7. Social authorization and real workflow tests remain separate unfinished work; keep schedules paused.

**Stop before DNS, nameserver, GoDaddy or production changes. A separate explicit owner launch approval is required after staging review.**

## Final preservation and acceptance checkpoint

The verified implementation, including the Studio correction, is saved at `fae585056c7d1494a27a22b0ff114c7cdb09467a`; its fresh GitHub Actions checkout passed all configured tests and build checks (run 34542085479). Connected acceptance evidence is now retained in [STAGING_ACCEPTANCE_2026-09-10.md](STAGING_ACCEPTANCE_2026-09-10.md). See [the consolidated launch-status report](reports/PRESERVATION_AND_LAUNCH_STATUS_2026-09-10.md) for full coverage, preservation and remaining gates.

**NOT READY TO GO LIVE. No protected Cloudflare website is deployed and no staging URL is available.** The existing GitHub integration is restricted to `cash4goldandDiamonds/cash4gold-astro`. The owner-approved `cash4gold-staging-deploy-limited` credential is registered securely in Cloudflare Builds, with no raw token file saved locally. Its three account permissions are Workers Scripts Edit, Workers Builds Configuration Edit and Account Settings Read. Worker editing technically covers the selected account; the approved operational scope is only `cash4gold-private-preview`. The owner also approved that staging scope after this boundary was explained. Workers, Builds and Zero Trust Free plans are verified. Complete this documentation follow-up and its fresh GitHub CI before deployment; keep endpoints disabled until the exact audit branch and Worker-specific All traffic Access are verified. No staging URL is enabled. The rebuild has no inquiry form or analytics/consent integration; actual booking, hosted draft-preview, accessibility/performance, private SEO/media reconciliation and full-site restore gates remain open. Both original local copies, original remote main and the live WordPress site are preserved. No DNS/nameserver/GoDaddy/production change is authorized without separate explicit launch approval.

## Studio navigation follow-up

The categorized editor navigation and draft-only creation templates are reconciled into this branch. Actual browser navigation and private CMS queries pass; all 198 page records remain discoverable and all 430 original migrated documents remain unchanged. See [the bounded acceptance evidence](reports/STUDIO_NAVIGATION_FOLLOWUP.md). Full hosted CMS acceptance remains incomplete.


## Latest publication safeguard checkpoint — September 10, 2026

The reviewed Studio navigation is preserved on GitHub at `577f11953037dc7f3098cfad4a0f5a090be4c93e`; fresh GitHub checkout/install/build and checks passed (run `34554005853`). The subsequent minimal Studio publication guard blocks unreviewed page publication while allowing autosave. Private-editor evidence and the complete local **33-test / 12-stage** passing validation are recorded in `reports/STUDIO_REVIEW_GUARD_FOLLOWUP.md` and `reports/STUDIO_REVIEW_GUARD_VALIDATION.json`. CMS-07/CMS-08 and the overall launch remain BLOCKED. Protected staging is not deployed; its credential and staging scope are approved, subject to the documented source, free-plan and protection checks. No production, DNS or domain changes were made.

## Authenticated inspection and staging authorization follow-up

The final implementation before this documentation follow-up is `c4ea1238669f1385e80deb998ae5a09455191dcb`, tree `89bd404ad96b7b1cd181a17e2afc2b3e856ab4b7` (1,046 files). Fresh GitHub Actions run [34557899635](https://github.com/cash4goldandDiamonds/cash4gold-astro/actions/runs/34557899635) verified that exact source, passed all 33 tests and completed the configured production build/checks. Earlier commit/count evidence above is historical. The documentation revision must receive its own exact-head CI verification.

See [authenticated WordPress/GoDaddy findings](reports/WORDPRESS_AUTHENTICATED_INSPECTION_2026-09-10.md) and [approved staging scope](reports/PROTECTED_STAGING_AUTHORIZATION_2026-09-10.md). The content export has no missing numeric public IDs or modified timestamps, but identifies attachment 3103 and three explicit SEO override differences requiring review. Raw exports and private backup data remain outside Git and static output. Full backup/restore and hosted acceptance remain BLOCKED; production launch is not authorized.
