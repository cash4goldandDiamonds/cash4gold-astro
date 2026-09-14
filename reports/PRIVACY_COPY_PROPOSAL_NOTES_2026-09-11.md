# Privacy page proposal for root review

`privacy-policy-proposed.html` is replacement body copy for the existing `/privacy-policy/` route. It has one H1 and unique heading IDs. This track has not applied it to `pages.json` or hosted content.

The first notice explicitly reflects the current disabled inquiry/analytics providers. Update that notice before enabling either integration; do not publish it unchanged once those states differ. Other sections explain the prepared functionality conditionally. Maintain the existing canonical URL and robots policy. Suggested description: `Privacy information for Cash 4 Gold & Diamonds: website security, inquiries, optional analytics, browser preferences and how to contact the business.`

Facts grounded in source: specified form fields, optional phone, permission to reply, no attachments, Cloudflare spam validation, Resend forwarding, no appointment confirmation, opt-in analytics, fixed custom conversion payloads, 180-day consent validity and separate menu sound storage. The 180 days describes preference validity, not automatic browser-storage deletion or mailbox, Cloudflare, Google or Resend retention.

Owner review remains necessary for actual business retention practices, request handling, organizational/legal disclosures and the final enabled providers. No deletion deadline, guaranteed legal coverage, vendor retention duration, compliance certification or data-sale claim is invented. This is a factual website explanation, not a substitute for the owner's complete privacy policy review.

Official provider privacy links were opened and verified on September 11: Cloudflare privacy policy, Resend privacy policy, Google privacy policy and Calendly's current `/legal/privacy-notice` destination. No visitor information was sent to those pages.

New test files: `tests/inquiry-markup.test.mjs` (five tests) and `tests/integration-csp.test.mjs` (three tests). All eight passed in an isolated test fixture copied from the current implementation. No shared implementation files were changed by this task. An isolated `node_modules` junction under this work directory points to the existing validation dependencies; do not recursively delete through it.
