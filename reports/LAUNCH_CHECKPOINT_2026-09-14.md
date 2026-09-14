# Release preparation checkpoint — September 14, 2026

**Earlier September 14 checkpoint.** The later [initial production release plan](INITIAL_PRODUCTION_RELEASE_2026-09-14.md) supersedes this report’s pending-approval and CMS-before-launch scope. Baseline e1f0d69 now passed exact-head GitHub quality CI. Four later articles, the favicon repair and explicit static production mode are in the final candidate; actual launch is not claimed by this historical record.

## Source and staging identity

The existing private repository is `cash4goldandDiamonds/cash4gold-astro`. The last synchronized audit source is `cd6d3f81422d88d865338f44e88b9b03aca9aa49`, tree `1db8392ed596b135a86efd8c3f3596ce0fa9fc9e`; local checkpoint `64f08d3c25478bdb811336fb70b84642a4220f08` has that same historical tree. The September 14 candidate contains later uncommitted edits. Its final file count, hash and validation results must be bound after the complete source freezes.

Review branch `review/final-launch-checks-2026-09-14` was created from `cd6d3f8`. The planned private review targets the existing `audit/pre-deployment-2026-09-10` branch. No September 14 uploads or commits are claimed here. Fresh quality and performance workflows must run against the actual uploaded head before merging into the audit branch. Original local copies and original remote main/safety branches remain preserved.

