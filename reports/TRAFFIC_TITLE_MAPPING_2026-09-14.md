# Traffic-sensitive title mapping — September 14, 2026

The GA4 title **"Sell Your Gold Online: 7 Ways to Get Best Cash Price Fast" maps in both saved live crawls to `/sell-your-golds/`**, the main gold service page. It does not identify the separate `/sell-gold-and-diamonds-online/` article.

Root reported a fresh GA4 home observation of **41 views in the last seven days** under that title. This workstream did not access GA4 and treats that number as root-supplied account evidence. A title-only report can combine paths or title variants; confirm the exact page-path/landing-page dimension and date range before attributing all 41 views to one URL or channel. It is not Search Console organic-click evidence.

| Evidence | Gold service page | Separate gold-and-diamond article |
| --- | --- | --- |
| Saved September 9 crawl title | `Sell Your Gold Online: 7 Ways to Get Best Cash Price Fast` | `How to Sell Gold and Diamonds Online: 7 Proven Tips` |
| Saved September 10 crawl title | Same gold service title | Same article SEO title |
| Final URL in both crawls | `/sell-your-golds/` | `/sell-gold-and-diamonds-online/` |
| Existing source redirect | `/sell-your-gold/` → `/sell-your-golds/` | `/cash-for-gold-sell-your-gold-and-dramonds-usa/` → `/sell-gold-and-diamonds-online/` |
| Current rebuild title | `Gold Buyer Los Angeles \| Sell Gold Jewelry, Scrap & Coins` | `Selling Gold and Diamonds Online: Prepare the Whole Piece` |
| Current content type | Service page (`isArticle:false`) | Article (`isArticle:true`); captured WordPress post ID `2898` |
| Current source robots | `follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large` | `follow, noindex` |
| Production policy output, evaluated locally | `index,follow,max-image-preview:large` | `noindex,follow,max-image-preview:large` |

Sources: `migration/source-evidence/crawl.json` (September 9 observations), `migration/pre-deployment/live-source/crawl.json` (September 10 observations), `migration/pre-deployment/wordpress-api/posts.json`, `migration/editorial-baseline.json`, `src/data/pages.json`, `src/data/redirects.json` and `src/lib/release-policy.mjs`. Both crawls returned HTTP 200 at the final gold service URL with an index directive; the article's noindex was already in those captures.

`migration/final-seo-audit/article-decisions.json` records the article as **KEEP**, with no proposed redirect target, alongside its inherited `follow, noindex` directive. Its summary has zero newly recommended `NOINDEX` decisions. The unresolved article noindex decision is therefore an inherited indexing review, not an approved new noindex action. Neither route occurs as a source in the eight conditional merge/redirect proposals.

## Preservation decision

- Keep `/sell-your-golds/`, its canonical, useful gold-selling content and existing singular-URL redirect. The source currently preserves its production index eligibility; this workstream changed none of them.
- Preserve `/sell-gold-and-diamonds-online/`, its content and current robots pending the owner's indexing decision. The 41-view title observation alone does not establish that this article received those views and is not grounds to delete, redirect or change its indexing.
- Leave all eight conditional merge/redirect proposals and both inherited article noindex decisions unapplied. Review path-level GA4, Search Console queries/clicks and backlink evidence before any owner-approved change.
- Keep all staging pages protected and noindex. The locally evaluated production rules above are not a live launch or crawler-access verification.

No page content, title, canonical, robots directive, redirect or sitemap was changed by this mapping correction. It prevents traffic data for the main gold service page from being incorrectly assigned to a similarly named article.
