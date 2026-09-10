# Requirements and acceptance matrix

**NOT READY.** Updated 2026-09-10T20:22:01.102Z. The full master was read; older repository requirements and the later social request remain in scope. Sentence-level criteria inherit conservative unresolved status when the complete requirement has not been proven. Implemented portions and their limits are stated separately.

Tested base: `ed8571bd28de71525eec46b14f56956934e26410`, branch `audit/pre-deployment-2026-09-10`, plus current audit working tree. No production release. See individual logs for actual run times; this document timestamp is not a new test run.

## SAFE-01 — Protect production.

**PASS** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:22`

Original checkout untouched; isolated audit branch and baseline hashes; no production site/DNS change or purchase. Later launch authorization is conditional on completion.

Evidence: migration/pre-deployment/baseline.json; migration/pre-deployment/account-observations.json

Command/result: Inspect git status; compare baseline copies

Remaining action: Retain originals and keep conditional release gate. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SAFE-01.1 | This plan does not authorize deployment to production, DNS or registrar changes, live WordPress edits, production CMS publication, destructive migrations, account cancellation, or removal of the existing host. | PASS |
| SAFE-01.2 | Work locally and in verified isolated staging. | PASS |
| SAFE-01.3 | Verify branch deployment hooks before pushing: a Git push must not accidentally release production. | PASS |

## SAFE-02 — Preserve work.

**PASS** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:24`

Original checkout untouched; isolated audit branch and baseline hashes; no production site/DNS change or purchase. Later launch authorization is conditional on completion.

Evidence: migration/pre-deployment/baseline.json; migration/pre-deployment/account-observations.json

Command/result: Inspect git status; compare baseline copies

Remaining action: Retain originals and keep conditional release gate. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SAFE-02.1 | Inspect Git status and history; preserve existing uncommitted changes. | PASS |
| SAFE-02.2 | Use an isolated branch/worktree as appropriate. | PASS |
| SAFE-02.3 | Do not force-push, rewrite shared history, delete work, or silently revert another contributor's changes. | PASS |

## SAFE-03 — Preserve content and URLs.

**PASS** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:26`

Original checkout untouched; isolated audit branch and baseline hashes; no production site/DNS change or purchase. Later launch authorization is conditional on completion.

Evidence: migration/pre-deployment/baseline.json; migration/pre-deployment/account-observations.json

Command/result: Inspect git status; compare baseline copies

Remaining action: Retain originals and keep conditional release gate. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SAFE-03.1 | No deletion, consolidation, material rewriting, URL changes, changed indexing policy, or other material business changes without recorded owner approval. | PASS |
| SAFE-03.2 | Prepare proposed changes in staging/drafts and retain originals. | PASS |

## SAFE-04 — Costs and access.

**PASS** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:28`

Original checkout untouched; isolated audit branch and baseline hashes; no production site/DNS change or purchase. Later launch authorization is conditional on completion.

Evidence: migration/pre-deployment/baseline.json; migration/pre-deployment/account-observations.json

Command/result: Inspect git status; compare baseline copies

Remaining action: Retain originals and keep conditional release gate. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SAFE-04.1 | Use owner-controlled accounts, scoped credentials, and existing authorized services. | PASS |
| SAFE-04.2 | Do not buy subscriptions, upgrade plans, enable billable features, or broadly expand permissions. | PASS |
| SAFE-04.3 | Record required capabilities and any cost/permission blocker. | PASS |
| SAFE-04.4 | Never put secrets in the repository, frontend, reports, screenshots, or chat. | PASS |

## SAFE-05 — Continue responsibly.

**PASS** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:30`

Original checkout untouched; isolated audit branch and baseline hashes; no production site/DNS change or purchase. Later launch authorization is conditional on completion.

Evidence: migration/pre-deployment/baseline.json; migration/pre-deployment/account-observations.json

Command/result: Inspect git status; compare baseline copies

Remaining action: Retain originals and keep conditional release gate. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SAFE-05.1 | Complete safe independent work without repeatedly requesting routine confirmations. | PASS |
| SAFE-05.2 | Do not bypass tool approval controls. | PASS |
| SAFE-05.3 | When blocked, record the exact missing access, decision, or dependency and continue other tasks. | PASS |
| SAFE-05.4 | Save a checkpoint when the session ends; do not claim continued background execution. | PASS |

## SAFE-06 — Evidence, not assertions.

**PASS** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:32`

Original checkout untouched; isolated audit branch and baseline hashes; no production site/DNS change or purchase. Later launch authorization is conditional on completion.

Evidence: migration/pre-deployment/baseline.json; migration/pre-deployment/account-observations.json

Command/result: Inspect git status; compare baseline copies

Remaining action: Retain originals and keep conditional release gate. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SAFE-06.1 | Never invent crawl results, customer reviews, credentials, live prices, analytics data, test output, or deployment status. | PASS |
| SAFE-06.2 | A file's existence, passing mock, or successful build alone does not prove a connected workflow works. | PASS |

## BIZ-01 — Seller-focused site.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:36`

Seller-focused content and owner buying-policy checks implemented. Hours, credentials, full expert review and genuine lead delivery remain unresolved.

Evidence: src/lib/buying-policy.mjs; src/lib/address-integrity.mjs; BUSINESS_FACTS.md

Command/result: verify-editorial; verify-built-site

Remaining action: Navid: confirm remaining business facts; operator: complete connected inquiry workflow. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| BIZ-01.1 | Build a premium local-buyer website that brings qualified sellers into the Downtown Los Angeles Jewelry District shop. | BLOCKED |
| BIZ-01.2 | Priority conversions are genuine inquiry delivery, calls, directions, and appointment requests. | BLOCKED |
| BIZ-01.3 | Do not accidentally build a retail jewelry store, affiliate shopping site, pawn-lending service, or nationwide mail-in operation. | BLOCKED |

## BIZ-02 — Relevant services.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:38`

Seller-focused content and owner buying-policy checks implemented. Hours, credentials, full expert review and genuine lead delivery remain unresolved.

Evidence: src/lib/buying-policy.mjs; src/lib/address-integrity.mjs; BUSINESS_FACTS.md

Command/result: verify-editorial; verify-built-site

Remaining action: Navid: confirm remaining business facts; operator: complete connected inquiry workflow. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| BIZ-02.1 | Preserve and properly represent the owner's services: gold jewelry of different karats, scrap/broken gold, gold coins, loose and GIA-graded diamonds, diamond jewelry, engagement rings, estate/inherited jewelry, luxury watches including Rolex, and designer jewelry. | BLOCKED |
| BIZ-02.2 | Verify exact buying criteria, exclusions, methods, and business promises before publication. | BLOCKED |

## BIZ-03 — Geography.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:40`

Seller-focused content and owner buying-policy checks implemented. Hours, credentials, full expert review and genuine lead delivery remain unresolved.

Evidence: src/lib/buying-policy.mjs; src/lib/address-integrity.mjs; BUSINESS_FACTS.md

Command/result: verify-editorial; verify-built-site

Remaining action: Navid: confirm remaining business facts; operator: complete connected inquiry workflow. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| BIZ-03.1 | Prioritize Downtown Los Angeles and relevant sellers within approximately 20 miles of ZIP 90014. | BLOCKED |
| BIZ-03.2 | This is a marketing focus, not a guaranteed ranking radius or an invented business restriction. | BLOCKED |
| BIZ-03.3 | Do not imply branches in other cities. | BLOCKED |
| BIZ-03.4 | Use `America/Los_Angeles` for business scheduling and local display times. | BLOCKED |

## BIZ-04 — Approved replacement.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:42`

Seller-focused content and owner buying-policy checks implemented. Hours, credentials, full expert review and genuine lead delivery remain unresolved.

Evidence: src/lib/buying-policy.mjs; src/lib/address-integrity.mjs; BUSINESS_FACTS.md

Command/result: verify-editorial; verify-built-site

Remaining action: Navid: confirm remaining business facts; operator: complete connected inquiry workflow. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| BIZ-04.1 | Replace the public WordPress/Elementor frontend and reproduce needed Rank Math capabilities with Astro, Sanity, and custom controls. | BLOCKED |
| BIZ-04.2 | WordPress may remain protected as a migration source and rollback asset; the new site must not depend on live WordPress for normal operation after cutover. | BLOCKED |

## BIZ-05 — Success measures.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:44`

Seller-focused content and owner buying-policy checks implemented. Hours, credentials, full expert review and genuine lead delivery remain unresolved.

Evidence: src/lib/buying-policy.mjs; src/lib/address-integrity.mjs; BUSINESS_FACTS.md

Command/result: verify-editorial; verify-built-site

Remaining action: Navid: confirm remaining business facts; operator: complete connected inquiry workflow. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| BIZ-05.1 | Establish a baseline for organic landing-page traffic, qualified inquiries, call/directions clicks, indexing coverage, and performance where authorized data is available. | BLOCKED |
| BIZ-05.2 | Track commercial outcomes separately from traffic. | BLOCKED |
| BIZ-05.3 | Do not promise first-place rankings, automatic indexing, AI citations, a specific revenue increase, or zero migration volatility. | BLOCKED |

## DISC-01 — Repository assessment.

**FIXED AND VERIFIED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:48`

Repository, branch, dependency versions, scripts and preserved baseline recorded.

Evidence: PROJECT_STATE.md; migration/pre-deployment/baseline.json; package.json; migration/pre-deployment/build.log

Command/result: Inspect files/git; build/check

Remaining action: Keep reproducible lockfile and branch checkpoint. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| DISC-01.1 | Record repository, branch, commit, framework versions, package manager, runtime, existing routes, CMS configuration, build/deploy workflows, tests, secrets requirements, and completed features. | FIXED AND VERIFIED |
| DISC-01.2 | Use a reproducible lockfile; do not upgrade everything indiscriminately. | FIXED AND VERIFIED |

## DISC-02 — Website inventory.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:50`

Repository and public site inspected; private WordPress/Rank Math, full performance and current analytics evidence unavailable.

Evidence: SOURCE_REGISTER.md; FEATURE_PARITY.md; wordpress-api/report.json

Command/result: crawl --audit; audit-wordpress-api; audit-migration

Remaining action: Provide authorized export/access; reconcile records and capture missing baseline. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| DISC-02.1 | Combine a rate-limited public crawl with available WordPress content/media exports, current sitemaps, existing redirects, authorized Search Console/analytics information, and server-log or backlink evidence where accessible. | BLOCKED |
| DISC-02.2 | A sitemap or homepage crawl alone is not a complete inventory. | BLOCKED |
| DISC-02.3 | Log unavailable sources and coverage limitations. | BLOCKED |

## DISC-03 — Baseline evidence.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:52`

Repository and public site inspected; private WordPress/Rank Math, full performance and current analytics evidence unavailable.

Evidence: SOURCE_REGISTER.md; FEATURE_PARITY.md; wordpress-api/report.json

Command/result: crawl --audit; audit-wordpress-api; audit-migration

Remaining action: Provide authorized export/access; reconcile records and capture missing baseline. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| DISC-03.1 | Capture representative old-page screenshots, rendered content, headings, metadata, schema, canonical/robots settings, response status, key links, forms, navigation, and page performance. | BLOCKED |
| DISC-03.2 | Record timestamps. | BLOCKED |
| DISC-03.3 | Do not present saved historical issues as fresh findings until rechecked. | BLOCKED |

## DISC-04 — Business truth register.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:54`

Repository and public site inspected; private WordPress/Rank Math, full performance and current analytics evidence unavailable.

Evidence: SOURCE_REGISTER.md; FEATURE_PARITY.md; wordpress-api/report.json

Command/result: crawl --audit; audit-wordpress-api; audit-migration

Remaining action: Provide authorized export/access; reconcile records and capture missing baseline. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| DISC-04.1 | Create a single approved record for business name, address, phone, email, hours, holiday hours, map/profile links, actual services, staff bios, credentials, payment claims, and parking instructions. | BLOCKED |
| DISC-04.2 | Record source, verification date, and approval. | BLOCKED |
| DISC-04.3 | Resolve conflicts using owner-approved facts and trustworthy current business records—not automated blog articles. | BLOCKED |
| DISC-04.4 | Unknown facts remain unpublished or explicitly blocked. | BLOCKED |

## DISC-05 — Feature replacement register.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:56`

Repository and public site inspected; private WordPress/Rank Math, full performance and current analytics evidence unavailable.

Evidence: SOURCE_REGISTER.md; FEATURE_PARITY.md; wordpress-api/report.json

Command/result: crawl --audit; audit-wordpress-api; audit-migration

Remaining action: Provide authorized export/access; reconcile records and capture missing baseline. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| DISC-05.1 | List each meaningful old-site function and its replacement: forms, navigation, galleries, SEO settings, redirects, schema, analytics, search, related posts, archives, appointment flow, privacy controls, and editor workflows. | BLOCKED |
| DISC-05.2 | Transfer necessary behavior, not obsolete plugin code or unnecessary scripts. | BLOCKED |

## MIG-01 — Account for everything.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:62`

111 published posts and 13 published pages map to local routes. Media API delivered 222 of 223 reported items. Hidden metadata/private content and human dispositions remain unresolved.

Evidence: migration/content-inventory.csv; migration/media-manifest.csv; migration/pre-deployment/wordpress-reconciliation.json; migration/pre-deployment/additions.json

Command/result: reconcile-wordpress-api; verify-cms-projection; verify-substantive; verify

Remaining action: Export full WordPress/Rank Math/media; reconcile the mismatch; approve dispositions; run private staging import and final delta. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| MIG-01.1 | Inventory all discoverable pages, posts, custom content types, category/tag/author archives, pagination, media, downloads, and existing redirects. | BLOCKED |
| MIG-01.2 | Include draft/private records when authorized exports permit, preserving their visibility. | BLOCKED |
| MIG-01.3 | Record an approved disposition for every discovered item; do not decide that poor-looking content can simply disappear. | BLOCKED |

## MIG-02 — Migration manifest.

**FIXED AND VERIFIED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:64`

Manifest includes every discovered public source/crawl record and all required columns, with missing source fields explicitly identified. Coverage completeness is separately BLOCKED.

Evidence: migration/content-inventory.csv; SOURCE_REGISTER.md

Command/result: write-audit-handoff

Remaining action: Update with full authorized exports and final delta. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| MIG-02.1 | Produce `migration/content-inventory.csv` with at least: source ID/type/status; old URL; source timestamp; title; content reference/checksum; headings; author/dates; categories/tags; image references; SEO title/description; canonical; robots; schema reference; proposed destination; Sanity ID; action; approval reference; migration status; verification evidence. | FIXED AND VERIFIED |
| MIG-02.2 | Store large raw content in protected backing files, not giant CSV cells. | FIXED AND VERIFIED |

## MIG-03 — Semantic preservation.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:66`

111 published posts and 13 published pages map to local routes. Media API delivered 222 of 223 reported items. Hidden metadata/private content and human dispositions remain unresolved.

Evidence: migration/content-inventory.csv; migration/media-manifest.csv; migration/pre-deployment/wordpress-reconciliation.json; migration/pre-deployment/additions.json

Command/result: reconcile-wordpress-api; verify-cms-projection; verify-substantive; verify

