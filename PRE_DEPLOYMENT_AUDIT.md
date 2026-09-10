> September 10 consolidation update: use `MIGRATION-STATUS.md` for current counts and validation. Protected website staging is authorized. No automatic launch, production/DNS/nameserver/GoDaddy change or social posting is authorized by that staging request. Earlier account observations below remain dated evidence.

# Pre-deployment audit

**NOT READY**

Updated 2026-09-10T20:22:01.102Z. Existing work preserved on audit/pre-deployment-2026-09-10, base ed8571bd28de71525eec46b14f56956934e26410 plus preserved changes on the audit branch. No deployment, DNS change, live WordPress edit, production data deletion or purchase occurred. The latest owner instruction authorizes protected staging and requires separate explicit approval before launch.

## Baseline actually available

The entire supplied CASH4GOLD_MASTER_BUILD_PLAN_v1.md was read. Original .md/.txt hashes match BF273DA45397451A0E0E450A1E124821651C92563835E454B156359DD66ED906. Earlier repository plans, README/task notes and prior audits were inspected and retained. This consolidated master is not proof of access to an earlier private ChatGPT conversation. See SOURCE_REGISTER.md and reports/source-register.json.

Every numbered requirement and material sentence-level criterion is recorded with PASS, FIXED AND VERIFIED, BLOCKED or NOT TESTED in [the requirement matrix](reports/REQUIREMENTS_MATRIX.md). That matrix is part of this audit; implemented portions do not imply connected acceptance passed.

## Verified fixes and implemented work

- Restored two source articles missed by the original capture; now 198 content routes and 111 articles. All 111 public REST posts and 13 public REST pages have a local route or explicit mapping.
- Preserved original content/media evidence and recorded proposed corrections to false addresses, unsupported rankings/credentials and payment guarantees. Original URL paths and publication dates retained.
- Generated private-preview robots/headers and guarded production builds; validated explicit redirects, canonical URLs, sitemap filtering and static output.
- Added responsive CMS image rendering, reference-link handling, non-overwriting staging dry-run/import logic, approval gates and richer SEO/reviewer/social controls. Fifteen content types compile; actual remote lifecycle remains blocked.
- Added exact Instagram/Facebook/Yelp profiles from the live site. Prepared 105 distinct-image social draft promotions, separate network captions, tracked links, three weekly Los Angeles slots, per-article opt-in, pause controls and durable queue/provider code. SQL/mock tests pass; no social posts have been sent.
- Fixed a measured 320px homepage overflow and heading/image metadata issues. All 198 built pages now pass internal link, H1, ALT, image dimension and JSON-LD parsing checks; 107 guide cards have 107 distinct image hashes.
- Added pinned GitHub quality checks and compatible dependency security fixes; no high/critical audit findings remain.

## Release blockers

| Requirement areas | Status | Evidence / exact remaining action |
|---|---|---|
| Full content/Rank Math migration | BLOCKED | Obtain authorized WordPress content/private/custom-type, Rank Math/redirect and media export. Reconcile 222 fetched versus 223 reported media items, source redirect/error cases and every material before/after difference. Public HTML is not a full SEO export. |
| Human content/business/media approval | BLOCKED | Navid or authorized reviewer must check critical service copy, all proposed rewrites, hours/arrival facts and media rights; record actual reviewer/date. Agent review hashes do not certify owner approval. |
| Real Sanity editor and publishing | BLOCKED | Connect scoped credentials, run private migration-staging import, verify roles, editable global/service content, protected visual preview and create/edit/publish/slug-change/unpublish/restore. No real lifecycle test has occurred. |
| Contact forms and booking | BLOCKED | Establish approved delivery provider and test recipient/sandbox. Implement/reconcile source form flow and verify genuine accepted/delivered states, errors, spam and duplicate handling. Calendly availability alone does not prove confirmations. |
| Analytics/local tracker/consent | BLOCKED | Confirm correct properties, conversion IDs and accounts; preserve required verification; test privacy-safe events and consent in actual authorized debug environments. |
| Cloudflare preview/runtime/pipeline | BLOCKED | Observed zero projects/routes and no configured Access staging. Create protected staging within approved entitlements, validate true runtime status/redirect/header/cache behavior and authenticated publishing/rollback. Local Wrangler failed with Access denied. |
| Social auto-publishing | BLOCKED | Finish Meta app/token authorization and owner-owned Cloudflare queue, approve eligible drafts, verify one real authorized promotion and its destination, then activate the schedule. Yelp ordinary blog-post automation is not available through the inspected listing API. |
| Recovery and source backup | BLOCKED | GoDaddy backup generation/download was requested, but a complete downloaded archive and isolated restoration are not verified. Obtain files/database/uploads, protect them, and restore into an isolated environment. Source backups alone are insufficient. |
| Performance/accessibility | BLOCKED / NOT TESTED | Complete representative deployed lab runs, keyboard/screen-reader/contrast/reflow/reduced-motion and genuine form journeys. No Lighthouse, axe or field scores are claimed. |
| Final delta and release identity | BLOCKED | Reconcile WordPress changes since the capture; retain exact release/source snapshot and known rollback. Remote quality workflow and release branch protection still need actual verification. |

