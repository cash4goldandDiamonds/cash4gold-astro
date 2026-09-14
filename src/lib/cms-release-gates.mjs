import {isLocalPath} from './redirects.mjs';
import {validatePageReview} from '../../studio/review-validation.js';

export function assertContentEnvironment(env = {}) {
  const source = env.CONTENT_SOURCE || 'cms';
  if (!['cms', 'reviewed-static'].includes(source)) throw new Error('Unknown CONTENT_SOURCE.');
  if (source === 'reviewed-static') {
    if (env.SITE_ENV !== 'production' || env.ENABLE_PRODUCTION_INDEXING !== 'true') throw new Error('Reviewed static release requires explicit production indexing.');
    if (env.ISOLATED_PRODUCTION_AUDIT === 'true' || env.ASTRO_OUT_DIR || env.BUILD_STAGING_STUDIO === 'true') throw new Error('Reviewed static release requires normal dist output without audit mode or Studio.');
    if (env.SANITY_PROJECT_ID || env.SANITY_DATASET || env.SANITY_READ_TOKEN || env.SANITY_AUTH_TOKEN || env.SANITY_WRITE_TOKEN || env.CMS_RELEASE_REVIEW || (env.SANITY_PERSPECTIVE && env.SANITY_PERSPECTIVE !== 'published')) throw new Error('Reviewed static release cannot mix CMS data, credentials, draft perspective or CMS approvals.');
    if (!/^[a-f0-9]{40}$/i.test(env.STATIC_RELEASE_COMMIT || '')) throw new Error('Reviewed static release requires the exact reviewed Git commit.');
    return {isolatedSnapshotAudit: false, reviewedStatic: true};
  }
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
    if (production && (doc._id?.startsWith('drafts.') || validatePageReview(doc) !== true)) throw new Error('Production page lacks valid recorded content/SEO review approval: ' + doc.path);
    if (production && (!doc.reviewerDocument?._id || doc.reviewerDocument._id !== doc.reviewedBy._ref || !doc.reviewerDocument.name?.trim())) throw new Error('Production page reviewer must resolve to a named published document: ' + doc.path);
  }
  const missing = requiredPaths.filter(path => !paths.has(path));
  if (missing.length) throw new Error('Sanity import is incomplete. Missing preserved pages: ' + missing.join(', '));
  if (!docs.length) throw new Error('Configured Sanity dataset has no pages.');
}
