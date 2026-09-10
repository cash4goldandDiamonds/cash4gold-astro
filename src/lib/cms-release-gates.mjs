import {isLocalPath} from './redirects.mjs';

export function assertContentEnvironment(env = {}) {
  if (env.SITE_ENV !== 'production') return {isolatedSnapshotAudit: false};
  const isolated = env.ISOLATED_PRODUCTION_AUDIT === 'true' && /^\.?[\\/]?\.cache[\\/]production-audit(?:[\\/]|$)/.test(env.ASTRO_OUT_DIR || '');
  if (isolated && !env.SANITY_PROJECT_ID && !env.SANITY_DATASET) return {isolatedSnapshotAudit: true};
  if (!env.SANITY_PROJECT_ID || !env.SANITY_DATASET) throw new Error('Production requires a verified Sanity content source. Snapshot output is allowed only in the isolated production-audit directory.');
  if (env.SANITY_DATASET !== 'production' || (env.SANITY_PERSPECTIVE || 'published') !== 'published') throw new Error('Production must use the production dataset and published perspective.');
  return {isolatedSnapshotAudit: false};
}

export function assertCmsPages(docs, requiredPaths, {production = false} = {}) {
  const paths = new Set();
  for (const doc of docs) {
    if (!isLocalPath(doc.path) || paths.has(doc.path)) throw new Error('Invalid or duplicate CMS page path: ' + doc.path);
    paths.add(doc.path);
    if (!doc.title?.trim() || !doc.seo?.title?.trim() || !doc.seo?.description?.trim()) throw new Error('Incomplete CMS page metadata: ' + doc.path);
    if (production && (doc._id?.startsWith('drafts.') || doc.reviewState !== 'approved' || !doc.contentVerified || !doc.seoVerified || !doc.reviewedBy?._ref || !doc.reviewedAt)) throw new Error('Production page lacks recorded content/SEO review approval: ' + doc.path);
  }
  const missing = requiredPaths.filter(path => !paths.has(path));
  if (missing.length) throw new Error('Sanity import is incomplete. Missing preserved pages: ' + missing.join(', '));
  if (!docs.length) throw new Error('Configured Sanity dataset has no pages.');
}
