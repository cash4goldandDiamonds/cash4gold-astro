# Remaining launch work — September 11, 2026

This record follows the September 10 inspection, September 11 SEO audit and article recovery. Existing source, 198 content pages, 111 articles, 18 redirects, original local copies and private GitHub repository remain preserved. No production, DNS, nameserver, GoDaddy, paid-plan or live Calendly change is authorized by this checkpoint.

## Owner decisions

- The owner states that the WordPress backup is complete. Backup creation is no longer an outstanding action. This task has not independently inspected a restore exercise.
- The owner declined a proposed synthetic appointment and requested that Calendly be left alone. No test reservation, confirmation email, cancellation or scheduling configuration change was made.
- The owner asked to continue remaining work across three browser tabs. Parallel tracks covered forms/tracking, bookings/CMS, and accessibility/technical QA. Authenticated browser checks were performed by the main task; agents performed independent source work.

## Implemented source

- Contact-only accessible inquiry form, phone/email fallback, shared input validation, same-origin Worker API, bounded request bodies, rate limiting, server Turnstile validation and a replaceable Resend adapter. The default configuration is disabled; provider acceptance is never described as verified inbox receipt or an appointment.
- Privacy preferences and consent-gated GA4 conversion hooks. Analytics remains disabled pending an isolated measurement destination. Query strings, inquiry fields and arbitrary requested 404 URLs are excluded from explicit conversion payloads.
- Corrected article CTA text contrast from a measured 1.28:1 to a calculated 9.18:1 using the observed background; strengthened keyboard focus and social-link hover contrast.
- Added a structural accessibility guard to CI. Baseline checks cover 199 documents. All 46 tables have nonempty headers and nearby explanatory headings; 44 explicit table-name advisories remain contextual improvements.
- CMS projection now retains Los Angeles entity context and uses current visible FAQ answers for matching schema. Incomplete, duplicate or unresolved FAQ references fail explicitly. Production review validation now uses the same substantive reviewer/date checks as Studio.
- Opt-in Sanity Studio build and scoped `/studio/` Worker routing at the existing protected staging origin. Production builds exclude the editor. Normal website 404 behavior remains separate. The editor uses browser Sanity authentication and contains no embedded service credential.

## Account and browser evidence

- Sanity project `gisdw6qa`: `migration-staging` is private; production remains unchanged/public. One Administrator seat, 432 documents, zero assets and zero webhooks were observed. No hosted Studio existed at inspection. Only the exact protected staging origin was added to credentialed CORS; no wildcard was allowed.
- Created a managed Turnstile widget restricted to the existing staging hostname, with pre-clearance disabled. Its secret is not in Git. Real inquiry sending remains disabled until provider configuration and receipt acceptance are complete.
- Protected Worker identity and GitHub build branch are unchanged. `BUILD_STAGING_STUDIO=true` was prepared for the staging build only. Account-wide domain, DNS and live-site settings were not changed.
- Calendly's existing event displays “30 Minute Meeting,” a 30-minute duration, Pacific time and selectable dates/times. The required name/email and optional preparation-message form loaded. Actual booking/confirmation/cancellation are untested at the owner's direction.
- Protected 14K article browser checks: desktop menu Enter/Tab/Escape behavior passes; Escape returns focus. The first table-of-contents heading sits at 110px below a 94.8px header. At 320px there is no page horizontal overflow, nested-menu Escape closes one level at a time, and the skip link focuses `main`. Fixed contact actions are 52px high.

## Validation and unresolved evidence

The final complete local pass passed 71 tests, Astro type checking/build, schema, source security, built routes/assets, SEO, CMS projection, editorial/substantive preservation, accessibility structure and design checks. A separate fresh production build, finalization and production SEO check also passed. The source secret scan found no leaks. All provider tests use synthetic mocks; none establish email inbox receipt or real analytics collection.

Windows native tooling blocks the Sanity CLI at `uv_os_get_passwd` and the Wrangler dry-run bundler at ancestor-directory permissions. No OS monkeypatch or security bypass was used. GitHub CI has explicit fresh-checkout Studio compilation and Worker dry-run checks; their outcome must be verified for the final commit before claiming completion. Installed Wrangler schema validation passes.

The performance skill requires Chrome DevTools tools, which are unavailable in this session. Permission for a local Lighthouse alternative was requested; no alternative browser profiling is implied by static asset checks. No measured Core Web Vitals or Lighthouse score is claimed.

Remaining gates: real inquiry-provider configuration and recipient receipt; isolated analytics consent/request/receipt checks; hosted Studio/draft-preview and publish/rebuild/rollback acceptance; current anonymous Access and edge checks; measured performance; owner content/privacy/media and SEO migration decisions; separate explicit launch approval. The existing conditional redirect recommendations remain unapplied. No guarantee of ranking or citation by every AI search engine is made.

**NOT READY TO GO LIVE.** The final task handoff records the exact GitHub commit, CI outcome and hosted deployment observations after this source checkpoint.

See [inquiry and tracking implementation](INQUIRY_AND_TRACKING_IMPLEMENTATION_2026-09-11.md) and [CMS/booking acceptance](CMS_BOOKING_LAUNCH_ACCEPTANCE_2026-09-11.md).
