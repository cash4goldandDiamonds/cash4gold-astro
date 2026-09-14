# Cash 4 Gold & Diamonds

The existing private WordPress-to-Astro/Sanity rebuild is live at https://cash4goldanddiamond.com/. The September 10 inspection remains the authoritative migration starting point. Both original local copies, WordPress hosting/backups and useful GitHub planning files are preserved.

## Verified launch — September 14, 2026

Initial main commit: 036eaf1bd4bca45461e4eb31aef9c51e8bfcaa90. Cloudflare Worker version: ee22bf08-0c48-4035-8668-a72d2215cb8c. The release contains 202 content pages, 115 articles, 122 indexable sitemap URLs and 18 existing redirects. It passed 111 tests, fresh GitHub production builds and 54 Lighthouse measurements. All 122 public sitemap URLs and the launch smoke/HTTPS/www redirect checks passed. Lab checks do not establish field Core Web Vitals or real inbox delivery.

Read [the live release record](reports/LIVE_RELEASE_2026-09-14.md) for exact build/commit identities, preserved migration assets, runtime settings, rollback and the subsequent conservative wording patch. Historical checkpoints remain dated evidence.

## Development and release verification

Use Node 24.19.0 and pnpm 11.19.0 with the frozen lockfile. Run pnpm install --frozen-lockfile, pnpm test, pnpm verify:schema, pnpm verify:source-security, pnpm exec astro check, pnpm build, node scripts/verify-built-site.mjs, pnpm verify:accessibility, pnpm verify:seo, pnpm verify, pnpm verify:cms, pnpm verify:editorial and pnpm verify:substantive. The GitHub workflow runs these checks from its exact candidate checkout, native Worker/Studio builds, dependency auditing and a reviewed-static production build. The separate Lighthouse workflow runs the frozen audit tooling.

Production deliberately uses CONTENT_SOURCE=reviewed-static and requires STATIC_RELEASE_COMMIT to equal the clean checked-out commit. The CMS mode retains its separate safeguards; production does not read private Sanity content or isolated audit output. Studio and temporary build manifests are excluded. Production robots, canonicals and sitemap allow indexing. Protected staging remains at https://cash4gold-private-preview.cash4goldanddiamond.workers.dev/ with its existing all-traffic Access policy and noindex protections.

## Deployment and remaining integrations

The two live apex/www Worker routes and canonical GET/HEAD redirect are recorded in configuration. Cloudflare Builds uploads inactive versions only. Review and validate a new exact source revision, deliberately set its build pin, verify its uploaded version and only then promote it. Preserve nameservers and mail DNS. A WordPress rollback needs both the saved origin DNS and removal of Worker routes; restoring provider service may require revalidation. DNS backups and runtime credentials stay outside Git.

The automated inquiry form and analytics remain disabled for the initial release. Honest phone/email options and the existing appointment link are available. Sender activation, owner inbox testing, analytics consent/receipt verification and CMS editing/publishing acceptance remain follow-ups. No QA email or booking was submitted. Free Cloudflare managed protection and DDoS protection are active, and search/AI crawler policies permit access. Wordfence remains on WordPress because its PHP plugin cannot run in Astro.

Do not commit credentials, actual environment files, customer submissions, private exports, caches or temporary build output. Preserve required source, configuration, content, media, scripts, tests, redirects and workflows.
