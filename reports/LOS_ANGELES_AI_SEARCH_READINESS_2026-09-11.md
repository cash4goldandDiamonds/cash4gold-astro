# Los Angeles seller search and AI discovery follow-up

This continues the verified final SEO checkpoint `be772cbbe70f72ad8984950711205cd357bfe452` in the existing private repository. It addresses the owner's follow-up request for discovery by Los Angeles sellers of gold, diamonds, Rolex watches, inherited jewelry and antique jewelry. It does not authorize launch or certify ranking. The [full audit](FINAL_SEO_CONTENT_UX_AUDIT_2026-09-11.md) and its open launch gates still apply.

## Improvements

- Expanded the existing estate service to answer inherited and antique jewelry questions, using the diamond/watch/gold pages as quality references. Its title, description and H1 now include antique jewelry naturally. Eight visible FAQs have matching schema. Copy distinguishes complete-piece evaluation from metal value, old reports from current offers, and preliminary estimates from final inspected offers.
- Linked the estate service from the homepage, shared footer and relevant diamond/watch context. Linked all five existing reviewed estate/antique guides from the service page. No neighborhood pages, invented offices, new routes, article body rewrites, redirects or blanket noindex changes were introduced.
- Added missing FAQPage markup for the existing eight diamond and nine luxury-watch questions, with answers copied from their visible text. The homepage retains its four service cards and five gallery images. Refreshed the prepared CMS proposal to ten pages and 40 documents; it remains unapplied and requires editor reconciliation.
- Removed unverified opening hours and `priceRange` from 76 legacy business-schema nodes (diamond/watch and 74 archives). All 194 existing business nodes now identify Los Angeles as their service area. The build checks reject those unverified fields and require the four primary seller-service pages to retain Service and visible FAQ schema.
- Preserved verified NAP: Cash 4 Gold & Diamonds, 617 S. Hill Street, Los Angeles, CA 90014, 310-663-1340. No invented geographic coordinates, parking, opening hours, credentials, antique-period specialties, remote offices, home visits or guaranteed prices were added.

## Existing routes cover the five seller needs

| Seller need | Primary destination | Supporting role |
|---|---|---|
| Sell gold, jewelry, coins or scrap in Los Angeles | `/sell-your-golds/` | Purity, weight, testing, spot-price context, final offers and visit preparation |
| Sell natural diamonds in Los Angeles | `/sell-your-diamonds-in-los-angeles/` | Natural cut/polished scope, reports and item-specific evaluation |
| Sell Rolex or luxury watches in Los Angeles | `/sell-luxury-watches-in-los-angeles/` | Condition, reference, records, originality and evaluation |
| Sell inherited jewelry in Los Angeles | `/sell-estate-jewelry-los-angeles/` | Inventory, ownership documentation, partial selections and current purchase terms |
| Sell antique jewelry in Los Angeles | `/sell-estate-jewelry-los-angeles/` | Preserve complete pieces, support age/maker claims with records, distinguish antique style from established age |

Existing supporting estate routes remain unchanged: `/how-to-value-estate-jewelry-pieces/`, `/best-inherited-jewelry-valuation-los-angeles-2026/`, `/where-to-sell-your-antique-gold-jewelry-for-the-best-price-expert-guide/`, `/best-estate-jewelry-buyers-los-angeles-2026/`, and `/sell-inherited-jewelry-no-obligation/`. Their current copy is seller-focused; historical “best” slugs do not establish rankings. All five remain KEEP in the article ledger. All 111 article bodies are preserved.

## Search and AI crawler readiness

The isolated production policy emits wildcard crawl permission, static HTML, self-canonical eligible pages, a canonical sitemap, headings, metadata and JSON-LD. It does not source-block the search crawlers below. That does not prove access through the eventual live host: Cloudflare-managed robots, AI Crawl Control, WAF, HTTP headers and redirects must also be verified before launch. Private staging deliberately remains behind Access with noindex, disallow-all and an empty sitemap.

