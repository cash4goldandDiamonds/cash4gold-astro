# September 10 staging acceptance evidence

**NOT READY TO GO LIVE.** This addendum records actual acceptance work on the existing rebuild. It does not authorize production deployment. The latest owner instruction requires separate explicit launch approval; earlier conditional permission does not supersede it.

## Source and scope

The full supplied `CASH4GOLD_MASTER_BUILD_PLAN_v1.md` and matching `.txt` were read; SHA256 `bf273da45397451a0e0e450a1e124821651c92563835e454b156359dd66ed906`. Earlier repository plans, README/task files and audit reports remain in the source register. No access to private ChatGPT conversations was assumed.

These checks ran in the separate `cash4gold-staging-acceptance` checkout, branch `audit/staging-acceptance-2026-09-10`, restored from commit `2fead36f824817d173cfc02610df4e16151f2687`, plus the explicitly recorded schema/checker/test correction. The original checkout and shared audit work were preserved. This historical checkpoint is not the final launch revision. The existing “Inspect existing Cash4 rebuild” task owns consolidation of minimal changes into the sanitized GitHub audit branch and Cloudflare staging. Its final deployed revision must be recorded separately.

No production DNS, nameservers, GoDaddy configuration, live WordPress, production Sanity content, advertising configuration or social schedule was changed. No customer lead, booking, invitation or social promotion was sent. Workspace authentication files and private document backups remain ignored and must never be committed or placed in a static output directory.

## Requirement evidence and limits

| Requirements | Status | Actual evidence and remaining boundary |
|---|---|---|
| SAFE-01/02/04/06 | PASS | Separate checkout, scoped private-dataset assertions, source preservation and no production writes. No purchase or broader account security setting was applied. |
| MIG-06 | BLOCKED | Actual dry run and 430-document private import succeeded with a before/source/after backup. Repeat comparison after editor tests finds 0 new, 430 unchanged, 0 conflicts. Importer preserves conflicting records and fails above its atomic-size limit; general large-batch/resume acceptance is not established. |
| MIG-07 | BLOCKED | All 430 imported server records remain unchanged after acceptance; two additional synthetic drafts are accounted for. This does not resolve the WordPress media discrepancy, full private SEO export or human content approval. |
| CMS-04/05 | BLOCKED | Studio now opens and actual FAQ/rich-text editing works. Saved rich text retained its block identity, section anchor and formatting class. Full global/service editing, all field paths, image editing and owner usability acceptance remain incomplete. |
| CMS-06 | BLOCKED | Actual private CMS-backed local build passed: 198 page records, 214 HTML outputs, noindex and 0 token matches. Hosted visual/click-to-edit draft preview and authorization are not tested. |
| CMS-07 | BLOCKED | Owner account is connected; current project uses Growth Trial and both dataset slots are occupied. Editor/reviewer/automation enforcement is untested. Custom granular roles were shown as an Enterprise capability; no purchase or role invitation was made. |
| CMS-08 | BLOCKED | Real API create/edit/publish/new-draft/unpublish/probe-content recovery passed; real Studio save/publish/unpublish also passed. Actual schema loading failure was fixed and verified. Review enforcement, image replacement and referenced-content deletion protections still require acceptance. |
| FORM-01–06 | BLOCKED | Read-only source comparison found a working contact-form surface on WordPress but zero forms in the 214 rebuilt HTML files. A real backend/recipient, validation, spam and retry behavior, receipt evidence and truthful booking confirmations remain missing or untested. |
| TRACK-01–03 | BLOCKED | Existing GA4 and GTM access verified. Existing stream is receiving traffic; GTM names its matching GA4 destination and Ads. Rebuilt output has no analytics or consent controls. Consent settings show inactive analytics/advertising signals despite a generic Good label. No production test events were injected. |
| SEC-03 | BLOCKED | Exact source-only restore passed for 983 tracked files (103,258,038 bytes), Git object and bundle integrity. Complete WordPress database/uploads restore, full Sanity dataset/assets restore and deployed rollback are not proven. |
| OPS-03, ARCH-04, SEC, PERF/A11Y | BLOCKED | Cloudflare Access was activated and Wrangler connection authorized. Specific staging deployment/protection is still being handled in the existing deployment task. No deployed performance/accessibility or production-like runtime result is claimed here. |
| QA-01/02, M5/M6, LAUNCH-01 | BLOCKED | 31 regression tests and strict 15-type schema validation pass locally; connected browser evidence covers the specific Studio journeys below. These do not replace full integration, migration and deployed acceptance. |

