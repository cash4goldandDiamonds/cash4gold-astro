# Launch acceptance checklist

Current release scope: [initial production release plan](reports/INITIAL_PRODUCTION_RELEASE_2026-09-14.md). The owner authorized launch and deferred optional enhancements. Initial release uses verified static content, honest contact fallbacks and disabled analytics; private CMS acceptance follows later. Final candidate CI, production output and hosting cutover remain pending. The detailed historical checklist below records evidence and follow-up work; unchecked optional items do not revoke the current authorization.

## Source preservation

- [x] Owner reports the WordPress backup complete.
- [ ] Isolated restoration demonstrated and the full backup contents independently verified.
- [ ] Source crawl and WordPress export counts reconciled.
- [ ] Every URL mapped: old URL, new URL, migration status, redirect needed, content verified, metadata verified.
- [ ] All important text, images, files, dates, authors, categories and relationships accounted for.
- [ ] No content removal, consolidation, rewriting or URL changes without owner approval.

## Staging

- [ ] Access control prevents unauthenticated viewing.
- [ ] Noindex protection applied to all staging responses.
- [ ] Desktop and mobile staging preview ready for owner review.
- [ ] Sanity content editing, draft preview and publishing tested.
- [ ] Fresh authenticated raw CMS snapshot reconciled against the 53 existing proposals and the privacy update; unrelated fields, drafts and release versions preserved.
- [ ] Secrets kept out of browser bundles and source control.

## SEO and functionality

- [ ] Old/new crawl comparison covers all indexable URLs.
- [ ] Titles, descriptions, canonicals, headings, robots, social metadata and schema reconciled.
- [ ] Internal links, image ALT text, downloads and sitemap validated.
- [ ] Redirect loops, chains, conflicts and missing destinations tested.
- [x] Owner-approved three sender DNS additions recorded; original 12 records verified unchanged.
- [x] Root verified the Resend sender and stored its domain-restricted key as an encrypted staging Worker secret.
- [ ] Reviewed staging source deploys prepared inquiry activation together with the owner-policy privacy page; current runtime remains disabled until that build.
- [ ] Actual inquiry/inbox receipt tested under the owner's deferred post-launch instruction; no receipt is claimed now.
- [ ] Actual booking acceptance tested; owner declined this test, calendar unchanged.
- [ ] Phone/email links and real challenge/spam-protection behavior verified on the final staging build.
- [x] Separate staging GA4 property and public build variables configured; production property unchanged.
- [ ] Analytics and conversion events verified without duplicate firing.
- [x] Owner-supplied inquiry retention and owner-handled deletion wording incorporated in local privacy source.
- [ ] Final privacy copy, hosted CMS version and enabled-service behavior independently reconciled.
- [ ] Central business details verified by owner.

## Quality

- [ ] Representative homepage, service, long article and contact pages tested.
- [ ] Mobile and desktop performance results recorded from the actual Linux lab run and independently reviewed; no usable Windows metrics were obtained.
- [ ] Keyboard access, labels, focus, contrast and heading hierarchy checked.
- [ ] Responsive layouts and image dimensions checked.
- [ ] Final frozen candidate passes combined checks, secret review and fresh exact-head Linux quality/performance workflows.
- [ ] Known issues documented and resolved or explicitly accepted.

## Release

- [ ] Owner has reviewed the final staging version.
- [ ] Explicit owner approval for production recorded.
- [ ] Rollback procedure and responsible account owner confirmed.
- [ ] Production DNS/deployment plan reviewed; sender-only DNS approval does not authorize website routing or launch.
- [ ] Post-launch crawl, forms, tracking, Search Console and 404 monitoring scheduled by agreement.

**No automatic production deployment from this repository while approval is pending.**

