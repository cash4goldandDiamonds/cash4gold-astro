# Cash 4 Gold & Diamonds

**Latest audit — September 11, 2026:** The [final SEO/content/conversion/UX audit](reports/FINAL_SEO_CONTENT_UX_AUDIT_2026-09-11.md) supersedes older page-quality and validation claims below. Gold/home/reviews/contact and supporting copy are updated; all 111 articles have individual recommendations. NO-GO remains: delivery, analytics/consent, hosted CMS, backup/restore, remaining SEO/media acceptance and measured performance are incomplete. No production change is authorized.

Continue the existing private WordPress-to-Astro/Sanity rebuild in https://github.com/cash4goldandDiamonds/cash4gold-astro. The [September 10 inspection](reports/INSPECTION_2026-09-10.md) is the authoritative starting point; both original local copies and useful GitHub planning/configuration files remain preserved.

## Current status — September 11, 2026

**NOT READY TO GO LIVE.** Protected GitHub-backed staging now exists at https://cash4gold-private-preview.cash4goldanddiamond.workers.dev/. The current source preserves 198 content pages and 111 articles, with 18 redirects and 217 generated routes. All 33 automated tests and the complete local verification/build passed after the three Rank Math redirect fixes. All 198 content routes rendered behind account-only Cloudflare Access. [Current staging QA and launch blockers](reports/PROTECTED_STAGING_QA_2026-09-11.md) supersede earlier statements below that no staging site exists, that only 15 redirects exist, or that authorization is pending. Earlier commit IDs/counts are historical evidence. The audit branch's final uploaded source requires its own exact-head CI/deployment verification, recorded in the final handoff.

Both original local copies and original GitHub main/safety branches are preserved. No production, DNS, nameserver, GoDaddy or paid-service changes were made. Launch requires separate explicit owner approval.

## Development and verification

Use Node 24.19.0 and pnpm 11.19.0. The project uses Astro 7.3.2 and Sanity 6.13.0.

1. `pnpm install --frozen-lockfile`
2. `pnpm test`, `pnpm verify:schema`, `pnpm verify:source-security`, `pnpm exec astro check`
3. `pnpm build`, then `node scripts/verify-built-site.mjs`
4. `pnpm verify`, `pnpm verify:cms`, `pnpm verify:editorial`, `pnpm verify:substantive`, `pnpm verify:design`, `pnpm audit --audit-level high`

`pnpm dev` starts the local preview. Blank Sanity settings use the complete preserved content snapshot. The GitHub quality workflow checks a fresh exact-head checkout with a locked dependency install. Cloudflare Builds separately uses the audit branch and the protected preview configuration. Build output is optimized for hosting while indexing remains disabled on staging.

## Open launch gates

Inquiry delivery, appointment confirmation, hosted Sanity draft preview/roles/rebuild/rollback, analytics/consent, full backup/restore, remaining private SEO/media reconciliation, measured performance, comprehensive accessibility/device QA and owner content acceptance remain incomplete. This is **NOT READY TO GO LIVE**.

The Worker-specific Access policy must protect all traffic. Never attach `cash4goldanddiamond.com` or change the live WordPress site without separate explicit launch approval. Deployments disable Worker endpoints by default; re-enable only the staging hostname after verifying the build and Access. Preview-version URLs stay off.

## Preserved records

- [Migration requirements](MIGRATION-REQUIREMENTS.md) and [migration status](MIGRATION-STATUS.md)
- [Current hosted QA](reports/PROTECTED_STAGING_QA_2026-09-11.md) and [local validation](reports/FINAL_STAGING_LOCAL_VALIDATION_2026-09-11.json)
- [Repository preservation](REPOSITORY_SYNC.md), [handoff](CODEX_HANDOFF.md), and [launch checklist](LAUNCH-CHECKLIST.md)
- [Authenticated WordPress inspection](reports/WORDPRESS_AUTHENTICATED_INSPECTION_2026-09-10.md) and [Rank Math follow-up](reports/RANK_MATH_AUTHENTICATED_FOLLOWUP_2026-09-11.md)
- [Historical checkpoints](migration/pre-deployment/prior-instructions/)

Do not commit credentials, account-verification values, real environment files, raw private exports, customer submissions, caches, build output or unnecessary original media. Required website media, source, configuration, scripts, tests, redirects and workflows are preserved.