The full 143-row requirement matrix remains authoritative for requirements outside this bounded continuation. A partial success in this table does not promote a whole requirement to PASS.

## Actual commands and results

All paths below are relative to this acceptance checkout. JSON timestamps describe the actual runs; this report's writing time is not a rerun.

| Check / command | Result | Evidence |
|---|---|---|
| `node scripts/import-staging.mjs` with the authorized private session supplied through environment, then `--execute` | PASS: private migration-staging only; 430 created, no remaining/conflicts | `migration/pre-deployment/import-plan.json`, `import-result.json`; ignored `.cache/cms-backups/2026-09-10T22-38-28-769Z` |
| `node scripts/verify-sanity-lifecycle.mjs` | PASS: 10 actual API steps, including draft isolation and probe-content recovery | `migration/pre-deployment/sanity-lifecycle.json` |
| `node scripts/build-private-cms-preview.mjs` | PASS: actual private dataset; 198 page docs, 214 HTML, 815 files, 0 token matches; all preview indexing protections | `migration/pre-deployment/private-cms-build.json` |
| `node scripts/check-schema.mjs` | FIXED AND VERIFIED: all 15 types structurally validate | `studio/schema.js`, `scripts/check-schema.mjs`, `tests/studio-schema.test.mjs` |
| `node --test tests/*.test.mjs` | PASS: 31 tests, 0 failures, 12,017.3852 ms; some provider tests remain mocks | ignored `.cache/studio-regression-tests.log`; prior detailed unit evidence retained |
| Actual Studio save/Publish/Unpublish clicks, followed by API readback | PASS: synthetic FAQ published and then unpublished; no linked site page changed | `migration/pre-deployment/studio-publish.json`, `studio-unpublish.json` |
| Actual Studio rich-text keyboard edit followed by API readback | PASS: text changed, `_key`, `sourceId`, `className` and legacy anchor retained; document remains a draft | `migration/pre-deployment/studio-rich-text.json` |
| `node scripts/verify-sanity-after-studio.mjs` | PASS: all 430 original server documents unchanged; raw total 432; exactly 2 unpublished probes; anonymous query exposes 0 docs; repeated import would create 0 docs | `migration/pre-deployment/sanity-after-studio.json` |
| Fresh empty-directory Git bundle clone with `core.autocrlf=false`, then `node scripts/verify-source-restore.mjs <bundle> 2fead36f824817d173cfc02610df4e16151f2687` | PASS: 983 files exact; 0 differences; object/bundle integrity | `migration/pre-deployment/source-restore-exact-bytes.json` |
| `node scripts/audit-interaction-surface.mjs` | BLOCKED acceptance: actual HTML inspection found 0 forms, 2 pages with booking links, 199 with phone links, 0 tracking-script pages, 0 consent controls | `migration/pre-deployment/interaction-surface.json` |
| Authenticated Analytics/GTM browser inspection and `node scripts/record-analytics-acceptance.mjs` | Account access PASS; replacement integration BLOCKED | `migration/pre-deployment/analytics-account.json`; identifiers in ignored `.cache/account-proofs/` |

The existing GTM workspace had 0 pending changes and 8 tags. Its Google tag points to the same GA4 stream observed in Analytics; the source page contains the same GTM container and Ads identifier. However, the legacy tag named “Book appointment for gmap” fires on visibility of `#wpcf7-f7-p28-o1 > form > div.wpcf7-response-output`, once per page, for all visibility events. This is not evidence of a confirmed appointment or even a successful inquiry; response/error visibility must not be copied as a booking-success event. The separate Calendly listener/conversion also requires an actual safe booking test. No live tag was edited or published. See `migration/pre-deployment/analytics-tag-review.json`.

