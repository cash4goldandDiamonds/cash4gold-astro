// Studio validation stops accidental publication, but Content Lake writes do
// not run schema rules. Account permissions and release checks remain required.
export function validatePageReview(document) {
  if (document?.reviewState !== 'approved') {
    return 'Complete editorial review before publishing. Draft changes still save automatically.';
  }
  const reviewer = document.reviewedBy?._ref;
  const reviewTime = typeof document.reviewedAt === 'string' ? Date.parse(document.reviewedAt) : NaN;
  if (document.contentVerified !== true || document.seoVerified !== true ||
      typeof reviewer !== 'string' || !reviewer.trim() || reviewer.startsWith('drafts.') ||
      !Number.isFinite(reviewTime) || reviewTime > Date.now()) {
    return 'Approval requires recorded content and SEO comparison, a named published reviewer, and a valid actual review date that is not in the future.';
  }
  return true;
}
