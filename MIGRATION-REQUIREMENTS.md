# Cash 4 Gold & Diamonds — Migration Requirements

We are looking for a highly experienced **senior Astro + Sanity developer or small development team** to completely rebuild and migrate an established local business website from WordPress/Elementor to a modern, extremely fast and scalable architecture.

**Proposed technology stack:**

**Astro + Sanity CMS + Cloudflare**

This is NOT a basic website redesign.

The existing website contains a substantial amount of established content, service pages, SEO articles, images, forms, appointment functionality, analytics, structured data, internal linking, redirects and existing Google rankings.

**ALL IMPORTANT INFORMATION AND CONTENT CURRENTLY ON THE WEBSITE MUST BE TRANSFERRED TO THE NEW WEBSITE.**

Nothing should be removed, consolidated, rewritten or materially changed without our approval.

## Primary Objectives

The new website must:

- Achieve excellent mobile and desktop performance.
- Target Google's "Good" Core Web Vitals thresholds on representative production pages wherever reasonably achievable.
- Preserve existing SEO rankings and indexed URLs.
- Completely eliminate dependency on WordPress, Elementor and unnecessary plugins.
- Provide an easy CMS for a non-technical owner.
- Replace and exceed the important functionality currently provided by Rank Math.
- Include advanced SEO, Local SEO, AEO and GEO/AI-search optimization capabilities.
- Scale efficiently to hundreds or potentially thousands of articles/pages.
- Allow normal content publishing and SEO management without requiring a developer.
- Maintain strong technical SEO automatically as the site grows.

## COMPLETE TRANSFER OF EXISTING WEBSITE — NON-NEGOTIABLE

Before development begins, the developer must completely crawl and inventory the existing website.

All important existing information and assets must be accounted for and migrated, including:

- Pages
- Service pages
- Blog posts/articles
- Text/content
- Headings
- Images/media
- ALT text
- Relevant image metadata
- URLs/slugs
- SEO titles
- Meta descriptions
- Canonical URLs
- Structured data/schema
- Internal links
- External links
- Categories
- Useful tags
- Authors
- Publication dates
- Modified dates where appropriate
- FAQs
- Testimonials/reviews displayed on the website
- Business information
- Contact information
- Calls to action
- Navigation
- Header/footer information
- Forms
- Appointment functionality
- Existing redirects
- GA4/GTM and relevant tracking
- Conversion tracking
- Search Console verification
- Open Graph/social metadata
- Downloadable resources
- Other important public-facing website information

The developer must create a migration inventory showing at minimum:

**Existing URL → New URL → Migration Status → Redirect Needed → Content Verified → SEO Metadata Verified**

Existing URLs should remain exactly the same wherever possible.

**DO NOT DELETE, CONSOLIDATE, RENAME OR REWRITE EXISTING CONTENT WITHOUT APPROVAL.**

## SEO MIGRATION & RANKING PROTECTION

This is an established website. SEO preservation is extremely important.

Before launch, verify:

- Every indexable URL
- Titles
- Meta descriptions
- Canonicals
- Heading structure
- Internal links
- External links
- ALT attributes
- Structured data
- Open Graph
- Index/noindex directives
- Sitemap inclusion
- robots.txt
- Redirects
- Trailing-slash behavior
- HTTP/HTTPS
- www/non-www

If a URL must change, implement the appropriate permanent 301 redirect.

A complete old-site-versus-new-site crawl comparison is mandatory before launch.

## ASTRO FRONT END

The public website should use Astro with performance-first architecture.

Requirements:

- Static/pre-rendered pages wherever appropriate
- Minimal client-side JavaScript
- Astro Islands only where necessary
- Semantic HTML
- Clean, maintainable CSS
- Mobile-first responsive development
- Strong accessibility
- Optimized fonts
- Efficient code splitting
- No unnecessary global JavaScript
- No heavy page-builder runtime
- No unnecessary component frameworks

Calendars, maps, reviews, CAPTCHA, analytics, chat and other third-party scripts should not automatically load globally when they aren't needed.

Use delayed/conditional loading wherever technically appropriate.