| Search experience | Readiness and launch verification |
|---|---|
| Google Search, AI Overviews and AI Mode | Useful seller content and normal technical SEO remain the foundation. Verify public indexing/snippet eligibility, Search Console ownership and current generative-AI settings. No special AI text file or schema guarantees appearance. [Google guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) |
| Bing and Copilot | Verify Bing Webmaster ownership and Bing Places details, submit the accepted sitemap after launch, and measure indexing and citations. [Microsoft AI performance guidance](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) |
| ChatGPT search | Confirm OAI-SearchBot can reach the approved public pages. GPTBot controls model-training access independently; training access is not required for search discovery. Preserve query parameters for referral measurement. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots) |
| Perplexity search | Confirm PerplexityBot access through the live host. When diagnosing blocking, validate the published IP ranges as well as user-agent identity. [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) |
| Claude search | Confirm Claude-SearchBot and user-requested Claude-User access. ClaudeBot training controls are separate. [Anthropic crawler guidance](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) |
| Gemini Apps and Vertex grounding | The existing wildcard permission leaves Google-Extended allowed. This product token covers both Gemini model improvement and grounding in Gemini Apps/Vertex; it does not control Google Search inclusion. Do not promise independent training/grounding controls when changing this token. [Google crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended) |
| DuckDuckGo AI answers and search | Preserve DuckAssistBot access for AI answers and DuckDuckBot access for crawling; Bing indexing also contributes to ordinary search results. [DuckAssistBot](https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot), [DuckDuckGo sources](https://duckduckgo.com/duckduckgo-help-pages/results/sources) |
| Brave Search and AI answers | Brave's crawler follows Googlebot permission and does not advertise a separate crawler user agent. No invented BraveBot rule is needed. [Brave crawler guidance](https://search.brave.com/help/brave-search-crawler) |
| Grok web search | Public page accessibility supports its documented web search/page browsing. No dedicated publisher crawler token was verified, so none was invented. [xAI web search documentation](https://docs.x.ai/developers/tools/web-search) |
| Other AI search products | Public, accessible, factual HTML and consistent business details provide reusable foundations. Check each product's current publisher guidance separately; this is not a certification of every provider. |

### Existing live Cloudflare configuration: read-only findings

The September 11 dashboard inspection found the individual Block Crawler switches off for OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Googlebot and BingBot. The category policies for Search, Agent and Training all displayed Allow (do not block). Managed robots.txt was off. Bot fight mode and AI Labyrinth were off; Browser Integrity Check was on. These observations do not establish successful crawling through every security rule or origin.

The dashboard's last-24-hour view showed zero allowed requests and unsuccessful requests for OAI-SearchBot (584), Claude-SearchBot (380), PerplexityBot (177) and BingBot (34). Its robots availability panel reported the apex robots.txt as 200 and www robots.txt as 408, with 86 unsuccessful www requests. This is dashboard evidence, not a verified diagnosis of each failed request. The existing www/canonical-host access issue remains a priority launch blocker: identify the failing origin/redirect/security layer and verify successful public crawler access after a separately approved launch. No live switch, rule, DNS record or production response was changed during inspection.

The legacy AI-bot policy also displayed Do not block, with mixed-purpose crawlers set to continue being allowed after the dashboard's announced September 15 policy transition. Recheck these live policies at launch, since hosting configuration can change independently of this repository.

## Follow-up local verification

All 33 unit tests and 13 local validation stages passed, including type checking, fresh preview build, 198-page SEO checks, CMS projection, editorial, substantive, source/route and design checks. A separate production-equivalent build, finalization and SEO verification passed with 118 eligible canonical sitemap entries and wildcard crawl permission. It was never deployed. The four changed pages passed 16 layout checks at 320, 390, 768 and 1280 pixels with no horizontal overflow, missing ALT attributes or failed loaded images. The estate FAQ and mobile navigation expanded correctly. These checks are not measured Core Web Vitals.

The fourteenth local stage, the online dependency advisory check, could not reach its registry (`fetch failed`). The lockfile and dependencies are unchanged from the prior passing GitHub checkpoint. Exact-head GitHub validation will repeat the advisory check and fresh install/build; its actual outcome belongs in the separate delivery handoff. No unperformed remote verification is claimed here.

Google local visibility depends partly on the searcher's distance as well as relevance and prominence. A single Downtown location cannot be promised top placement for every query from every Los Angeles neighborhood. Keep the genuine business location explicit and improve useful service coverage. [Google local ranking guidance](https://support.google.com/business/answer/7091?hl=en).

## Remaining owner and launch decisions

Confirm actual business hours, antique acceptance/specialties and testing methods before stating specific operational claims. The revised page discusses possible antique pieces within the already established buying scope; it does not claim authentication credentials or formal probate/tax/insurance appraisal services. Confirm any current editor changes before applying the prepared CMS update.

The existing 111-article ledger still recommends 84 KEEP, 19 IMPROVE, 4 MERGE and 4 REDIRECT. The 19 improvement candidates and eight conditional consolidations require the recorded content/traffic/backlink decisions. No automated “fully optimized” label substitutes for that review or ongoing measurement.

Inquiry delivery, booking confirmation, analytics/consent, hosted Sanity acceptance, full backup/restore, measured performance and wider accessibility/edge checks remain unresolved. Staging is intentionally undiscoverable. Publish indexing settings and submit sitemaps only after the remaining launch gates pass and the owner explicitly approves launch.

**Recommendation remains NO-GO for launch.** Test/build results and the final GitHub commit for this follow-up are recorded in its separate delivery handoff. This document does not claim that a pending commit, build or deployment has passed.
