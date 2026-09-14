# Inquiry runtime configuration

The contact form uses the same-origin Worker endpoint `/api/inquiry/`; `/api/inquiry/config/` reports whether its required settings are present. This is a configuration check, not a delivery health check. A valid-looking key, sender or Turnstile configuration can still be rejected by its provider.

## Recorded state and owner decision

September 14 preparation: root verified Resend sender domain `notify.cash4goldanddiamond.com`, applied the exact three owner-approved DNS additions and confirmed that the original 12 records were unchanged. Root created a sending key restricted to that domain and stored it directly as encrypted Worker secret `INQUIRY_RESEND_API_KEY`. No key value was recorded in source or a local file. The existing encrypted Turnstile secret is preserved. This is root's account evidence, not a delivery result.

The owner authorized sender setup, the restricted key and continued protected staging setup, superseding the credential portion of the September 13 deferral. `wrangler.preview.jsonc` now prepares `INQUIRY_ENABLED=true` and `INQUIRY_FROM=inquiries@notify.cash4goldanddiamond.com` so the next reviewed protected build activates inquiries together with the owner-policy privacy page. The currently deployed runtime remains disabled until that build; verify Access and the served notice before accepting activation. See [the current release checkpoint](../../reports/LAUNCH_CHECKPOINT_2026-09-14.md).

The actual inbox test remains deferred until after a confirmed website launch, and a real booking test remains declined. Do not send a message or mark delivery accepted on the basis of setup approval. Neither deferral is launch approval.

## Required Worker settings

Configure these on the existing `cash4gold-private-preview` Worker. They are runtime bindings, not browser variables or Astro build secrets. Keep credential values outside source control and reports. [Cloudflare secret storage](https://developers.cloudflare.com/workers/configuration/secrets/).

| Setting | Required value or rule | Recorded state / remaining action |
| --- | --- | --- |
| `SITE_ENV` | `preview` on protected staging; `production` only on the separately approved production Worker | Staging source has `preview` |
| `INQUIRY_ENABLED` | Exact string `true` enables configuration readiness | Prepared `true` in reviewed source for atomic privacy/form activation; deployed runtime still `false` at this checkpoint |
| `INQUIRY_PROVIDER` | `resend` | Present in staging source |
| `INQUIRY_ALLOWED_ORIGINS` | Comma-separated exact HTTPS origins, without trailing slash or paths | Existing staging origin is `https://cash4gold-private-preview.cash4goldanddiamond.workers.dev`; production requires its actual approved origin |
| `INQUIRY_FROM` | Bare email address on the sender domain verified by Resend; no display-name wrapper | Prepared `inquiries@notify.cash4goldanddiamond.com` |
| `INQUIRY_TO` | Approved business recipient | Staging source retains `cash4goldanddiamond@gmail.com` |
| `INQUIRY_RESEND_API_KEY` | Worker encrypted secret with sending permission restricted to the selected domain | Root verified encrypted storage after creating the domain-restricted sending key September 14 |
| `INQUIRY_TURNSTILE_SITE_KEY` | Public site key for the existing widget, allowing the exact staging hostname | Present in staging source; provider hostname configuration still needs confirmation |
| `INQUIRY_TURNSTILE_SECRET` | Matching Worker encrypted secret | Present per September 13 handoff; do not print or replace it merely to inspect configuration |
| `INQUIRY_RATE_LIMITER` | Native binding exposing `limit({key})` | Staging source declares namespace `2026091101`, five attempts per 60 seconds |

The Worker uses the connecting IP in Turnstile verification and a SHA-256 digest of that IP for the rate-limit key. The digest is not a claim of anonymous data. The rate limiter is not a precise global quota. [Cloudflare rate-limit binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).

## Remaining configuration sequence

1. Preserve the already verified `notify.cash4goldanddiamond.com`; do not create a duplicate domain. Root observed TLS enforced, tracking unconfigured and receiving off. The business Gmail address remains the recipient, not the sender domain. [Verified domains](https://resend.com/docs/dashboard/domains/introduction).
2. Preserve the three approved sender DNS additions and all existing mail-routing/website records. This sender-only authorization does not extend to website routing or nameserver changes. Exact account-generated values remain in the private setup evidence. [Resend domain setup](https://resend.com/docs/add-a-domain).
3. Preserve the existing domain-restricted sending key in encrypted Worker storage. Record only its purpose and permission, never its value. Keep the prepared bare sender address and approved recipient. [Resend key permissions](https://resend.com/docs/api-reference/api-keys/create-api-key), [domain restriction and key management](https://resend.com/docs/dashboard/api-keys/introduction).
4. Confirm the existing Turnstile widget permits the exact staging hostname and the configured secret matches it. Keep the action `inquiry`; the Worker requires that action and the request hostname in the verification response. Confirm the existing rate-limit and asset bindings remain attached. Preserve Cloudflare Access for every staging route. [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
5. Review and deploy the owner-policy privacy replacement with the prepared inquiry activation in one protected staging build. The September 14 local source and [policy record](../../reports/PRIVACY_LAUNCH_DECISIONS_2026-09-14.md) supersede the older proposal; the hosted CMS proposal remains unapplied. Verify the served notice accurately describes inquiry fields, Turnstile and Resend processing. Source preparation is not deployment.
6. After the reviewed build, verify the deployed source identity, All traffic Access and runtime readiness through GET only. Runtime dashboard changes can be overwritten by deployment; this candidate keeps non-secret activation values in its actual deployment configuration. Production origin, Turnstile hostname and environment remain separate release configuration. No production route is prepared here.

## Acceptance evidence to collect later

An authenticated GET to `/api/inquiry/config/` is read-only. While disabled it should report `enabled:false`, an empty site key and the phone/email fallback. When every runtime requirement is configured and activation is authorized, `enabled:true` confirms presence only. Never infer sender verification or inbox delivery from this response.

At the owner's later inquiry test, verify the real compact challenge, a clearly labeled synthetic inquiry, provider acceptance, actual business-inbox receipt and reply behavior. Record only the time, non-sensitive reference and outcome. A 202 response says the provider accepted delivery; it does not establish inbox placement. Test failure and unchanged manual-retry behavior separately without sending duplicate customer messages. The implementation has no automatic retry.

The September 14 client fix retains the reference when an unchanged inquiry is retried after editing and undoing text, toggling permission, or adding only trimmed whitespace. Different submitted content gets a new reference; a confirmed acceptance resets the form for a genuinely new inquiry. Identity lasts only in the current page session. Refreshing or opening another tab loses it; follow the uncertainty message and check with the business before creating another copy.

Focused local verification: `node --test tests/inquiry-form.test.mjs tests/inquiry.test.mjs tests/inquiry-markup.test.mjs tests/privacy-consent.test.mjs`. These tests use synthetic inputs and mocked network responses and cannot establish provider or inbox acceptance.
