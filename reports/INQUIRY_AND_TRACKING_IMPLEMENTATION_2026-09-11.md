# Inquiry and tracking implementation — September 11, 2026

The rebuild now has an accessible inquiry component, a same-origin Cloudflare Worker handler, optional-analytics preferences and explicit conversion hooks. External delivery and analytics stay disabled until their configuration is complete. This change does not establish inbox delivery, a booking reservation or production launch readiness.

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
- A separate staging GA4 stream must be checked for automatic/enhanced-measurement events, duplicate tags and actual request payloads before acceptance. Explicit safe hooks alone cannot prove third-party behavior.

## Configuration and acceptance still required

1. Configure the existing protected staging origin, the native inquiry rate-limit binding, a staging-allowed Turnstile widget, and its server secret.
2. Select/authorize the delivery provider and securely configure a verified sender, approved recipient and sending credential. The code currently supplies a replaceable Resend adapter; no provider account, sender, credential or DNS record was created by this implementation.
3. Send the previously authorized clearly labeled synthetic inquiry to the business recipient and verify actual receipt, error/retry behavior and challenge usability. Provider acceptance is only one step in that check.
4. Configure a separate analytics test destination, confirm the privacy wording, and test accept/reject/withdraw/persistence and actual event receipts. Preserve the existing production GA4/GTM/Ads configuration until a separately approved launch.
5. Verify a safe appointment reservation, confirmation and cancellation path with the scheduling provider. The existing Calendly link remains; a real reservation is a separate action.

## Validation recorded by this implementation track

Twelve Node tests passed: nine inquiry tests and three consent/event-policy tests. They cover malformed input, body limits, origins, rate-limit failure, challenge mismatches, provider acceptance/error/timeout, idempotent retry behavior, static-asset fallback, consent expiry and event payload restrictions. All external responses in these tests are synthetic; they do not send email or create bookings. Frontend JavaScript syntax checks also passed. Full project tests, production builds, deployed Worker behavior and browser integration acceptance are recorded separately by the release review.

## Primary references

- [Cloudflare Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) and [widget configurations](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/)
- [Cloudflare rate-limit binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Resend email API](https://resend.com/docs/api-reference/emails/send-email) and [idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Google consent implementation](https://developers.google.com/tag-platform/security/guides/consent)
