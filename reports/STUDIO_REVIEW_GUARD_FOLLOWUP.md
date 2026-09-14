# Studio publication review safeguard

**FIXED AND VERIFIED for the narrow accidental-publication bug. CMS-08, CMS-07 and overall launch acceptance remain BLOCKED.**

The existing page validator allowed draft/inReview records to pass because it checked review evidence only when the state already equaled approved. In the actual private Studio, the existing synthetic, unreviewed article draft displayed an enabled Publish button. No publish was attempted.

`studio/review-validation.js`, wired into `studio/schema.js`, now requires approved review state, explicit content/SEO comparison flags, a named published-reviewer reference and a valid review date that is not in the future. Draft saves remain available. The same check applies to all `page` records, including articles and archives; it does not migrate or approve any content or change other document types.

## Actual verification

- Actual browser before/after: the private synthetic draft's Publish button changed from enabled to disabled. The validation panel displayed “Complete editorial review before publishing. Draft changes still save automatically.” No production page or imported document was edited.
- While that validation error was present, an excerpt was saved through the real Studio. `node scripts/verify-studio-review-guard.mjs` read it back from the private API and passed: draft state and false approval flags retained, no published counterpart. Evidence: `migration/pre-deployment/studio-review-guard.json`, completed 2026-09-11T02:09:46.805Z; `studio-review-guard-browser.json` records the UI observations.
- `node --test tests/studio-schema.test.mjs`: 4 tests passed. They cover schema validity, source-anchor preservation, rejection of unreviewed states, incomplete review records, malformed/future dates and invalid flags/references, plus acceptance of a complete synthetic review record without changing it.
- `node --test tests/*.test.mjs`: **33 passed, 0 failed**, 4785.2271 ms. The tests that use provider mocks remain mock-only evidence. Log: ignored `.cache/studio-review-regression-tests.log`; summarized in `migration/pre-deployment/studio-review-guard-tests.json`.
- `node scripts/verify-sanity-after-studio.mjs`: PASS at 2026-09-11T02:10:46.409Z. All 430 imported records are unchanged; the same two synthetic drafts remain unpublished; anonymous queries expose zero records; repeat import would create zero documents. No additional draft was created for this check.

## Remaining boundary

This is browser Studio validation, not server authorization. Direct Sanity API writes do not run schema rules. Reviewer role enforcement, review freshness after later edits, asset replacement, referenced-document deletion protections and hosted build/release behavior still require acceptance. No real document was marked human-approved and no end-to-end approved-page publish was performed for this change. The page publishing rule is narrower than the full CMS-08 requirement, which remains BLOCKED.

Supporting primary documentation: [Studio validation](https://www.sanity.io/docs/studio/validation) describes validation errors blocking publication; [Content Lake schema validation](https://www.sanity.io/docs/content-lake/schema-validation-and-the-content-lake) explains the API boundary. These sources were checked September 10, 2026, Pacific time.
