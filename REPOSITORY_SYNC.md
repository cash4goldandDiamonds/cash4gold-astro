# Repository synchronization checkpoint

September 10, 2026. Preserve the existing Astro/Sanity rebuild in the private `cash4goldandDiamonds/cash4gold-astro` repository, on the existing `audit/pre-deployment-2026-09-10` branch. This checkpoint covers source consolidation. The latest owner instruction authorizes protected Cloudflare website staging and private staging CMS acceptance next. Production deployment, DNS/nameserver/GoDaddy changes, live WordPress edits and social publishing are not included. A separate explicit launch approval is required.

## Source and preservation

The original home checkout remains at `C:/Users/judit/Documents/Codex/2026-09-09/cash-for-gold/cash4gold-astro`. The latest audit checkout remains at `C:/Users/judit/Documents/Codex/2026-09-09/realtime-voice-chat/cash4gold-audit`.

The synchronized source includes the Astro frontend, reviewed content, current media, Sanity schemas and prepared content, worker source, scripts, tests, lockfile, non-secret configuration examples, migration baselines and project records. Current totals are 198 content pages, 111 articles, 107 guide cards, 15 redirects, and 430 prepared CMS documents. The build generates 214 routes including the 404 page.

`reports/LOCAL_ONLY_FILES.json` inventories approximately 405 MB of original artwork, duplicate HTML captures, and historical media excluded from Git. Those files remain locally. The current source, prepared CMS content and built output were used to identify 747 unreferenced historical public-media files; they are preserved locally and excluded from this Git snapshot. Generated output, installed dependencies, caches, archives and local credential files are also ignored.

Normal installation, building and verification use the committed files. Historical image regeneration and raw-capture investigation may require the preserved local originals. Public captures are migration evidence, not private WordPress/Rank Math exports or customer data.

## Validation and secret review

The reviewed source passed all 12 local check stages: unit tests, strict Sanity schema validation, source-security checks, Astro type checks, build/finalization, built-site validation, CMS projection, editorial checks, substantive-review checks, source/route checks, design/sound checks, and dependency audit at the high severity threshold. The Studio correction increased the suite from 29 to 31 tests. A separate copy of the selected Git files is used for installation and package verification. Final results are recorded in `reports/REPOSITORY_SYNC_VALIDATION.json`.

Secret scanning uses Gitleaks defaults. The only explicit allowance is the public image identifier `antique-diamond-festoon-necklace-v1`, which the generic API-key rule incorrectly identified in image metadata. No rule or file is broadly excluded. Credential examples contain blank secret values; real `.env`, `.dev.vars`, credential stores and private keys are not included.

The dependency audit reports zero high/critical findings and one moderate finding. Source/render comparison retains eight documented editorial warnings; these are not broken-route failures or owner approval of every rewrite.

## Production remains separate

Account-verification values captured from the old website are retained only in ignored local backups. They are removed from Git copies of source metadata. The layout reads `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` from build configuration, with blank examples in Git. Restore the existing owner-approved values in the hosting environment before any future production release. This change does not remove or change verification on the live WordPress site. `pnpm verify:source-security` checks that captured verification values have not returned to repository data.

The phone number and shop address are public business information, verified against https://cash4goldanddiamond.com/ on September 10, 2026, and remain part of the website. They are not customer submissions or private account credentials.

The GitHub quality workflow has no push trigger or deployment/publishing step. Hosting configurations have no production routes, and the social configuration has no active schedule. Preview builds remain non-indexable. The repository backup is not a production release: CMS editor/draft-preview acceptance, genuine inquiry delivery, protected staging, full migration reconciliation, performance/accessibility acceptance and the other blockers in `PRE_DEPLOYMENT_AUDIT.md` remain unfinished.

## Final preservation and acceptance checkpoint

The verified implementation, including the Studio correction, is saved at `fae585056c7d1494a27a22b0ff114c7cdb09467a`; its fresh GitHub Actions checkout passed all configured tests and build checks (run 34542085479). Connected acceptance evidence is now retained in [STAGING_ACCEPTANCE_2026-09-10.md](STAGING_ACCEPTANCE_2026-09-10.md). See [the consolidated launch-status report](reports/PRESERVATION_AND_LAUNCH_STATUS_2026-09-10.md) for full coverage, preservation and remaining gates.

**NOT READY TO GO LIVE. No protected Cloudflare website is deployed and no staging URL is available.** GitHub verification and the owner-approved restriction to only `cash4goldandDiamonds/cash4gold-astro` are complete. A new confirmation is pending for the prepared `cash4gold-staging-deploy-limited` credential: Workers Scripts Edit, Workers Builds Configuration Edit and Account Settings Read for this Cloudflare account only. No token has been created. Per-Worker All traffic Access for account members is prepared but unsubmitted; no staging URL is enabled. The rebuild has no inquiry form or analytics/consent integration; actual booking, hosted draft-preview, accessibility/performance, private SEO/media reconciliation and full-site restore gates remain open. Both original local copies, original remote main and the live WordPress site are preserved. No DNS/nameserver/GoDaddy/production change is authorized without separate explicit launch approval.

## Studio navigation follow-up

The categorized editor navigation and draft-only creation templates are reconciled into this branch. Actual browser navigation and private CMS queries pass; all 198 page records remain discoverable and all 430 original migrated documents remain unchanged. See [the bounded acceptance evidence](reports/STUDIO_NAVIGATION_FOLLOWUP.md). Full hosted CMS acceptance remains incomplete.


## Latest publication safeguard checkpoint — September 10, 2026

The reviewed Studio navigation is preserved on GitHub at `577f11953037dc7f3098cfad4a0f5a090be4c93e`; fresh GitHub checkout/install/build and checks passed (run `34554005853`). The subsequent minimal Studio publication guard blocks unreviewed page publication while allowing autosave. Private-editor evidence and the complete local **33-test / 12-stage** passing validation are recorded in `reports/STUDIO_REVIEW_GUARD_FOLLOWUP.md` and `reports/STUDIO_REVIEW_GUARD_VALIDATION.json`. CMS-07/CMS-08 and the overall launch remain BLOCKED. Protected staging is not deployed; its restricted credential confirmation is pending. No production, DNS or domain changes were made.
