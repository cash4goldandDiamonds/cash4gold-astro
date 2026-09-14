# Article social publishing

**BLOCKED — prepared and locally tested, not activated.** Updated September 10, 2026. No article has been posted by this integration.

The owner requested existing and future article promotion and selected three posts per week. Existing site profiles are Instagram, Facebook and Yelp. Their exact links are preserved in `src/data/social-profiles.json`; they appear in the new footer and business structured data. No additional account has been invented.

## What is prepared

- 105 eligible canonical, indexable article drafts in `migration/pre-deployment/social-backlog.json`, with separate network captions and 105 distinct 1080-square JPEGs in `public/media/social/`. Four canonical duplicates and two noindex articles are held. Images contain the complete source composition rather than cropping away the jewelry. Their rights still need human review.
- Monday, Wednesday and Friday, 10 a.m. America/Los_Angeles. Three weekly posts is owner-approved; 10 a.m. is an implementation default. The worker checks daylight saving time. There is at most one post per network per eligible date, and no catch-up flood after a missed slot.
- Per-article Sanity controls for channel, caption, image/ALT, content and media review, and an explicit sharing switch. A global switch pauses all publishing. Imported drafts and the global switch start disabled.
- A separate Cloudflare scheduled worker and durable D1 queue. Each article/channel is posted at most once by the queue. Editing an already-posted article does not automatically repost it.
- Each job waits for the public HTTPS article to return 200, a matching canonical, no noindex, and the exact published Sanity revision. This prevents promoting an unpublished draft or a CMS edit that has not reached the live site.
- Tracked article links use `utm_source=facebook` or `instagram`, `utm_medium=organic_social`, and `utm_campaign=selling_guides`. They contain no visitor data. Instagram captions include the guide URL and direct readers to the profile link; ordinary caption URLs are not treated as clickable links.

The Instagram profile guide link was corrected in the owner's app and read back in the browser. Instagram adds its own profile tracking parameters. The HTTP blog destination redirects to HTTPS. Website-to-profile links and profile-to-guide links are present; attribution and new-post destinations still require live testing.

## Actual account state

Meta app **Cash4Gold Social Publishing**, ID `1771403890678469`, is created and owned by the verified **navid lalezari** business portfolio, ID `1131065491630831`. Business Suite's reloaded Apps page confirms this ownership and Navid's full access. Its Instagram app ID is `1737075570881921`. The app is unpublished. `instagram_business_basic` and `instagram_business_content_publish` show **Ready for testing**; this is not advanced-access approval or a completed publishing test.

The owner completed Instagram sign-in, and the **Cash4Gold Social Publishing-IG** tester invitation was accepted in Apps and Websites. Meta Roles no longer shows Pending. Instagram API setup lists `@cash4goldanddiamond`, account ID `17841461592404304`, with Generate token available. The **Cash4goldanddiamonds** Facebook Page, ID `107008765832415`, was verified in Business Suite as owned by the same portfolio, with Navid's full access.

**Cash4Gold Page Publishing**, configuration ID `1713622949693414`, was created and read back: General login, system-user access token, Meta's recommended **60-day** expiration, **Pages only**, and exactly `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`. This is a saved login configuration, not a token grant. No access token has been generated or stored, no live provider API has been called, and no post has been sent. The adapter requires a token capable of acting for the verified Page; a system-user configuration alone does not establish that capability. Account IDs in the paused worker configuration are non-secret.

## Finish connection and acceptance

