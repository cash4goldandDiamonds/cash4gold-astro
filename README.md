# Cash 4 Gold & Diamonds

Existing private WordPress-to-Astro/Sanity rebuild for https://cash4goldanddiamond.com/. Continue this implementation in https://github.com/cash4goldandDiamonds/cash4gold-astro; do not scaffold a replacement.

## Current checkpoint — September 10, 2026

**NOT READY TO GO LIVE.** The September 10 inspection is the authoritative starting point: [inspection report](reports/INSPECTION_2026-09-10.md). Subsequent verified results are in [migration status](MIGRATION-STATUS.md), [synchronization evidence](reports/REPOSITORY_SYNC_VALIDATION.json), and [the pre-deployment audit](PRE_DEPLOYMENT_AUDIT.md).

The latest audit has 198 content pages, 111 articles, 107 distinct guide-card images, 15 redirects and 430 prepared Sanity documents. The build generates 214 routes, including the 404 page. All 111 article reviews are recorded; the two recovered articles are included. The complete source package passed 33 automated tests and all 12 verification stages, including installation from the lockfile and a fresh optimized Astro build. Connected integrations and hosted acceptance remain separate gates.

Both local copies remain preserved. The audit checkout is the current implementation; the earlier home checkout and unneeded original media remain local. See [REPOSITORY_SYNC.md](REPOSITORY_SYNC.md) for preservation and excluded-file records.

## Development and verification

Use Node 24 and pnpm 11.19.0 to match the verified environment. The project uses Astro 7.3.2 and Sanity 6.13.0.

1. Install with `pnpm install --frozen-lockfile`.
2. Use `pnpm dev` for the loopback preview.
3. Run `pnpm test`, `pnpm verify:schema`, and `pnpm exec astro check`.
4. Run `pnpm verify:source-security` and `pnpm build`.
5. Run `pnpm verify`, `pnpm verify:cms`, `pnpm verify:editorial`, `pnpm verify:substantive`, `pnpm verify:design`, and `pnpm audit --audit-level high`.

Blank Sanity settings select the complete local content snapshot. Copy only blank configuration examples when needed; never commit local credentials. See [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md) for the connected CMS workflow.

## Staging and launch authority

The owner's latest instruction authorizes consolidation to this existing private repository and protected Cloudflare staging from the saved source. Staging must require authentication, remain noindex, and use no live domain. DNS, domain nameservers, GoDaddy settings and the live WordPress site must remain unchanged.

**A separate explicit owner approval is required before launch, even if every test passes. No automatic production release is authorized.** Historical conditional launch statements are superseded by this instruction.

Before launch, complete hosted route/SEO/accessibility/performance checks; real inquiry and appointment delivery; remaining CMS roles, image workflows and protected website draft preview; analytics/consent validation; full WordPress/Rank Math/media reconciliation; full-site backup/restore evidence; and owner content/media acceptance. The private CMS import, bounded Studio editing and a connected local build have passed. The quality workflow has no push-triggered deployment.

## Project records

- [MIGRATION-REQUIREMENTS.md](MIGRATION-REQUIREMENTS.md): preserved migration and acceptance requirements.
- [MIGRATION-STATUS.md](MIGRATION-STATUS.md): current evidence and remaining work.
- [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md): release gates and explicit approval.
- [CODEX_HANDOFF.md](CODEX_HANDOFF.md): implementation details and continuation safeguards.
- [Historical checkpoints](migration/pre-deployment/prior-instructions/): earlier documentation preserved for provenance.

Do not commit passwords, API keys, account-verification tokens, local environment files, customer submissions, caches, generated builds or unnecessary raw media. Required site media and implementation assets are retained in the source package.

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
