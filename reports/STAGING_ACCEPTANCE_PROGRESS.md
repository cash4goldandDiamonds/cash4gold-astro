# Staging acceptance progress

September 10, 2026. **NOT READY TO GO LIVE.**

The complete source is preserved in the existing private GitHub repository. Its fresh GitHub Actions checkout/build and an independent 994-file download/build passed. Both original local copies remain preserved. Main, DNS, nameservers, GoDaddy and the live WordPress site remain unchanged.

## Verified follow-up

- All 13 currently published WordPress pages and 111 posts are covered by rebuild routes or redirects. The public media API still reports 223 records but returns 222; this remains unresolved.
- The committed Sanity import contains 430 records. All 430 were imported into the existing private migration-staging dataset; 431 was stale report text, not a missing import. Two unlinked synthetic unpublished acceptance drafts are separate test data.
- An actual private-CMS-backed local build passed: 198 page documents, 214 HTML files, 815 output files checked, zero session-token matches, and preview noindex/robots protections. This is separate from hosted deployment.
- Browser Studio exposed unsupported fields on block schema declarations. The correction removes those declarations while preserving existing migrated block data. Strict schema validation and 31 automated tests pass, along with all 12 validation stages.
- An isolated historical source-bundle restore of commit 2fead36 was verified byte for byte (983 files). The current GitHub source was independently restored/downloaded and built. These checks do not prove restoration of the WordPress database/uploads or the Sanity dataset.

## Still pending

Cloudflare Zero Trust Free is active. No staging website has been deployed. The local Wrangler file resolver encounters a Windows parent-directory restriction even after read permission was granted. The GitHub connection screen requires authorization review. An account-wide Access proposal was rejected and was not applied; protection must stay limited to staging.

Complete Worker-specific authentication before enabling the preview endpoint, then verify all routes, images, links, redirects, SEO metadata/schema, robots/sitemap, 404 behavior, mobile navigation, accessibility and measured performance over hosted HTTP. Studio browser editing, publishing and unpublishing are now verified, including preservation of imported section anchors and presentation fields. Protected website draft-preview acceptance and documented role checks remain pending. Verify actual inquiry delivery, appointments, analytics/consent, full private WordPress/Rank Math/media reconciliation and relevant backup restoration. No real customer lead should be used as test data.

A separate explicit owner approval is required before launch.
