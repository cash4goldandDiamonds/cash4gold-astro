# Editing and publishing guide

**Private Studio editing is partly verified; the complete publishing service remains blocked.** Actual draft editing, a synthetic FAQ publish/unpublish, article rich-text preservation and the organized navigation passed in `migration-staging`. Image replacement, full global/service editing, protected hosted visual preview, reviewer permissions and rebuild/rollback acceptance remain incomplete. Production was not changed. See `STAGING_ACCEPTANCE_2026-09-10.md` for the dated evidence and its limits.

## Edit an article

1. Open Articles for selling guides, Pages for general pages, or Services for service records. Categories, Archives, Questions and answers, Media, Business information, SEO and content review, Navigation and footer, and Redirects have separate sections. All pages and articles retains older saved editor links. Keep the existing URL path. Choose a clear page title and author. Preserve the original publication date; use Actual content revision date only when the public content meaningfully changes.
2. In Content, edit the structured body, headings, lists, links, tables and images. New documents default to edited content. Imported service/home layouts can retain Preserved source layout; changing the body alone will not replace that layout until its content mode is changed. Full routine editing of global/home/service blocks is still an acceptance gap.
3. Internal links should use Link to a page so a reference resolves to the destination's current path. Add an optional existing section anchor. Use a normal external link for authoritative sources. Verify all links in the rendered preview.
4. Give images descriptive ALT text, credit/rights, an appropriate caption and the illustrative/AI flag when applicable. Do not label generated jewelry as actual shop inventory. Review the complete item at mobile and desktop sizes. Migrated local images retain original source metadata; a filename does not establish usage rights.
5. In AEO / GEO, add a concise direct answer, relevant service, useful questions, related guides, primary reader intent and real sources/check dates. Avoid creating a competing destination for a question already answered well. Do not add unsupported ratings, certification, ranking guarantees or location details.
6. In SEO, review the title and description against the actual page, canonical, index/follow switches, social preview and breadcrumb. Select BlogPosting for an article, Service only for relevant visible service content. A focus keyword is an editing aid, not a meta-keywords ranking signal. The score is a project checklist heuristic, not a Google score or a promise of ranking.
7. A named authorized human reviewer must check source preservation, facts, buying scope, SEO, media rights and the preview. Record the actual reviewer/date and content/SEO comparison flags; then set the review state to approved. An agent draft ledger does not meet this gate.

Draft changes save automatically even while validation prevents publishing. Pages with draft/inReview status cannot be published through this Studio. The reviewer reference, both comparison flags and an actual review date are required; dates in the future are rejected. This checks the review record, not the reviewer's account authority or the freshness of a previous approval after later edits. Schema validation does not protect direct Content Lake API writes. Tested account permissions and final release checks remain mandatory before launch.

## Preview and release

Private previews must require authentication and remain noindex with private/no-store caching. Never place a read/write token in the browser, preview URL, public source or Studio fields. A public dataset plus a guessed URL is not private preview protection.

After a real Sanity publish, the hosting pipeline must rebuild from the published dataset, run checks, retain an immutable release snapshot and promote only successful output. That pipeline is not connected yet. Publishing in Sanity alone must not be described as a completed website release. Social jobs also require the matching live content revision.

Test and record create, edit, image replacement/ALT, preview, publish, URL change plus redirect, unpublish, restore, reviewer restriction and failed-build behavior in private staging. Never unpublish or restore production content as a test.

## URLs and redirects

Preserve existing paths. A necessary change needs a documented old-to-new disposition and a Redirects document. Prefer one 301 directly to the final relevant destination. Check collisions, cycles, query strings, fragment targets and real hosting response status. Do not redirect all missing pages to the homepage. Ensure internal links and canonical/sitemap entries use the approved destination.

## Social sharing

Use the Social publishing article tab only after the article, image rights and network caption are reviewed. Select channels and explicitly opt in. Global Social publishing can pause everything. Existing drafts are disabled by default. See `SOCIAL_PUBLISHING.md` for the three-post weekly cadence, approval rules, token/hosting blockers and recovery steps.

## Permissions and record keeping

Use separate named editor/reviewer/operator access with the minimum capabilities the actual Sanity plan supports. Hiding a field is not authorization. Administrator access was observed for one owner; separate editor roles have not been configured/tested. Growth Trial expiry and cost/role implications must be resolved without buying a plan automatically. Keep credentials, private leads and backup archives outside content documents. Back up the dataset/assets before imports, preserve source ledgers, and verify restoration in isolation.