Remaining action: Export full WordPress/Rank Math/media; reconcile the mismatch; approve dispositions; run private staging import and final delta. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| MIG-03.1 | Transfer text, important headings, lists, tables, FAQs, captions, links, downloads, and meaningful page sections into structured Sanity content. | BLOCKED |
| MIG-03.2 | Extract content from Elementor/template data as needed; do not import an empty body and mark the page complete. | BLOCKED |
| MIG-03.3 | Replace shortcodes and layout artifacts with equivalent working components. | BLOCKED |
| MIG-03.4 | Strip unsafe scripts while retaining an archived original and documenting transformations. | BLOCKED |

## MIG-04 — Metadata preservation.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:68`

111 published posts and 13 published pages map to local routes. Media API delivered 222 of 223 reported items. Hidden metadata/private content and human dispositions remain unresolved.

Evidence: migration/content-inventory.csv; migration/media-manifest.csv; migration/pre-deployment/wordpress-reconciliation.json; migration/pre-deployment/additions.json

Command/result: reconcile-wordpress-api; verify-cms-projection; verify-substantive; verify

Remaining action: Export full WordPress/Rank Math/media; reconcile the mismatch; approve dispositions; run private staging import and final delta. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| MIG-04.1 | Migrate actual Rank Math values and relevant older SEO metadata where present, including resolved template values, canonical overrides, robots settings, social titles/images, focus-topic fields, author/entity associations, redirects, and legitimate structured data. | BLOCKED |
| MIG-04.2 | Record which fields were inaccessible. | BLOCKED |
| MIG-04.3 | Do not treat publicly visible HTML as proof that hidden CMS metadata was fully exported. | BLOCKED |

## MIG-05 — Media preservation.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:70`

111 published posts and 13 published pages map to local routes. Media API delivered 222 of 223 reported items. Hidden metadata/private content and human dispositions remain unresolved.

Evidence: migration/content-inventory.csv; migration/media-manifest.csv; migration/pre-deployment/wordpress-reconciliation.json; migration/pre-deployment/additions.json

Command/result: reconcile-wordpress-api; verify-cms-projection; verify-substantive; verify

Remaining action: Export full WordPress/Rank Math/media; reconcile the mismatch; approve dispositions; run private staging import and final delta. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| MIG-05.1 | Map every referenced asset, featured image, inline image, gallery image, and downloadable document. | BLOCKED |
| MIG-05.2 | Retain originals, provenance, rights, ALT, caption, title, description, crop/focal point, dimensions, and destination. | BLOCKED |
| MIG-05.3 | Copy owner-controlled/appropriately licensed assets into an independent managed store. | BLOCKED |
| MIG-05.4 | Report external hotlinks and unresolved rights. | BLOCKED |
| MIG-05.5 | Preserve important legacy media URLs or implement approved compatible replacements. | BLOCKED |

## MIG-06 — Safe, repeatable imports.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:72`

111 published posts and 13 published pages map to local routes. Media API delivered 222 of 223 reported items. Hidden metadata/private content and human dispositions remain unresolved.

Evidence: migration/content-inventory.csv; migration/media-manifest.csv; migration/pre-deployment/wordpress-reconciliation.json; migration/pre-deployment/additions.json

Command/result: reconcile-wordpress-api; verify-cms-projection; verify-substantive; verify

Remaining action: Export full WordPress/Rank Math/media; reconcile the mismatch; approve dispositions; run private staging import and final delta. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| MIG-06.1 | Implement dry-run, staging-first, deterministic IDs, deduplication, validation, retry/error reporting, and resumable batches. | BLOCKED |
| MIG-06.2 | Re-running an import must not duplicate records or overwrite later editorial changes without an explicit conflict decision. | BLOCKED |
| MIG-06.3 | Back up the target dataset before writes. | BLOCKED |
| MIG-06.4 | Distinguish content-model transformation from editorial rewriting. | BLOCKED |

## MIG-07 — Reconcile results.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:74`

111 published posts and 13 published pages map to local routes. Media API delivered 222 of 223 reported items. Hidden metadata/private content and human dispositions remain unresolved.

Evidence: migration/content-inventory.csv; migration/media-manifest.csv; migration/pre-deployment/wordpress-reconciliation.json; migration/pre-deployment/additions.json

Command/result: reconcile-wordpress-api; verify-cms-projection; verify-substantive; verify

Remaining action: Export full WordPress/Rank Math/media; reconcile the mismatch; approve dispositions; run private staging import and final delta. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| MIG-07.1 | Compare counts by type/status, media references, semantic block coverage, important links, and old/new page output. | BLOCKED |
| MIG-07.2 | Explain every discrepancy. | BLOCKED |
| MIG-07.3 | A word-count match is not sufficient. | BLOCKED |
| MIG-07.4 | Require human visual review of critical pages and a documented sample of long-form/archive pages, plus automated checks across the full inventory. | BLOCKED |

## MIG-08 — Final delta.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:76`

111 published posts and 13 published pages map to local routes. Media API delivered 222 of 223 reported items. Hidden metadata/private content and human dispositions remain unresolved.

Evidence: migration/content-inventory.csv; migration/media-manifest.csv; migration/pre-deployment/wordpress-reconciliation.json; migration/pre-deployment/additions.json

Command/result: reconcile-wordpress-api; verify-cms-projection; verify-substantive; verify

Remaining action: Export full WordPress/Rank Math/media; reconcile the mismatch; approve dispositions; run private staging import and final delta. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| MIG-08.1 | Before an authorized launch, reconcile content created or edited on WordPress since the baseline. | BLOCKED |
| MIG-08.2 | Arrange an owner-approved freeze or final delta migration. | BLOCKED |
| MIG-08.3 | Never replace recent live content with a stale export. | BLOCKED |

## URL-01 — Preserve existing paths.

**FIXED AND VERIFIED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:82`

Every published REST post/page has a retained local route or explicit existing mapping; two missing articles restored. Runtime redirect proof is separately blocked.

Evidence: migration/pre-deployment/wordpress-reconciliation.json; migration/pre-deployment/additions.json; migration/redirect-map.csv

Command/result: reconcile-wordpress-api: 111 posts + 13 pages, zero missing routes

Remaining action: Reconcile private/custom records and source-error dispositions before full migration signoff. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| URL-01.1 | Keep existing important URLs, path case where meaningful, and trailing-slash conventions whenever possible. | FIXED AND VERIFIED |
| URL-01.2 | Navigation labels may improve without changing URLs. | FIXED AND VERIFIED |
| URL-01.3 | Discover the real service/blog paths before assigning new slugs; do not turn an existing archive into `/blog/` merely by convention. | FIXED AND VERIFIED |

## URL-02 — One mapping register.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:84`

15 local mappings validated; source routes accounted for. Actual Cloudflare redirects, host normalization and request status behavior remain unverified.

Evidence: migration/redirect-map.csv; migration/pre-deployment/build-policy.json; migration/pre-deployment/cloudflare-local-runtime.log

Command/result: tests/release-policy.test.mjs; verify-built-site; verify

Remaining action: Operator: test GET/HEAD/queries/host variants on protected Cloudflare staging. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| URL-02.1 | Create `migration/redirect-map.csv`: source, final destination, status, reason, approval, query-string policy, implementation layer, test result. | BLOCKED |
| URL-02.2 | Preserve necessary old redirect behavior while removing loops/chains only through documented safe changes. | BLOCKED |
| URL-02.3 | Do not bulk-redirect missing articles to an unrelated homepage. | BLOCKED |

## URL-03 — Redirect behavior.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:86`

15 local mappings validated; source routes accounted for. Actual Cloudflare redirects, host normalization and request status behavior remain unverified.

Evidence: migration/redirect-map.csv; migration/pre-deployment/build-policy.json; migration/pre-deployment/cloudflare-local-runtime.log

Command/result: tests/release-policy.test.mjs; verify-built-site; verify

Remaining action: Operator: test GET/HEAD/queries/host variants on protected Cloudflare staging. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| URL-03.1 | Use approved permanent HTTP redirects for moved content, normally 301. | BLOCKED |
| URL-03.2 | Test the actual Cloudflare request path, not only a local dictionary. | BLOCKED |
| URL-03.3 | Google recommends keeping migration redirects for at least a year and potentially longer; retain valuable legacy redirects indefinitely unless an approved reason exists to remove them. [S05] | BLOCKED |

## URL-04 — Host normalization.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:88`

15 local mappings validated; source routes accounted for. Actual Cloudflare redirects, host normalization and request status behavior remain unverified.

Evidence: migration/redirect-map.csv; migration/pre-deployment/build-policy.json; migration/pre-deployment/cloudflare-local-runtime.log

Command/result: tests/release-policy.test.mjs; verify-built-site; verify

Remaining action: Operator: test GET/HEAD/queries/host variants on protected Cloudflare staging. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| URL-04.1 | Preserve the established approved HTTPS canonical host. | BLOCKED |
| URL-04.2 | Verify www/non-www, HTTP/HTTPS, legacy hostname behavior, query strings, and encoded paths. | BLOCKED |
| URL-04.3 | Normalize directly to the final destination where possible. | BLOCKED |
| URL-04.4 | Preserve attribution parameters on navigation/redirects when appropriate, without adding them to canonical URLs. | BLOCKED |

## URL-05 — True status codes.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:90`

15 local mappings validated; source routes accounted for. Actual Cloudflare redirects, host normalization and request status behavior remain unverified.

Evidence: migration/redirect-map.csv; migration/pre-deployment/build-policy.json; migration/pre-deployment/cloudflare-local-runtime.log

Command/result: tests/release-policy.test.mjs; verify-built-site; verify

Remaining action: Operator: test GET/HEAD/queries/host variants on protected Cloudflare staging. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| URL-05.1 | Missing content returns a real 404 with useful navigation, not a successful homepage. | BLOCKED |
| URL-05.2 | A 410 requires an approved removal. | BLOCKED |
| URL-05.3 | Preview routes, APIs, media, and pagination must not be swallowed by a blanket catch-all route. | BLOCKED |
| URL-05.4 | Test GET and HEAD where relevant. | BLOCKED |

## URL-06 — Runtime correctness.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:92`

15 local mappings validated; source routes accounted for. Actual Cloudflare redirects, host normalization and request status behavior remain unverified.

Evidence: migration/redirect-map.csv; migration/pre-deployment/build-policy.json; migration/pre-deployment/cloudflare-local-runtime.log

Command/result: tests/release-policy.test.mjs; verify-built-site; verify

Remaining action: Operator: test GET/HEAD/queries/host variants on protected Cloudflare staging. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| URL-06.1 | Cloudflare static-asset `_redirects` rules do not govern responses served by Worker code. | BLOCKED |
| URL-06.2 | Implement redirects in the appropriate routing layer and test both static and dynamic routes; do not assume a generated redirect file covers the entire application. [S02] | BLOCKED |

## ARCH-01 — Static-first Astro.

**PASS** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:96`

Public marketing content is emitted into static HTML; only small navigation interaction is loaded. Social scheduling lives in a separate server worker.

Evidence: astro.config.mjs; src/pages/[...slug].astro; migration/pre-deployment/built-site-verification.json

Command/result: Astro build; built HTML scan

Remaining action: Validate deployed performance and dynamic integrations separately. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| ARCH-01.1 | Pre-render public marketing, service, and editorial pages where practical. | PASS |
| ARCH-01.2 | Use small interactive islands only when required. | PASS |
| ARCH-01.3 | Reserve server execution for genuinely dynamic needs such as protected previews, form handlers, and authenticated build hooks. | PASS |
| ARCH-01.4 | Main content and navigation must be available in initial HTML. | PASS |

## ARCH-02 — Cloudflare deployment.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:98`

Static Astro output and Sanity projection/release guards implemented. Real CMS-backed preview and hosting pipeline are not connected.

Evidence: astro.config.mjs; src/lib/content.ts; src/lib/cms-release-gates.mjs; wrangler.preview.jsonc

Command/result: Astro build/check; cms-release-import tests

Remaining action: Connect private staging/CMS workflow and verify actual runtime before production. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| ARCH-02.1 | Use Cloudflare Workers with static assets as the default implementation for new infrastructure, consistent with current Astro deployment guidance. | BLOCKED |
| ARCH-02.2 | Inspect existing Cloudflare work before changing it; do not discard an already appropriate setup merely because it uses a different supported arrangement. | BLOCKED |
| ARCH-02.3 | Document adapter/runtime compatibility and each route's rendering/cache behavior. [S01] | BLOCKED |

## ARCH-03 — Sanity as content source.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:100`

Static Astro output and Sanity projection/release guards implemented. Real CMS-backed preview and hosting pipeline are not connected.

Evidence: astro.config.mjs; src/lib/content.ts; src/lib/cms-release-gates.mjs; wrangler.preview.jsonc

Command/result: Astro build/check; cms-release-import tests

Remaining action: Connect private staging/CMS workflow and verify actual runtime before production. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| ARCH-03.1 | Separate content access, typed models, rich-text rendering, SEO generation, URL resolution, and UI components. | BLOCKED |
| ARCH-03.2 | Use the supported Sanity/Astro integration appropriate to the installed versions. | BLOCKED |
| ARCH-03.3 | Pin API/package versions deliberately and test compatibility. [S03] | BLOCKED |

## ARCH-04 — Environments.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:102`

Static Astro output and Sanity projection/release guards implemented. Real CMS-backed preview and hosting pipeline are not connected.

Evidence: astro.config.mjs; src/lib/content.ts; src/lib/cms-release-gates.mjs; wrangler.preview.jsonc

Command/result: Astro build/check; cms-release-import tests

Remaining action: Connect private staging/CMS workflow and verify actual runtime before production. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| ARCH-04.1 | Separate development, protected staging/preview, and production configuration, credentials, content visibility, form recipients, analytics, and domain bindings. | BLOCKED |
| ARCH-04.2 | Validate required environment variables. | BLOCKED |
| ARCH-04.3 | Production must never fall back to demonstration business data, placeholder leads, or a draft dataset. | BLOCKED |

## ARCH-05 — Suggested structure.

**PASS** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:104`

Existing directory structure retained; module equivalents, schemas, scripts, tests and secret-free examples provided.

Evidence: src; studio; scripts; workers; tests; .env.example; .dev.vars.example

Command/result: Repository inspection

Remaining action: No additional structural rewrite needed. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| ARCH-05.1 | Adapt to existing code rather than restructure unnecessarily. | PASS |
| ARCH-05.2 | Provide equivalents of `src/components`, `src/layouts`, `src/pages`, `src/lib/{sanity,seo,urls,forms}`, `sanity/schemaTypes`, `scripts/migration`, `tests`, `docs`, `migration`, and `reports`. | PASS |
| ARCH-05.3 | Include `.env.example` with names and explanations only, never secret values. | PASS |

## ARCH-06 — Reliable releases.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:106`

Static Astro output and Sanity projection/release guards implemented. Real CMS-backed preview and hosting pipeline are not connected.

Evidence: astro.config.mjs; src/lib/content.ts; src/lib/cms-release-gates.mjs; wrangler.preview.jsonc

Command/result: Astro build/check; cms-release-import tests

Remaining action: Connect private staging/CMS workflow and verify actual runtime before production. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| ARCH-06.1 | A failed CMS fetch, invalid schema, route collision, or incomplete critical dataset must fail a release build—not publish a mostly empty site. | BLOCKED |
| ARCH-06.2 | Serve the previous successful release during recoverable publishing failures. | BLOCKED |
| ARCH-06.3 | Document deploy identity, content snapshot, build logs, and rollback target. | BLOCKED |

## PAGE-01 — Content/keyword map.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:110`

