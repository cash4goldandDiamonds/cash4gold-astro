# Protected staging and pre-launch QA — September 11, 2026

**NOT READY TO GO LIVE.** Protected staging exists at https://cash4gold-private-preview.cash4goldanddiamond.workers.dev/. The September 10 inspection remains the authoritative baseline. No production, DNS, nameserver, GoDaddy or paid-service change was made.

## Preserved source and hosting

The existing private repository is `cash4goldandDiamonds/cash4gold-astro`, branch `audit/pre-deployment-2026-09-10`. Original `main` and `safety/before-consolidation-2026-09-10` remain at `ed8571bd28de71525eec46b14f56956934e26410`; both original local copies are retained. A separate local checkpoint preserves this follow-up.

The first hosted website came from exact GitHub source `cf451a603c53aa07588459a8e4719f8bc8aadd25` (tree `4e334b14668121d196fc231fa9552005fe858ba1`, 1,054 files). Fresh GitHub checkout/install/tests/build passed in [run 34578261110](https://github.com/cash4goldandDiamonds/cash4gold-astro/actions/runs/34578261110). Cloudflare Build `5d2c4786-971e-4547-8fe6-a32fc093d0fc` succeeded, creating version `b8d19939-cf26-41f9-a7f0-7c199db44816`.

Worker-specific All traffic Access allows Cloudflare account members, with 24-hour sessions. Account sign-in and the website were tested. All 814 anonymous probes were redirected to Access, including content, assets, robots, sitemap and missing routes. Workers/Builds/Zero Trust remain Free. There are no custom domains or production routes; preview-version URLs remain disabled. The committed deployment configuration deliberately disables public endpoints on each build. Re-enable the staging Worker URL only after checking the new build and its Access protection.

## Reviewed redirect follow-up

The authenticated Rank Math export revealed three missing aliases. `/sell-your-gemstone/` and `/sell-your-watches/` now lead to the existing service pages. `/best-gold-buyers-los-angeles/` leads to the preserved `/best-gold-jewelry-buyers-los-angeles-2026/` article, avoiding the live site's observed two-address cycle. The live site was not edited. Owner canonical/content acceptance remains open.

The follow-up has **198 content pages, 111 articles, 107 guide-card images, 18 redirects and 217 built routes**, including 404. All **33 tests** and all **12 verification stages** passed again (build/finalization recorded as two command results). One moderate dependency finding and eight documented source-text warnings remain; there are no high/critical dependency findings. See [local validation](FINAL_STAGING_LOCAL_VALIDATION_2026-09-11.json). Exact-head fresh GitHub CI and the subsequent Cloudflare build must be checked for the final uploaded commit.

The other inspection copy still contained previously removed account-verification metadata. Those values were not imported. The reviewed `src/data/pages.json` is unchanged, SHA256 `e528eac246cab9f3ee8213397ecabaeaf921e7df19fc2cfca5c1c7a1b5b561ed`. The different content hash in the bounded Rank Math report refers to that separate local inspection copy; substantive content matches after the earlier verification-metadata removal. Raw WXR/Rank Math exports, tokens, environment files, caches and builds remain outside Git.

## Actual hosted QA and limits

The signed-in browser rendered all **198 content routes**, including all **111 articles** (206 navigations including aliases/rechecks). Every content page had one H1, a main landmark, noindex metadata and parseable JSON-LD. All image elements had an ALT attribute; decorative empty ALT is intentional. No broken eager image was observed. Canonicals retain the production origin, including four deliberate duplicate-article canonical relationships. Static build checks validate local image and internal-link references.

At the observed 390 × 844 mobile viewport, the main/service menus opened, the gold service link navigated correctly, and the new page's menu was closed. Homepage, gold service, contact and article layouts were visually inspected. Keyboard Tab reached Skip to content; Enter focused main. Early measurements produced transient overflow flags, so these are not asserted as defects. The attempted desktop override did not change the actual viewport. Full desktop/device coverage, lazy-image review, contrast/screen-reader testing and measured Core Web Vitals remain open. No Lighthouse or accessibility conformance score is claimed.

The custom missing-page screen rendered with noindex, but its authenticated HTTP status was not captured. Generated robots disallows all and the staging sitemap contains zero URLs; anonymous requests are protected. The browser blocked direct robots.txt viewing, so authenticated raw-response verification remains open. Redirect destinations/query preservation are checked after the follow-up deployment; exact authenticated HTTP headers remain a separate check.

The contact page has no connected inquiry form. Calendly opens and shows available dates, but no booking was submitted and confirmation/delivery is unverified. Read-only WordPress evidence found two existing CF7 forms and WP Mail SMTP set to Default (none); no reusable external provider is configured. The rebuild has no analytics/consent integration. No test message was sent or claimed delivered.

Private Sanity import, a connected local build, editor navigation/autosave and the unreviewed-publication guard have passed bounded checks. The first hosted website uses the verified local content snapshot. Hosted draft preview, roles, media/deletion workflows, review freshness/API bypass controls and rebuild/rollback remain incomplete. Three new editable Sanity redirect records are not yet created; runtime merging includes the local aliases.

## Source comparison and remaining launch blockers

Authenticated WXR evidence covers all 111 published posts and 13 pages with no missing numeric IDs or changed modification times. Rank Math's four active redirects are reconciled without copying the live cycle. Full parity is not certified: attachment 3103's binary/rights, three explicit SEO override differences, rendered loose-diamond title/description differences, template variable resolution and owner content/media acceptance remain open. Full database/files/uploads backup and isolated restore are blocked by GoDaddy's backup-history error; WXR is not a full restore backup.

Before launch: connect and prove inquiry delivery; complete booking confirmation tests; finish hosted Sanity/editor/draft-preview and rollback acceptance; implement/test analytics and consent; resolve private SEO/media differences and backup/restore; complete measured performance, accessibility and responsive QA; obtain owner content approval and separate explicit launch approval. See [browser evidence](../migration/pre-deployment/hosted-staging-browser-qa.json), [Rank Math follow-up](RANK_MATH_AUTHENTICATED_FOLLOWUP_2026-09-11.md), and the preserved 143-requirement/421-criterion acceptance matrix.
