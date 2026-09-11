# Project state

September 10, 2026. **NOT READY TO GO LIVE.**

Start with [the authoritative inspection](reports/INSPECTION_2026-09-10.md) and [current migration status](MIGRATION-STATUS.md). The latest source has 198 pages, 111 articles, 107 guide cards, 15 redirects and 430 prepared CMS documents. The complete selected source passed 33 tests, all 12 verification stages and a fresh 214-route optimized build. Private Sanity import and a connected local build are verified. Hosted acceptance remains unfinished.

Both local checkouts and original media remain preserved. The complete reviewed implementation, including the Studio correction, is preserved in the existing private `cash4goldandDiamonds/cash4gold-astro` repository at `fae585056c7d1494a27a22b0ff114c7cdb09467a`. Fresh GitHub checkout checks passed for this revision; an independent source download/build also verified the earlier consolidation checkpoint. `main` remains unchanged, with `safety/before-consolidation-2026-09-10` preserving it. The earlier local audit history is retained on `archive/local-audit-before-sanitized-sync-2026-09-10`.

Protected Cloudflare staging is authorized next, using the verified GitHub source. Keep authentication and noindex protections. Preserve the live WordPress site and do not change DNS, nameservers, GoDaddy settings or production. **Separate explicit owner approval is required for launch.**

See [REPOSITORY_SYNC.md](REPOSITORY_SYNC.md), [PRE_DEPLOYMENT_AUDIT.md](PRE_DEPLOYMENT_AUDIT.md) and [CODEX_HANDOFF.md](CODEX_HANDOFF.md) for implementation evidence and remaining blockers. See [current acceptance progress](reports/STAGING_ACCEPTANCE_PROGRESS.md); earlier empty Sanity observations are superseded.

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