1. Tester acceptance and business ownership are complete. Finish the actual scoped authorization/token grant for these exact assets once secure server storage is available. Verify standard/advanced access and app publication requirements for the owner-owned assets; no app publication or review approval is inferred. The owner has no outstanding password prompt from this completed step.
2. Read back the granted token scopes and Page/Instagram identity using authorized API calls. Verify the currently supported Graph API version before filling `META_API_VERSION`; the version in unit fixtures is not an API-version assertion. Do not use an unrelated personal-profile token.
3. Store scoped tokens in provider secret settings. Copy actual issued-token expiry timestamps into `FACEBOOK_PAGE_TOKEN_EXPIRES_AT` and `INSTAGRAM_TOKEN_EXPIRES_AT`. Never calculate them from the time the app/configuration was created. The worker blocks missing/expired expiry metadata before consuming a daily slot; `/status` reports renewal due seven days before expiry. This is a local metadata check, not provider token validation or delivered alerts. A token-refresh service and real renewal/notification tests still need completion before unattended activation.
4. Create the owner-owned Cloudflare D1 resource within confirmed entitlements, apply `workers/social/migrations/0001_social_queue.sql`, and bind it as `SOCIAL_DB`. Keep `wrangler.social.jsonc` paused while testing. An empty binding/cron list is intentional.
5. Complete the site/CMS launch prerequisites. The scheduler is designed for the approved production CMS and deployed article revision; it cannot safely publish against this local preview.
6. Review one genuine article, its image rights, caption and intended networks. Run one owner-authorized real promotion once the article is live. Confirm the real provider ID/permalink, correct account and article destination, image/ALT, caption and analytics attribution. This public publishing test is NOT TESTED; do not record mock results as live success.
7. Test pause, removal of opt-in, duplicate invocation, restart and controlled provider failure on the actual runtime. Then enable the production switch, global CMS switch and the cron. A 15-minute polling cron can cover the four attempts in the 10 a.m. hour; the queue claims only one network/date slot.
8. Verify operator alerts and token-expiry notifications to the owner's chosen destination. No phone notification or background monitor is currently promised or verified.

## Recovery and operational limits

`queued` jobs may be refreshed to their latest approved revision. Removing approval cancels unsent queued jobs. Unavailable public articles/images are deferred behind unchecked candidates, without consuming a posting slot. An individual article timeout cannot stop another article from being considered. Unchanged CMS snapshots preserve deferral order and avoid rewriting every queued payload. `publishing` records contain any returned Instagram container ID; interruption after 30 minutes moves them to `uncertain`. Explicit rejected writes become `blocked`; ambiguous writes become `uncertain` and are never blindly retried. Reconcile the real network/container/post before changing those records. Failed/uncertain publishing attempts consume the day's slot to avoid accidental duplicates. Never delete queue history to make a post retry.

The authenticated `/status` endpoint requires its own `SOCIAL_STATUS_TOKEN`, returns no-store/noindex responses, and exposes no publishing endpoint. No tokens, raw API error bodies, messages, followers or lead details should be logged. Monitor queue age, failed/uncertain jobs, API expiry, successful run times and actual costs. Polling currently reads the approved article list and synchronizes jobs; verify D1/query/request quotas at the current backlog size before activation. The snapshot stops rather than silently truncating at 1,000 articles; extend with tested pagination before that limit.

Yelp's inspected API updates listing attributes; it is not an ordinary article/post publishing endpoint. Keep the real Yelp profile link. Do not mark automatic Yelp blog sharing complete, scrape a private endpoint, or purchase an upgrade. Any available Yelp posting product must be separately verified and approved by the owner.

## Evidence and references

Thirteen social tests in `tests/social-publishing.test.mjs` execute actual SQLite queue statements and mocked providers. They cover schedule/DST, opt-in, live-revision checks, atomic claims, cancellation, recovery, tokens in headers, ambiguous-write handling, unavailable-article rotation, per-article timeout isolation and expiry gating without losing a daily slot. Status failures return sanitized no-store responses. The first rotation regression exposed inconsistent timestamp precision; timestamps were normalized and the test passed on rerun. They do **not** run Cloudflare D1 or post to Meta. `migration/pre-deployment/social-queue-tests.log` records 13 passing social tests; `unit-tests.log` records all 29 passing tests. The initial failed run is preserved separately.

- [Instagram API with Instagram Login](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login) — professional accounts and publishing scopes.
- [Meta's Instagram API collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api) — media container/publishing flow and JPEG constraints.
- [Yelp listing update endpoint](https://docs.developer.yelp.com/reference/create_business_update_v1) — listing updates, not a blog-post endpoint.
- [Cloudflare Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) and [D1 prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/) — hosting primitives, not proof of provisioned resources.
