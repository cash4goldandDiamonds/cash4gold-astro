# GitHub preservation and pre-launch status — September 10, 2026

**NOT READY TO GO LIVE.** The reviewed rebuild is preserved in the existing private repository. Protected Cloudflare deployment and hosted acceptance remain incomplete. DNS, nameservers, GoDaddy settings and the existing live WordPress site were not changed.

## Repository and recovery

- Existing repository: https://github.com/cash4goldandDiamonds/cash4gold-astro
- Reviewed implementation branch: `audit/pre-deployment-2026-09-10`.
- Verified implementation commit: `fae585056c7d1494a27a22b0ff114c7cdb09467a`, including the real Sanity Studio schema correction. Subsequent acceptance-record commits preserve this implementation.
- Remote safety branch: `safety/before-consolidation-2026-09-10`, preserving original `main` at `ed8571bd28de71525eec46b14f56956934e26410`.
- Local historical audit: `archive/local-audit-before-sanitized-sync-2026-09-10` at `2fead36f824817d173cfc02610df4e16151f2687`. This older local history was not pushed over the sanitized GitHub source.
- Draft review: https://github.com/cash4goldandDiamonds/cash4gold-astro/pull/1. It is not merged. Both original local copies and useful local-only media remain preserved.

The September 10 inspection in `reports/INSPECTION_2026-09-10.md` remains the authoritative starting point. README, migration status and checkpoint documentation now describe the newer audit, with historical planning/configuration files retained.

## Validation and security

The implementation, including the latest Studio publication safeguard, passed all 33 automated tests and all 12 local verification stages, including strict schema validation, source-security checks, Astro checking, a fresh optimized build, built-site verification, CMS projection, editorial/substantive checks, route/source checks, design checks and dependency audit. The high/critical dependency threshold passed; one moderate advisory and eight documented source-text warnings remain. A passing test suite is not completion of business integration or launch acceptance.

GitHub Actions run https://github.com/cash4goldandDiamonds/cash4gold-astro/actions/runs/34542085479 independently performed a fresh checkout/install and passed its complete test/build/check sequence for exact commit `fae585056c7d1494a27a22b0ff114c7cdb09467a`. An earlier independent 994-file GitHub download was verified against Git object hashes and built successfully. The final acceptance-record revision must retain a passing fresh-checkout run.

Gitleaks scans found no secrets in the reviewed source, schema change or actual CMS-generated output. Actual environment files, credentials, session files, caches, dependencies, temporary builds, backups and unnecessary raw media are excluded. Required current website media, source, Astro/Sanity configuration, tests/scripts, redirects, SEO/schema work, Cloudflare configuration and GitHub workflows are preserved. Only blank environment examples are committed. Captured account-verification metadata was removed from the shared source; approved verification values must be configured securely before a future launch.

## Staging

**Staging URL: none — no protected website deployment was completed.** No guessed `workers.dev` address is presented as an available site.

Zero Trust Free is active and the limited Wrangler connection was authorized. Wrangler could not upload because its build resolver encounters a Windows parent-directory access restriction. The dashboard folder upload did not load the files; Deploy remained disabled. No staging Worker was deployed through either attempt.

The earlier account-wide Access proposal was rejected and remains unapplied. The separate GitHub inspection block was resolved by explicit owner approval. GitHub verification succeeded, and the existing Cloudflare app installation is now saved with only the existing private website repository selected. The existing GitHub integration is restricted to `cash4goldandDiamonds/cash4gold-astro`. The owner-approved `cash4gold-staging-deploy-limited` credential is registered securely in Cloudflare Builds, with no raw token file saved locally. Its three account permissions are Workers Scripts Edit, Workers Builds Configuration Edit and Account Settings Read. Worker editing technically covers the selected account; the approved operational scope is only `cash4gold-private-preview`. The owner also approved that staging scope after this boundary was explained. Workers, Builds and Zero Trust Free plans are verified. Complete this documentation follow-up and its fresh GitHub CI before deployment; keep endpoints disabled until the exact audit branch and Worker-specific All traffic Access are verified. No staging URL is enabled. The default broadly scoped build credential has not been created.

## QA coverage and remaining gates

