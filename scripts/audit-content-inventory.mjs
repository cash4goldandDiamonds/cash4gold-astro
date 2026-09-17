// One-off analysis script for the Sept 17, 2026 SEO/AEO/GEO audit content inventory.
// Reads the already-built dist/ output (production-equivalent, reviewed-static build) and
// derives structural facts directly from the rendered HTML -- nothing here is guessed.
// Run after `pnpm build` with the production env vars (see README "Development and release
// verification"). Writes reports/CONTENT_INVENTORY_2026-09-17.json and .csv.
import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

const distDir = path.resolve('dist');
const siteOrigin = 'https://cash4goldanddiamond.com';

const sitemapXml = await fs.readFile(path.join(distDir, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const sitemapPaths = sitemapUrls.map(u => new URL(u).pathname);

// Build a full internal-link graph across every built content page (not just sitemap pages),
// so "internal links in" reflects the whole site's actual crawlable HTML, and orphan status
// is real (a page could be linked only from a non-indexable archive/tag page, for instance).
async function walk(dir) {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  let files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(await walk(p));
    else if (e.name === 'index.html') files.push(p);
  }
  return files;
}
const allHtmlFiles = await walk(distDir);

const linksIn = new Map(); // path -> Set(source paths)
const pageData = new Map(); // path -> extracted facts

for (const file of allHtmlFiles) {
  const rel = '/' + path.relative(distDir, file).replace(/index\.html$/, '').replace(/\\/g, '/');
  const routePath = rel === '//' ? '/' : rel.replace(/\/$/, '/') || '/';
  const html = await fs.readFile(file, 'utf8');
  const $ = load(html);

  // Whole-document link graph (header/nav/footer + body): this is what actually determines
  // crawlability/PageRank flow and real orphan status.
  const internalOutPaths = new Set();
  $('a[href]').each((i, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    let u;
    try { u = new URL(href, siteOrigin); } catch { return; }
    if (u.origin !== siteOrigin) return;
    internalOutPaths.add(u.pathname);
  });
  for (const target of internalOutPaths) {
    if (!linksIn.has(target)) linksIn.set(target, new Set());
    linksIn.get(target).add(routePath);
  }
  // Body-content-only outbound links: a better signal of deliberate contextual/editorial
  // linking, separate from the persistent header/footer nav that's on every page.
  const bodyOutPaths = new Set();
  $('main a[href]').each((i, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    let u;
    try { u = new URL(href, siteOrigin); } catch { return; }
    if (u.origin === siteOrigin) bodyOutPaths.add(u.pathname);
  });

  const h1s = $('main h1');
  const mainText = $('main').text().replace(/\s+/g, ' ').trim();
  const wordCount = mainText ? mainText.split(' ').length : 0;
  const hasContactCta = $('main a[href^="/contact-us"], main a[href^="tel:"], main a[href*="calendly.com"]').length > 0;
  const externalCitations = new Set();
  $('main a[href^="http"]').each((i, el) => {
    const href = $(el).attr('href');
    try { const u = new URL(href); if (u.origin !== siteOrigin && !/calendly\.com|instagram\.com|facebook\.com|yelp\.com|goo\.gl|google\.com\/maps/.test(u.hostname)) externalCitations.add(u.hostname); } catch {}
  });
  const authorMeta = $('meta[name="author"]').attr('content') || '';
  const byline = $('.byline, [itemprop="author"], .article-author, [data-author]').first().text().trim();
  const modified = $('meta[property="article:modified_time"]').attr('content') || $('meta[property="article:published_time"]').attr('content') || '';
  const ld = $('script[type="application/ld+json"]').first().html();
  let ldType = '';
  try { const parsed = JSON.parse(ld || '{}'); const graph = parsed['@graph'] || [parsed]; const main = graph.find(n => n['@type'] === 'BlogPosting' || n['@type'] === 'WebPage'); ldType = main?.['@type'] || ''; } catch {}

  pageData.set(routePath, {
    path: routePath,
    title: $('title').text(),
    h1: h1s.first().text().trim(),
    h1Count: h1s.length,
    canonical: $('link[rel="canonical"]').attr('href') || '',
    robots: $('meta[name="robots"]').attr('content') || '',
    wordCount,
    internalLinksOut: internalOutPaths.size,
    internalLinksOutBody: bodyOutPaths.size,
    hasContactCta,
    authorSignal: authorMeta || byline || '',
    externalCitationCount: externalCitations.size,
    externalCitationHosts: [...externalCitations],
    modified,
    schemaType: ldType,
  });
}

const rows = sitemapPaths.map(p => {
  const data = pageData.get(p) || {};
  return {
    ...data,
    path: p,
    url: siteOrigin + p,
    indexable: !/noindex/.test(data.robots || ''),
    internalLinksIn: linksIn.has(p) ? linksIn.get(p).size : 0,
    linkedFrom: linksIn.has(p) ? [...linksIn.get(p)] : [],
  };
});

await fs.mkdir('reports', {recursive: true});
await fs.writeFile('reports/CONTENT_INVENTORY_RAW_2026-09-17.json', JSON.stringify(rows, null, 2));
console.log(JSON.stringify({sitemapUrls: sitemapPaths.length, totalPagesCrawled: allHtmlFiles.length, orphanedIndexable: rows.filter(r => r.internalLinksIn === 0).length}, null, 2));