Protected staging remains [cash4gold-private-preview](https://cash4gold-private-preview.cash4goldanddiamond.workers.dev/), historically deployed from `cd6d3f8`. September 13 browser checks confirmed authentication redirects on four paths and mobile layout checks across nine routes at two widths. Those are dated observations of the deployed version, not acceptance of the newer source. Preserve Worker-specific All traffic Access, staging noindex, disabled version previews and the absence of a production route.

## September 14 changes and acceptance boundaries

| Workstream | Current evidence | Remaining acceptance |
| --- | --- | --- |
| Inquiry | Client retries retain their reference for unchanged normalized content after edit/undo, permission changes or whitespace changes. Different content rotates it; acceptance clears it. Synthetic regression and independent review passed. Sender verification and restricted encrypted key setup are complete. | Reviewed staging deployment of prepared activation plus privacy copy, Turnstile pairing and actual provider/inbox behavior. Current deployed runtime remains disabled. |
| Consent and analytics | Preview rejects the known live measurement ID. Cross-tab clearing, open-page expiry and loading races stop analytics. Failed persistence removes an old grant if possible; when storage refuses changes, withdrawal stays page-only without reloading into the old grant. Explicit event context excludes inquiry fields and incoming query/referrer paths. Focused synthetic checks and independent review passed. | Fresh staging build, actual Google requests, consent/withdrawal behavior and received events. `inquiry_accepted` is not inbox confirmation, and no real accepted inquiry has been tested. |
| CMS | Preview comparisons now read actual raw IDs/revisions without the CDN, including visible drafts and release versions, and fail on malformed/duplicate evidence. All 53 existing proposals were compared locally with current source: 16 pages and 37 FAQs. | A fresh authenticated raw hosted snapshot and reviewed revision-bound reconciliation. Local export is not hosted evidence. Draft/publish/rebuild/rollback, roles and media acceptance remain incomplete. |
| Privacy and content | The owner supplied inquiry retention and owner-handled deletion wording. The local privacy replacement and matching unapplied CMS proposal incorporate it. [Policy record](PRIVACY_LAUNCH_DECISIONS_2026-09-14.md) and [traffic-title mapping](TRAFFIC_TITLE_MAPPING_2026-09-14.md) record scope. | Final source/editorial QA and actual deployed-service consistency. Existing article indexing decisions and eight conditional merge/redirect proposals remain unapplied. |
| Performance | Isolated locked Lighthouse tooling and a read-only Linux workflow cover nine routes, including Reviews and Estate, three mobile and three desktop runs each. Loopback isolation, finite results, median calculations and score/transfer budgets have focused tests. | All 54 actual lab runs and artifact review. Windows attempts produced zero usable metrics. Hosted performance, warm-cache/interactions, separate SEO/accessibility/best-practices scores and field Core Web Vitals remain unmeasured. |

Raw CMS before/after equality covers the authenticated reader's observed, permission-visible query results. It is not proof of a transactional snapshot or whole-dataset immutability. The hosted UI showed private `migration-staging` with 432 documents; a local generated export has 441. Counts alone cannot establish the necessary reconciliation. The CLI fails with `uv_os_get_passwd` in this environment, and shell HTTPS probes did not obtain a snapshot. A narrowly scoped read-only Studio snapshot-download feature is implemented with synthetic tests, using the existing login and fixed private dataset. It binds download eligibility to the current user/client and checks raw revision inventories around document reads. Actual Studio compilation, hosted download and snapshot provenance remain unverified; the feature is not hosted acceptance or an asset-inclusive backup. No CMS token or hosted mutation was created for this preparation.

## Separate staging analytics configuration

The existing GA account is `312320526`. Root verified a distinct staging property `553985961`, **Cash4Gold Rebuild — Staging QA**, stream `15773012956`, public measurement ID `G-H4HZNYXVZ6`. Production property `439181997` and measurement ID `G-149Y3HZKHT` remain unchanged.

The staging stream has enhanced measurement off and zero connected site tags. Google signals, user-provided data, granular device/location and advertising personalization are off. Event/user retention is two months with activity reset off; the UI states that changes take effect after 24 hours and do not cover most aggregated reports. These settings are account evidence, not a received-event result.

Root verified these persisted Cloudflare **build-process** variables:

```dotenv
SITE_ENV=preview
ENABLE_PRODUCTION_INDEXING=false
PUBLIC_ANALYTICS_ENABLED=true
PUBLIC_ANALYTICS_ENV=preview
PUBLIC_GA4_MEASUREMENT_ID=G-H4HZNYXVZ6
```

The public analytics settings must reach both Astro's `import.meta.env` and `scripts/finalize-build.mjs` through `process.env`, so generated markup and CSP agree. Runtime-only Worker variables or an Astro-only environment load are insufficient. Rebuild the reviewed staging source before testing. No initial Google script is expected before affirmative consent. A staging ID in built HTML does not prove receipt or privacy of actual third-party requests.

## Sender preparation and owner decisions

The owner authorized the exact three sender DNS additions, a domain-restricted Resend sending key and continued protected staging setup on September 14. Root added those records and verified that the original 12 DNS records were unchanged. Root then verified sender domain `notify.cash4goldanddiamond.com` at approximately 1:46 a.m. Pacific, with TLS enforced, tracking unconfigured and receiving off. A key named `Cash4Gold protected staging inquiries`, restricted to sending on that domain, was transferred directly into encrypted Worker secret `INQUIRY_RESEND_API_KEY`. No raw key file or output was retained. Website routing, WordPress and nameservers were not changed. This limited approval does not authorize a production website launch.

`wrangler.preview.jsonc` now prepares `INQUIRY_ENABLED=true` and `INQUIRY_FROM=inquiries@notify.cash4goldanddiamond.com`, with only the existing protected staging origin allowed. This makes activation and the owner-policy privacy page part of the same reviewed build. The currently deployed runtime remains disabled until that build. Verify its source identity, served privacy page, All traffic Access and GET-only readiness after deployment. Keep credentials outside Git, browser bundles and reports. Readiness establishes required-setting presence, not provider validity or inbox delivery. The [inquiry operations guide](../workers/inquiry/README.md) records the exact runtime distinction.

The real inbox test remains owner-deferred until after a confirmed website launch; the existing follow-up should not be duplicated. A real booking test remains declined and the calendar is unchanged. These decisions are not test passes or launch approval. The owner reports the WordPress backup complete; an isolated restore has not been demonstrated.

## Validation scope and unresolved warnings

Focused inquiry, consent, raw-CMS and performance-policy fixtures passed their recorded September 14 reviews. An earlier combined candidate passed local tests and preview/isolated-production checks using reused installed dependencies; later consent, performance, privacy, Studio and documentation changes require final combined verification. Do not reuse its test total or manifest as the final release identity.

Fresh dependency-audit network calls, Worker bundling and Studio compilation encountered environment failures locally. Those failures are not vulnerability findings, successful audits or successful compilation. The existing quality workflow and new performance workflow require fresh frozen installations and exact-head Linux results. Performance's focused tests run explicitly in its own job because the root test glob does not include `tools/performance/`.

The pre-privacy-edit baseline retained 44 table-name accessibility review items, 10 source-text parity warnings and 297 missing-source-text markers, matching the September 11 validation rather than the older archived 8-warning/266-marker report. These are review items, not an empty-page finding or owner approval. The authorized privacy rewrite changes source parity context; final QA must record its actual result. Remaining SEO/media reconciliation, inherited article noindex decisions, factual business claims and human content approval are still open.

Local fixtures do not establish provider behavior, raw hosted headers, role enforcement, CMS lifecycle, current edge/crawler behavior or field performance. Final approval must name the exact reviewed staging release. Do not attach the live domain or change the production WordPress site without separate explicit launch approval.

## Detailed private evidence

Detailed implementation/reviewer reports and synthetic evidence remain outside Git in `work/launch-finish-2026-09-14/`, relative to the parent task workspace. The actual analytics account record is `work/launch-finish-2026-09-14/staging-analytics-account.md`. The September 13 handoff is `work/launch-integrations-2026-09-11/RESUMED_HANDOFF_2026-09-13.md`. Private exports, raw account captures, credentials, caches and generated lab output must stay outside this repository.
