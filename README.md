# Cash 4 Gold & Diamonds migration

Private repository for migrating https://cash4goldanddiamond.com/ from WordPress/Elementor to Astro + Sanity.

## Current status

Discovery started. No website application has been built or migrated. The production WordPress site remains live.

- GitHub account connection verified.
- ChatGPT Codex Connector access limited to this repository.
- Existing migration requirements recovered.
- Full source crawl, WordPress export, media inventory, and service connections are pending.

## Production approval

**Do not publish this project to the live domain, change DNS, redirect live traffic, or retire WordPress without Navid's explicit approval of the completed staging site.**

Staging must be private with access control. Also use noindex headers/meta and exclude staging from public sitemaps. Robots directives alone do not provide privacy.

## Planned architecture

- Astro: prerendered content and minimal client JavaScript.
- Sanity: structured pages, articles, services, media, business data, navigation, redirects, and SEO controls.
- Cloudflare: staging and eventual production delivery after approval.
- Existing URLs, content, metadata, images, forms, appointments, and tracking preserved and reconciled before launch.

## Project records

- MIGRATION-REQUIREMENTS.md: recovered acceptance requirements.
- MIGRATION-STATUS.md: evidence, blockers, and next steps.
- LAUNCH-CHECKLIST.md: required evidence before requesting launch approval.

Do not commit credentials, private customer submissions, backups, or raw account exports. Keep source backups in private storage and document their location without embedding access secrets.

