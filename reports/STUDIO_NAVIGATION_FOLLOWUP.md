# Studio navigation acceptance follow-up

**FIXED AND VERIFIED for CMS-05.1. Overall CMS acceptance remains BLOCKED.**

The editor previously put pages and articles into one list. `studio/structure.js` now provides Pages, Articles, Services, Categories, Archives, questions, SEO/content review, Media, business information, navigation, redirects and social publishing sections. The original `page` pane ID is retained so existing editor bookmarks still open. Future document types retain a fallback entry. This changes editor navigation only; it does not change content, grants, publishing permissions or production.

New-content templates set the appropriate page/article/archive kind and begin with unapproved draft review state. Their selection links were observed in the browser; actual creation through every template remains NOT TESTED. Review lists show content requiring approval and missing required SEO fields without implying a ranking score or owner approval. The Media section links to pages containing images and existing uploaded assets; no complete media migration/upload acceptance is claimed.

Actual checks:

- `node --check studio/structure.js` and `node --check sanity.config.js`: passed.
- `node scripts/check-schema.mjs`: 15 content types structurally validated and compiled, zero errors.
- `node scripts/verify-studio-navigation.mjs`: PASS against private published Sanity content. 37 pages, 111 articles and 50 archives account for all 198 page records exactly once. Five service records and eight categories remain accessible. 180 pages contain image blocks; the uploaded-asset list is currently empty. All 198 records still require editorial/SEO approval. Zero records lack the specifically tested required title/description/canonical fields; this is not full SEO acceptance.
- Actual browser: root menus, old document link, articles, five service records, review lists and the built-in asset list loaded. See `migration/pre-deployment/studio-navigation-browser.json`.
- `node scripts/verify-sanity-after-studio.mjs`: all 430 migrated documents remain unchanged; exactly two existing synthetic drafts remain unpublished; repeated import would create zero documents. See its timestamped JSON.

The first remote verification attempt was blocked by the network sandbox (`EACCES`). After the owner granted the app's requested network permission, the actual query check passed. The initial failure remains in `migration/pre-deployment/studio-navigation-initial-network-block.json`; no permission was bypassed.

Changes live in the existing isolated `audit/staging-acceptance-2026-09-10` checkout. A minimal `sanity.config.js` patch plus the new structure file is being supplied for consolidation into the reviewed audit branch. No production deployment occurred.

Current owner decisions: permission-screen inspection and clearly labeled synthetic inquiry tests to the confirmed Gmail inbox are approved. Do not ask for those again. Those approvals do not authorize booking reservations/invitations, a broader credential, account-wide Access, DNS changes or production launch. GoDaddy sign-in, an actual form delivery integration, remaining privacy/analytics decisions, complete restore and full CMS/deployed acceptance remain separate gates.
