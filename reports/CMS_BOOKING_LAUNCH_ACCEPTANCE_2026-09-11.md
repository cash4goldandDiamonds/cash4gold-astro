# CMS and booking acceptance — September 11, 2026

This records the current integration work. It does not approve publication or change the live WordPress site. The owner reports that the WordPress backup is complete; no additional backup was requested or performed in this track.

## Confirmed hosted state

The root agent inspected the existing authenticated Sanity project `gisdw6qa`. `migration-staging` is private; the separate `production` dataset is public and was left unchanged. The project shows 432 documents, zero assets, zero webhooks and one Administrator seat. No Studio has been deployed. API settings show no API tokens and one credentialed CORS origin, `http://localhost:3333`. These are observations before any subsequent staging integration, not assumed environment configuration.

The existing protected website uses repository content. Historical local Studio and private published-content builds do not establish a currently deployed editor, draft website preview or publish-triggered rebuild.

## Code completed and locally verified

- Real CMS projection now emits the same factual Los Angeles service area as the snapshot. It adds no unverified opening hours or price range.
- In edited rich-text mode, referenced FAQ answers update visible answers and the corresponding FAQ schema together. Missing, unresolved or duplicate question references stop the build with a specific error. Questions must have one matching visible heading followed by an answer paragraph. Removing references removes their FAQ markup; it does not silently delete body text. Preserved-layout mode continues using its matching repository content and schema.
- Production content gates now apply the same strict reviewer identity, Boolean approval fields and actual nonfuture review-date validation as Studio. This does not substitute for account permissions or human review of a later content edit.
- Twenty-four focused CMS, build-plan and routing tests passed. The complete 111-article rich-text projection passed with 222 images, 2,688 legacy anchors and zero errors. This is local projection evidence, not a hosted lifecycle claim.

## Protected Studio build prepared

After a fresh website build, run `BUILD_STAGING_STUDIO=true node scripts/build-staging-studio.mjs` in a preview environment. The helper builds the existing Studio with the locked Sanity dependency under `/studio/`, fixed to the private `migration-staging` dataset. It uses Sanity browser sign-in and embeds no read or write token. It rejects client-exposed credential variables and real local environment files, checks output for credential values, adds noindex metadata and records generated inline-script hashes for a scoped Content Security Policy.

Every production plan excludes Studio. The helper also rejects unexpected leftover Studio files in a disabled or production build. Website build output must be refreshed before each Studio build. Build files and redacted logs remain outside Git.

The restricted agent's local Sanity CLI failed before compilation with an operating-system account lookup error, including for `build --help`. Studio compilation therefore still needs verification in the root execution environment or the existing GitHub/Cloudflare build. No successful Studio compilation or hosted editor acceptance is claimed here.

The inquiry Worker now calls a dedicated staging Studio handler. It serves the editor only in an explicitly enabled preview environment on the exact existing protected staging hostname. Direct document navigation falls back to the `/studio/` shell; missing scripts and ordinary website routes retain 404 responses. HTML responses get an editor-specific CSP with exact inline bootstrap hashes, no inline/eval script allowance, noindex and private no-store headers. The expanded editor policy does not apply to website pages. Production, another hostname and mutation requests fail closed. Tests cover these boundaries, but the compiled editor's actual browser connections still need checking.

For hosting, keep the existing All traffic Cloudflare Access policy. Add only the exact protected staging origin to credentialed Sanity CORS after the authorized configuration step. Enable `SITE_ENV=preview` and `STAGING_STUDIO_ENABLED=true` for the Worker, with worker-first routing for `/studio` and `/studio/*`. Confirm `/studio/`, direct document links, sign-in, draft save, source/SEO controls and logout using the protected URL. Do not label a static snapshot link as a draft preview.

Sanity's [self-hosting guidance](https://www.sanity.io/docs/studio/deployment) specifies the CLI base path and SPA routing. Self-hosted registration/schema deployment is a separate step; compiling or serving Studio files does not perform it. [Draft perspectives](https://www.sanity.io/docs/content-lake/presenting-and-previewing-content) also require a distinct authenticated content path. No token should be placed in the public website bundle.

## Pending content reconciliation

Retain the separate ten-page service/home and six-article proposals. Both remain unapplied with content and SEO approval flags unset. `node scripts/verify-cms-update-proposals.mjs` checks their page metadata against the current repository. Supplying a fresh private dataset export as its only argument compares published revisions and identifies drafts to preserve. The command has no network client or import operation and outputs hashes and document identifiers rather than raw private content.

Do not replace the dataset wholesale. Review current hosted changes, then apply only the accepted document differences with revision guards. Complete protected draft rendering, editor permission boundaries, media upload/replacement, publish-triggered staging rebuild and rollback before declaring the CMS launch-ready.

## Booking observation

The existing `https://calendly.com/calidiamond310/30min` URL opens an event titled **30 Minute Meeting**, hosted by Navid, with a 30-minute duration and Pacific Time (US & Canada). September 14 shows appointments between 11 a.m. and 3 p.m. The details form requires Name and Email, offers optional preparation information and guests, and did not display the store's physical address or a meeting location in the inspected flow. No appointment was submitted by this track.

The owner explicitly declined a QA appointment and instructed that the existing event be left alone: “No as long as it works, it’s fine. Leave it alone.” No title, location or event configuration was changed, and no booking or cancellation was submitted. Public date/time selection and the details form passed inspection. Actual confirmation delivery and cancellation/rescheduling remain untested by owner choice; this report does not infer their success from available slots.

## Remaining gates

Hosted Studio compilation/access and CORS; current document reconciliation; protected website draft rendering; role and approval enforcement; and media and rebuild/rollback acceptance remain open until fresh evidence closes them. Booking confirmation/cancellation is an explicitly untested acceptance item by owner choice, with no further booking changes requested. No production launch is performed.