| Area | Verified result | Remaining launch gate |
|---|---|---|
| Homepage, major services and articles | 198 content pages, 111 articles and 214 generated HTML routes pass the configured static checks. All 214 HTML routes also returned expected statuses from an isolated local HTTP audit of the CMS build. | Protected hosted visual/interactive acceptance across desktop and mobile. Local HTTP emulation does not prove Cloudflare behavior. |
| Navigation and accessibility | Navigation implementation and existing regression suite are retained. | Actual hosted keyboard, focus, screen-reader, contrast, mobile-menu and image-loading checks. An isolated Edge connection timed out before automated browser checks; no accessibility pass is claimed. |
| Inquiry forms | Comparison found a Contact Form 7 surface on live WordPress and zero forms in the rebuilt output. | Implement an approved recipient/backend, validation, spam protection and retries; prove synthetic inquiry delivery and failures. |
| Appointments | Existing appointment/contact links and source scheduling references are preserved. | Prove a safe booking flow, confirmed booking and truthful confirmations; link presence is not completion. |
| Redirects, links, canonical tags, robots, sitemap and schema | Fifteen redirects are retained. Source/build validators pass. Preview output has noindex, disallow-all robots and private/no-store headers; SEO/schema and sitemap policy checks pass. | Verify actual protected Cloudflare responses, all routes/assets/internal links, canonical behavior, redirect chains, sitemap and 404 status; complete private SEO reconciliation. |
| CMS/editor | 430 prepared records imported into the private `migration-staging` dataset. All 430 remain unchanged after actual API and Studio tests; repeat import plans zero new/conflicting records. Two synthetic, unlinked unpublished drafts remain accounted for. Studio save/publish/unpublish and a rich-text keyboard edit passed, preserving anchors and formatting data. Actual private-CMS local build produced 198 page documents/214 HTML files with no token exposure. | Protected website draft/visual preview, image workflows, role/reviewer enforcement, webhook builds and full dataset/assets restore. Confirm ongoing private-dataset/role entitlement after the observed trial. |
| Analytics and consent | Existing Analytics/GTM access and matching production destinations verified read-only. Source has eight GTM tags; no live tag was changed. | Rebuild has zero tracking-script pages and zero consent controls. Configure a safe staging test destination and approved consent behavior, then prove accept/reject/revocation and event receipt. Legacy contact-response visibility is not a confirmed booking. |
| Performance | Production build and static checks pass. | Hosted Lighthouse/performance and accessibility audits remain unrun. No field Core Web Vitals or lab score is claimed. The Chrome DevTools MCP trace tool is unavailable; the independent local browser attempt also failed to attach. |
| WordPress/migration parity | Fresh public WordPress inventory has 13 published pages and 111 posts, all covered by rebuild routes/redirects. Required current media and article/SEO source assets are preserved. | Authenticated WXR has 223 attachments and identifies the extra record as ID 3103. Its binary/rights, three differing SEO overrides, Rank Math global defaults/redirects and factual/content approval remain unresolved; comprehensive parity cannot yet be certified. |
| Recovery and rollback | Exact historical source-bundle restoration and fresh GitHub source checkout/build verified. | Full WordPress database/uploads restore, Sanity dataset/assets restore and deployed rollback proof. Source recovery alone is not full-site disaster recovery. |

Detailed connected-account evidence and requirement boundaries are in `STAGING_ACCEPTANCE_2026-09-10.md`. The broader migration requirement matrix remains applicable; partial checks do not promote entire requirements to PASS.

Complete protected deployment under the approved scope and the above gates before considering a launch. **Separate explicit owner approval is required before any production launch. Do not change DNS, domain nameservers, GoDaddy settings or production automatically.**

## Subsequent editor navigation reconciliation

The bounded navigation follow-up provides separate editor areas and unapproved creation templates. Actual Studio browsing and private-query verification passed, with all 198 content records accessible and all 430 original imported documents unchanged. Strict schema validation and the additional-source Gitleaks scan also passed. This does not complete hosted preview, role enforcement, image upload or owner acceptance. See `reports/STUDIO_NAVIGATION_FOLLOWUP.md`.


## Latest publication safeguard checkpoint — September 10, 2026

The reviewed Studio navigation is preserved on GitHub at `577f11953037dc7f3098cfad4a0f5a090be4c93e`; fresh GitHub checkout/install/build and checks passed (run `34554005853`). The subsequent minimal Studio publication guard blocks unreviewed page publication while allowing autosave. Private-editor evidence and the complete local **33-test / 12-stage** passing validation are recorded in `reports/STUDIO_REVIEW_GUARD_FOLLOWUP.md` and `reports/STUDIO_REVIEW_GUARD_VALIDATION.json`. CMS-07/CMS-08 and the overall launch remain BLOCKED. Protected staging is not deployed; its credential and staging scope are approved, subject to the documented source, free-plan and protection checks. No production, DNS or domain changes were made.

## Authenticated inspection and staging authorization follow-up

The final implementation before this documentation follow-up is `c4ea1238669f1385e80deb998ae5a09455191dcb`, tree `89bd404ad96b7b1cd181a17e2afc2b3e856ab4b7` (1,046 files). Fresh GitHub Actions run [34557899635](https://github.com/cash4goldandDiamonds/cash4gold-astro/actions/runs/34557899635) verified that exact source, passed all 33 tests and completed the configured production build/checks. Earlier commit/count evidence above is historical. The documentation revision must receive its own exact-head CI verification.

See [authenticated WordPress/GoDaddy findings](WORDPRESS_AUTHENTICATED_INSPECTION_2026-09-10.md) and [approved staging scope](PROTECTED_STAGING_AUTHORIZATION_2026-09-10.md). The content export has no missing numeric public IDs or modified timestamps, but identifies attachment 3103 and three explicit SEO override differences requiring review. Raw exports and private backup data remain outside Git and static output. Full backup/restore and hosted acceptance remain BLOCKED; production launch is not authorized.
