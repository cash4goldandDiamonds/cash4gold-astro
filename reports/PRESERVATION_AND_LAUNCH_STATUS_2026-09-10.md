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

The implementation passed all 31 automated tests and all 12 local verification stages, including strict schema validation, source-security checks, Astro checking, a fresh optimized build, built-site verification, CMS projection, editorial/substantive checks, route/source checks, design checks and dependency audit. The high/critical dependency threshold passed; one moderate advisory and eight documented source-text warnings remain. A passing test suite is not completion of business integration or launch acceptance.

GitHub Actions run https://github.com/cash4goldandDiamonds/cash4gold-astro/actions/runs/34542085479 independently performed a fresh checkout/install and passed its complete test/build/check sequence for exact commit `fae585056c7d1494a27a22b0ff114c7cdb09467a`. An earlier independent 994-file GitHub download was verified against Git object hashes and built successfully. The final acceptance-record revision must retain a passing fresh-checkout run.

Gitleaks scans found no secrets in the reviewed source, schema change or actual CMS-generated output. Actual environment files, credentials, session files, caches, dependencies, temporary builds, backups and unnecessary raw media are excluded. Required current website media, source, Astro/Sanity configuration, tests/scripts, redirects, SEO/schema work, Cloudflare configuration and GitHub workflows are preserved. Only blank environment examples are committed. Captured account-verification metadata was removed from the shared source; approved verification values must be configured securely before a future launch.

## Staging

**Staging URL: none — no protected website deployment was completed.** No guessed `workers.dev` address is presented as an available site.

Zero Trust Free is active and the limited Wrangler connection was authorized. Wrangler could not upload because its build resolver encounters a Windows parent-directory access restriction. The dashboard folder upload did not load the files; Deploy remained disabled. No staging Worker was deployed through either attempt.

The earlier account-wide Access proposal was rejected and remains unapplied. The separate GitHub inspection block was resolved by explicit owner approval. GitHub verification succeeded, and the existing Cloudflare app installation is now saved with only the existing private website repository selected. GitHub verification and the owner-approved restriction to only `cash4goldandDiamonds/cash4gold-astro` are complete. A new confirmation is pending for the prepared `cash4gold-staging-deploy-limited` credential: Workers Scripts Edit, Workers Builds Configuration Edit and Account Settings Read for this Cloudflare account only. No token has been created. Per-Worker All traffic Access for account members is prepared but unsubmitted; no staging URL is enabled. The default broadly scoped build credential has not been created.

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
| WordPress/migration parity | Fresh public WordPress inventory has 13 published pages and 111 posts, all covered by rebuild routes/redirects. Required current media and article/SEO source assets are preserved. | Public media API reports 223 records but returns 222. Full private WordPress/Rank Math export, media rights and factual/content difference approval are still required; comprehensive parity cannot yet be certified. |
| Recovery and rollback | Exact historical source-bundle restoration and fresh GitHub source checkout/build verified. | Full WordPress database/uploads restore, Sanity dataset/assets restore and deployed rollback proof. Source recovery alone is not full-site disaster recovery. |

Detailed connected-account evidence and requirement boundaries are in `STAGING_ACCEPTANCE_2026-09-10.md`. The broader migration requirement matrix remains applicable; partial checks do not promote entire requirements to PASS.

Complete the restricted credential confirmation, protected deployment and the above gates before considering a launch. **Separate explicit owner approval is required before any production launch. Do not change DNS, domain nameservers, GoDaddy settings or production automatically.**

## Subsequent editor navigation reconciliation

The bounded navigation follow-up provides separate editor areas and unapproved creation templates. Actual Studio browsing and private-query verification passed, with all 198 content records accessible and all 430 original imported documents unchanged. Strict schema validation and the additional-source Gitleaks scan also passed. This does not complete hosted preview, role enforcement, image upload or owner acceptance. See `reports/STUDIO_NAVIGATION_FOLLOWUP.md`.