198 populated routes, 111 articles and 107 unique guide cards. Commercial/editorial templates are present; complete source approval and routine CMS coverage remain outstanding.

Evidence: src/data/pages.json; src/components; migration/keyword-map.csv; migration/pre-deployment/built-site-verification.json

Command/result: verify-built-site; verify-editorial; browser reports

Remaining action: Navid: review critical content/design. Operator: complete editable global/service blocks and missing form/search parity. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PAGE-01.1 | Choose one primary page per distinct commercial intent using the actual inventory and available performance evidence. | BLOCKED |
| PAGE-01.2 | Map related articles to supporting roles. | BLOCKED |
| PAGE-01.3 | Multiple keyword variations do not automatically require separate pages. | BLOCKED |
| PAGE-01.4 | Preserve overlapping legacy pages until an owner-approved consolidation decision exists. | BLOCKED |

## PAGE-02 — Required commercial coverage.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:112`

198 populated routes, 111 articles and 107 unique guide cards. Commercial/editorial templates are present; complete source approval and routine CMS coverage remain outstanding.

Evidence: src/data/pages.json; src/components; migration/keyword-map.csv; migration/pre-deployment/built-site-verification.json

Command/result: verify-built-site; verify-editorial; browser reports

Remaining action: Navid: review critical content/design. Operator: complete editable global/service blocks and missing form/search parity. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PAGE-02.1 | Provide strong primary destinations for gold buying/selling in Los Angeles, diamond buying/selling in Los Angeles, luxury-watch buying/selling, and Rolex buying. | BLOCKED |
| PAGE-02.2 | Cover scrap gold, gold coins, engagement rings, estate/inherited jewelry, and designer jewelry through existing pages or proposed approved pages. | BLOCKED |
| PAGE-02.3 | Do not invent missing URLs or services. | BLOCKED |

## PAGE-03 — Homepage blueprint.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:114`

198 populated routes, 111 articles and 107 unique guide cards. Commercial/editorial templates are present; complete source approval and routine CMS coverage remain outstanding.

Evidence: src/data/pages.json; src/components; migration/keyword-map.csv; migration/pre-deployment/built-site-verification.json

Command/result: verify-built-site; verify-editorial; browser reports

Remaining action: Navid: review critical content/design. Operator: complete editable global/service blocks and missing form/search parity. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PAGE-03.1 | Build a clear seller-focused hero with Call, Get Directions, and Request an Evaluation actions; service/category entry points; the real evaluation process; verified trust information; relevant original imagery; useful seller questions; links to strongest educational resources; and an obvious visit/contact section. | BLOCKED |
| PAGE-03.2 | Reuse important existing content rather than replace everything with generic marketing copy. | BLOCKED |

## PAGE-04 — Service-page blueprint.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:116`

198 populated routes, 111 articles and 107 unique guide cards. Commercial/editorial templates are present; complete source approval and routine CMS coverage remain outstanding.

Evidence: src/data/pages.json; src/components; migration/keyword-map.csv; migration/pre-deployment/built-site-verification.json

Command/result: verify-built-site; verify-editorial; browser reports

Remaining action: Navid: review critical content/design. Operator: complete editable global/service blocks and missing form/search parity. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PAGE-04.1 | Include a distinct H1 and direct explanation, what the business buys, valuation factors, how evaluation works, what to bring, limitations/quote caveats, genuine expertise, useful FAQs, related services/articles, and an accessible local-visit CTA. | BLOCKED |
| PAGE-04.2 | Pages must be substantively different, not a repeated template with commodity names swapped. | BLOCKED |

## PAGE-05 — Article blueprint.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:118`

198 populated routes, 111 articles and 107 unique guide cards. Commercial/editorial templates are present; complete source approval and routine CMS coverage remain outstanding.

Evidence: src/data/pages.json; src/components; migration/keyword-map.csv; migration/pre-deployment/built-site-verification.json

Command/result: verify-built-site; verify-editorial; browser reports

Remaining action: Navid: review critical content/design. Operator: complete editable global/service blocks and missing form/search parity. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PAGE-05.1 | Preserve the old URL and content, title, byline, truthful publication/modification dates, meaningful images, headings, relevant source references, contextual internal links, and commercial next step. | BLOCKED |
| PAGE-05.2 | Add a table of contents when useful. | BLOCKED |
| PAGE-05.3 | Retain readable lists/tables on mobile and support in-article image placement in the CMS. | BLOCKED |

## PAGE-06 — Other templates.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:120`

198 populated routes, 111 articles and 107 unique guide cards. Commercial/editorial templates are present; complete source approval and routine CMS coverage remain outstanding.

Evidence: src/data/pages.json; src/components; migration/keyword-map.csv; migration/pre-deployment/built-site-verification.json

Command/result: verify-built-site; verify-editorial; browser reports

Remaining action: Navid: review critical content/design. Operator: complete editable global/service blocks and missing form/search parity. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PAGE-06.1 | Provide editable About, Contact/Visit, process, FAQ, blog/archive, category/tag/author/pagination where retained, privacy and other existing legal pages, and an actual 404. | BLOCKED |
| PAGE-06.2 | Preserve existing functional search or document an approved replacement. | BLOCKED |
| PAGE-06.3 | Keep original archive/indexing policy unless an approved SEO decision changes it. | BLOCKED |

## PAGE-07 — Global components.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:122`

198 populated routes, 111 articles and 107 unique guide cards. Commercial/editorial templates are present; complete source approval and routine CMS coverage remain outstanding.

Evidence: src/data/pages.json; src/components; migration/keyword-map.csv; migration/pre-deployment/built-site-verification.json

Command/result: verify-built-site; verify-editorial; browser reports

Remaining action: Navid: review critical content/design. Operator: complete editable global/service blocks and missing form/search parity. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PAGE-07.1 | Implement accessible desktop/mobile navigation, breadcrumbs where helpful, consistent footer, verified contact information, visible CTA states, and mobile call/directions access. | BLOCKED |
| PAGE-07.2 | Do not cover content or consent controls with sticky elements. | BLOCKED |

## EDIT-01 — Diamond page.

**FIXED AND VERIFIED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:126`

Diamond-specific private copy and buying-scope guards replace gold/placeholder content. Human publication review remains separately blocked.

Evidence: src/data/pages.json diamond service; src/lib/buying-policy.mjs; migration/substantive-review.json

Command/result: verify-editorial; buying-policy guards

Remaining action: Review proposed final text before publication. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| EDIT-01.1 | Recheck the previously reported placeholder text and incorrect gold wording. | FIXED AND VERIFIED |
| EDIT-01.2 | Prepare a corrected diamond-specific draft addressing loose diamonds, GIA grading reports, the 4Cs, engagement rings, diamond jewelry, evaluation, and a clear visit CTA. | FIXED AND VERIFIED |
| EDIT-01.3 | Distinguish a buying evaluation from an insurance/tax appraisal; do not invent credentials or services. | FIXED AND VERIFIED |

## EDIT-02 — Luxury watches page.

**FIXED AND VERIFIED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:128`

Watch-specific private copy covers model/reference, condition and records; supports the existing watch/Rolex commercial destination.

Evidence: src/data/pages.json watch service; editorial ledgers

Command/result: verify-editorial; audit-migration

Remaining action: Review proposed final text before publication. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| EDIT-02.1 | Recheck the previously reported gold-related template copy, “Book An Consultation” wording, and unsupported competitor comparisons. | FIXED AND VERIFIED |
| EDIT-02.2 | Prepare an approved-quality watch-specific replacement covering brand/model/reference, condition/originality, box/papers, and evaluation. | FIXED AND VERIFIED |
| EDIT-02.3 | Make Rolex content support the intended Rolex/watch destination rather than create competing near-duplicates. | FIXED AND VERIFIED |

## EDIT-03 — Whole-site quality review.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:130`

111 article bodies have agent correction ledgers and retained originals. This is not human approval; further source/business/media review remains necessary.

Evidence: migration/substantive-review.json; migration/pre-deployment/additions.json; migration/pre-deployment/home-claim-corrections.json; migration/pre-deployment/migration-comparison.json

Command/result: verify-substantive; audit-migration

Remaining action: Navid/reviewer: approve factual corrections and media; record actual reviewer/date in CMS. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| EDIT-03.1 | Flag irrelevant shopping-intent articles, repetitive search intent, invented rankings, false addresses, inconsistent hours, unsupported payment promises, fabricated experience/credentials, weak sourcing, and internal links pointing to unsuitable destinations. | BLOCKED |
| EDIT-03.2 | Produce a proposed correction register, not silent deletions or blanket noindex changes. | BLOCKED |

## EDIT-04 — Phone-quote education.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:132`

111 article bodies have agent correction ledgers and retained originals. This is not human approval; further source/business/media review remains necessary.

Evidence: migration/substantive-review.json; migration/pre-deployment/additions.json; migration/pre-deployment/home-claim-corrections.json; migration/pre-deployment/migration-comparison.json

Command/result: verify-substantive; audit-migration

Remaining action: Navid/reviewer: approve factual corrections and media; record actual reviewer/date in CMS. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| EDIT-04.1 | Include a natural, relevant warning that phone/online estimates can differ from final offers after in-person inspection. | BLOCKED |
| EDIT-04.2 | Avoid accusing particular competitors without evidence. | BLOCKED |
| EDIT-04.3 | Explain the business's actual evaluation process and distinguish estimates, underlying material value, and an actual purchase offer. | BLOCKED |

## EDIT-05 — Human review.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:134`

111 article bodies have agent correction ledgers and retained originals. This is not human approval; further source/business/media review remains necessary.

Evidence: migration/substantive-review.json; migration/pre-deployment/additions.json; migration/pre-deployment/home-claim-corrections.json; migration/pre-deployment/migration-comparison.json

Command/result: verify-substantive; audit-migration

Remaining action: Navid/reviewer: approve factual corrections and media; record actual reviewer/date in CMS. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| EDIT-05.1 | New AI/vendor content follows Generate → Draft → Review → Publish. | BLOCKED |
| EDIT-05.2 | No unchecked auto-publishing. | BLOCKED |
| EDIT-05.3 | Require named reviewer, verified facts, appropriate commercial intent, primary destination, image/provenance check, and factual-source check. | BLOCKED |
| EDIT-05.4 | Do not mark Navid as author/reviewer of work he has not approved. | BLOCKED |

## EDIT-06 — Preservation versus correction.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:136`

111 article bodies have agent correction ledgers and retained originals. This is not human approval; further source/business/media review remains necessary.

Evidence: migration/substantive-review.json; migration/pre-deployment/additions.json; migration/pre-deployment/home-claim-corrections.json; migration/pre-deployment/migration-comparison.json

Command/result: verify-substantive; audit-migration

Remaining action: Navid/reviewer: approve factual corrections and media; record actual reviewer/date in CMS. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| EDIT-06.1 | Keep original imported versions and show proposed before/after changes. | BLOCKED |
| EDIT-06.2 | Material editorial changes require owner approval. | BLOCKED |
| EDIT-06.3 | Critically misleading unresolved material is a launch blocker for the affected release; neither silently delete it nor republish it as verified truth. | BLOCKED |

## DES-01 — Design direction.

**NOT TESTED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:140`

Reusable styles and responsive templates exist; browser layout evidence is partial and separately recorded. Full contrast, keyboard, zoom, motion and owner visual acceptance are not proven.

Evidence: src/styles; browser/layout-baseline-summary.json

Command/result: verify-design; browser DOM inspection

Remaining action: Complete final viewport/manual/accessibility review; label real devices versus emulation. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| DES-01.1 | Create a premium, modern, trustworthy jewelry-buyer experience with a restrained high-tech character. | NOT TESTED |
| DES-01.2 | Proposed visual implementation: charcoal/ivory foundations, restrained gold accents, generous spacing, clear typography, detailed jewelry imagery, and excellent contrast. | NOT TESTED |
| DES-01.3 | Treat final colors/type/layout as design choices for approval, not as an already-approved new brand identity. | NOT TESTED |

## DES-02 — Design system.

**NOT TESTED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:142`

Reusable styles and responsive templates exist; browser layout evidence is partial and separately recorded. Full contrast, keyboard, zoom, motion and owner visual acceptance are not proven.

Evidence: src/styles; browser/layout-baseline-summary.json

Command/result: verify-design; browser DOM inspection

Remaining action: Complete final viewport/manual/accessibility review; label real devices versus emulation. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| DES-02.1 | Implement reusable tokens for color, typography, spacing, radii, focus, layout widths, and motion. | NOT TESTED |
| DES-02.2 | Provide consistent buttons, cards, form controls, notices, accordions, tables, and image treatments. | NOT TESTED |
| DES-02.3 | Avoid inaccessible gold-on-white text, clutter, generic stock-heavy layouts, autoplay hero video, and unnecessary app-style effects. | NOT TESTED |

## DES-03 — Responsive behavior.

**NOT TESTED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:144`

Reusable styles and responsive templates exist; browser layout evidence is partial and separately recorded. Full contrast, keyboard, zoom, motion and owner visual acceptance are not proven.

Evidence: src/styles; browser/layout-baseline-summary.json

Command/result: verify-design; browser DOM inspection

Remaining action: Complete final viewport/manual/accessibility review; label real devices versus emulation. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| DES-03.1 | Verify layouts at 320, 375, 390, 768, 1024, and 1440 CSS pixels. | NOT TESTED |
| DES-03.2 | Test a real phone when available; label emulation as emulation. | NOT TESTED |
| DES-03.3 | No accidental horizontal overflow, unreadable tables, cropped buttons, obstructed keyboard focus, or mobile content loss. | NOT TESTED |
| DES-03.4 | Preserve orientation/zoom usability. | NOT TESTED |

## DES-04 — Motion.

**NOT TESTED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:146`

Reusable styles and responsive templates exist; browser layout evidence is partial and separately recorded. Full contrast, keyboard, zoom, motion and owner visual acceptance are not proven.

Evidence: src/styles; browser/layout-baseline-summary.json

Command/result: verify-design; browser DOM inspection

Remaining action: Complete final viewport/manual/accessibility review; label real devices versus emulation. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| DES-04.1 | Use subtle hover/focus feedback and small opacity/transform transitions where they improve clarity. | NOT TESTED |
| DES-04.2 | Respect reduced-motion preferences. | NOT TESTED |
| DES-04.3 | Avoid scroll hijacking, content hidden until JavaScript runs, large animation libraries for trivial effects, cursor tricks, and motion that delays the main content. | NOT TESTED |

## IMG-01 — Required visual coverage.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:148`

Responsive local media and one new unique large-diamond illustration delivered. Technical image checks pass; complete rights and authentic shop/staff review do not.

Evidence: migration/media-manifest.csv; migration/image-optimization.json; recovered-jewelry-buyers/disposition.json

Command/result: verify-built-site; verify-editorial; actual generated image inspection

Remaining action: Navid: confirm original media rights and supply/approve authentic business photos; review actual crops. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| IMG-01.1 | Supply a homepage hero composition and relevant imagery for gold, diamonds/engagement rings, luxury watches/Rolex, gold coins, estate/inherited jewelry, and designer jewelry. | BLOCKED |
| IMG-01.2 | Preserve and optimize existing article imagery; provide contextual in-article images where approved rather than relying only on featured thumbnails. | BLOCKED |
| IMG-01.3 | Reuse appropriate assets instead of generating redundant files. | BLOCKED |

## IMG-02 — Authenticity.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:150`

