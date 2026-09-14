# Inquiry and tracking implementation — September 11, 2026

This September 11 record describes the initial inquiry/consent implementation and its historical tests. [The September 14 checkpoint](LAUNCH_CHECKPOINT_2026-09-14.md) supersedes its account/configuration state: retry and consent defects are fixed, a separate staging GA4 property/build configuration is prepared, the sender domain and restricted encrypted key are configured, and the owner-policy privacy replacement is prepared in local source. Reviewed source enables inquiries with that privacy page in the next protected build; the currently deployed runtime remains disabled. No actual analytics receipt, inbox delivery, booking reservation or launch readiness is established.

## Inquiry behavior

- The contact component retains callable phone and email fallbacks. If the delivery service, approved origin, rate-limit binding or Turnstile configuration is unavailable, the form remains unavailable and does not report success.
- Server validation limits JSON requests to 16 KiB, rejects unexpected fields and invalid values, checks the exact request origin, enforces a honeypot and form-age check, and calls the Cloudflare rate limiter before external services.
- Turnstile tokens are verified server-side for success, the `inquiry` action and the actual hostname. The contact-only compact widget is 150 by 140 pixels to fit narrow phones. Phone/email remain available if the challenge cannot complete.
- The provisional Resend adapter sends plain-text inquiries to the server-configured recipient with a verified sender. Visitor email is only the reply address. Credentials, challenge tokens and customer fields are not returned to the browser or written to logs by this code.
- HTTP 202 requires the provider to accept the request and return an identifier. The visitor is told that the message was **accepted for delivery**, not that inbox receipt or an appointment was confirmed.
- Identical manual retries use a stable provider idempotency key. There is no automatic retry after an ambiguous network outcome. The UI preserves the inquiry on errors and makes the uncertainty clear.
- No files, identification documents, banking information, payment details or customer accounts are collected. Required inquiry permission covers responding to the request; it does not grant marketing consent.

## Preferences and conversion behavior

- Optional analytics requires an explicit enabled build configuration matching the preview or production environment. Staging needs its own measurement destination.
- Google code is not loaded before affirmative analytics consent. Visitors can reject, accept, change or withdraw their choice. The stored preference expires after 180 days. With unavailable browser storage, a choice applies to the current page only.
- Advertising storage, advertising user data, personalized advertising and Google signals are disabled by this implementation. It does not import or publish the existing production GTM/Ads configuration.
- Explicit event names distinguish `phone_click`, `email_click`, `directions_click`, `appointment_click` and `inquiry_accepted`. No confirmed-booking or inbox-delivery event is inferred from clicking a link or seeing a response.
- Explicit payloads contain only the build-known page path. Page query strings, fragments, arbitrary requested 404 paths, external referrer paths, phone/email destinations and inquiry fields are excluded.
- A separate staging GA4 property was configured September 14; another stream inside the live property would not provide that separation. Actual requests, duplicate tags, automatic behavior and received events still require acceptance. Explicit safe hooks alone cannot prove third-party behavior.

## Configuration and acceptance still required

1. Configure the existing protected staging origin, the native inquiry rate-limit binding, a staging-allowed Turnstile widget, and its server secret.
2. Root verified `notify.cash4goldanddiamond.com` after the three owner-approved DNS additions and securely stored a domain-restricted Resend sending key. Reviewed source prepares `inquiries@notify.cash4goldanddiamond.com` as sender and activates only the protected staging origin with the new privacy page. Verify the new build, Access and read-only runtime readiness; do not infer provider validity from configuration presence.
3. **Owner decision updated September 14:** sender setup, the restricted key and protected staging activation are authorized. Actual inquiry/inbox testing remains deferred until after a confirmed website launch. No test email was sent. This is not a delivery pass or launch authorization; complete receipt checks only under the owner's later testing instruction.
4. Rebuild with the verified separate staging property configuration, review the owner-policy privacy source, and test actual accept/reject/withdraw/persistence and event receipt. Preserve the existing production GA4/GTM/Ads configuration until a separately approved launch.
5. **Owner decision recorded September 13:** the owner declined a real booking test. Preserve the existing Calendly link and calendar, and record booking acceptance as unverified rather than repeatedly requesting or making a reservation.

The exact runtime configuration and remaining setup sequence are documented in [the inquiry operations guide](../workers/inquiry/README.md). Its configuration checks establish presence only; they cannot establish provider authorization, inbox receipt or production launch readiness.

## Validation recorded by this implementation track

Twelve Node tests passed: nine inquiry tests and three consent/event-policy tests. They cover malformed input, body limits, origins, rate-limit failure, challenge mismatches, provider acceptance/error/timeout, idempotent retry behavior, static-asset fallback, consent expiry and event payload restrictions. All external responses in these tests are synthetic; they do not send email or create bookings. Frontend JavaScript syntax checks also passed. Full project tests, production builds, deployed Worker behavior and browser integration acceptance are recorded separately by the release review.

## Primary references

- [Cloudflare Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) and [widget configurations](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/)
- [Cloudflare rate-limit binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Resend email API](https://resend.com/docs/api-reference/emails/send-email) and [idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Google consent implementation](https://developers.google.com/tag-platform/security/guides/consent)