## SANITY CMS

Sanity should allow a non-technical administrator to manage:

- Pages
- Services
- Articles
- Categories
- Authors
- FAQs
- Reviews/testimonials
- Locations
- Calls to action
- Images
- Navigation
- Footer
- Business information
- SEO
- Schema
- Redirects

Content should use properly structured/reusable data rather than giant unstructured page fields.

Changes to centralized business information should propagate throughout the site where appropriate.

## VISUAL EDITING

We want:

- Visual preview
- Draft preview
- Click-to-edit where practical
- Mobile/desktop preview
- Easy publishing
- Scheduled publishing where available

Routine page/article changes must NOT require a developer.

## CUSTOM RANK MATH-STYLE SEO SYSTEM

We want to replace and exceed the important functionality currently provided by Rank Math.

Every relevant page/article should support:

- Focus keyword
- Secondary keywords
- SEO title
- Meta description
- URL slug
- Canonical URL
- Index/noindex
- Follow/nofollow where necessary
- Open Graph title
- Open Graph description
- Social image
- ALT text
- Schema settings
- Breadcrumb information
- Internal/related content

We want a visual SEO checklist/score that can identify issues such as:

- Missing/poor SEO title
- Title length
- Missing/long meta description
- H1 problems
- Missing focus keyword
- Missing ALT text
- Missing canonical
- Missing social image
- Internal-link issues
- Broken links
- Missing schema
- Missing author
- Missing dates

The system should reflect actual SEO best practices rather than blindly copying Rank Math's scoring algorithm.

## LOCAL SEO

The architecture must properly support:

- LocalBusiness/Organization data
- Business name
- Address
- Telephone
- Hours
- Geographic information
- Service areas
- Google Business Profile relationship
- Maps/location information
- Business images
- sameAs/social profiles
- Appropriate review information
- Location/service relationships

Business information should be centrally managed.

## STRUCTURED DATA / JSON-LD

Schema should be generated programmatically from CMS data where appropriate.

Potential types include:

- Organization
- LocalBusiness
- WebSite
- WebPage
- Article
- BlogPosting
- BreadcrumbList
- Service
- Person/Author
- FAQPage when appropriate/compliant
- VideoObject
- ImageObject

Avoid duplicate/conflicting schema.

Validate structured data before launch.

## AEO / GEO / AI SEARCH

The CMS/content architecture should support modern answer engines and AI search in addition to Google SEO.

Support:

- Clear entities
- Entity relationships
- Question/answer content
- Concise answer sections
- Structured FAQs
- Factual business information
- Authors
- Publication/update dates
- Citations/sources where appropriate
- Topics
- Related content
- Geographic relationships
- Service relationships
- Machine-readable structured data

We would like a separate **AEO/GEO checklist/score** where practical.

Possible checks:

- Direct answer present
- Question-oriented headings
- Author identified
- Published/updated dates
- Geographic entity identified
- Organization identified
- Service identified
- Sources/citations where appropriate
- Appropriate FAQ/Q&A structure
- Relevant structured data
- Related internal resources
- Clear topical relationships

## INTERNAL LINKING SYSTEM

We want scalable internal-link management.

Ideally editors can:

- Find related pages/articles
- Add internal links easily
- Identify orphaned pages
- Detect broken internal links
- View outgoing links
- View incoming links where practical
- Receive contextually relevant internal-link suggestions where feasible

Developer should recommend the strongest implementation for Astro/Sanity.

## REDIRECT MANAGER

Non-technical administrators should be able to manage:

- 301 redirects
- 302 redirects where appropriate
- Old URL → new URL mappings

Include protection/detection for:

- Redirect loops
- Duplicate redirects

Import/export functionality is preferred where practical.

## 404 MONITORING

Provide a reliable method for identifying 404 URLs including, where practical:

- Requested URL
- Frequency
- Referrer
- First occurrence
- Last occurrence

Cloudflare or another technically superior monitoring solution can be used if better than placing this functionality inside Sanity.

## XML SITEMAPS

Automatically generate valid XML sitemaps.

Requirements:

- Only canonical/indexable URLs
- New articles automatically included
- Noindexed/deleted content excluded
- Appropriate last-modified dates
- Scalable sitemap index if necessary
- Google Search Console compatibility
- Bing compatibility

## ROBOTS.TXT & AI CRAWLERS

Implement proper robots.txt management.

We also want deliberate control of relevant traditional search crawlers and AI crawlers.

Document how this is implemented.

## IMAGE PERFORMANCE

The website contains many high-quality jewelry photographs.

Implement:

- Responsive images
- Automatic optimization
- WebP/AVIF
- Correct dimensions
- Lazy loading
- Appropriate priority loading
- CLS prevention
- ALT text
- Efficient filenames where appropriate
- CDN delivery
- Correct mobile image sizes

## PERFORMANCE / CORE WEB VITALS

Performance is one of the main reasons for this project.

Optimize and test:

- LCP
- INP
- CLS
- FCP
- TTFB

Testing must use representative production-like pages, not an empty demo page.

Test at minimum:

- Homepage
- Major service page
- Long article
- Contact/appointment page

**Mobile performance is extremely important.**

## CLOUDFLARE

Configure an appropriate Cloudflare architecture, potentially including:

- Cloudflare Workers
- CDN/caching
- Compression
- Redirects
- SSL
- DNS
- Cache-Control
- Security headers
- Appropriate security/bot protection

Developer should recommend the strongest configuration.

## FORMS & APPOINTMENTS

Existing lead-generation functionality must continue working.

Including:

- Contact forms
- Appointment scheduling
- Phone links
- Email links
- Conversion tracking

Implement spam protection without unnecessarily damaging performance.

Appointment/calendar scripts should not unnecessarily load across the entire website.

## ANALYTICS & CONVERSION TRACKING

Support and correctly configure:

- GA4
- Google Tag Manager
- Google Search Console
- Advertising conversion tracking
- Appointment conversions
- Form submissions
- Click-to-call conversions
- Other important lead events

All tracking must be tested after migration.

## SECURITY

Follow modern security practices including:

- HTTPS
- HTTP security headers
- CSP where appropriate
- Secure forms
- API security
- CMS permissions
- Environment variables
- Secret management
- Dependency management

## ACCESSIBILITY

Use modern accessibility practices including:

- Semantic HTML
- Keyboard navigation
- Proper labels
- Focus states
- ALT attributes
- Correct heading hierarchy
- Appropriate contrast
- Accessible forms

## REQUIRED MIGRATION PROCESS

The existing WordPress website remains operational while the new site is developed on staging.

Required process:

1. Crawl current website.
2. Inventory all URLs/content.
3. Inventory metadata.
4. Inventory redirects.
5. Inventory schema.
6. Inventory internal links.
7. Build Astro/Sanity architecture.
8. Migrate ALL important content.
9. Migrate images/media.
10. Crawl new website.
11. Compare old/new URLs.
12. Compare metadata.
13. Validate internal links.
14. Test broken links.
15. Test redirects.
16. Validate canonicals.
17. Validate schema.
18. Validate sitemap.
19. Validate robots.txt.
20. Test performance.
21. Test mobile/responsive design.
22. Test forms.
23. Test appointments.
24. Test analytics/conversions.
25. Verify staging remains noindex.
26. Prepare backup/rollback.
27. Deploy production.
28. Crawl production.
29. Verify Search Console.
30. Monitor indexing, rankings, 404s and Core Web Vitals after launch.

## DOCUMENTATION

Provide documentation for:

- Sanity usage
- Creating/editing articles
- Creating/editing pages
- SEO system
- AEO/GEO system
- Images/ALT text
- Redirects
- Schema
- Sitemap
- Analytics
- Deployment
- Cloudflare
- Backups/versioning
- Rollback
- Developer setup

We must not become permanently dependent on the developer for routine operation.

## SOURCE CODE & OWNERSHIP

We must own and have administrator access to:

- Source-code repository
- Sanity
- Cloudflare
- Deployment/hosting
- Analytics
- APIs/services used by the project

No developer-controlled proprietary hosting or inaccessible source code.