## Resolved failures retained as evidence

- Studio initially rejected the schema because Portable Text block declarations contained unsupported `fields`. Removing only that invalid declaration made the real Studio load. Imported block metadata was preserved and survived an actual keyboard edit. The checker now validates schema structure instead of relying on compilation alone.
- Initial API checks expected private queries to return HTTP 401/403. Sanity actually returns an empty result for unauthenticated queries to this private dataset. The corrected assertion tests absence of documents. Initial failures are retained in `sanity-lifecycle-initial-client-config.json` and `sanity-lifecycle-initial-http-expectation.json`.
- Initial Astro build could not write telemetry state under the user profile. Disabling telemetry for this build allowed the actual build; the initial failure is retained in `private-cms-build-initial-telemetry.json`.
- Initial Git checkout applied Windows line endings to 338 files. The failed byte comparison was retained. A proposed forced checkout was rejected by automatic approval review; it was not executed. A fresh empty-directory clone with explicit line-ending policy restored all bytes exactly without overwriting existing work.
- A synthetic rich-text `.fill()` did not persist through the editor. The failed check is retained in `studio-rich-text-initial-fill.json`; actual keyboard input and subsequent API readback passed.
- Profile-directory Sanity CLI persistence remained blocked. The official local authentication callback was used with an ignored workspace session. The Studio uses the already authorized localhost origin; an Add CORS dialog was cancelled without saving a change.

## Remaining owner actions and dependent work

1. The existing GitHub integration is restricted to `cash4goldandDiamonds/cash4gold-astro`. The owner-approved `cash4gold-staging-deploy-limited` credential is registered securely in Cloudflare Builds, with no raw token file saved locally. Its three account permissions are Workers Scripts Edit, Workers Builds Configuration Edit and Account Settings Read. Worker editing technically covers the selected account; the approved operational scope is only `cash4gold-private-preview`. The owner also approved that staging scope after this boundary was explained. Workers, Builds and Zero Trust Free plans are verified. Complete this documentation follow-up and its fresh GitHub CI before deployment; keep endpoints disabled until the exact audit branch and Worker-specific All traffic Access are verified. No staging URL is enabled. Complete staging protection before enabling its endpoint. Do not enable account-wide Access or production routing.
2. GoDaddy and WordPress sign-in are confirmed. The authenticated all-content WXR export was downloaded and checked offline; it contains 111 published posts, 13 published pages and 223 attachments. Complete database/files/uploads backup, Rank Math global settings/redirect export and isolated restore remain required. The backup-history screen returned an error twice; a dashboard backup timestamp is not restore proof.
3. The owner has authorized clearly labeled synthetic inquiries to cash4goldanddiamond@gmail.com. Confirm and implement the delivery provider and a safe scheduling test destination; no real booking reservations or invitations are authorized. The operator must implement the missing form, then verify actual delivery, errors, retries and appointment semantics.
4. Confirm consent/privacy wording and approve a separate analytics test destination. The operator must preserve the verified production GA4/GTM/Ads configuration, implement consent and meaningful events, and verify actual event receipts without personal data or production-test contamination.
5. Confirm how private CMS access will remain available after the observed Growth Trial ends and how editor/reviewer/automation permissions will be enforced under the chosen entitlement. No paid upgrade is authorized by this report. Both current dataset slots are used, so a separate private full-restore destination is unresolved. The operator must also finish protected visual preview, image workflow, webhook-triggered builds and role enforcement tests.
6. Approve factual business details, hours/arrival instructions, media rights and the content difference ledger; preserve and review attachment 3103 identified by the authenticated export, reconcile its binary/rights and the three explicit SEO override differences, and complete the final content delta. Existing unapproved content has not become owner-approved merely because it built successfully.
7. After all critical gates pass, provide separate explicit production launch approval. No earlier conditional statement is used as current permission to launch.

