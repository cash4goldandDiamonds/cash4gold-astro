# Cash 4 Gold & Diamonds

**Latest release preparation - September 14, 2026:** The owner authorized launch with optional improvements afterward. Read the [initial production release plan](reports/INITIAL_PRODUCTION_RELEASE_2026-09-14.md). The deliberate reviewed-static mode preserves Sanity's separate approval safeguards and requires an exact clean Git commit. Four newly published articles are included: 202 content pages, 115 articles and 18 preserved redirects. Final candidate validation and actual production cutover remain pending; this is not a claim that launch has occurred.

Continue the existing private WordPress-to-Astro/Sanity rebuild in https://github.com/cash4goldandDiamonds/cash4gold-astro. The [September 10 inspection](reports/INSPECTION_2026-09-10.md) is the authoritative starting point; both original local copies and useful GitHub planning/configuration files remain preserved.

## Current status — September 14, 2026

Protected staging remains at https://cash4gold-private-preview.cash4goldanddiamond.workers.dev/. Its last deployed source is `cd6d3f8`. The uploaded `e1f0d69` baseline passed exact-head GitHub quality checks on September 14, including the native Worker and Studio builds. Its separate performance run found a missing favicon, now restored in the source. The final combined candidate requires a new exact-head production build. Earlier test totals and account observations below are dated evidence.

Both original local copies and original GitHub main/safety branches remain preserved. The owner approved the limited sender setup and later explicitly approved production launch. Website routing, WordPress and nameservers remain unchanged at this source checkpoint. Initial production uses honest contact fallbacks with inquiry sending and analytics disabled; their verification and CMS publishing follow after launch.

## Development and verification

Use Node 24.19.0 and pnpm 11.19.0. The project uses Astro 7.3.2 and Sanity 6.13.0.

1. `pnpm install --frozen-lockfile`
2. `pnpm test`, `pnpm verify:schema`, `pnpm verify:source-security`, `pnpm exec astro check`
3. `pnpm build`, then `node scripts/verify-built-site.mjs`
4. `pnpm verify`, `pnpm verify:cms`, `pnpm verify:editorial`, `pnpm verify:substantive`, `pnpm verify:design`, `pnpm audit --audit-level high`

`pnpm dev` starts the local preview. Blank Sanity settings use the complete preserved content snapshot. The GitHub quality workflow checks a fresh exact-head checkout with a locked dependency install. The new isolated Lighthouse workflow has a separate frozen tooling lock and explicitly runs `node --test tools/performance/audit-policy.test.mjs`; its lab measurements remain pending. Cloudflare Builds separately uses the audit branch and protected preview configuration. Staging indexing stays disabled. See the current checkpoint for the three staging analytics build variables and their CSP/finalizer integration.

## Open launch gates

Inquiry configuration/delivery, hosted Sanity reconciliation/draft preview/rebuild/rollback, actual analytics receipt/consent, remaining SEO/media reconciliation, measured performance and final content acceptance remain open. The owner's privacy retention policy is incorporated into local source; deployment and hosted-service consistency remain separate. The owner reports the WordPress backup complete; a restore has not been independently exercised. Inbox testing remains deferred until after confirmed launch and real booking tests remain declined. Neither deferral is a passing result or launch approval.

The Worker-specific Access policy must protect all traffic. Never attach `cash4goldanddiamond.com` or change the live WordPress site without separate explicit launch approval. Deployments disable Worker endpoints by default; re-enable only the staging hostname after verifying the build and Access. Preview-version URLs stay off.

## Preserved records

- [Migration requirements](MIGRATION-REQUIREMENTS.md) and [migration status](MIGRATION-STATUS.md)
- [September 11 hosted QA](reports/PROTECTED_STAGING_QA_2026-09-11.md) and [September 11 local validation](reports/FINAL_STAGING_LOCAL_VALIDATION_2026-09-11.json)
- [Repository preservation](REPOSITORY_SYNC.md), [handoff](CODEX_HANDOFF.md), and [launch checklist](LAUNCH-CHECKLIST.md)
- [Authenticated WordPress inspection](reports/WORDPRESS_AUTHENTICATED_INSPECTION_2026-09-10.md) and [Rank Math follow-up](reports/RANK_MATH_AUTHENTICATED_FOLLOWUP_2026-09-11.md)
- [Historical checkpoints](migration/pre-deployment/prior-instructions/)

Do not commit credentials, account-verification values, real environment files, raw private exports, customer submissions, caches, build output or unnecessary original media. Required website media, source, configuration, scripts, tests, redirects and workflows are preserved.