## Actual evidence and remaining risks

[Commands and results](reports/TEST_EVIDENCE.md), [content inventory](migration/content-inventory.csv), [media register](migration/media-manifest.csv), [redirect map](migration/redirect-map.csv), [keyword map](migration/keyword-map.csv), [source comparison](migration/pre-deployment/migration-comparison.json), [WordPress reconciliation](migration/pre-deployment/wordpress-reconciliation.json), [social setup](SOCIAL_PUBLISHING.md). Source/render comparison currently has 8 review warnings and 266 exact text blocks differing; these are visible proposed revisions, not proof of loss-free approved migration.

One moderate adm-zip dependency advisory remains without a published compatible fix in the observed registry. Do not process untrusted ZIP archives through that dependency. Full deployed CSP/secret separation, media rights, forms, analytics, CMS and restoration evidence must be completed; local passing tests do not cover those gaps.

## Owner actions

1. The Facebook and Instagram password steps and Instagram tester acceptance are complete. Protected Cloudflare website staging is explicitly authorized by the latest owner instruction; production and social publishing remain unapproved. Scoped tokens, renewal and API acceptance remain implementation work; do not send passwords/tokens in chat.
2. Provide the authorized WordPress/Rank Math/media export and resolve the complete backup download; identify a protected isolated restore destination.
3. Connect least-privilege Sanity and hosting credentials using local ignored secret files or provider secret settings. The operator must then run the integration tests; credentials alone do not satisfy acceptance.
4. Confirm remaining business hours/arrival facts, approved final content/media and the correct analytics/local-tracker properties. Supply an approved test recipient/provider for inquiry and appointment tests.
5. After those dependencies are connected, complete the remaining acceptance runs and final migration delta. Report readiness to the owner and wait for separate explicit launch approval.

Future indexing outcomes, field performance and post-launch monitoring remain NOT TESTED by phase in POST_LAUNCH_CHECKLIST.md. They are not substituted for missing pre-launch safety/integration evidence.

## Requirement status register

Each row links to the full acceptance evidence, limits, subcriteria and remaining action in the companion matrix.

