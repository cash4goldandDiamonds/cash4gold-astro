# Local development and remaining connections

**For the new work PC, follow `WORK-PC-HANDOFF.md`.** It contains the portable setup and current account/validation state. The original-computer paths and earlier unconnected status below are historical. Required public source evidence and selected source artwork now live inside `migration/`; generated reports go to `outputs/`. Do not copy old machine-specific launchers, saved authentication, or runtime folders.

## Checkout

`C:\Users\judit\Documents\Codex\2026-09-09\cash-for-gold\cash4gold-astro`

The repository is a real clone of `cash4goldandDiamonds/cash4gold-astro`, branch `main`. Implementation changes are local and uncommitted. Nothing has been pushed.

The parent task's `outputs/Start-Preview.cmd` launches the local preview. `outputs/Open-Development-Shell.cmd` opens a shell with bundled Git, Node and pnpm available. These launchers change the current process only; they do not change Windows-wide settings.

## Working commands

- `pnpm dev`: local server at http://127.0.0.1:4321/.
- `pnpm build`: static site in `dist/`.
- `pnpm verify`: compare generated output against captured source.
- `node scripts/export-sanity.mjs`: prepare structured import documents locally.
- `node scripts/check-schema.mjs`: compile the Sanity schema without account access.

Astro 7 starts a background development server. Use `pnpm exec astro dev status`, `pnpm exec astro dev logs`, or `pnpm exec astro dev stop` to manage it.

## Sanity connection

Use an owner-controlled Sanity project and a private staging dataset. Copy `.env.example` to `.env`, supply the project ID and dataset, and provide a read-only token through `SANITY_READ_TOKEN`. Tokens stay build-side and must never use a PUBLIC_ or SANITY_STUDIO_ prefix. Studio uses its own signed-in user permissions.

For Studio, set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`, then run `pnpm exec sanity dev --host 127.0.0.1`. No placeholder project IDs or credentials are supplied. An authenticated Studio session and publishing have not been tested.

`migration/sanity-import.ndjson` contains structured pages, rich text, tables, imported-image records, questions/answers and business/navigation data. It has not been uploaded. Review it before importing into the private dataset. Imported images point to the local snapshot and retain their source URLs; the original assets still need to be uploaded to Sanity and reconciled. Export tools do not send data remotely.

Pages default to **Preserved source layout**. Their editable rich text is prepared separately. Choose **Edited content below** only after checking the edited preview against the original. Static content changes become visible after rebuilding. A CMS refresh/webhook, authenticated draft preview and click-to-edit remain to be configured.

The global header/footer can read the business and main-navigation documents. Source article text and preserved JSON-LD still retain original business references and need a structured-content review before claiming site-wide propagation.

The SEO/AEO checklist measures editorial field completeness, not rankings. Redirect schema validation detects duplicates and cycles. CMS redirect publication is not wired; local `_redirects` rules currently reflect the captured source aliases.

## Forms, appointments and analytics

The existing Calendly booking URL is linked from appointment areas. It opens only when selected and has not been booking-tested. Contact forms show an explicit local-preview notice and telephone alternative; delivery is not simulated. Supply the existing form delivery configuration before implementing and testing submissions.

Third-party review widgets and tracking scripts have been inventoried and left inactive. The captured written testimonials are preserved. Analytics/conversions, review feeds, consent behavior and scheduling must be tested before release.

## Source preservation and quality

`../work/source/` holds timestamped source HTML, CSS, sitemap responses and crawl records. `migration/` holds the URL/media inventory, import issues, source redirect chains, structured Sanity import and output verification. Public capture is not a full WordPress backup and has not been reconciled with an owner export.

Two source URLs form a redirect loop: `/best-gold-buyers-los-angeles/` and `/best-gold-jewelry-buyers-los-angeles-2026/`. `/3727/` and `/author/` returned 404. These source problems are recorded rather than guessed. `locations.kml` was captured as XML, not an HTML page.

Generated-page tests cover source text blocks, metadata, H1s, asset existence, internal routes, noindex, inactive forms/scripts and redirect targets. They do not establish browser layout quality, accessibility compliance, field Core Web Vitals, working external services or complete migration acceptance. Owner visual review and representative browser/device testing remain pending.

## Future Cloudflare staging

`wrangler.preview.jsonc` is prepared for static assets. No deployment command, production domain, DNS route or automated publish workflow is configured. Before any remote staging, set up access control on the owner's Cloudflare account. Noindex alone is not privacy. Existing `_headers` and `_redirects` files are ready for the static host; validate behavior on private staging.

Production requires owner review of the completed replacement, acceptance evidence, a backup/rollback plan and explicit approval.
