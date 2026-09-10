# Cash 4 Gold & Diamonds

Existing private WordPress-to-Astro/Sanity rebuild for https://cash4goldanddiamond.com/. Continue this implementation in https://github.com/cash4goldandDiamonds/cash4gold-astro; do not scaffold a replacement.

## Current checkpoint — September 10, 2026

**NOT READY TO GO LIVE.** The September 10 inspection is the authoritative starting point: [inspection report](reports/INSPECTION_2026-09-10.md). Subsequent verified results are in [migration status](MIGRATION-STATUS.md), [synchronization evidence](reports/REPOSITORY_SYNC_VALIDATION.json), and [the pre-deployment audit](PRE_DEPLOYMENT_AUDIT.md).

The latest audit has 198 content pages, 111 articles, 107 distinct guide-card images, 15 redirects and 430 prepared Sanity documents. The build generates 214 routes, including the 404 page. All 111 article reviews are recorded; the two recovered articles are included. The complete source package passed 31 automated tests and all 12 verification stages, including installation from the lockfile and a fresh optimized Astro build. Connected integrations and hosted acceptance remain separate gates.

Both local copies remain preserved. The audit checkout is the current implementation; the earlier home checkout and unneeded original media remain local. See [REPOSITORY_SYNC.md](REPOSITORY_SYNC.md) for preservation and excluded-file records.

## Development and verification

Use Node 24 and pnpm 11.19.0 to match the verified environment. The project uses Astro 7.3.2 and Sanity 6.13.0.

1. Install with `pnpm install --frozen-lockfile`.
2. Use `pnpm dev` for the loopback preview.
3. Run `pnpm test`, `pnpm verify:schema`, and `pnpm exec astro check`.
4. Run `pnpm verify:source-security` and `pnpm build`.
5. Run `pnpm verify`, `pnpm verify:cms`, `pnpm verify:editorial`, `pnpm verify:substantive`, `pnpm verify:design`, and `pnpm audit --audit-level high`.

Blank Sanity settings select the complete local content snapshot. Copy only blank configuration examples when needed; never commit local credentials. See [LOCAL-DEVELOPMENT.md](LOCAL-DEVELOPMENT.md) for the connected CMS workflow.

## Staging and launch authority

The owner's latest instruction authorizes consolidation to this existing private repository and protected Cloudflare staging from the saved source. Staging must require authentication, remain noindex, and use no live domain. DNS, domain nameservers, GoDaddy settings and the live WordPress site must remain unchanged.

**A separate explicit owner approval is required before launch, even if every test passes. No automatic production release is authorized.** Historical conditional launch statements are superseded by this instruction.

Before launch, complete hosted route/SEO/accessibility/performance checks; real inquiry and appointment delivery; private Sanity import, editing and draft preview; analytics/consent validation; full WordPress/Rank Math/media reconciliation; backup/restore evidence; and owner content/media acceptance. The quality workflow has no push-triggered deployment.

## Project records

- [MIGRATION-REQUIREMENTS.md](MIGRATION-REQUIREMENTS.md): preserved migration and acceptance requirements.
- [MIGRATION-STATUS.md](MIGRATION-STATUS.md): current evidence and remaining work.
- [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md): release gates and explicit approval.
- [CODEX_HANDOFF.md](CODEX_HANDOFF.md): implementation details and continuation safeguards.
- [Historical checkpoints](migration/pre-deployment/prior-instructions/): earlier documentation preserved for provenance.

Do not commit passwords, API keys, account-verification tokens, local environment files, customer submissions, caches, generated builds or unnecessary raw media. Required site media and implementation assets are retained in the source package.
