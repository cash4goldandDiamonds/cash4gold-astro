# September 14 verified remote release

Repository: cash4goldandDiamonds/cash4gold-astro (existing private repository).

- Reviewed source: 406dfbef5071785a7a8654d29c695890669059c8.
- Verified tree: 520bbbde4fad66a8294ff46d9942f862dc342194, 1,176 files.
- Review branch: review/final-launch-checks-2026-09-14.
- Safety branch: safety/before-static-production-2026-09-14 at 3eb91b98ad542f856090babbf3972e826ba2e291.
- PR 2 merged to audit/pre-deployment-2026-09-10: 86cfe8e92f9b44392236fc5e6f0c4bc39d717710.
- PR 1 merged to main: 036eaf1bd4bca45461e4eb31aef9c51e8bfcaa90.

Reviewed-source quality run 34863274378/job104040646510 passed in 1m44s. Fresh GitHub checkout verified the exact tree and file count, 111 tests, content/SEO/security, native Worker/Studio builds, actual reviewed-static production build and route-free production Worker dry run.

Reviewed-source Lighthouse run 34863274383/job104040887347 passed in 5m33s, 54 measurements, LAB_MEASUREMENTS_COMPLETE_REVIEW_REQUIRED. Artifact10355657943 SHA256 b14ae10506cca21b64ce3768ca42d9271ee621c702211c611bae991914b85431.

Merged audit quality run34864061896/job104043350881 passed in1m42s with the identical tree and file count. Audit Lighthouse34864061931/job104043350827 passed in5m12s with54 measurements.

The owner's 08:35 quality-failure email points to ad508cde044f077e3864cef166024394019dcba3, run34862950903/job104039559065, job1m13s. CMS projection failed because the four newest article paths were referenced before the final pages.json upload; title was undefined for those paths. The final406dfbe source passes the same check. Earlier Lighthouse34862394832 failed because static-release-source.mjs had not yet been uploaded. These intermediate failures do not describe the complete release.

Independent Gitleaks scan of the exact 1,176 uploaded files passed with zero findings; the original local copies and frozen reviewed source remain preserved. Local Git writes remain blocked by sandbox ACL, so no new local commit is claimed.

Cloudflare production build 103b7793-9b6e-4b17-a0ad-84b0abe121b7 succeeded at 2026-09-14 15:52:03 UTC from existing repository/main with STATIC_RELEASE_COMMIT=036eaf1bd4bca45461e4eb31aef9c51e8bfcaa90. Active production Worker cash4gold-production version ee22bf08-0c48-4035-8668-a72d2215cb8c was verified at 100% traffic. Build included static-release, built-site and SEO verification: 202 content pages, 115 articles, 18 redirects, 122 indexable sitemap entries, zero reported content/SEO errors. Private Studio and temporary manifests were excluded; analytics and automated inquiry submission remain disabled. Workers.dev and version preview URLs are disabled.

After successful deployment, the Cloudflare Builds deployment command was changed to `pnpm exec wrangler versions upload --config wrangler.production.jsonc` and verified saved. Future GitHub builds can upload inactive versions but cannot automatically activate a release or overwrite manually attached routing. Reconcile the operational configuration before restoring automatic activation.

Two production routes were attached and verified in both Worker and zone settings: `cash4goldanddiamond.com/*` and `www.cash4goldanddiamond.com/*`, both to cash4gold-production. Initial public probes still reached WordPress because the proxied apex record remained associated with its hosting provider. Cloudflare's DNS UI explicitly identified that provider connection. Under the owner's launch authorization, only the proxied apex A record was changed from 160.153.0.111 to the documented originless Worker target 192.0.2.1. The saved DNS table confirmed the new target. The www CNAME, other 14 records, mail records and nameservers ken.ns.cloudflare.com / luciane.ns.cloudflare.com were unchanged. WordPress hosting, files and backups were retained.

Independent public probes at 2026-09-14 16:09:59 UTC confirmed the rebuilt Astro site on the live apex, no WordPress markers, inquiry configuration JSON 200, new robots.txt 200 and favicon 200. Root also visually confirmed the public rebuilt homepage. Independent public smoke at 16:10:45 UTC passed 89 of 91 checks, with only the then-unfinished HTTP/www canonical redirects failing.

Canonical rule `Cash4Gold canonical HTTPS apex GET and HEAD`, ID 2a4da3aec42c40a2b8e902549efcc7b5, was subsequently verified Active in Cloudflare. Filter: `(http.host in {"cash4goldanddiamond.com" "www.cash4goldanddiamond.com"}) and (not ssl or http.host eq "www.cash4goldanddiamond.com") and (http.request.method in {"GET" "HEAD"})`. Destination: `concat("https://cash4goldanddiamond.com", http.request.uri.path)`, dynamic 301 with query preservation. The draft's invalid `http.request.scheme` field was corrected to the documented `not ssl`. POST requests are outside this rule. These settings are now represented in the stabilization source; the initial deployed source identity above remains historical evidence.

