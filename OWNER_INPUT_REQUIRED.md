# Owner input required

Facts and decisions in this file can only come from Navid. Nothing here was inferred, guessed
or copied from the old automated WordPress content — see `BUSINESS_FACTS.md` for what is
already confirmed and what is explicitly blocked from being published until verified here.

This list was compiled during the September 17, 2026 SEO/AEO/GEO/conversion audit
(`fix/seo-aeo-geo-production-audit`). Nothing on this page has been published; it is a request
list only.

## 1. Activating the inquiry form (blocks Phase 2)

The contact-page inquiry form is intentionally disabled in production
(`wrangler.production.jsonc`: `INQUIRY_ENABLED: "false"`, `INQUIRY_TURNSTILE_SITE_KEY: ""`).
The code is fail-safe: `/api/inquiry/config/` correctly reports `enabled:false` and the page
falls back to phone/email. To turn it on, we need:

- Confirmation of whether a Cloudflare Turnstile widget already exists for
  `https://cash4goldanddiamond.com` (the staging widget, site key `0x4AAAAAAEwdb5Av8PaY6cRA`,
  is scoped to the staging hostname only and should not simply be reused on production without
  checking its allowed hostnames in the Cloudflare Turnstile dashboard).
- Confirmation that the production Worker (`cash4gold-production`) actually has
  `INQUIRY_RESEND_API_KEY` and `INQUIRY_TURNSTILE_SECRET` set as Cloudflare encrypted secrets.
  These are not visible in git by design; only you or whoever has Cloudflare dashboard/Wrangler
  access can confirm this.
- Sign-off to go live with real customer email delivery (the repo's own notes say the actual
  inbox test was deliberately deferred past launch and no real booking/lead test has been run).

Nothing was flipped on for you. See `workers/inquiry/README.md` for the exact settings table.

## 2. Analytics (blocks Phase 3)

The GA4 property from the old WordPress site (`G-149Y3HZKHT`) is already wired into the
consent-gated analytics code (`src/lib/privacy-consent.mjs`, `PrivacyControls.astro`) with a
safety guard so a preview build can never send test traffic into that real property. To turn it
on for production we need:

- Confirmation that `G-149Y3HZKHT` is still the GA4 property you want used (vs. creating a new
  one for the rebuilt site) — your call, not ours to assume.
- The Cloudflare Pages/Workers **build-time** environment variables `PUBLIC_ANALYTICS_ENABLED=true`,
  `PUBLIC_GA4_MEASUREMENT_ID=G-149Y3HZKHT` and `PUBLIC_ANALYTICS_ENV=production` set in the
  Cloudflare dashboard for the production build pipeline. We can't see or set Cloudflare Build
  variables from here.
- A decision on Google Ads: the old site's Google tag was `AW-16559283274`. We did not add a
  second raw gtag config for it — the current, lower-risk path is linking Google Ads to this
  GA4 property in the Google Ads UI so the existing `phone_click` / `appointment_click` /
  `inquiry_accepted` events (already implemented) become Google Ads conversion actions. Only
  you can do that linking (Google Ads account access).

## 3. Cloudflare Web Analytics beacon (Phase 4)

We added an opt-in CSP allowance for `static.cloudflareinsights.com` (the beacon Lighthouse
flagged), but it's off by default — we could not confirm from the codebase whether Cloudflare's
"Web Analytics" toggle is intentionally on for this zone. Check Cloudflare dashboard →
Analytics & Logs → Web Analytics:

- If it's ON and you want to keep it: set `PUBLIC_CLOUDFLARE_BEACON_ENABLED=true` as a Cloudflare
  build variable and the CSP will allow it narrowly (nothing else changes).
- If it's OFF or unwanted: no action needed — leave the build variable unset, and consider
  turning the dashboard toggle off too since right now it's injecting a script that goes nowhere
  useful.

## 4. Business facts still blocked from publication

Carried forward from `BUSINESS_FACTS.md` — do not infer any of these from the old automated
blog content:

- **Hours and holiday hours** — not yet owner-verified anywhere in the source. No hours are
  published on the site or in schema.
- **Parking / building entrance instructions** — not verified.
- **Walk-in vs. appointment-only policy** — not stated explicitly anywhere; the site currently
  implies appointment-first via Calendly without saying whether walk-ins are accepted.
- **Staff/evaluator credentials, certifications, years of experience** — none published; none
  should be until you confirm exact wording (e.g. do NOT claim GIA certification unless someone
  on staff actually holds it).
- **Opening date (2007)** — appears in your Cash 4 Gold profile info elsewhere but is explicitly
  marked BLOCKED in the source; confirm before it goes on the site.
- **Guaranteed-payout or highest-price claims** — explicitly must not be published without your
  sign-off (and generally inadvisable given the phone-quote-vs-final-offer distinction the site
  already draws).

## 5. Owner/expertise section (Phase 15)

To build a real author/owner-expertise profile (helps both AEO and GEO — a named, credentialed
source reads better to both readers and AI answer engines than an anonymous business):

- Preferred public name and title (e.g. "Navid Lalezari, Owner" — the existing article byline
  already uses "Navid Lalezari" as author; confirm this is correct for public display).
- Any real, verifiable credentials or affiliations you want published (jewelry trade
  association membership, years buying gold/diamonds, etc.) — only what you're comfortable
  having checked publicly.
- A professional photo, plus optional storefront/interior/evaluation photos. You mentioned we
  can pull from Instagram (@cash4goldanddiamond) — happy to do that once you confirm which
  specific photos you want used and that you hold the rights to reuse them on the website.

## 6. Duplicate/legacy content decisions (Phase 6)

Two legacy articles are currently `noindex` on purpose, carried over from the WordPress site:
`/how-to-spot-a-fake-rolex/` and `/sell-gold-and-diamonds-online/`. Both look like genuinely
useful seller-intent content (the first maps directly onto the "how do I know it's real"
question buyers ask). Confirm whether these should stay noindex (if there's a reason we're not
aware of — e.g. a legal/liability concern with the Rolex-authentication topic) or be reconsidered
for indexing now that the site has relaunched.

---
*Nothing in this file has been published or changed live. It is a request list compiled during
the September 17, 2026 audit. Update `BUSINESS_FACTS.md` once any of the above is confirmed.*
