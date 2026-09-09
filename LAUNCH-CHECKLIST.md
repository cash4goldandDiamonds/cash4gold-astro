# Launch acceptance checklist

Status: NOT READY. All unchecked items are incomplete or unverified.

## Source preservation

- [ ] Full private WordPress/database/media backup recorded and restoration tested.
- [ ] Source crawl and WordPress export counts reconciled.
- [ ] Every URL mapped: old URL, new URL, migration status, redirect needed, content verified, metadata verified.
- [ ] All important text, images, files, dates, authors, categories and relationships accounted for.
- [ ] No content removal, consolidation, rewriting or URL changes without owner approval.

## Staging

- [ ] Access control prevents unauthenticated viewing.
- [ ] Noindex protection applied to all staging responses.
- [ ] Desktop and mobile staging preview ready for owner review.
- [ ] Sanity content editing, draft preview and publishing tested.
- [ ] Secrets kept out of browser bundles and source control.

## SEO and functionality

- [ ] Old/new crawl comparison covers all indexable URLs.
- [ ] Titles, descriptions, canonicals, headings, robots, social metadata and schema reconciled.
- [ ] Internal links, image ALT text, downloads and sitemap validated.
- [ ] Redirect loops, chains, conflicts and missing destinations tested.
- [ ] Contact forms tested end to end with approved test submissions.
- [ ] Appointments, phone/email links and spam protection tested.
- [ ] Analytics and conversion events verified without duplicate firing.
- [ ] Central business details verified by owner.

## Quality

- [ ] Representative homepage, service, long article and contact pages tested.
- [ ] Mobile and desktop performance results recorded.
- [ ] Keyboard access, labels, focus, contrast and heading hierarchy checked.
- [ ] Responsive layouts and image dimensions checked.
- [ ] Meaningful automated tests and production build pass.
- [ ] Known issues documented and resolved or explicitly accepted.

## Release

- [ ] Owner has reviewed the final staging version.
- [ ] Explicit owner approval for production recorded.
- [ ] Rollback procedure and responsible account owner confirmed.
- [ ] Production DNS/deployment plan reviewed.
- [ ] Post-launch crawl, forms, tracking, Search Console and 404 monitoring scheduled by agreement.

**No automatic production deployment from this repository while approval is pending.**