Responsive local media and one new unique large-diamond illustration delivered. Technical image checks pass; complete rights and authentic shop/staff review do not.

Evidence: migration/media-manifest.csv; migration/image-optimization.json; recovered-jewelry-buyers/disposition.json

Command/result: verify-built-site; verify-editorial; actual generated image inspection

Remaining action: Navid: confirm original media rights and supply/approve authentic business photos; review actual crops. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| IMG-02.1 | Use authentic storefront, staff, and evaluation-process photographs for business-specific representations. | BLOCKED |
| IMG-02.2 | AI-generated art may illustrate jewelry or concepts but must not impersonate the real shop, Navid/staff, customer transactions, endorsements, certificates, or actual inventory. | BLOCKED |
| IMG-02.3 | Do not generate or republish a real person's likeness without appropriate supplied material/permission. | BLOCKED |

## IMG-03 — Asset register.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:152`

Responsive local media and one new unique large-diamond illustration delivered. Technical image checks pass; complete rights and authentic shop/staff review do not.

Evidence: migration/media-manifest.csv; migration/image-optimization.json; recovered-jewelry-buyers/disposition.json

Command/result: verify-built-site; verify-editorial; actual generated image inspection

Remaining action: Navid: confirm original media rights and supply/approve authentic business photos; review actual crops. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| IMG-03.1 | For each new/migrated asset record source/original, final filename, ALT, title, description, caption, page/section placement, crop/focal point, dimensions, rights, and whether illustrative/AI-generated. | BLOCKED |
| IMG-03.2 | Decorative images use empty ALT where appropriate. | BLOCKED |
| IMG-03.3 | Do not keyword-stuff image text or invent what is pictured. | BLOCKED |

## IMG-04 — Delivery pipeline.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:154`

Responsive local media and one new unique large-diamond illustration delivered. Technical image checks pass; complete rights and authentic shop/staff review do not.

Evidence: migration/media-manifest.csv; migration/image-optimization.json; recovered-jewelry-buyers/disposition.json

Command/result: verify-built-site; verify-editorial; actual generated image inspection

Remaining action: Navid: confirm original media rights and supply/approve authentic business photos; review actual crops. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| IMG-04.1 | Generate responsive sizes and appropriate WebP/AVIF alternatives with compatible fallbacks as needed. | BLOCKED |
| IMG-04.2 | Set dimensions/aspect ratios; lazy-load below-fold imagery but not the principal hero/LCP image. | BLOCKED |
| IMG-04.3 | Load only the appropriate responsive hero variant. | BLOCKED |
| IMG-04.4 | Preserve originals and eliminate obsolete WordPress hotlinks before retirement. | BLOCKED |

## IMG-05 — Completion evidence.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:156`

Responsive local media and one new unique large-diamond illustration delivered. Technical image checks pass; complete rights and authentic shop/staff review do not.

Evidence: migration/media-manifest.csv; migration/image-optimization.json; recovered-jewelry-buyers/disposition.json

Command/result: verify-built-site; verify-editorial; actual generated image inspection

Remaining action: Navid: confirm original media rights and supply/approve authentic business photos; review actual crops. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| IMG-05.1 | Inspect actual rendered assets for artifacts, wrong text/logos, misleading details, crop problems, and mobile readability. | BLOCKED |
| IMG-05.2 | Prompts, placeholders, filenames, or a statement that images will be created are not completed image deliverables. | BLOCKED |
| IMG-05.3 | Record tool/access/rights blockers honestly. | BLOCKED |

## CMS-01 — Core models.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:160`

15 compiled schema types, structured article projection, metadata/review/social controls and non-overwriting staging importer are implemented. No actual staging editing/publishing lifecycle completed.

Evidence: studio/schema.js; studio/social-schema.js; src/lib/cms-page.mjs; scripts/import-staging.mjs; migration/pre-deployment/import-plan.json

Command/result: check-schema; verify-cms-projection; cms-controls/release-import tests

Remaining action: Connect scoped Sanity credentials; import private staging; test roles, edit/preview/publish/unpublish/restore and full global/service fields. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| CMS-01.1 | Provide equivalents of site settings/business profile, homepage, service, article, standard page, category/tag, author/reviewer, FAQ items, media metadata, navigation/footer, redirects, and approved testimonials. | BLOCKED |
| CMS-01.2 | Use reusable blocks rather than one unstructured HTML field. | BLOCKED |
| CMS-01.3 | Store private leads in an appropriately private system, not public content documents. | BLOCKED |

## CMS-02 — Common fields.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:162`

15 compiled schema types, structured article projection, metadata/review/social controls and non-overwriting staging importer are implemented. No actual staging editing/publishing lifecycle completed.

Evidence: studio/schema.js; studio/social-schema.js; src/lib/cms-page.mjs; scripts/import-staging.mjs; migration/pre-deployment/import-plan.json

Command/result: check-schema; verify-cms-projection; cms-controls/release-import tests

Remaining action: Connect scoped Sanity credentials; import private staging; test roles, edit/preview/publish/unpublish/restore and full global/service fields. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| CMS-02.1 | Content documents need stable ID; title; preserved slug/legacy URL; type; body/sections; excerpt; media; related-content references; status; source ID; publication/modification dates; author/reviewer; primary service/topic; SEO object; review/approval state; and migration provenance. | BLOCKED |
| CMS-02.2 | Keep public content and internal/private notes separate. | BLOCKED |

## CMS-03 — Service fields.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:164`

15 compiled schema types, structured article projection, metadata/review/social controls and non-overwriting staging importer are implemented. No actual staging editing/publishing lifecycle completed.

Evidence: studio/schema.js; studio/social-schema.js; src/lib/cms-page.mjs; scripts/import-staging.mjs; migration/pre-deployment/import-plan.json

Command/result: check-schema; verify-cms-projection; cms-controls/release-import tests

Remaining action: Connect scoped Sanity credentials; import private staging; test roles, edit/preview/publish/unpublish/restore and full global/service fields. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| CMS-03.1 | Support introduction, accepted-item groups, valuation factors, process steps, preparation checklist, FAQ references, proof/credentials with verification, related services/articles, CTA references, and location reference. | BLOCKED |
| CMS-03.2 | Reuse the approved business profile rather than retyping address/phone throughout the site. | BLOCKED |

## CMS-04 — Article fields.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:166`

15 compiled schema types, structured article projection, metadata/review/social controls and non-overwriting staging importer are implemented. No actual staging editing/publishing lifecycle completed.

Evidence: studio/schema.js; studio/social-schema.js; src/lib/cms-page.mjs; scripts/import-staging.mjs; migration/pre-deployment/import-plan.json

Command/result: check-schema; verify-cms-projection; cms-controls/release-import tests

Remaining action: Connect scoped Sanity credentials; import private staging; test roles, edit/preview/publish/unpublish/restore and full global/service fields. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| CMS-04.1 | Support rich text, headings, links, tables, inline images/captions, excerpts, categories/tags, related services/articles, sources with dates, author/reviewer, original publication date, actual revision date, and fact-review notes. | BLOCKED |
| CMS-04.2 | Avoid converting every article into hardcoded source code. | BLOCKED |

## CMS-05 — Editor experience.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:168`

15 compiled schema types, structured article projection, metadata/review/social controls and non-overwriting staging importer are implemented. No actual staging editing/publishing lifecycle completed.

Evidence: studio/schema.js; studio/social-schema.js; src/lib/cms-page.mjs; scripts/import-staging.mjs; migration/pre-deployment/import-plan.json

Command/result: check-schema; verify-cms-projection; cms-controls/release-import tests

Remaining action: Connect scoped Sanity credentials; import private staging; test roles, edit/preview/publish/unpublish/restore and full global/service fields. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| CMS-05.1 | Organize Studio into understandable sections such as Pages, Services, Articles, Media, Business Information, SEO Issues, Redirects, and Navigation. | BLOCKED |
| CMS-05.2 | Include clear field descriptions, previews, validation, and a way to identify outstanding migration/editorial issues. | BLOCKED |
| CMS-05.3 | Navid must be able to edit routine site content without coding. | BLOCKED |

## CMS-06 — Visual/draft preview.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:170`

15 compiled schema types, structured article projection, metadata/review/social controls and non-overwriting staging importer are implemented. No actual staging editing/publishing lifecycle completed.

Evidence: studio/schema.js; studio/social-schema.js; src/lib/cms-page.mjs; scripts/import-staging.mjs; migration/pre-deployment/import-plan.json

Command/result: check-schema; verify-cms-projection; cms-controls/release-import tests

Remaining action: Connect scoped Sanity credentials; import private staging; test roles, edit/preview/publish/unpublish/restore and full global/service fields. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| CMS-06.1 | Implement protected live/draft preview and click-to-edit using supported Sanity visual-editing capabilities. | BLOCKED |
| CMS-06.2 | Test previewing an unpublished edit, navigating to its document, changing content, and confirming the public version remains unchanged. | BLOCKED |
| CMS-06.3 | Exclude preview overlays, draft data, and preview credentials from public output. [S04] | BLOCKED |

## CMS-07 — Permissions.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:172`

15 compiled schema types, structured article projection, metadata/review/social controls and non-overwriting staging importer are implemented. No actual staging editing/publishing lifecycle completed.

Evidence: studio/schema.js; studio/social-schema.js; src/lib/cms-page.mjs; scripts/import-staging.mjs; migration/pre-deployment/import-plan.json

Command/result: check-schema; verify-cms-projection; cms-controls/release-import tests

Remaining action: Connect scoped Sanity credentials; import private staging; test roles, edit/preview/publish/unpublish/restore and full global/service fields. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| CMS-07.1 | Establish owner/admin, editor, reviewer/publisher, and automation capabilities using features actually available on the account. | BLOCKED |
| CMS-07.2 | Verify enforcement, not just hidden buttons. | BLOCKED |
| CMS-07.3 | If a role/workflow feature needs a paid tier, record the blocker and propose a safe explicit alternative; do not claim enterprise-style permissions exist on an unverified plan. | BLOCKED |

## CMS-08 — Validation and publishing.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:174`

15 compiled schema types, structured article projection, metadata/review/social controls and non-overwriting staging importer are implemented. No actual staging editing/publishing lifecycle completed.

Evidence: studio/schema.js; studio/social-schema.js; src/lib/cms-page.mjs; scripts/import-staging.mjs; migration/pre-deployment/import-plan.json

Command/result: check-schema; verify-cms-projection; cms-controls/release-import tests

Remaining action: Connect scoped Sanity credentials; import private staging; test roles, edit/preview/publish/unpublish/restore and full global/service fields. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| CMS-08.1 | Catch slug collisions, invalid references, missing required business facts, missing nondecorative ALT, malformed URLs, and prohibited draft publication. | BLOCKED |
| CMS-08.2 | Test save, review, publish, unpublish, rollback, and image replacement in a test dataset. | BLOCKED |
| CMS-08.3 | Restrict destructive operations and prevent accidental deletion of referenced content. | BLOCKED |

## PANEL-01 — Editable SEO controls.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:178`

Snippet/checklist, peer duplicate/intent/link checks and SEO fields implemented. Authorized Studio peer query and complete actual HTML editing acceptance are not tested.

Evidence: studio/QualityInput.js; src/lib/seo-site-checks.mjs; tests/cms-controls.test.mjs

Command/result: unit tests; check-schema; verify-cms-projection

Remaining action: Run the specified title/description/ALT/canonical/link/slug acceptance in the actual private Studio. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PANEL-01.1 | For pages/services/articles provide SEO title, meta description, canonical override with warnings, indexability setting, social title/description/image, primary topic/intent, related queries, schema selection, breadcrumb label, and redirect guidance when a slug changes. | BLOCKED |
| PANEL-01.2 | Include snippet previews and understandable explanations. | BLOCKED |

## PANEL-02 — Content checks.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:180`

Snippet/checklist, peer duplicate/intent/link checks and SEO fields implemented. Authorized Studio peer query and complete actual HTML editing acceptance are not tested.

Evidence: studio/QualityInput.js; src/lib/seo-site-checks.mjs; tests/cms-controls.test.mjs

Command/result: unit tests; check-schema; verify-cms-projection

Remaining action: Run the specified title/description/ALT/canonical/link/slug acceptance in the actual private Studio. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PANEL-02.1 | Flag absent/duplicate titles and descriptions, unclear main heading, missing images/ALT, broken links, orphaned pages, unsupported claims, missing source/review dates, and missing relevant service links. | BLOCKED |
| PANEL-02.2 | Use a default meta-description guidance target around 160 characters; preserve imported text and flag exceptions rather than silently truncate. | BLOCKED |

## PANEL-03 — Whole-site intent checks.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:182`

Snippet/checklist, peer duplicate/intent/link checks and SEO fields implemented. Authorized Studio peer query and complete actual HTML editing acceptance are not tested.

Evidence: studio/QualityInput.js; src/lib/seo-site-checks.mjs; tests/cms-controls.test.mjs

Command/result: unit tests; check-schema; verify-cms-projection

Remaining action: Run the specified title/description/ALT/canonical/link/slug acceptance in the actual private Studio. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PANEL-03.1 | Identify pages targeting overlapping commercial intent and show existing primary/supporting destinations before an editor creates another page. | BLOCKED |
| PANEL-03.2 | Build an internal-link graph with inbound/outbound references, broken-link status, orphan warnings, and editable related-content suggestions. | BLOCKED |
| PANEL-03.3 | Suggestions must not silently rewrite published pages. | BLOCKED |

## PANEL-04 — Local checks.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:184`

Snippet/checklist, peer duplicate/intent/link checks and SEO fields implemented. Authorized Studio peer query and complete actual HTML editing acceptance are not tested.

Evidence: studio/QualityInput.js; src/lib/seo-site-checks.mjs; tests/cms-controls.test.mjs

Command/result: unit tests; check-schema; verify-cms-projection

Remaining action: Run the specified title/description/ALT/canonical/link/slug acceptance in the actual private Studio. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PANEL-04.1 | Validate name/address/phone consistency against the approved business profile, linked location, actual service coverage, local CTA, map/profile references, and missing verification. | BLOCKED |
| PANEL-04.2 | Do not generate fictional local branches or keyword-filled business names. | BLOCKED |

## PANEL-05 — Answer/AI-search readiness.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:186`

Snippet/checklist, peer duplicate/intent/link checks and SEO fields implemented. Authorized Studio peer query and complete actual HTML editing acceptance are not tested.

Evidence: studio/QualityInput.js; src/lib/seo-site-checks.mjs; tests/cms-controls.test.mjs

Command/result: unit tests; check-schema; verify-cms-projection

Remaining action: Run the specified title/description/ALT/canonical/link/slug acceptance in the actual private Studio. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PANEL-05.1 | Support clear questions and answers, concise summaries when useful, original practical expertise, sources, authorship/review, freshness, relevant entities, and readable formatting. | BLOCKED |
| PANEL-05.2 | These are editorial aids—not proprietary Google/ChatGPT ranking inputs. | BLOCKED |
| PANEL-05.3 | Google says ordinary SEO remains relevant to generative search and no special AI markup guarantees inclusion. [S06] | BLOCKED |

## PANEL-06 — Honest scoring.

