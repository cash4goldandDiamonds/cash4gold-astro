# Manual verification checklist

Items here need dashboard/account access this session doesn't have. Compiled during the
September 17, 2026 SEO/AEO/GEO/conversion audit (`fix/seo-aeo-geo-production-audit`).
Nothing below has been checked off — it's a checklist, not a report of results.

## Cloudflare (highest priority — recurring finding)

Two prior audits (August 24 notes, and the September 11
`reports/LOS_ANGELES_AI_SEARCH_READINESS_2026-09-11.md` dashboard inspection) flagged that
Googlebot and AI-answer crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) were showing
**zero successful requests** in Cloudflare's last-24h analytics, and that `www` robots.txt
returned an intermittent 408. This predates the September 14 relaunch and has not been
re-verified since. From inside this session we could not reach the production domain directly
(outbound network here is restricted to an allowlist that doesn't include it) or query the
Cloudflare dashboard/API (no token available), but a same-origin browser check today confirmed:

- `robots.txt` on apex currently serves `Allow: /` correctly (200, live-checked in-browser today).
- `http://`, `https://`, `www` and non-`www` all converge cleanly on
  `https://cash4goldanddiamond.com/robots.txt` with no visible redirect problem.

That's a good sign, but it's not the same as confirming a real Googlebot/GPTBot/ClaudeBot
user-agent gets through Cloudflare's WAF/Bot Fight Mode/Super Bot Fight Mode. Please check:

- [ ] Cloudflare dashboard → Security → Bots: confirm Bot Fight Mode / Super Bot Fight Mode
      isn't set to challenge or block "Verified Bots" or "Definitely Automated" traffic on
      pages that should stay crawlable.
- [ ] Cloudflare dashboard → AI Crawl Control (or Security → Bots → Configure AI Crawlers):
      confirm the individual toggles for Googlebot, OAI-SearchBot/GPTBot, Claude-SearchBot/
      ClaudeBot, PerplexityBot and BingBot match what you want (search/answer crawlers allowed;
      training-only crawlers are a separate decision — see Phase 10 note below).
- [ ] Cloudflare dashboard → Analytics & Logs → Security: pull the last 7 days of bot traffic
      for the production zone and confirm these crawlers now show successful (not just
      attempted) requests.
- [ ] Use Google Search Console's URL Inspection tool ("Test Live URL") on 3–5 representative
      pages to get Google's own fetch result, which is the authoritative check.
- [ ] Confirm whether Cloudflare **Web Analytics** (Speed/Analytics & Logs → Web Analytics) is
      toggled on for this zone. See `OWNER_INPUT_REQUIRED.md` §3 — this determines whether the
      new opt-in CSP allowance for the beacon should be turned on via
      `PUBLIC_CLOUDFLARE_BEACON_ENABLED=true`.
- [ ] Confirm Worker secrets on `cash4gold-production` (`INQUIRY_RESEND_API_KEY`,
      `INQUIRY_TURNSTILE_SECRET`) — see `OWNER_INPUT_REQUIRED.md` §1.
- [ ] Confirm the Cloudflare Build environment variables used for the production build
      (`PUBLIC_ANALYTICS_ENABLED`, `PUBLIC_GA4_MEASUREMENT_ID`, `PUBLIC_ANALYTICS_ENV`) — see
      `OWNER_INPUT_REQUIRED.md` §2.

## Google Search Console

- [ ] Confirm/verify ownership of `https://cash4goldanddiamond.com` (and that the property is
      set up as a Domain property or covers both host variants).
- [ ] Submit `sitemap.xml` if not already submitted since the September 14 relaunch.
- [ ] Coverage report: check indexed vs. excluded URL counts against the 122 indexable URLs the
      current sitemap generates. Investigate any "Duplicate, Google chose different canonical"
      or "Excluded by noindex" entries — cross-reference against the two intentionally-noindex
      legacy articles in `OWNER_INPUT_REQUIRED.md` §6 and the 4 already-canonicalized "-2" ring
      duplicates (`migration/duplicate-article-canonicals.json`).
- [ ] Check Core Web Vitals field data (real user data — this repo's own PageSpeed numbers are
      lab data only, from a single test run).
- [ ] Check the Search Console "AI Overviews"/generative-search performance report if your
      property has it enabled.
- [ ] Spot-check top queries/pages for cannibalization beyond the 4 known duplicate pairs.

## Google Business Profile

- [ ] Confirm exact NAP matches the site exactly: Cash 4 Gold & Diamonds, 617 S. Hill Street,
      Los Angeles, CA 90014, 310-663-1340.
- [ ] Confirm category, hours (see `OWNER_INPUT_REQUIRED.md` §4 — hours are not published
      anywhere in code pending your confirmation), website URL points to the new site, and
      whether an "Appointment URL" field should point to the Calendly link.
- [ ] Check for duplicate/unmanaged listings.
- [ ] Review photos and review-response cadence.

## Google Ads / GA4

- [ ] Confirm `G-149Y3HZKHT` (GA4) is the correct property to keep using — see
      `OWNER_INPUT_REQUIRED.md` §2.
- [ ] Once analytics is enabled, verify in GA4 DebugView that `phone_click`, `email_click`,
      `directions_click`, `appointment_click` and `inquiry_accepted` fire correctly and stay
      distinct (the code already keeps these semantically separate — see
      `src/lib/privacy-consent.mjs` and `src/lib/conversion-click.mjs`).
- [ ] Link Google Ads to this GA4 property and import the above events as conversion actions,
      rather than adding a second raw Google Ads tag — see reasoning in
      `OWNER_INPUT_REQUIRED.md` §2.
- [ ] Confirm the historical `AW-16559283274` Google Ads account/tag is still the one in use.
- [ ] Review the existing Gold ad group Quality Score/keyword work already in progress
      (tracked separately) once conversion data starts flowing again from the new site.

## Cross-check against this audit's code findings

These were verified from the codebase/build and a same-origin browser check, not fabricated —
listed here so you can spot-check them independently if you'd like:

- Production build: 202 pages, 115 articles, 122 indexable sitemap URLs, 18 redirects — matches
  the numbers recorded at the September 14 launch.
- `pnpm verify:seo`, `verify-built-site.mjs`, `verify-static-release.mjs`: all clean (0 errors)
  against the current `fix/seo-aeo-geo-production-audit` branch.
- `/api/inquiry/config/` on production currently returns `{"enabled":false,...}` with the phone/
  email fallback message — confirmed live in-browser today, matches the code's fail-safe design.
- Contact page correctly shows phone/email/Calendly fallbacks while the inquiry form is disabled
  — confirmed live in-browser today.