| ID | Requirement | Status |
|---|---|---|
| SAFE-01 | Protect production. | PASS |
| SAFE-02 | Preserve work. | PASS |
| SAFE-03 | Preserve content and URLs. | PASS |
| SAFE-04 | Costs and access. | PASS |
| SAFE-05 | Continue responsibly. | PASS |
| SAFE-06 | Evidence, not assertions. | PASS |
| BIZ-01 | Seller-focused site. | BLOCKED |
| BIZ-02 | Relevant services. | BLOCKED |
| BIZ-03 | Geography. | BLOCKED |
| BIZ-04 | Approved replacement. | BLOCKED |
| BIZ-05 | Success measures. | BLOCKED |
| DISC-01 | Repository assessment. | FIXED AND VERIFIED |
| DISC-02 | Website inventory. | BLOCKED |
| DISC-03 | Baseline evidence. | BLOCKED |
| DISC-04 | Business truth register. | BLOCKED |
| DISC-05 | Feature replacement register. | BLOCKED |
| MIG-01 | Account for everything. | BLOCKED |
| MIG-02 | Migration manifest. | FIXED AND VERIFIED |
| MIG-03 | Semantic preservation. | BLOCKED |
| MIG-04 | Metadata preservation. | BLOCKED |
| MIG-05 | Media preservation. | BLOCKED |
| MIG-06 | Safe, repeatable imports. | BLOCKED |
| MIG-07 | Reconcile results. | BLOCKED |
| MIG-08 | Final delta. | BLOCKED |
| URL-01 | Preserve existing paths. | FIXED AND VERIFIED |
| URL-02 | One mapping register. | BLOCKED |
| URL-03 | Redirect behavior. | BLOCKED |
| URL-04 | Host normalization. | BLOCKED |
| URL-05 | True status codes. | BLOCKED |
| URL-06 | Runtime correctness. | BLOCKED |
| ARCH-01 | Static-first Astro. | PASS |
| ARCH-02 | Cloudflare deployment. | BLOCKED |
| ARCH-03 | Sanity as content source. | BLOCKED |
| ARCH-04 | Environments. | BLOCKED |
| ARCH-05 | Suggested structure. | PASS |
| ARCH-06 | Reliable releases. | BLOCKED |
| PAGE-01 | Content/keyword map. | BLOCKED |
| PAGE-02 | Required commercial coverage. | BLOCKED |
| PAGE-03 | Homepage blueprint. | BLOCKED |
| PAGE-04 | Service-page blueprint. | BLOCKED |
| PAGE-05 | Article blueprint. | BLOCKED |
| PAGE-06 | Other templates. | BLOCKED |
| PAGE-07 | Global components. | BLOCKED |
| EDIT-01 | Diamond page. | FIXED AND VERIFIED |
| EDIT-02 | Luxury watches page. | FIXED AND VERIFIED |
| EDIT-03 | Whole-site quality review. | BLOCKED |
| EDIT-04 | Phone-quote education. | BLOCKED |
| EDIT-05 | Human review. | BLOCKED |
| EDIT-06 | Preservation versus correction. | BLOCKED |
| DES-01 | Design direction. | NOT TESTED |
| DES-02 | Design system. | NOT TESTED |
| DES-03 | Responsive behavior. | NOT TESTED |
| DES-04 | Motion. | NOT TESTED |
| IMG-01 | Required visual coverage. | BLOCKED |
| IMG-02 | Authenticity. | BLOCKED |
| IMG-03 | Asset register. | BLOCKED |
| IMG-04 | Delivery pipeline. | BLOCKED |
| IMG-05 | Completion evidence. | BLOCKED |
| CMS-01 | Core models. | BLOCKED |
| CMS-02 | Common fields. | BLOCKED |
| CMS-03 | Service fields. | BLOCKED |
| CMS-04 | Article fields. | BLOCKED |
| CMS-05 | Editor experience. | BLOCKED |
| CMS-06 | Visual/draft preview. | BLOCKED |
| CMS-07 | Permissions. | BLOCKED |
| CMS-08 | Validation and publishing. | BLOCKED |
| PANEL-01 | Editable SEO controls. | BLOCKED |
| PANEL-02 | Content checks. | BLOCKED |
| PANEL-03 | Whole-site intent checks. | BLOCKED |
| PANEL-04 | Local checks. | BLOCKED |
| PANEL-05 | Answer/AI-search readiness. | BLOCKED |
| PANEL-06 | Honest scoring. | PASS |
| PANEL-07 | External tools. | BLOCKED |
| SEO-01 | Single metadata implementation. | FIXED AND VERIFIED |
| SEO-02 | Indexability policy. | BLOCKED |
| SEO-03 | Canonicals. | FIXED AND VERIFIED |
| SEO-04 | Sitemaps and discovery. | BLOCKED |
| SEO-05 | Structured data graph. | BLOCKED |
| SEO-06 | Schema accuracy. | BLOCKED |
| SEO-07 | Current FAQ treatment. | BLOCKED |
| SEO-08 | Known indexing issues. | BLOCKED |
| SEO-09 | Crawler access. | BLOCKED |
| LOCAL-01 | Real-world consistency. | BLOCKED |
| LOCAL-02 | Useful local content. | BLOCKED |
| LOCAL-03 | Genuine expertise. | BLOCKED |
| LOCAL-04 | Answer visibility. | PASS |
| LOCAL-05 | Measured growth plan. | BLOCKED |
| FORM-01 | Preserve working contact paths. | BLOCKED |
| FORM-02 | Minimum collection. | BLOCKED |
| FORM-03 | Server-side protection. | BLOCKED |
| FORM-04 | Truthful delivery. | BLOCKED |
| FORM-05 | End-to-end evidence. | BLOCKED |
| FORM-06 | Appointment semantics. | BLOCKED |
| TRACK-01 | Analytics continuity. | BLOCKED |
| TRACK-02 | Event meanings. | BLOCKED |
| TRACK-03 | Privacy and testing. | BLOCKED |
| PERF-01 | Field targets. | NOT TESTED |
| PERF-02 | Pre-launch laboratory targets. | BLOCKED |
| PERF-03 | Engineering budgets. | BLOCKED |
| PERF-04 | Test coverage. | BLOCKED |
| PERF-05 | Real conditions. | BLOCKED |
| PERF-06 | Optimization. | BLOCKED |
| OPS-01 | Cache design. | BLOCKED |
| OPS-02 | Publish-to-site pipeline. | BLOCKED |
| OPS-03 | Hosting configuration. | BLOCKED |
| SEC-01 | Credential security. | BLOCKED |
| SEC-02 | Application hardening. | BLOCKED |
| SEC-03 | Backups and recovery. | BLOCKED |
| OPS-04 | Logs and monitoring. | BLOCKED |
| OPS-05 | Ownership and cost register. | BLOCKED |
| QA-01 | Reproducible checks. | BLOCKED |
| QA-02 | Critical automated assertions. | BLOCKED |
| QA-03 | CMS lifecycle proof. | BLOCKED |
| QA-04 | CI/release gates. | BLOCKED |
| QA-05 | Requirement matrix. | FIXED AND VERIFIED |
| QA-06 | Severity. | PASS |
| M1 | Discover and reconcile. | BLOCKED |
| M2 | Foundation and CMS. | BLOCKED |
| M3 | Templates and design. | BLOCKED |
| M4 | Full migration. | BLOCKED |
| M5 | Integrations and hardening. | BLOCKED |
| M6 | Pre-launch audit. | BLOCKED |
| M7 | Controlled launch, only after separate approval. | NOT TESTED |
| M8 | Post-launch validation. | NOT TESTED |
| LAUNCH-01 | Preflight. | BLOCKED |
| LAUNCH-02 | DNS and email safety. | BLOCKED |
| LAUNCH-03 | Controlled release. | NOT TESTED |
| LAUNCH-04 | Immediate verification. | NOT TESTED |
| LAUNCH-05 | Search continuity. | NOT TESTED |
| LAUNCH-06 | Rollback triggers. | BLOCKED |
| LAUNCH-07 | Legacy retention. | BLOCKED |
| POST-01 | Operational checks. | NOT TESTED |
| POST-02 | Search and conversion comparison. | NOT TESTED |
| POST-03 | Field performance. | NOT TESTED |
| POST-04 | Maintenance ownership. | NOT TESTED |
| SOCIAL-01 | Reuse verified social profiles | FIXED AND VERIFIED |
| SOCIAL-02 | Three posts per week | FIXED AND VERIFIED |
| SOCIAL-03 | Existing article backlog | BLOCKED |
| SOCIAL-04 | Future article opt-in | BLOCKED |
| SOCIAL-05 | Website traffic and interlinking | BLOCKED |
| SOCIAL-06 | Account connections and publishing | BLOCKED |
| SOCIAL-07 | Pause, deduplication and failure recovery | FIXED AND VERIFIED |
| SOCIAL-08 | Unattended hosting and monitoring | BLOCKED |