**PASS** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:188`

Checklist explicitly labels its score as a project heuristic; it does not promise Google rankings or AI inclusion.

Evidence: studio/QualityInput.js; src/lib/editorial-checks.mjs

Command/result: Source inspection and unit checks

Remaining action: Keep live metrics separate from editorial checks. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PANEL-06.1 | Any checklist score must be labeled a project heuristic, explain its rules, separate errors from suggestions, allow justified exceptions, and avoid forced keyword density or word counts. | PASS |
| PANEL-06.2 | Never label a heuristic a Google score, AI probability, domain authority guarantee, or proof of indexing. | PASS |

## PANEL-07 — External tools.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:190`

Snippet/checklist, peer duplicate/intent/link checks and SEO fields implemented. Authorized Studio peer query and complete actual HTML editing acceptance are not tested.

Evidence: studio/QualityInput.js; src/lib/seo-site-checks.mjs; tests/cms-controls.test.mjs

Command/result: unit tests; check-schema; verify-cms-projection

Remaining action: Run the specified title/description/ALT/canonical/link/slug acceptance in the actual private Studio. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PANEL-07.1 | Preserve the planned ability to use an existing authorized Semrush One account or other already-approved reporting sources. | BLOCKED |
| PANEL-07.2 | Show actual API/account limits and data timestamps. | BLOCKED |
| PANEL-07.3 | Do not recreate a full paid SEO platform, invent metrics, or buy a subscription/API add-on. | BLOCKED |
| PANEL-07.4 | Unconnected data remains explicitly unavailable. | BLOCKED |

## SEO-01 — Single metadata implementation.

**FIXED AND VERIFIED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:196`

Central metadata output tested across all built pages; all main H1, descriptions, canonical values and source-specific robots output are present.

Evidence: src/layouts/Base.astro; migration/pre-deployment/built-site-verification.json; cms-projection verification

Command/result: verify-built-site; verify-editorial; verify-cms-projection

Remaining action: Source Rank Math parity and real production headers remain separate blockers. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SEO-01.1 | Generate metadata centrally with tested precedence for document overrides and defaults. | FIXED AND VERIFIED |
| SEO-01.2 | Provide a meaningful title, description, canonical, robots policy, and appropriate social metadata. | FIXED AND VERIFIED |
| SEO-01.3 | Avoid duplicate plugin-era tags and contradictory HTTP headers. | FIXED AND VERIFIED |
| SEO-01.4 | Use one clear main page heading and a sensible heading hierarchy as the project convention. | FIXED AND VERIFIED |

## SEO-02 — Indexability policy.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:198`

Metadata/canonical/indexability/sitemap policies implemented and local output checked. Protected deployed staging, current GSC cases, production account settings and source metadata parity remain unverified.

Evidence: src/lib/release-policy.mjs; src/lib/cms-page.mjs; migration/pre-deployment/build-policy.json; migration/pre-deployment/production-audit-policy.json

Command/result: release-policy tests; build; verify-built-site

Remaining action: Verify current GSC/Rank Math and production-like runtime; enable production only after release gates pass. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SEO-02.1 | Production should expose only approved, public, canonical, indexable pages. | BLOCKED |
| SEO-02.2 | Staging must stay authenticated and non-indexable. | BLOCKED |
| SEO-02.3 | A robots.txt block alone is not a reliable noindex mechanism: Google must be able to access a page to read its noindex directive. | BLOCKED |
| SEO-02.4 | Use authentication for privacy and test staging/production policies separately. [S08] | BLOCKED |

## SEO-03 — Canonicals.

**FIXED AND VERIFIED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:200`

Canonical origin/path validation and intentional overrides are enforced; preview hostnames/tracking parameters cannot be emitted as CMS canonicals.

Evidence: src/lib/release-policy.mjs; src/lib/cms-page.mjs; tests/release-policy.test.mjs

Command/result: Unit tests and 198-page HTML verification

Remaining action: Review GSC canonical-selection cases separately. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SEO-03.1 | Build self-canonicals for intended primary pages using the configured production origin and legacy-path policy. | FIXED AND VERIFIED |
| SEO-03.2 | Support justified overrides, not blanket canonicals to the homepage or category page. | FIXED AND VERIFIED |
| SEO-03.3 | Prevent preview hostnames, tracking queries, or draft URLs from leaking into production metadata. | FIXED AND VERIFIED |
| SEO-03.4 | Do not strip functional URL parameters indiscriminately. | FIXED AND VERIFIED |

## SEO-04 — Sitemaps and discovery.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:202`

Metadata/canonical/indexability/sitemap policies implemented and local output checked. Protected deployed staging, current GSC cases, production account settings and source metadata parity remain unverified.

Evidence: src/lib/release-policy.mjs; src/lib/cms-page.mjs; migration/pre-deployment/build-policy.json; migration/pre-deployment/production-audit-policy.json

Command/result: release-policy tests; build; verify-built-site

Remaining action: Verify current GSC/Rank Math and production-like runtime; enable production only after release gates pass. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SEO-04.1 | Automatically generate XML sitemap(s) from the same approved published route set used by the application. | BLOCKED |
| SEO-04.2 | Exclude drafts, redirects, errors, noindex pages, and duplicate canonical variants. | BLOCKED |
| SEO-04.3 | Use meaningful modification dates. | BLOCKED |
| SEO-04.4 | Update on publishing changes and preserve existing verification methods for Google/Bing. | BLOCKED |
| SEO-04.5 | Do not claim a sitemap submission guarantees indexing. [S10] | BLOCKED |

## SEO-05 — Structured data graph.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:204`

Metadata/canonical/indexability/sitemap policies implemented and local output checked. Protected deployed staging, current GSC cases, production account settings and source metadata parity remain unverified.

Evidence: src/lib/release-policy.mjs; src/lib/cms-page.mjs; migration/pre-deployment/build-policy.json; migration/pre-deployment/production-audit-policy.json

Command/result: release-policy tests; build; verify-built-site

Remaining action: Verify current GSC/Rank Math and production-like runtime; enable production only after release gates pass. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SEO-05.1 | Generate appropriate, truthful JSON-LD using the actual business entity and relevant page types: Organization/LocalBusiness with an appropriate subtype, WebSite/WebPage, Service, Article/BlogPosting, BreadcrumbList, and visible FAQs when semantically appropriate. | BLOCKED |
| SEO-05.2 | Keep stable entity IDs and consistent references. | BLOCKED |
| SEO-05.3 | Do not put Article schema indiscriminately on every service page or invent Product offers for items the business is buying. | BLOCKED |

## SEO-06 — Schema accuracy.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:206`

Metadata/canonical/indexability/sitemap policies implemented and local output checked. Protected deployed staging, current GSC cases, production account settings and source metadata parity remain unverified.

Evidence: src/lib/release-policy.mjs; src/lib/cms-page.mjs; migration/pre-deployment/build-policy.json; migration/pre-deployment/production-audit-policy.json

Command/result: release-policy tests; build; verify-built-site

Remaining action: Verify current GSC/Rank Math and production-like runtime; enable production only after release gates pass. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SEO-06.1 | Markup must match visible approved content. | BLOCKED |
| SEO-06.2 | Do not invent reviews, aggregate ratings, awards, certifications, opening hours, or prices. | BLOCKED |
| SEO-06.3 | Do not add self-serving review-star markup as a ranking tactic. | BLOCKED |
| SEO-06.4 | Distinguish Schema.org validation from eligibility for a currently supported Google rich result; record both where applicable. | BLOCKED |

## SEO-07 — Current FAQ treatment.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:208`

Metadata/canonical/indexability/sitemap policies implemented and local output checked. Protected deployed staging, current GSC cases, production account settings and source metadata parity remain unverified.

Evidence: src/lib/release-policy.mjs; src/lib/cms-page.mjs; migration/pre-deployment/build-policy.json; migration/pre-deployment/production-audit-policy.json

Command/result: release-policy tests; build; verify-built-site

Remaining action: Verify current GSC/Rank Math and production-like runtime; enable production only after release gates pass. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SEO-07.1 | Keep useful human-readable FAQs and preserve legitimate semantic content, but do not promise FAQ rich results. | BLOCKED |
| SEO-07.2 | Google's documentation records that FAQ rich results stopped appearing beginning May 7, 2026. | BLOCKED |
| SEO-07.3 | Do not make a deprecated rich-result feature a launch-success criterion. [S07] | BLOCKED |

## SEO-08 — Known indexing issues.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:210`

Metadata/canonical/indexability/sitemap policies implemented and local output checked. Protected deployed staging, current GSC cases, production account settings and source metadata parity remain unverified.

Evidence: src/lib/release-policy.mjs; src/lib/cms-page.mjs; migration/pre-deployment/build-policy.json; migration/pre-deployment/production-audit-policy.json

Command/result: release-policy tests; build; verify-built-site

Remaining action: Verify current GSC/Rank Math and production-like runtime; enable production only after release gates pass. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SEO-08.1 | Explicitly review the previously reported “Duplicate, Google chose different canonical than user” and “Excluded by ‘noindex’ tag” cases when authorized Search Console access is available. | BLOCKED |
| SEO-08.2 | Classify intentional exclusions separately from defects. | BLOCKED |
| SEO-08.3 | Retain an affected-URL/action log and verify fixes; do not change all canonicals/noindex rules globally without diagnosis. | BLOCKED |

## SEO-09 — Crawler access.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:212`

Metadata/canonical/indexability/sitemap policies implemented and local output checked. Protected deployed staging, current GSC cases, production account settings and source metadata parity remain unverified.

Evidence: src/lib/release-policy.mjs; src/lib/cms-page.mjs; migration/pre-deployment/build-policy.json; migration/pre-deployment/production-audit-policy.json

Command/result: release-policy tests; build; verify-built-site

Remaining action: Verify current GSC/Rank Math and production-like runtime; enable production only after release gates pass. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SEO-09.1 | Document and test robots, CDN/WAF rules, preview protection, and public HTML for legitimate search crawling. | BLOCKED |
| SEO-09.2 | Provide owner-controlled policies for search/AI crawlers, distinguishing search discovery from training preferences. | BLOCKED |
| SEO-09.3 | Verify current vendor documentation before setting user agents. | BLOCKED |
| SEO-09.4 | Do not disable security or enable every bot by default. | BLOCKED |

## LOCAL-01 — Real-world consistency.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:216`

Owner NAP used across output; exact Instagram/Facebook/Yelp profiles extracted from live pages. Instagram guide link corrected and verified. Full external citation and firsthand-content approval remain open.

Evidence: BUSINESS_FACTS.md; migration/pre-deployment/social-profile-evidence.json; migration/keyword-map.csv

Command/result: address/buying policy checks; social-profile tests; browser observations

Remaining action: Confirm hours/arrival instructions and expert content; connect authorized local tracker/reporting and record baseline. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| LOCAL-01.1 | Keep approved contact facts consistent across templates, schema, navigation, footer, map links, and linked official profiles. | BLOCKED |
| LOCAL-01.2 | Preserve business-profile destination URLs and relevant attribution. | BLOCKED |
| LOCAL-01.3 | Any external profile edits require authorized access and a recorded change, not an assertion that citations were updated. | BLOCKED |

## LOCAL-02 — Useful local content.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:218`

Owner NAP used across output; exact Instagram/Facebook/Yelp profiles extracted from live pages. Instagram guide link corrected and verified. Full external citation and firsthand-content approval remain open.

Evidence: BUSINESS_FACTS.md; migration/pre-deployment/social-profile-evidence.json; migration/keyword-map.csv

Command/result: address/buying policy checks; social-profile tests; browser observations

Remaining action: Confirm hours/arrival instructions and expert content; connect authorized local tracker/reporting and record baseline. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| LOCAL-02.1 | Explain the real visit/evaluation experience, relevant items, what to bring, and verified parking/arrival information. | BLOCKED |
| LOCAL-02.2 | Location pages need distinct, genuinely useful local substance and must not imply nonexistent storefronts. | BLOCKED |
| LOCAL-02.3 | Do not mass-produce doorway pages around every nearby city or keyword. | BLOCKED |

## LOCAL-03 — Genuine expertise.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:220`

Owner NAP used across output; exact Instagram/Facebook/Yelp profiles extracted from live pages. Instagram guide link corrected and verified. Full external citation and firsthand-content approval remain open.

Evidence: BUSINESS_FACTS.md; migration/pre-deployment/social-profile-evidence.json; migration/keyword-map.csv

Command/result: address/buying policy checks; social-profile tests; browser observations

Remaining action: Confirm hours/arrival instructions and expert content; connect authorized local tracker/reporting and record baseline. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| LOCAL-03.1 | Build content around approved firsthand knowledge: karat testing, metal versus stone evaluation, GIA reports, engagement-ring resale factors, watch condition/reference/box/papers, and inherited-jewelry questions. | BLOCKED |
| LOCAL-03.2 | Require owner/expert review. | BLOCKED |
| LOCAL-03.3 | Avoid unsupported claims against competitors or promises of the “highest payout.” | BLOCKED |

## LOCAL-04 — Answer visibility.

**PASS** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:222`

Article answers, related links and source citations are in normal HTML; no hidden AI-only copy or automated outreach was added.

Evidence: src/data/pages.json; src/lib/cms-page.mjs; migration/pre-deployment/built-site-verification.json

Command/result: verify-substantive; verify-built-site

Remaining action: Maintain human source and fact review. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| LOCAL-04.1 | Make useful information available as normal readable HTML with clear relationships and relevant supporting sources. | PASS |
| LOCAL-04.2 | No hidden AI-only text, fake citations, keyword stuffing, paid-link schemes, or fabricated local reviews. | PASS |
| LOCAL-04.3 | Treat `llms.txt` as an optional noncritical compatibility artifact only; Google states it does not improve or harm Google Search visibility. [S06] | PASS |

## LOCAL-05 — Measured growth plan.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:224`

Owner NAP used across output; exact Instagram/Facebook/Yelp profiles extracted from live pages. Instagram guide link corrected and verified. Full external citation and firsthand-content approval remain open.

Evidence: BUSINESS_FACTS.md; migration/pre-deployment/social-profile-evidence.json; migration/keyword-map.csv

Command/result: address/buying policy checks; social-profile tests; browser observations

Remaining action: Confirm hours/arrival instructions and expert content; connect authorized local tracker/reporting and record baseline. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| LOCAL-05.1 | Prepare a prioritized editorial backlog, primary/supporting page map, internal-link opportunities, authentic review-request workflow, and legitimate local partnership/citation opportunities. | BLOCKED |
| LOCAL-05.2 | Publish or contact others only under appropriate approval. | BLOCKED |
| LOCAL-05.3 | Measure actual leads and visibility rather than promise an arbitrary domain-authority or AI-citation increase. | BLOCKED |

## FORM-01 — Preserve working contact paths.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:228`

Phone/email and public Calendly links are available. Source form recipients/settings, server delivery, spam protection and controlled end-to-end lead/booking evidence are missing. No live leads or invitations sent.

Evidence: FEATURE_PARITY.md; migration/pre-deployment/account-observations.json; src/data/pages.json contact route

Command/result: Read-only Calendly availability check; no synthetic production submission

Remaining action: Provide approved provider and test recipient/sandbox; implement and test genuine acceptance, errors, deduplication and privacy. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| FORM-01.1 | Inventory the existing forms, recipients, acknowledgement behavior, phone links, appointment flow, and any approved attachments. | BLOCKED |
| FORM-01.2 | Reproduce necessary functionality with a real backend. | BLOCKED |
| FORM-01.3 | Do not add a fake quote engine or automatically guarantee a purchase price. | BLOCKED |

## FORM-02 — Minimum collection.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:230`

