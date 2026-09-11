# Authenticated Rank Math export and redirect fixes

**NOT READY TO GO LIVE.** Export preservation and the bounded local redirect fixes are **FIXED AND VERIFIED**. Full SEO parity, owner content/canonical acceptance and deployed HTTP behavior remain **BLOCKED / NOT TESTED** as detailed below.

## Evidence actually collected

WordPress Status & Tools → Import & Export → Export Settings downloaded all five selected settings panels, including redirects. No Import, Restore, Save Changes or production-content action was used.

- File: `rank-math-settings-2026-09-11T06-06-32-134Z.json`, **19,564 bytes**.
- SHA256: `c48496d0b274bb8805f1a4517ead0838be1b0d8c89f53c1e777dab2afd62e30f`.
- The original and timestamped copies remain private under Downloads / ignored `exports/rank-math/`. Git exclusion and byte-identical copies passed.
- Six sections were present: general, titles, sitemap, role-manager, redirections, modules. Only allowlisted public template settings and redirect evidence appear in `migration/pre-deployment/rank-math-authenticated-export.json`.
- Four active exact-match 301 rules were exported. Direct read-only HTTP checks independently verified three working redirects and a two-address cycle. See `migration/pre-deployment/rank-math-source-url-check.json` for actual statuses and Location headers.

This supersedes earlier statements that authenticated Rank Math settings/redirect exports were unavailable. It does not establish full database/files backup or migration approval.

## Safe implementation changes

`src/data/redirects.json` and generated `public/_redirects` now add:

| Source | Single destination | Evidence / disposition |
|---|---|---|
| `/sell-your-gemstone/` | `/sell-gemstones-for-cash-in-los-angeles/` | Exported active 301; live 301 → 200; destination already exists |
| `/sell-your-watches/` | `/sell-luxury-watches-in-los-angeles/` | Exported active 301; live 301 → 200; destination already exists |
| `/best-gold-buyers-los-angeles/` | `/best-gold-jewelry-buyers-los-angeles-2026/` | Live source loops between these addresses. Retain the existing rebuilt article/canonical and direct its alternate address there |

The broken Rank Math rule in the reverse direction is deliberately not copied. The existing content file is byte-for-byte unchanged, SHA256 `5fa589c6929792955c69eb38137a748939b02985857b0d61537dc67f1245f2b3`. Both addresses remain supported by the rebuild without deleting or rewriting the article. Final owner review of canonical/content policy remains required. The live WordPress loop was not changed.

## Verification

`node scripts/verify-rank-math-followup.mjs` passed:

1. Routing generation: 18 rules.
2. Existing release-policy tests: four passed, zero failed.
3. Actual Astro preview build and build finalization: exit 0.
4. All 18 redirect paths, destinations, conflicts and cycles validated. All three added 301 lines appear in the generated output; their destination HTML exists and does not redirect back.
5. Staging `noindex` headers and disallow-all robots preserved. Content-file hash unchanged.

Exact command results and scope are in `migration/pre-deployment/rank-math-followup-verification.json`. Logs are in ignored `.cache/rank-math-verification-logs/`; the verification command reproduces them. The initial run placed logs in the build output, so Astro removed the first two during its clean build. The log directory was corrected and verification repeated to retain all four logs. This local result does not establish hosted HTTP status, query-string behavior, CMS editing or full fresh-checkout CI for the follow-up commit.

## Remaining SEO findings

- WordPress's exported global defaults are now known: post/page title templates, excerpt-based descriptions, category/tag term templates, global index, author noindex, empty-taxonomy noindex, post/page/category sitemaps enabled, attachment/tag sitemaps disabled. These require a deliberate comparison against the rebuild's accepted production policy; do not blindly enable index on staging.
- The live loose-diamond-appraisal page returns 200, but its title and description differ from the rewritten local snapshot. The earlier WXR override comparison and this rendered comparison have different scopes. Neither authorizes silently replacing the current rewrite or claims SEO parity.
- Rank Math rule 1 remains marked BLOCKED in the export comparison because exact reproduction would conflict with a preserved page and recreate a broken source policy. The safe alternate-address redirect above resolves the new site's routing risk; owner content/canonical acceptance is still open.
- Newly added redirects are included in static snapshot builds and merged by the existing CMS runtime. Separate editable Sanity redirect records have not yet been created/tested for these new rules.
- Full metadata variable resolution, content difference approvals, media rights/binaries, and full backup/restore remain incomplete.

No production deployment, DNS, nameserver, hosting-setting change or paid service was performed.
