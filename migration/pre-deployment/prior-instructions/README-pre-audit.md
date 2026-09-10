# Cash 4 Gold & Diamonds migration

**Home-computer work resumed:** the transfer is deferred. Continue this checkout; see [HOME-WORK-STATUS.md](HOME-WORK-STATUS.md) for the latest article review and remaining work. The transfer ZIP is an earlier checkpoint.

Private repository for migrating https://cash4goldanddiamond.com/ from WordPress/Elementor to Astro + Sanity.

## Current status

**Work-PC handoff checkpoint:** start with [WORK-PC-HANDOFF.md](WORK-PC-HANDOFF.md). The complete current implementation and portable source evidence are included. The first 109-article optimization pass, gold page, five substantive gold-guide rewrites, archive synchronization, and address corrections are complete locally. The subsequently requested deeper all-article rewrite and full mobile/desktop performance validation are queued. No live release or CMS upload has taken place. Older migration discovery notes below describe earlier checkpoints.

The first local Astro implementation is running. The production WordPress site remains live.

- GitHub authentication and local clone verified.
- Public crawl: 215 requested URLs, including 122 sitemap URLs.
- 196 distinct pages and 14 existing redirect aliases imported; 480 media files downloaded.
- Source headings, paragraphs, lists and table text, page titles, descriptions, canonical URLs and local assets checked against generated pages.
- 335 images optimized; source originals retained.
- Sanity schema, structured import and build-time content integration prepared. Account connection is pending.
- Contact form delivery, tracking, export reconciliation and final review remain outstanding. This is not a completed migration.

## Local development

Use Node.js 22.12 or newer and pnpm. This computer has Node 24.19 and pnpm 11.19 available through Codex's bundled runtime.

1. `pnpm install --frozen-lockfile`
2. `pnpm dev` (loopback only, http://127.0.0.1:4321/)
3. `pnpm build`
4. `pnpm verify`

Leave Sanity variables blank to use the captured local content. See `.env.example` and `LOCAL-DEVELOPMENT.md` for the connected workflow. All preview pages remain noindex; a public sitemap is intentionally not published while staging is private.

Reports are in `migration/`. Public source HTML and styles are included in `migration/source-evidence/` for portable verification. Selected source artwork is in `migration/design-source/`; editable current content is in `src/data/`. Do not serve the migration evidence directories. Generated audit copies are written to the ignored `outputs/` directory.

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