Phone/email and public Calendly links are available. Source form recipients/settings, server delivery, spam protection and controlled end-to-end lead/booking evidence are missing. No live leads or invitations sent.

Evidence: FEATURE_PARITY.md; migration/pre-deployment/account-observations.json; src/data/pages.json contact route

Command/result: Read-only Calendly availability check; no synthetic production submission

Remaining action: Provide approved provider and test recipient/sandbox; implement and test genuine acceptance, errors, deduplication and privacy. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| FORM-02.1 | Collect only useful inquiry details such as name, preferred contact method, relevant contact detail, item category, and message. | BLOCKED |
| FORM-02.2 | Make photographs optional only when securely supported and approved. | BLOCKED |
| FORM-02.3 | Do not request Social Security numbers, payment credentials, identity documents, or unnecessary private financial information through a general lead form. | BLOCKED |

## FORM-03 — Server-side protection.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:232`

Phone/email and public Calendly links are available. Source form recipients/settings, server delivery, spam protection and controlled end-to-end lead/booking evidence are missing. No live leads or invitations sent.

Evidence: FEATURE_PARITY.md; migration/pre-deployment/account-observations.json; src/data/pages.json contact route

Command/result: Read-only Calendly availability check; no synthetic production submission

Remaining action: Provide approved provider and test recipient/sandbox; implement and test genuine acceptance, errors, deduplication and privacy. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| FORM-03.1 | Validate and normalize inputs server-side; enforce size/type limits, rate limiting, origin/CSRF protections appropriate to the endpoint, and accessible spam protection. | BLOCKED |
| FORM-03.2 | Protect uploads and remove unnecessary metadata. | BLOCKED |
| FORM-03.3 | Keep private inquiry data out of public Sanity datasets, browser logs, analytics, and Git. | BLOCKED |

## FORM-04 — Truthful delivery.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:234`

Phone/email and public Calendly links are available. Source form recipients/settings, server delivery, spam protection and controlled end-to-end lead/booking evidence are missing. No live leads or invitations sent.

Evidence: FEATURE_PARITY.md; migration/pre-deployment/account-observations.json; src/data/pages.json contact route

Command/result: Read-only Calendly availability check; no synthetic production submission

Remaining action: Provide approved provider and test recipient/sandbox; implement and test genuine acceptance, errors, deduplication and privacy. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| FORM-04.1 | Separate validation failure, backend failure, accepted submission, provider delivery status where available, and confirmed booking. | BLOCKED |
| FORM-04.2 | Show success only after genuine backend acceptance/persistence—not a timer or client-side flag. | BLOCKED |
| FORM-04.3 | Handle retries and duplicates without repeatedly sending the same inquiry. | BLOCKED |
| FORM-04.4 | Configure a real authorized recipient/provider; missing delivery configuration is a launch blocker for an advertised form. | BLOCKED |

## FORM-05 — End-to-end evidence.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:236`

Phone/email and public Calendly links are available. Source form recipients/settings, server delivery, spam protection and controlled end-to-end lead/booking evidence are missing. No live leads or invitations sent.

Evidence: FEATURE_PARITY.md; migration/pre-deployment/account-observations.json; src/data/pages.json contact route

Command/result: Read-only Calendly availability check; no synthetic production submission

Remaining action: Provide approved provider and test recipient/sandbox; implement and test genuine acceptance, errors, deduplication and privacy. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| FORM-05.1 | Use synthetic inquiries and approved test recipients/sandbox destinations. | BLOCKED |
| FORM-05.2 | Verify received content, mobile completion, errors, spam handling, and retry behavior. | BLOCKED |
| FORM-05.3 | A mocked mail transport proves only the mock path; label it accordingly. | BLOCKED |
| FORM-05.4 | Do not submit fake inquiries to production staff or customers without explicit test authorization. | BLOCKED |

## FORM-06 — Appointment semantics.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:238`

Phone/email and public Calendly links are available. Source form recipients/settings, server delivery, spam protection and controlled end-to-end lead/booking evidence are missing. No live leads or invitations sent.

Evidence: FEATURE_PARITY.md; migration/pre-deployment/account-observations.json; src/data/pages.json contact route

Command/result: Read-only Calendly availability check; no synthetic production submission

Remaining action: Provide approved provider and test recipient/sandbox; implement and test genuine acceptance, errors, deduplication and privacy. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| FORM-06.1 | Preserve a real booking integration when authorized and available. | BLOCKED |
| FORM-06.2 | Otherwise label the feature an appointment request requiring confirmation. | BLOCKED |
| FORM-06.3 | Do not display invented availability, claim a confirmed time without a working scheduling system, or send invitations to real people during tests. | BLOCKED |

## TRACK-01 — Analytics continuity.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:240`

No active third-party tracking in the preview; no invented analytics success. Original account/container/conversion continuity, consent and real debug events are not proven.

Evidence: FEATURE_PARITY.md; source-evidence; PRE_DEPLOYMENT_AUDIT.md

Command/result: Built HTML/script inventory only

Remaining action: Connect correct GA4/GTM/Ads/GSC/Bing properties; configure consent; test truthful events without private data. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| TRACK-01.1 | Preserve authorized GA4/GTM, Search Console, Bing verification, and relevant Google Ads conversion wiring. | BLOCKED |
| TRACK-01.2 | Record actual property/container IDs securely, avoid duplicate tags, and use staging/debug isolation. | BLOCKED |
| TRACK-01.3 | Do not modify advertising budgets, audiences, or campaigns as part of the site build. | BLOCKED |

## TRACK-02 — Event meanings.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:242`

No active third-party tracking in the preview; no invented analytics success. Original account/container/conversion continuity, consent and real debug events are not proven.

Evidence: FEATURE_PARITY.md; source-evidence; PRE_DEPLOYMENT_AUDIT.md

Command/result: Built HTML/script inventory only

Remaining action: Connect correct GA4/GTM/Ads/GSC/Bing properties; configure consent; test truthful events without private data. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| TRACK-02.1 | Track call clicks, directions clicks, form starts, accepted inquiry events, appointment requests, and confirmed bookings only when those events genuinely occur. | BLOCKED |
| TRACK-02.2 | A phone click is not a completed call; a directions click is not a store visit; an inquiry is not revenue. | BLOCKED |
| TRACK-02.3 | Prevent duplicate success events on reload/retry. | BLOCKED |

## TRACK-03 — Privacy and testing.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:244`

No active third-party tracking in the preview; no invented analytics success. Original account/container/conversion continuity, consent and real debug events are not proven.

Evidence: FEATURE_PARITY.md; source-evidence; PRE_DEPLOYMENT_AUDIT.md

Command/result: Built HTML/script inventory only

Remaining action: Connect correct GA4/GTM/Ads/GSC/Bing properties; configure consent; test truthful events without private data. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| TRACK-03.1 | Send no names, emails, phone numbers, message bodies, uploaded files, or private URL parameters into analytics. | BLOCKED |
| TRACK-03.2 | Preserve attribution without excessive collection. | BLOCKED |
| TRACK-03.3 | Implement the approved consent/privacy configuration and obtain appropriate review of policy wording. | BLOCKED |
| TRACK-03.4 | Verify events in the actual authorized debug environment; otherwise report the integration as unverified. | BLOCKED |

## PERF-01 — Field targets.

**NOT TESTED** · postlaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:248`

File sizes and responsive markup measured. Lighthouse/headless Edge and Chrome DevTools workflow unavailable; no passing CWV/Lighthouse score is claimed.

Evidence: migration/pre-deployment/built-site-verification.json; browser evidence; logs in task work/audit-tools

Command/result: Attempted Lighthouse/Edge; local file-size audit

Remaining action: Run 3 comparable mobile/desktop lab runs per representative route on protected deployed staging; retain every result. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PERF-01.1 | Target LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1 at the 75th percentile, evaluated separately for mobile and desktop. | NOT TESTED |
| PERF-01.2 | These are current Core Web Vitals thresholds. | NOT TESTED |
| PERF-01.3 | Real field success requires real-user data; pre-launch lab scores cannot prove it. [S09] | NOT TESTED |

## PERF-02 — Pre-launch laboratory targets.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:250`

File sizes and responsive markup measured. Lighthouse/headless Edge and Chrome DevTools workflow unavailable; no passing CWV/Lighthouse score is claimed.

Evidence: migration/pre-deployment/built-site-verification.json; browser evidence; logs in task work/audit-tools

Command/result: Attempted Lighthouse/Edge; local file-size audit

Remaining action: Run 3 comparable mobile/desktop lab runs per representative route on protected deployed staging; retain every result. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PERF-02.1 | Use production-like output, representative content, and the intended authorized integrations. | BLOCKED |
| PERF-02.2 | Target mobile Lighthouse performance of at least 90, desktop at least 95, and at least 95 for automated SEO/accessibility/best-practices categories, with 100 as an improvement goal rather than a guarantee. | BLOCKED |
| PERF-02.3 | Target FCP at or below 1.8 seconds and lab TBT at or below 200 milliseconds under the documented test profile. | BLOCKED |
| PERF-02.4 | These are project acceptance targets; Lighthouse navigation tests do not measure real-user INP. [S09] | BLOCKED |

## PERF-03 — Engineering budgets.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:252`

File sizes and responsive markup measured. Lighthouse/headless Edge and Chrome DevTools workflow unavailable; no passing CWV/Lighthouse score is claimed.

Evidence: migration/pre-deployment/built-site-verification.json; browser evidence; logs in task work/audit-tools

Command/result: Attempted Lighthouse/Edge; local file-size audit

Remaining action: Run 3 comparable mobile/desktop lab runs per representative route on protected deployed staging; retain every result. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PERF-03.1 | Initial targets for ordinary marketing pages: first-party initial JavaScript no more than 80 KB compressed; CSS no more than 50 KB compressed; fonts no more than 100 KB transferred; mobile hero image around 200 KB or less; initial mobile transfer around 1 MB or less. | BLOCKED |
| PERF-03.2 | These are implementation budgets introduced in this specification, not Google's ranking rules or previously measured results. | BLOCKED |
| PERF-03.3 | Record justified page-specific exceptions without sacrificing readable content or trustworthy visual quality. | BLOCKED |

## PERF-04 — Test coverage.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:254`

File sizes and responsive markup measured. Lighthouse/headless Edge and Chrome DevTools workflow unavailable; no passing CWV/Lighthouse score is claimed.

Evidence: migration/pre-deployment/built-site-verification.json; browser evidence; logs in task work/audit-tools

Command/result: Attempted Lighthouse/Edge; local file-size audit

Remaining action: Run 3 comparable mobile/desktop lab runs per representative route on protected deployed staging; retain every result. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PERF-04.1 | Measure the homepage, gold service, diamond service, watch/Rolex destination, Contact, a long article, an image-heavy article, and an archive. | BLOCKED |
| PERF-04.2 | Include every substantially different template. | BLOCKED |
| PERF-04.3 | Run at least three comparable mobile and desktop tests per representative route; retain all runs, median and worst results, tool/version, device/network/CPU profile, URL, build commit, and time. | BLOCKED |
| PERF-04.4 | Do not cherry-pick the fastest run. | BLOCKED |

## PERF-05 — Real conditions.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:256`

File sizes and responsive markup measured. Lighthouse/headless Edge and Chrome DevTools workflow unavailable; no passing CWV/Lighthouse score is claimed.

Evidence: migration/pre-deployment/built-site-verification.json; browser evidence; logs in task work/audit-tools

Command/result: Attempted Lighthouse/Edge; local file-size audit

Remaining action: Run 3 comparable mobile/desktop lab runs per representative route on protected deployed staging; retain every result. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PERF-05.1 | Test cold/warm behavior, deployed staging runtime, image delivery, fonts, and relevant interactions. | BLOCKED |
| PERF-05.2 | Authenticated staging should be measured with authorized browser/CLI access rather than made public just for a tool. | BLOCKED |
| PERF-05.3 | Test production indexability in a local/isolated production-config build while keeping external staging protected. | BLOCKED |
| PERF-05.4 | Explain expected staging SEO-score penalties from noindex instead of hiding them. | BLOCKED |

## PERF-06 — Optimization.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:258`

File sizes and responsive markup measured. Lighthouse/headless Edge and Chrome DevTools workflow unavailable; no passing CWV/Lighthouse score is claimed.

Evidence: migration/pre-deployment/built-site-verification.json; browser evidence; logs in task work/audit-tools

Command/result: Attempted Lighthouse/Edge; local file-size audit

Remaining action: Run 3 comparable mobile/desktop lab runs per representative route on protected deployed staging; retain every result. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| PERF-06.1 | Remove unused code/styles, excessive DOM nesting, render-blocking noncritical assets, duplicate trackers, unnecessary fonts, and heavy embeds. | BLOCKED |
| PERF-06.2 | Load maps/video on demand where suitable. | BLOCKED |
| PERF-06.3 | Avoid broad performance toggles that break content or hydration. | BLOCKED |
| PERF-06.4 | Test each change and retain a rollback. | BLOCKED |

## OPS-01 — Cache design.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:266`

Fail-closed preview config, release guards, cache/header generation and local social scheduler are present. Cloudflare project/access/publish hooks/runtime/alerts are not connected.

Evidence: wrangler.preview.jsonc; wrangler.social.jsonc; DEPLOYMENT_RUNBOOK.md; migration/pre-deployment/account-observations.json

Command/result: build/finalize; mocked social scheduler; Wrangler local runtime failed

Remaining action: Create protected infrastructure within approved entitlements; test controlled build/release/rollback and actual alert delivery. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| OPS-01.1 | Define cache policy per response class: versioned static assets, public HTML, CMS fetches, previews, forms, and APIs. | BLOCKED |
| OPS-01.2 | Never publicly cache private/draft content or form responses. | BLOCKED |
| OPS-01.3 | Verify cache invalidation and content freshness after publishing. | BLOCKED |
| OPS-01.4 | Do not enable blanket caching or script rewriting without end-to-end tests. | BLOCKED |

## OPS-02 — Publish-to-site pipeline.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:268`

Fail-closed preview config, release guards, cache/header generation and local social scheduler are present. Cloudflare project/access/publish hooks/runtime/alerts are not connected.

Evidence: wrangler.preview.jsonc; wrangler.social.jsonc; DEPLOYMENT_RUNBOOK.md; migration/pre-deployment/account-observations.json

Command/result: build/finalize; mocked social scheduler; Wrangler local runtime failed

Remaining action: Create protected infrastructure within approved entitlements; test controlled build/release/rollback and actual alert delivery. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| OPS-02.1 | Implement authenticated/signed publish hooks or an equivalent controlled build trigger. | BLOCKED |
| OPS-02.2 | Validate the correct source, handle duplicate/retried events, and avoid draft updates triggering public publication. | BLOCKED |
| OPS-02.3 | Rebuild affected public output/sitemaps/redirects as required, record revision/build state, and expose failures to the responsible operator. | BLOCKED |
| OPS-02.4 | Keep the last successful release if the next build fails. | BLOCKED |

## OPS-03 — Hosting configuration.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:270`

Fail-closed preview config, release guards, cache/header generation and local social scheduler are present. Cloudflare project/access/publish hooks/runtime/alerts are not connected.

Evidence: wrangler.preview.jsonc; wrangler.social.jsonc; DEPLOYMENT_RUNBOOK.md; migration/pre-deployment/account-observations.json

Command/result: build/finalize; mocked social scheduler; Wrangler local runtime failed

