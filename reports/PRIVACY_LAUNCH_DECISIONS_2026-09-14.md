# Launch privacy wording and owner policy

The owner supplied this policy on September 14: "We keep customer inquiries only as long as needed to answer questions and complete transactions, and we delete them upon request. All privacy and deletion requests are handled by the owner."

`PRIVACY_LAUNCH_DRAFT_2026-09-14.html` incorporates that policy verbatim. Its body, excluding the opening review notice, is prepared in the local `/privacy-policy/` source page, with a matching unapplied CMS proposal outside Git. Neither preparation deploys a site or changes a hosted CMS document. The formerly unanswered business-retention and request-owner decisions are resolved; no deadline, backup process, legal exception or other business practice has been invented.

The path, canonical, robots policy, title and historical source metadata remain unchanged. The updated description is `How Cash 4 Gold & Diamonds handles website inquiries, optional analytics, browser preferences and privacy questions.` The page removes the old preview-only/always-disabled assertions and describes inquiry and analytics features conditionally.

## Facts established by source

- Cloudflare hosts/protects the prepared deployment; Turnstile is used for available inquiries. Server verification includes the connecting IP and challenge token.
- The inquiry asks for name, email, item type, message and an optional phone, with permission to respond. The adapter forwards those details and a reference through Resend to the business mailbox. There are no file uploads, customer accounts, newsletters or website payments in this implementation.
- Optional Google Analytics requires affirmative consent. Its explicit contact events use an action and build-known page, not inquiry fields. Technical/cookie processing by Google is acknowledged rather than described as anonymous.
- The September 14 analytics corrections enforce preference expiry and cross-tab clearing. If saving rejection fails, the latest fix attempts to remove the stale saved grant. If both operations fail, analytics stays disabled on the current page with a page-only notice. The copy now makes reloading conditional. The 180-day period is consent validity, not a records-retention/deletion schedule.
- Menu sound preference is stored separately in the browser. Calendly remains an external scheduling link. The source makes no booking/inbox-delivery success claim.
- The business contact information is preserved from the reviewed source. The owner is expressly identified as handling privacy and deletion requests.

## Remaining release checks

1. **Final services and settings:** verify Cloudflare/Turnstile, Resend and Google Analytics against the actual enabled deployment. Preserve conditional wording while inquiries/analytics remain unavailable. Confirm provider retention settings from the actual accounts; the wording invents no provider retention period, and the owner's inquiry policy is not a provider-setting report.
2. **Hosted analytics:** complete actual consent, payload, automatic-event and withdrawal checks before relying on those statements. The source description is not evidence of successful hosted acceptance.
3. **Other business practices:** preserve the existing identity and contacts. This copy adds no claims about unconfirmed marketing, sale/sharing, children's data, statutory coverage or compliance certification.
4. **Owner deferrals:** the inbox receipt check remains after confirmed launch, and a real booking remains declined. Publishing a notice is not proof that either flow works.
5. **CMS review:** independently review the source body and CMS projection, then bind any later merge to a fresh authenticated raw read and exact current revisions. The unapplied proposal does not authorize overwriting or publishing a hosted document.

The owner's standard inquiry retention and deletion policy is now incorporated without adding an arbitrary duration or an invented exception. The source body and matching CMS projection remain subject to independent editorial verification; account and hosted acceptance gaps are recorded separately above.

Official provider privacy pages were opened September 14: [Cloudflare](https://www.cloudflare.com/privacypolicy/), [Resend](https://resend.com/legal/privacy-policy), [Google](https://policies.google.com/privacy), [Calendly](https://calendly.com/legal/privacy-notice). These links explain those providers' policies; they do not establish the business's policy or a specific account configuration.
