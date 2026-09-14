# Deployment runbook — do not execute until ready

**NOT READY.** The owner authorized launch once everything is complete. That condition is unmet. This document describes future operator actions; it is not evidence that hosting, DNS, secrets or production content were changed.

## Required preparation

1. Close all mandatory prelaunch items in `reports/REQUIREMENTS_MATRIX.md`, including human source/content/media approval, full exports, private CMS editing, genuine inquiry delivery, performance/accessibility and tested recovery. Run `node scripts/verify-release-readiness.mjs`; unresolved requirements must block promotion.
2. Reconcile a fresh WordPress delta against the source manifest immediately before cutover. Preserve posts, media, categories, URLs, metadata, originals and approved dispositions. Record who approved each meaningful change. Agree a short editorial freeze only when necessary; do not silently lose later WordPress edits.
3. Download and validate a complete WordPress files/uploads/database backup, retain it outside Git, hash it, and restore into an isolated environment. Record current DNS, TLS, host, CMS snapshot and immutable site artifact. See `ROLLBACK_PLAN.md`.
4. Verify account/source ownership, branch protection, repository contents, permission scopes, plan costs and billing owner. No paid service may be purchased automatically. Confirm Sanity trial expiry and private-preview/editor entitlements; Cloudflare Free does not prove every proposed feature is included.
5. Create protected Cloudflare staging with real authentication, noindex and no-store. Configure private Sanity read access and build-only secrets. Test missing token/unauthorized access and verify draft content is never visible without authentication. Do not deploy the isolated audit output to a public URL.

## Build and acceptance

Use Node 24.19.0 and pnpm 11.19.0 with the checked-in lockfile. `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm verify:schema`, Astro check, `pnpm build`, `pnpm verify`, `pnpm verify:cms`, `pnpm verify:editorial`, `pnpm verify:substantive` and `node scripts/verify-built-site.mjs` are local checks. Set `ASTRO_TELEMETRY_DISABLED=1` in this Windows environment. The full paths to Node entry points used for reproducibility are in the logs and package scripts.

Preview: `SITE_ENV=preview`, `ENABLE_PRODUCTION_INDEXING=false`. Set both Sanity project and private staging dataset together, with a scoped read token. Draft perspective is allowed only for private preview. Test connected CMS lifecycle and the actual build pipeline before production.

Production: use project `gisdw6qa`, dataset `production`, perspective `published`, `SITE_ENV=production`, `ENABLE_PRODUCTION_INDEXING=true`. Every preserved required page must be complete and have recorded human approval. Leave `ISOLATED_PRODUCTION_AUDIT=false`, use the normal release output, and never repurpose `.cache/production-audit` for release. Do not copy secrets, source exports, `.prerender`, temporary audit HTML or a build manifest into a public artifact.

On protected real hosting, verify GET and HEAD status, 15 explicit 301 mappings, query retention, canonical HTTPS/non-www/trailing-slash handling, missing-page 404, headers/CSP and caching. Cloudflare's automatic trailing-slash behavior is not equivalent to proof of a required 301; document/test any runtime 307 and implement required normalization without loops. Verify external navigation, tel, email, Calendly, forms, successful delivery, failures/spam/duplicates, consent and authorized analytics debug events. No real customer lead is a test fixture.

Measure the eight representative routes listed in `POST_LAUNCH_CHECKLIST.md` with three mobile and three desktop Lighthouse runs each. Retain median, worst, timestamp, URL and artifact. Complete manual keyboard/reflow/screen-reader/contrast/motion checks. Targets are not measurements.

## Conditional cutover

Only after the actual audit recommendation is READY FOR OWNER LAUNCH APPROVAL and the previously granted conditional launch authorization is applicable, identify the exact content snapshot, code commit and tested artifact. Record the operator/time and promotion destination. Deploy the verified artifact using the owner-owned pipeline. Preserve current mail-related MX/TXT/autodiscover/email and unrelated DNS records; do not replace the whole zone. Validate TLS and domain ownership before changing only the web routing required for launch.

Immediately verify production canonical/robots/sitemap, critical routes and actual inquiry delivery. Submit the verified sitemap to the correct Search Console property and use supported URL Inspection requests where eligible and available. Google does not provide guaranteed bulk indexing for every ordinary article; do not use the jobs/broadcast Indexing API for general jewelry content or claim all URLs indexed from a sitemap submission.

Keep WordPress and backups intact until recovery and postlaunch acceptance are complete. If error/lead/privacy/content regressions occur, use the known rollback, not ad hoc deletion. Enable social automation only after its own real-account/live-revision test gates pass. Run the postlaunch checklist and actual owner alerts.