Remaining action: Create protected infrastructure within approved entitlements; test controlled build/release/rollback and actual alert delivery. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| OPS-03.1 | Document Cloudflare project/Worker, preview domains, production bindings, TLS, cache/security rules, runtime compatibility, redirects, and deploy commands. | BLOCKED |
| OPS-03.2 | Respect actual account limits. | BLOCKED |
| OPS-03.3 | Test a production-like build using the correct runtime, not only the Astro development server. | BLOCKED |

## SEC-01 — Credential security.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:272`

Compatible security updates remove high/critical audit findings; one moderate adm-zip issue has no published patched package. Private staging, complete credential/CORS verification and restore proof remain blocked.

Evidence: migration/pre-deployment/dependency-audit-final.json; pnpm-workspace.yaml; SECURITY_NOTES.md; migration/pre-deployment/account-observations.json

Command/result: pnpm audit; release/CMS tests; no production restore

Remaining action: Complete source/built secret review, scoped credential checks and isolated restoration. Do not use vulnerable ZIP extraction on untrusted archives. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SEC-01.1 | Use least-privilege tokens and owner-controlled accounts; verify secret separation, CMS CORS origins, preview access, and token revocation procedures. | BLOCKED |
| SEC-01.2 | Keep public frontend variables distinct from server secrets. | BLOCKED |
| SEC-01.3 | Scan both source and built assets; remediate exposed secrets without repeating them in reports. | BLOCKED |

## SEC-02 — Application hardening.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:274`

Compatible security updates remove high/critical audit findings; one moderate adm-zip issue has no published patched package. Private staging, complete credential/CORS verification and restore proof remain blocked.

Evidence: migration/pre-deployment/dependency-audit-final.json; pnpm-workspace.yaml; SECURITY_NOTES.md; migration/pre-deployment/account-observations.json

Command/result: pnpm audit; release/CMS tests; no production restore

Remaining action: Complete source/built secret review, scoped credential checks and isolated restoration. Do not use vulnerable ZIP extraction on untrusted archives. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SEC-02.1 | Apply suitable HTTPS/security headers, content sanitization, safe URL handling, dependency review, and endpoint abuse protections. | BLOCKED |
| SEC-02.2 | Test CSP against actual approved scripts instead of blindly deploying a breaking policy. | BLOCKED |
| SEC-02.3 | Do not disable WAF protections wholesale to make tests pass. | BLOCKED |

## SEC-03 — Backups and recovery.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:276`

Compatible security updates remove high/critical audit findings; one moderate adm-zip issue has no published patched package. Private staging, complete credential/CORS verification and restore proof remain blocked.

Evidence: migration/pre-deployment/dependency-audit-final.json; pnpm-workspace.yaml; SECURITY_NOTES.md; migration/pre-deployment/account-observations.json

Command/result: pnpm audit; release/CMS tests; no production restore

Remaining action: Complete source/built secret review, scoped credential checks and isolated restoration. Do not use vulnerable ZIP extraction on untrusted archives. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| SEC-03.1 | Back up source, CMS content/schema, media inventory, redirects, deployment configuration, and the legacy WordPress/database/uploads before cutover. | BLOCKED |
| SEC-03.2 | Store backups securely. | BLOCKED |
| SEC-03.3 | Demonstrate restoration into an isolated environment; a backup file without a restore test is not verified recovery. | BLOCKED |

## OPS-04 — Logs and monitoring.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:278`

Fail-closed preview config, release guards, cache/header generation and local social scheduler are present. Cloudflare project/access/publish hooks/runtime/alerts are not connected.

Evidence: wrangler.preview.jsonc; wrangler.social.jsonc; DEPLOYMENT_RUNBOOK.md; migration/pre-deployment/account-observations.json

Command/result: build/finalize; mocked social scheduler; Wrangler local runtime failed

Remaining action: Create protected infrastructure within approved entitlements; test controlled build/release/rollback and actual alert delivery. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| OPS-04.1 | Provide privacy-preserving 404, runtime-error, form-failure, and build-failure visibility. | BLOCKED |
| OPS-04.2 | Distinguish bots/random probes from valuable broken legacy URLs. | BLOCKED |
| OPS-04.3 | Establish actual alert destinations only with approved configuration and test delivery. | BLOCKED |
| OPS-04.4 | Never claim monitoring is active because a script exists. | BLOCKED |

## OPS-05 — Ownership and cost register.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:280`

Fail-closed preview config, release guards, cache/header generation and local social scheduler are present. Cloudflare project/access/publish hooks/runtime/alerts are not connected.

Evidence: wrangler.preview.jsonc; wrangler.social.jsonc; DEPLOYMENT_RUNBOOK.md; migration/pre-deployment/account-observations.json

Command/result: build/finalize; mocked social scheduler; Wrangler local runtime failed

Remaining action: Create protected infrastructure within approved entitlements; test controlled build/release/rollback and actual alert delivery. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| OPS-05.1 | Record which owner-controlled accounts hold the domain, DNS, GitHub repository, Sanity project, Cloudflare, analytics, email/form delivery, and authorized SEO services. | BLOCKED |
| OPS-05.2 | Document seats, quotas, billable components, and renewal responsibilities using current account evidence. | BLOCKED |
| OPS-05.3 | Do not assume any account is connected, free, or paid. | BLOCKED |

## QA-01 — Reproducible checks.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:284`

Reproducible local checks and a pinned, read-only GitHub quality workflow are supplied. CI has not run remotely; real integration/runtime/performance/preview/form gates remain incomplete.

Evidence: package.json; .github/workflows/quality.yml; reports/REQUIREMENTS_MATRIX.md

Command/result: See reports/TEST_EVIDENCE.md

Remaining action: Run remaining connected acceptance tests; retain evidence and do not bypass failed gates. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| QA-01.1 | Provide documented commands for clean installation, lint/type checks, unit tests, content/schema validation, Astro/Studio builds, route/redirect checks, migration comparison, internal-link/media checks, browser end-to-end tests, accessibility checks, and performance checks. | BLOCKED |
| QA-01.2 | Use the actual package manager; do not invent a passing `npm test` when no script exists. | BLOCKED |

## QA-02 — Critical automated assertions.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:286`

Reproducible local checks and a pinned, read-only GitHub quality workflow are supplied. CI has not run remotely; real integration/runtime/performance/preview/form gates remain incomplete.

Evidence: package.json; .github/workflows/quality.yml; reports/REQUIREMENTS_MATRIX.md

Command/result: See reports/TEST_EVIDENCE.md

Remaining action: Run remaining connected acceptance tests; retain evidence and do not bypass failed gates. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| QA-02.1 | Cover URL normalization, real 404 status, redirect final destination, source-manifest reconciliation, duplicate slugs, canonical consistency, sitemap filtering, draft exclusion, metadata output, valid JSON-LD, safe rich-text rendering, missing media, form validation/error/success, duplicate submission protection, and preview authorization. | BLOCKED |

## QA-03 — CMS lifecycle proof.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:288`

Reproducible local checks and a pinned, read-only GitHub quality workflow are supplied. CI has not run remotely; real integration/runtime/performance/preview/form gates remain incomplete.

Evidence: package.json; .github/workflows/quality.yml; reports/REQUIREMENTS_MATRIX.md

Command/result: See reports/TEST_EVIDENCE.md

Remaining action: Run remaining connected acceptance tests; retain evidence and do not bypass failed gates. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| QA-03.1 | In staging, create a test draft, edit it in preview, review/publish it, verify public-staging HTML and sitemap, change a test slug through the redirect workflow, and unpublish/restore it. | BLOCKED |
| QA-03.2 | Confirm production and real customer data were unaffected. | BLOCKED |
| QA-03.3 | Capture evidence without credentials. | BLOCKED |

## QA-04 — CI/release gates.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:290`

Reproducible local checks and a pinned, read-only GitHub quality workflow are supplied. CI has not run remotely; real integration/runtime/performance/preview/form gates remain incomplete.

Evidence: package.json; .github/workflows/quality.yml; reports/REQUIREMENTS_MATRIX.md

Command/result: See reports/TEST_EVIDENCE.md

Remaining action: Run remaining connected acceptance tests; retain evidence and do not bypass failed gates. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| QA-04.1 | Run appropriate checks on proposed changes and protect production release behind explicit approval. | BLOCKED |
| QA-04.2 | A failed required gate must not be bypassed by removing the test, lowering a threshold without approval, or hardcoding data solely to satisfy a test. | BLOCKED |
| QA-04.3 | Keep mock/integration/live checks clearly separate. | BLOCKED |

## QA-05 — Requirement matrix.

**FIXED AND VERIFIED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:292`

Every numbered master ID and sentence-level material criterion is listed with status, source, phase, evidence, command, time/build and owner action.

Evidence: reports/REQUIREMENTS_MATRIX.md; reports/requirements.json

Command/result: write-audit-handoff; matrix completeness check

Remaining action: Refresh after new evidence; never promote a blocked criterion on code existence alone. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| QA-05.1 | Create `reports/REQUIREMENTS_MATRIX.md` or an equivalent machine-readable register covering every requirement ID and its material subcriteria. | FIXED AND VERIFIED |
| QA-05.2 | Include requirement, source, phase, priority, acceptance evidence, status, affected files/routes, test command/result, timestamp, commit/build, unresolved action, and responsible owner. | FIXED AND VERIFIED |
| QA-05.3 | Do not mark a whole section PASS because one representative check passed. | FIXED AND VERIFIED |

## QA-06 — Severity.

**PASS** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:296`

Critical source, live-integration, indexing/preview, recovery and performance gaps are explicit launch blockers; recommendation remains NOT READY.

Evidence: PRE_DEPLOYMENT_AUDIT.md

Command/result: Review blocker register

Remaining action: Close blockers before changing recommendation. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| QA-06.1 | Content loss, secret/data exposure, broken critical routes, misleading business facts, accidental noindex/canonical failures on money pages, nonfunctional advertised lead delivery, or missing recovery capability are release blockers. | PASS |
| QA-06.2 | Do not hide them inside an average score. | PASS |
| QA-06.3 | List lesser issues separately with risk and explicit disposition. | PASS |

## M1 — Discover and reconcile.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:300`

Milestone remains incomplete while its source, integration or acceptance prerequisites are unresolved.

Evidence: reports/REQUIREMENTS_MATRIX.md; PRE_DEPLOYMENT_AUDIT.md

Command/result: See component requirements

Remaining action: Complete the relevant component requirements without discarding verified work. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| M1.1 | Read all specifications; inspect existing work and deployment hooks; establish business facts, feature parity, source coverage, and the full migration manifest. | BLOCKED |
| M1.2 | Identify blockers and add evidence-driven tasks. | BLOCKED |
| M1.3 | Do not delay independent implementation merely because one account is unavailable. | BLOCKED |

## M2 — Foundation and CMS.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:302`

Milestone remains incomplete while its source, integration or acceptance prerequisites are unresolved.

Evidence: reports/REQUIREMENTS_MATRIX.md; PRE_DEPLOYMENT_AUDIT.md

Command/result: See component requirements

Remaining action: Complete the relevant component requirements without discarding verified work. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| M2.1 | Complete typed Astro/Sanity integration, environments, protected previews, base layouts, content models, SEO generation, safe publishing, and configuration validation. | BLOCKED |
| M2.2 | Verify against small representative test records before importing everything. | BLOCKED |

## M3 — Templates and design.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:304`

Milestone remains incomplete while its source, integration or acceptance prerequisites are unresolved.

Evidence: reports/REQUIREMENTS_MATRIX.md; PRE_DEPLOYMENT_AUDIT.md

Command/result: See component requirements

Remaining action: Complete the relevant component requirements without discarding verified work. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| M3.1 | Complete responsive homepage/service/article/archive/contact templates, accessible global navigation, approved design system, real image assets, restrained motion, and editor controls. | BLOCKED |
| M3.2 | Show functioning pages with representative migrated content—not an attractive empty scaffold. | BLOCKED |

## M4 — Full migration.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:306`

Milestone remains incomplete while its source, integration or acceptance prerequisites are unresolved.

Evidence: reports/REQUIREMENTS_MATRIX.md; PRE_DEPLOYMENT_AUDIT.md

Command/result: See component requirements

Remaining action: Complete the relevant component requirements without discarding verified work. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| M4.1 | Run staged imports, reconcile every source record/media asset/metadata field, preserve legacy paths, and implement approved redirects. | BLOCKED |
| M4.2 | Keep proposed content corrections separate until approved. | BLOCKED |
| M4.3 | Repeat import/delta tests safely. | BLOCKED |

## M5 — Integrations and hardening.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:308`

Milestone remains incomplete while its source, integration or acceptance prerequisites are unresolved.

Evidence: reports/REQUIREMENTS_MATRIX.md; PRE_DEPLOYMENT_AUDIT.md

Command/result: See component requirements

Remaining action: Complete the relevant component requirements without discarding verified work. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| M5.1 | Complete verified lead delivery, appointment behavior, analytics/consent, security/cache rules, backups/restoration, and observability. | BLOCKED |
| M5.2 | Document account-specific blockers instead of substituting simulated integrations. | BLOCKED |

## M6 — Pre-launch audit.

**BLOCKED** · prelaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:310`

Milestone remains incomplete while its source, integration or acceptance prerequisites are unresolved.

Evidence: reports/REQUIREMENTS_MATRIX.md; PRE_DEPLOYMENT_AUDIT.md

Command/result: See component requirements

Remaining action: Complete the relevant component requirements without discarding verified work. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| M6.1 | Run full checks, compare old/new crawls, test manual journeys, review performance and accessibility, close failures, and generate an evidence-backed release recommendation. | BLOCKED |
| M6.2 | Code review and user acceptance must cover substantive content, not only appearance. | BLOCKED |

## M7 — Controlled launch, only after separate approval.

**NOT TESTED** · cutover · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:312`

Milestone remains incomplete while its source, integration or acceptance prerequisites are unresolved.

Evidence: reports/REQUIREMENTS_MATRIX.md; PRE_DEPLOYMENT_AUDIT.md

Command/result: See component requirements

Remaining action: Complete the relevant component requirements without discarding verified work. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| M7.1 | Follow the runbook below; complete actual cutover and smoke tests only once explicitly authorized. | NOT TESTED |
| M7.2 | This document alone is not launch authorization. | NOT TESTED |

## M8 — Post-launch validation.

**NOT TESTED** · postlaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:314`

Milestone remains incomplete while its source, integration or acceptance prerequisites are unresolved.

Evidence: reports/REQUIREMENTS_MATRIX.md; PRE_DEPLOYMENT_AUDIT.md

Command/result: See component requirements

Remaining action: Complete the relevant component requirements without discarding verified work. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| M8.1 | Provide a named-owner monitoring checklist for launch day, days 1–7, and days 14/30, adjusted to available data. | NOT TESTED |
| M8.2 | This is an operational handoff schedule, not a claim that Codex or ChatGPT will work asynchronously. | NOT TESTED |
| M8.3 | Do not label scheduled checks completed before they run. | NOT TESTED |

## LAUNCH-01 — Preflight.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:318`

Separate explicit owner launch approval is required after protected staging review. No production release or DNS changes occurred.

Evidence: DEPLOYMENT_RUNBOOK.md; ROLLBACK_PLAN.md; migration/pre-deployment/dns-observed.json

Command/result: Read-only provider/DNS inspection; no cutover tests

