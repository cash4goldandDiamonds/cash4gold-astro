# Protected staging setup — September 11, 2026

**NOT READY TO GO LIVE.** The September 10 inspection remains the baseline. This follow-up records the authorized Cloudflare setup after source preservation and fresh GitHub validation. It does not certify hosted website acceptance.

## Verified source

The existing private repository `cash4goldandDiamonds/cash4gold-astro`, branch `audit/pre-deployment-2026-09-10`, is preserved through commit `534d583e1f389be01978b75301d6c5ea959276b8`. Fresh GitHub Actions run [34568980900](https://github.com/cash4goldandDiamonds/cash4gold-astro/actions/runs/34568980900), job `103166841183`, checked out that exact commit and passed all 33 tests and every configured build/check step. Its complete tree `74489d3d92a8fe20d8948a854708412ca271b9fc` contains 1,053 files and matches the clean local checkpoint `5313868c5fc88969c45eedd00d490d854a841122` on `checkpoint/authenticated-inspection-2026-09-10`. The reviewed source scan covered 91,000,457 bytes with zero findings.

The browser upload retained Windows line endings in 13 documentation/evidence files. The local exact-byte checkpoint reconciles that harmless difference; the complete tree above, rather than the earlier normalized staging tree, is the verified comparison. Original local copies and `main`/`safety/before-consolidation-2026-09-10` remain preserved.

## Authorized setup actually completed

- Account: **Cash4goldanddiamond@gmail.com's Account**, `51297d0a5f91f93ec6100eeabcac7939`.
- Worker: **cash4gold-private-preview**, ID `33f524e5c0194fabb22357a6eccaa28d`.
- Workers Free, Workers Builds Free and Zero Trust Free were separately verified. No paid plan, add-on or quota increase was selected.
- Both `workers.dev` and preview URLs were explicitly disabled at creation and remained disabled after the initial version. No route, custom domain, binding, queue or production resource was created.
- Worker-specific Access was applied successfully: **All traffic**, **Cloudflare account members — Allow**, **24-hour** sessions. The saved dashboard states that login is required on every production and preview URL. Account-wide Access remains unchanged.
- Cloudflare required an initial version before enabling its Git connection. Version `d9ee3c28-173e-448d-987f-ea715ea4e4ee` contains only an empty 403 response with noindex/no-store headers. It contains no website content. Endpoints remained disabled.
- The earlier limited Wrangler connection was renewed with the same permissions, without expansion. The separately approved three-permission `cash4gold-staging-deploy-limited` credential remains registered in Cloudflare Builds. No raw credential is committed.

## Saved GitHub build configuration

| Setting | Verified value |
|---|---|
| Repository | `cash4goldandDiamonds/cash4gold-astro` |
| Branch used for this staging Worker | `audit/pre-deployment-2026-09-10` |
| Builds for other branches | Disabled |
| Build command | `pnpm build` |
| Deploy command | `pnpm exec wrangler deploy --config wrangler.preview.jsonc --no-autoconfig` |
| Root | `/` |
| Build credential | Existing `cash4gold-staging-deploy-limited` |
| Node / pnpm | `24.19.0` / `11.19.0` |
| Site environment / indexing | `SITE_ENV=preview`, `ENABLE_PRODUCTION_INDEXING=false` |
| Build cache | Disabled |

Cloudflare confirmed the connection and displayed that the next repository commit starts the first build. This documentation-only commit records that state and triggers the first build of the already verified implementation. Its tests and build must still pass. Website endpoints remain disabled by the committed Wrangler configuration.

## Acceptance still required

The expected hostname is `cash4gold-private-preview.cash4goldanddiamond.workers.dev`; it is **not an available website at this checkpoint**. Verify the exact GitHub source/build result and saved Access protection before enabling its staging endpoint. Then prove anonymous HTML/assets are blocked and an allowed account member can sign in; run the full hosted QA matrix.

Authenticated WordPress and Rank Math reconciliation continues. The newly observed live redirect cycle must not be copied into staging; any reviewed redirect correction requires source validation and a separate evidence record. Inquiry delivery, appointments, analytics/consent, CMS roles/draft preview, performance/accessibility, media/SEO acceptance and complete backup/restore remain launch gates.

No production WordPress, DNS, nameserver, GoDaddy or live-domain setting was changed. Separate explicit owner approval is required before launch.