Local source restoration is not disaster recovery of the full business website. No Lighthouse score, field Core Web Vitals result, deployed accessibility pass, mail receipt or active social automation is implied by these files.

Technical references used for interpretation: [Sanity dataset behavior](https://www.sanity.io/docs/content-lake/datasets), [Sanity Actions API](https://www.sanity.io/docs/content-lake/dispatch-actions), [Google consent implementation](https://developers.google.com/tag-platform/security/guides/consent), [Cloudflare Worker-specific Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/).

## Consolidation evidence received and independently checked

GitHub commit `fae585056c7d1494a27a22b0ff114c7cdb09467a` on the audit branch includes the minimal Studio fix. GitHub connector inspection of exact-commit workflow runs and run `34542085479` returned success for fresh checkout/install, tests, strict schema validation, source security, Astro typecheck/build, built-site/CMS/editorial/source checks and dependency audit. See `migration/pre-deployment/github-followup-jobs.json`. This verifies configured CI only; Cloudflare staging is still undeployed and no deployed performance/integration result is inferred. The original historical acceptance checkout is not pushed over the consolidated branch.

## Integration into the GitHub preservation branch

This evidence was reconciled into `audit/pre-deployment-2026-09-10` after verified implementation commit `fae585056c7d1494a27a22b0ff114c7cdb09467a`. The four reusable acceptance/restore helpers are retained under `scripts/`. The one-time browser-observation report writer stays in the preserved acceptance checkout; its recorded observations and results are retained here. No historical checkout was pushed over the sanitized source. The authoritative original inspection remains `reports/INSPECTION_2026-09-10.md`.

## Editor navigation follow-up

The reviewed Studio navigation change preserves the original page pane ID and future-schema discovery. Actual browser and private-query checks pass: 37 pages, 111 articles and 50 archives partition all 198 page records; five services and eight categories remain visible. All 430 original migrated documents are unchanged. The templates begin unapproved; actual creation through each template, media uploads, roles and hosted preview remain unproven. See `reports/STUDIO_NAVIGATION_FOLLOWUP.md` and `migration/pre-deployment/studio-navigation*.json`.


## Studio publication safeguard follow-up — September 10, 2026

The accidental-publication bug is fixed and verified in the private Studio: unreviewed page drafts cannot be published through the Studio, while draft autosave remains available. Actual private API readback confirmed the edit, no published counterpart, and unchanged original imported records. The review record requires explicit content/SEO flags, a published-reviewer reference and a valid, non-future date. See `reports/STUDIO_REVIEW_GUARD_FOLLOWUP.md` and its dated evidence.

CMS-07, CMS-08 and overall release acceptance remain BLOCKED. These schema rules do not authorize reviewers, invalidate stale approvals after later edits, or protect direct Content Lake API writes. Hosted preview, media editing and complete release/rollback acceptance remain outstanding. No source content was human-approved or released by this change.

## Authenticated inspection and staging authorization follow-up

The final implementation before this documentation follow-up is `c4ea1238669f1385e80deb998ae5a09455191dcb`, tree `89bd404ad96b7b1cd181a17e2afc2b3e856ab4b7` (1,046 files). Fresh GitHub Actions run [34557899635](https://github.com/cash4goldandDiamonds/cash4gold-astro/actions/runs/34557899635) verified that exact source, passed all 33 tests and completed the configured production build/checks. Earlier commit/count evidence above is historical. The documentation revision must receive its own exact-head CI verification.

See [authenticated WordPress/GoDaddy findings](reports/WORDPRESS_AUTHENTICATED_INSPECTION_2026-09-10.md) and [approved staging scope](reports/PROTECTED_STAGING_AUTHORIZATION_2026-09-10.md). The content export has no missing numeric public IDs or modified timestamps, but identifies attachment 3103 and three explicit SEO override differences requiring review. Raw exports and private backup data remain outside Git and static output. Full backup/restore and hosted acceptance remain BLOCKED; production launch is not authorized.