Staging refreshed from the merged audit branch. Its existing All traffic Access policy and account-members Allow policy were verified; the same protected workers.dev hostname was restored after the build. Version preview URLs remain disabled.

Independent canonical verification at 2026-09-14 16:14:26 UTC passed all focused checks: HTTP apex, HTTPS www and HTTP www each returned 301 to the exact HTTPS apex destination, preserving path and query; the HTTPS apex destination returned 200 without a redirect loop. Evidence: coordinator `outputs/public-launch-canonical-check.json`. Together with the earlier smoke this resolves all 91 smoke assertions.

The full independent sitemap crawl completed at 2026-09-14 16:24:32 UTC: all 122 discovered and unique sitemap URLs passed, zero failures. The bounded read-only crawl verified successful status, one H1, canonical URL and absence of unintended noindex for every sitemap URL. It does not independently establish visual quality, asset completeness, actual email delivery, field Core Web Vitals or Git identity. Evidence: coordinator `outputs/public-all-pages-check.json`.

Public homepage security-header verification at 16:26:03 UTC passed: CSP present, X-Content-Type-Options nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy strict-origin-when-cross-origin. HSTS is not currently set; HTTPS canonical redirects are verified. This was one public response, not a comprehensive penetration test. Evidence: coordinator `outputs/public-security-headers-check.json`.

Launch outcome: the authorized initial static release is LIVE and its launch verification is complete. Postlaunch follow-ups are automated inquiry sender activation and owner inbox test, analytics/consent verification, CMS editing acceptance, and deliberate validation/promotion of future releases. No real inquiry or booking test was submitted. The existing `test-inquiry-after-website-launch` reminder was paused through the Codex automation tool; its one-time owner reminder is included in the final handoff, with no duplicate automation.

Security and AI access were inspected in the actual Cloudflare zone after cutover. On the existing free plan, the managed ruleset and HTTP DDoS protection show Always active; Network-layer and SSL/TLS DDoS protection show Active. Search, Agent and Training AI policies all show Allow (do not block). The legacy AI policy shows Do not block (allow crawlers), with mixed-purpose crawlers continuing to be allowed on September 15. Bot Fight Mode and AI Labyrinth are off. No protection settings were weakened or changed during this inspection. These settings permit crawler access; they cannot guarantee indexing, rankings or citations by any search/answer engine.

The owner's Wordfence request was reviewed against official documentation. Wordfence requires WordPress/PHP and cannot be installed into the Astro/JavaScript Worker runtime. It remains preserved on the retained WordPress installation. The new site uses the existing free Cloudflare managed protection plus its generated CSP/security headers, private Studio exclusion and server-side inquiry safeguards. No essential source-security gap requiring Wordfence or a paid upgrade was found in this bounded review. References: https://www.wordfence.com/help/firewall/ ; https://www.wordfence.com/help/advanced/system-requirements/ ; https://developers.cloudflare.com/waf/get-started/ ; https://developers.cloudflare.com/ddos-protection/about/ .

The stabilization source records the two active routes in wrangler.production.jsonc, corrects the canonical JSON to not ssl with enabled true and the verified rule ID, and reconciles the prelaunch release documentation and workflow step label. Do not alter the exact-commit production release guard. The current frozen source remains the exact already-tested release. The Cloudflare versions-upload command prevents a future source change from automatically changing live traffic.

Rollback evidence: the original 15-record DNS export is preserved outside Git at `dns-before-cutover-2026-09-14.txt`, SHA256 5C9F35332792AE04A8A68E1E775BBE09F4976F099A9C1BA4486A6410816DDAF5. A WordPress rollback would require restoring the apex A target 160.153.0.111 and removing the two Worker routes; hosting-provider custom-hostname revalidation may also be necessary after this DNS move. Do not change nameservers or mail DNS, delete the provider hostname, or assume restoring DNS alone immediately restores provider service.

## Conservative stabilization

The next patch applies 13 spelling and punctuation corrections in five existing noindex tag pages, two articles and the shared footer. All 202 route paths, 115 articles, canonicals, robots directives, source capture hashes, author/date fields and image assignments are preserved. Homepage, diamond-service and reviews page objects remain unchanged: the reported Lorem Ipsum, consultation typo, visible raw URLs and review shortcodes were already absent in fresh public/source inspection. No genuine review was deleted. Exact candidate validation and promoted revision are recorded in subsequent release evidence; the initial commit above is not a claim that this patch was already deployed.