Remaining action: Close prelaunch blockers, reconcile the final delta and request separate explicit owner approval before launch. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| LAUNCH-01.1 | Obtain approval for the exact release/commit, business facts, migration dispositions, material content changes, and any accepted exceptions. | BLOCKED |
| LAUNCH-01.2 | Verify backups/restore, final delta, production settings, real service configuration, redirect map, public contact details, and rollback authority. | BLOCKED |
| LAUNCH-01.3 | Record responsible people and change sequence. | BLOCKED |

## LAUNCH-02 — DNS and email safety.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:320`

Separate explicit owner launch approval is required after protected staging review. No production release or DNS changes occurred.

Evidence: DEPLOYMENT_RUNBOOK.md; ROLLBACK_PLAN.md; migration/pre-deployment/dns-observed.json

Command/result: Read-only provider/DNS inspection; no cutover tests

Remaining action: Close prelaunch blockers, reconcile the final delta and request separate explicit owner approval before launch. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| LAUNCH-02.1 | Snapshot existing DNS and hosting settings. | BLOCKED |
| LAUNCH-02.2 | Preserve MX, SPF, DKIM, DMARC, verification records, and unrelated subdomains. | BLOCKED |
| LAUNCH-02.3 | Change only approved web-hosting records/routes. | BLOCKED |
| LAUNCH-02.4 | Do not move registrar, cancel hosting, or disturb business email as an incidental part of launch. | BLOCKED |

## LAUNCH-03 — Controlled release.

**NOT TESTED** · cutover · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:322`

Separate explicit owner launch approval is required after protected staging review. No production release or DNS changes occurred.

Evidence: DEPLOYMENT_RUNBOOK.md; ROLLBACK_PLAN.md; migration/pre-deployment/dns-observed.json

Command/result: Read-only provider/DNS inspection; no cutover tests

Remaining action: Close prelaunch blockers, reconcile the final delta and request separate explicit owner approval before launch. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| LAUNCH-03.1 | Publish only the approved content/build; bind the authorized production domain; enable the correct production robots/indexability policy; activate tested redirects; invalidate appropriate caches. | NOT TESTED |
| LAUNCH-03.2 | Keep protected staging non-indexable. | NOT TESTED |
| LAUNCH-03.3 | Record timestamps and release identity. | NOT TESTED |

## LAUNCH-04 — Immediate verification.

**NOT TESTED** · cutover · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:324`

Separate explicit owner launch approval is required after protected staging review. No production release or DNS changes occurred.

Evidence: DEPLOYMENT_RUNBOOK.md; ROLLBACK_PLAN.md; migration/pre-deployment/dns-observed.json

Command/result: Read-only provider/DNS inspection; no cutover tests

Remaining action: Close prelaunch blockers, reconcile the final delta and request separate explicit owner approval before launch. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| LAUNCH-04.1 | Test root/host variants, all critical commercial pages, sampled legacy URLs/media, menus, real status codes, canonical/robots headers, sitemap, forms, contact/directions, analytics behavior, and TLS. | NOT TESTED |
| LAUNCH-04.2 | Check for public drafts, dummy data, mixed-content errors, and secret leakage. | NOT TESTED |
| LAUNCH-04.3 | Verify actual business email continuity after relevant infrastructure changes. | NOT TESTED |

## LAUNCH-05 — Search continuity.

**NOT TESTED** · cutover · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:326`

Separate explicit owner launch approval is required after protected staging review. No production release or DNS changes occurred.

Evidence: DEPLOYMENT_RUNBOOK.md; ROLLBACK_PLAN.md; migration/pre-deployment/dns-observed.json

Command/result: Read-only provider/DNS inspection; no cutover tests

Remaining action: Close prelaunch blockers, reconcile the final delta and request separate explicit owner approval before launch. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| LAUNCH-05.1 | Preserve Search Console/Bing verification and submit the correct sitemap where authorized. | NOT TESTED |
| LAUNCH-05.2 | Recheck indexing settings on critical pages. | NOT TESTED |
| LAUNCH-05.3 | This is a same-domain rebuild: do not use a domain Change of Address workflow merely because the CMS/hosting changed. | NOT TESTED |
| LAUNCH-05.4 | Verify current guidance if a genuine domain move is separately approved. [S05] | NOT TESTED |

## LAUNCH-06 — Rollback triggers.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:328`

Separate explicit owner launch approval is required after protected staging review. No production release or DNS changes occurred.

Evidence: DEPLOYMENT_RUNBOOK.md; ROLLBACK_PLAN.md; migration/pre-deployment/dns-observed.json

Command/result: Read-only provider/DNS inspection; no cutover tests

Remaining action: Close prelaunch blockers, reconcile the final delta and request separate explicit owner approval before launch. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| LAUNCH-06.1 | Define immediate rollback/escalation for significant content loss, widespread errors, exposed private data, broken core inquiry delivery, critical accidental deindexing settings, or severe availability/performance regression. | BLOCKED |
| LAUNCH-06.2 | Roll back deployment/routes safely and reconcile new content/inquiries collected during the cutover; do not overwrite them with an older snapshot. | BLOCKED |

## LAUNCH-07 — Legacy retention.

**BLOCKED** · prelaunch · P0/P1 release gate

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:330`

Separate explicit owner launch approval is required after protected staging review. No production release or DNS changes occurred.

Evidence: DEPLOYMENT_RUNBOOK.md; ROLLBACK_PLAN.md; migration/pre-deployment/dns-observed.json

Command/result: Read-only provider/DNS inspection; no cutover tests

Remaining action: Close prelaunch blockers, reconcile the final delta and request separate explicit owner approval before launch. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| LAUNCH-07.1 | Retain the old site/backups in a secure, nonpublic or properly protected state until Navid explicitly approves retirement. | BLOCKED |
| LAUNCH-07.2 | Prevent a publicly crawlable duplicate copy while preserving recovery. | BLOCKED |
| LAUNCH-07.3 | Do not remove redirects or old media dependencies until their replacements are confirmed. | BLOCKED |

## POST-01 — Operational checks.

**NOT TESTED** · postlaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:334`

Future checks are scheduled in the handoff checklist, not executed. No background monitor or phone-alert delivery is claimed.

Evidence: POST_LAUNCH_CHECKLIST.md

Command/result: Not run: release has not happened

Remaining action: Navid/operator: carry out launch day, days 1–7 and days 14/30 checks after release. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| POST-01.1 | Monitor errors, uptime, inquiry delivery, webhook/build failures, broken legacy URLs, sitemap/indexing signals, and unwanted draft/preview exposure. | NOT TESTED |
| POST-01.2 | Log actual checks and fixes. | NOT TESTED |
| POST-01.3 | Set alerts/jobs only with approved infrastructure and tested notification delivery. | NOT TESTED |

## POST-02 — Search and conversion comparison.

**NOT TESTED** · postlaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:336`

Future checks are scheduled in the handoff checklist, not executed. No background monitor or phone-alert delivery is claimed.

Evidence: POST_LAUNCH_CHECKLIST.md

Command/result: Not run: release has not happened

Remaining action: Navid/operator: carry out launch day, days 1–7 and days 14/30 checks after release. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| POST-02.1 | Compare landing-page/query performance, actual inquiries, call/directions clicks, paid-conversion continuity, and indexing coverage against the recorded baseline. | NOT TESTED |
| POST-02.2 | Account for data delays, seasonality, demand, and campaign changes. | NOT TESTED |
| POST-02.3 | Report correlation honestly; do not attribute every change to the migration. | NOT TESTED |

## POST-03 — Field performance.

**NOT TESTED** · postlaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:338`

Future checks are scheduled in the handoff checklist, not executed. No background monitor or phone-alert delivery is claimed.

Evidence: POST_LAUNCH_CHECKLIST.md

Command/result: Not run: release has not happened

Remaining action: Navid/operator: carry out launch day, days 1–7 and days 14/30 checks after release. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| POST-03.1 | Review available real-user Core Web Vitals after sufficient traffic/data exists. | NOT TESTED |
| POST-03.2 | State whether results describe individual URLs or the origin and whether they include pre-migration history. | NOT TESTED |
| POST-03.3 | Lack of field data is not a PASS. | NOT TESTED |
| POST-03.4 | Use verified instrumentation while evidence accumulates. [S09] | NOT TESTED |

## POST-04 — Maintenance ownership.

**NOT TESTED** · postlaunch · P1 acceptance

Source: `CASH4GOLD_MASTER_BUILD_PLAN_v1.md:340`

Future checks are scheduled in the handoff checklist, not executed. No background monitor or phone-alert delivery is claimed.

Evidence: POST_LAUNCH_CHECKLIST.md

Command/result: Not run: release has not happened

Remaining action: Navid/operator: carry out launch day, days 1–7 and days 14/30 checks after release. Responsible: Navid for facts/account verification; implementation operator for code/integration tests.

| Criterion | Requirement | Status |
|---|---|---|
| POST-04.1 | Document CMS/editor training, content review cadence, dependency/security updates, credential reviews, backup/restore checks, redirect maintenance, and ownership of unresolved issues. | NOT TESTED |
| POST-04.2 | Provide safe rollback instructions for routine updates. | NOT TESTED |

## SOCIAL-01 — Reuse verified social profiles

**FIXED AND VERIFIED** · prelaunch · P1 owner acceptance

Source: `Owner social automation request and three-post/week reply, 2026-09-10`

Instagram/Facebook/Yelp links extracted from the live site and rendered across the new site.

Evidence: migration/pre-deployment/social-profile-evidence.json; tests/social-profiles.test.mjs

Command/result: Profile extraction; unit/HTML verification

Remaining action: Verify any additional owner-supplied networks before adding them. Responsible: Navid + implementation operator.

| Criterion | Requirement | Status |
|---|---|---|
| SOCIAL-01.1 | Reuse verified social profiles | FIXED AND VERIFIED |

## SOCIAL-02 — Three posts per week

**FIXED AND VERIFIED** · prelaunch · P1 owner acceptance

Source: `Owner social automation request and three-post/week reply, 2026-09-10`

Owner chose three posts/week. Scheduler uses Monday/Wednesday/Friday at 10 a.m. Los Angeles, including daylight-saving changes.

Evidence: src/lib/social-publishing.mjs; tests/social-publishing.test.mjs

Command/result: Local clock and SQLite slot tests pass

Remaining action: Activate only after connection/live test gates pass; time of day is a documented implementation default. Responsible: Navid + implementation operator.

| Criterion | Requirement | Status |
|---|---|---|
| SOCIAL-02.1 | Three posts per week | FIXED AND VERIFIED |

## SOCIAL-03 — Existing article backlog

**BLOCKED** · prelaunch · P1 owner acceptance

Source: `Owner social automation request and three-post/week reply, 2026-09-10`

105 eligible canonical/indexable articles have distinct JPEG and separate caption drafts. Duplicate canonical/noindex articles are explicitly held. No posts sent.

Evidence: migration/pre-deployment/social-backlog.json; scripts/prepare-social-backlog.mjs

Command/result: 105 local drafts/images; 105 unique hashes

Remaining action: Approve final article/caption/media and connect accounts before enqueueing published CMS documents. Responsible: Navid + implementation operator.

| Criterion | Requirement | Status |
|---|---|---|
| SOCIAL-03.1 | Existing article backlog | BLOCKED |

## SOCIAL-04 — Future article opt-in

**BLOCKED** · prelaunch · P1 owner acceptance

Source: `Owner social automation request and three-post/week reply, 2026-09-10`

Per-article channel/caption/image/reviewer controls exist in compiled Sanity schema; scheduler reads only published approved documents and checks matching live revision.

Evidence: studio/social-schema.js; workers/social/index.mjs

Command/result: 15-type schema; mocked end-to-end tests

Remaining action: Test actual Studio opt-in, publish, live rebuild, queue and network post. Responsible: Navid + implementation operator.

| Criterion | Requirement | Status |
|---|---|---|
| SOCIAL-04.1 | Future article opt-in | BLOCKED |

## SOCIAL-05 — Website traffic and interlinking

**BLOCKED** · prelaunch · P1 owner acceptance

Source: `Owner social automation request and three-post/week reply, 2026-09-10`

Tracked article URLs, profile-link instruction and website profile links implemented. Instagram profile guide link corrected and read back; no traffic-performance claim.

Evidence: src/lib/social-publishing.mjs; migration/pre-deployment/social-profile-evidence.json; SOCIAL_PUBLISHING.md

Command/result: URL tests; Instagram browser and HTTP 301 observation

Remaining action: Verify Meta post destinations/permalinks and analytics attribution after first authorized live promotion. Responsible: Navid + implementation operator.

| Criterion | Requirement | Status |
|---|---|---|
| SOCIAL-05.1 | Website traffic and interlinking | BLOCKED |

## SOCIAL-06 — Account connections and publishing

**BLOCKED** · prelaunch · P1 owner acceptance

Source: `Owner social automation request and three-post/week reply, 2026-09-10`

Meta app 1771403890678469 is owned by verified portfolio 1131065491630831. Instagram tester accepted; account 17841461592404304 and Facebook Page 107008765832415 verified. Configuration 1713622949693414 saved with Pages-only publishing/read/list scopes and recommended 60-day tokens. Token grants, secure storage, API calls and real posts remain incomplete. Yelp ordinary blog-post automation unsupported by the inspected API.

Evidence: migration/pre-deployment/account-observations.json; SOCIAL_PUBLISHING.md

Command/result: Authenticated app/role/portfolio/Page inspection and saved configuration read-back; provider mocks only

Remaining action: Complete scoped token grants and storage, verify API version/identity/permissions; provision private Cloudflare queue; test an approved real promotion. Responsible: Navid + implementation operator.

| Criterion | Requirement | Status |
|---|---|---|
| SOCIAL-06.1 | Account connections and publishing | BLOCKED |

## SOCIAL-07 — Pause, deduplication and failure recovery

**FIXED AND VERIFIED** · prelaunch · P1 owner acceptance

Source: `Owner social automation request and three-post/week reply, 2026-09-10`

Local SQL/provider tests prove pause, one slot/network/day, one lifetime article/channel, container persistence, unavailable-article rotation, isolated article timeouts, missing/expired token holds and no blind ambiguous-write retry. Real runtime remains separate.

Evidence: workers/social; tests/social-publishing.test.mjs; migration/pre-deployment/social-queue-tests.log

Command/result: 13 social tests pass with SQLite + mock providers; all 29 unit tests pass

Remaining action: Reconcile uncertain IDs against the network; never reset uncertain jobs blindly. Actual token renewal and delivered operator alerts remain required. Responsible: Navid + implementation operator.

| Criterion | Requirement | Status |
|---|---|---|
| SOCIAL-07.1 | Pause, deduplication and failure recovery | FIXED AND VERIFIED |

## SOCIAL-08 — Unattended hosting and monitoring

**BLOCKED** · prelaunch · P1 owner acceptance

Source: `Owner social automation request and three-post/week reply, 2026-09-10`

Separate Cloudflare scheduled worker source supplied. Cron, route, database and publishing switches remain disabled until configured/tested. No Codex reminder is substituted for app publishing.

Evidence: wrangler.social.jsonc; SOCIAL_PUBLISHING.md

Command/result: No remote scheduler deployment or alert delivery test

Remaining action: Configure owner-owned Cloudflare resources within approved limits; verify scheduling and operator alerts independently of this computer. Responsible: Navid + implementation operator.

| Criterion | Requirement | Status |
|---|---|---|
| SOCIAL-08.1 | Unattended hosting and monitoring | BLOCKED |
