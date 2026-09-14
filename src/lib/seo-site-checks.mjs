const origin = 'https://cash4goldanddiamond.com';
const normalize = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
const publicId = id => String(id || '').replace(/^drafts\./, '');
export function inspectSeoPeers(document, documents) {
  const all = documents.filter(doc => publicId(doc._id) !== publicId(document._id));
  const pages = [...all, document], byId = new Map(pages.map(doc => [publicId(doc._id), doc]));
  const paths = new Set(pages.map(doc => doc.path));
  function links(doc) {
    const found = [];
    for (const ref of doc.related || []) found.push({path: byId.get(publicId(ref._ref))?.path, reference: ref._ref});
    for (const block of doc.body || []) for (const mark of block.markDefs || []) {
      if (mark._type === 'internalLink') found.push({path: byId.get(publicId(mark.target?._ref))?.path, reference: mark.target?._ref});
      if (mark._type === 'link' && mark.href) {
        try { const url = new URL(mark.href, origin + (doc.path || '/')); if (url.origin === origin) found.push({path: url.pathname, href: mark.href}); } catch { found.push({href: mark.href}); }
      }
    }
    return found;
  }
  const outgoing = links(document), inbound = all.filter(doc => links(doc).some(link => link.path === document.path));
  const canonical = document.seo?.canonical || origin + (document.path || '/');
  let canonicalWarning = '';
  try { const url = new URL(canonical); if (url.origin !== origin || url.search || url.hash) canonicalWarning = 'Canonical must use the production origin without tracking queries or fragments.'; else if (url.pathname !== document.path) canonicalWarning = 'This canonical points to another page. Record the reason and verify the intended primary destination.'; } catch { canonicalWarning = 'Canonical is not a valid absolute URL.'; }
  const duplicate = field => all.filter(doc => normalize(document.seo?.[field]) && normalize(doc.seo?.[field]) === normalize(document.seo[field])).map(doc => ({path: doc.path, canonicalAlias: (doc.seo?.canonical || origin + doc.path) === canonical}));
  return {
    duplicateTitles: duplicate('title'), duplicateDescriptions: duplicate('description'), canonicalWarning,
    overlappingTopics: all.filter(doc => normalize(document.seo?.focusKeyword) && normalize(doc.seo?.focusKeyword) === normalize(document.seo.focusKeyword)).map(doc => ({path: doc.path, title: doc.title})),
    inbound: inbound.map(doc => ({path: doc.path, title: doc.title})), outbound: [...new Set(outgoing.map(link => link.path).filter(Boolean))],
    brokenReferences: outgoing.filter(link => !link.path || (!paths.has(link.path) && !/\.[a-z0-9]+$/i.test(link.path))),
    scope: 'CMS document body and related links only. Global navigation, redirects, assets and fragments require the built-site audit.'
  };
}
