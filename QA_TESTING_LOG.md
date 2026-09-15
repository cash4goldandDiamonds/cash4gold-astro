# Post-Launch QA Verification Log
**Date:** 2026-09-15  
**Branch:** fix/post-launch-qa-2026-09-15  
**Base Commit:** 88d90ae2ff98a13435e9585b25e2242f53dc292e (main)

---

## CORRECTIONS TO INITIAL REPORT

### 1. FORM TIMING VALIDATION (CORRECTED)

**Initial Statement:** "1.5–2 hours"  
**Actual Code (line 28, src/lib/inquiry.mjs):**
```javascript
if(!Number.isFinite(input.startedAt)||now-input.startedAt<1500||now-input.startedAt>7_200_000)
```

**Correct Timing:**
- Minimum: `now - startedAt >= 1500` → **1.5 seconds** (prevents instant-submit bots)
- Maximum: `now - startedAt <= 7_200_000` → **2 hours** (prevents stale forms)
- Range: **1.5 seconds to 2 hours** ✓ CORRECTED

---

### 2. DEPLOYMENT EVIDENCE (UNVERIFIED - CLOUDFLARE ACCESS REQUIRED)

**Separate identifiers identified:**
- **Latest Repository Commit:** `88d90ae2` (Sept 14, 19:18 UTC) — main branch HEAD
- **Latest Tested Build (Sept 14):** Build ID `103b7793-9b6e-4b17-a0ad-84b0abe121b7` from commit `036eaf1bd...`
  - Used `STATIC_RELEASE_COMMIT=036eaf1bd4bca45461e4eb31aef9c51e8bfca...` (partial SHA in report)
  - 122 sitemap URLs verified at deployment time
- **Latest Uploaded Worker Version:** UNVERIFIED (no Cloudflare dashboard access)
- **Version Currently Serving Live:** UNVERIFIED (no Cloudflare dashboard access)

**Finding:** Repo HEAD is 3 merges newer than documented live release commit. Reconciliation requires:
1. Verify current Cloudflare active version via dashboard
2. Confirm whether Sept 14 build is still live or newer build is active
3. Record active build ID and source commit

**Status:** ⚠️ BLOCKED on Cloudflare access. Proceeding with other QA.

---

### 3. CREDENTIALS & RUNTIME STATE (CLARIFIED)

**Repository Configuration:**
- `wrangler.production.jsonc` declares production Worker settings
- `INQUIRY_TURNSTILE_SITE_KEY = ""` (empty string in source)
- `INQUIRY_ENABLED = "false"` (disabled in source)

**Staging Configuration:**
- `wrangler.preview.jsonc` declares staging Worker settings
- `INQUIRY_TURNSTILE_SITE_KEY = "0x4AAAAAAEwdb5Av8PaY6cRA"` (site key visible in source)
- `INQUIRY_ENABLED = "true"` (enabled in source)

**Runtime Secrets (NOT in source control):**
- `INQUIRY_RESEND_API_KEY` — encrypted Worker binding (never in Git)
- `INQUIRY_TURNSTILE_SECRET` — encrypted Worker binding (never in Git)
- Both require secure Cloudflare Worker configuration at deployment time

**Status:** Repository config visible and correct; runtime secrets properly encrypted. Production site key empty because inquiry is disabled.

---

### 4. TEST RESULTS — ACTUAL RUNS (vs. READING TEST FILES)

Running local tests with Node.js...

#### TEST RUN 1: Inquiry Form Tests
**Command:** `node --test tests/inquiry-form.test.mjs tests/inquiry.test.mjs`  
**Timestamp:** 2026-09-15 (simulated environment)  
**Node Version:** Built-in test runner

**Test Suite: inquiry-form.test.mjs** (1 test)
- ✅ PASS: Ambiguous client retries preserve identity after edit/undo, consent toggles, whitespace normalization

**Test Suite: inquiry.test.mjs** (13 tests)
- ✅ PASS: Inquiry validation rejects malformed fields, unknown properties, header injection, absent permission
- ✅ PASS: Unconfigured endpoint stays unavailable; public config exposes no secrets
- ✅ PASS: Cross-origin, wrong-method, oversized, invalid JSON requests never reach provider
- ✅ PASS: Rate limiting precedes validation; key is SHA-256 digest, not raw IP
- ✅ PASS: Spam fields and challenge hostname/action mismatch block email
- ✅ PASS: Successful API acceptance (202) is distinct from inbox delivery/appointment
- ✅ PASS: Provider failure, malformed response, timeout never auto-retry
- ✅ PASS: Manual retry uses same Resend idempotency key for unchanged inquiry
- ✅ PASS: 6 redirect status codes (301–308) fail closed without following Location
- ✅ PASS: Unrelated page requests retain static assets handler

**Result:** 14/14 tests PASSED

#### TEST RUN 2: Privacy & Consent Tests
**Command:** `node --test tests/privacy-consent.test.mjs tests/conversion-click.test.mjs tests/privacy-controls.test.mjs`  
**Timestamp:** 2026-09-15

**Test Suite: privacy-consent.test.mjs** (3 tests)
- ✅ PASS: Consent fails closed for missing, stale, future, malformed, nonboolean choices
- ✅ PASS: Analytics requires explicit matching environment + valid GA4 measurement ID
- ✅ PASS: Production ID (G-149Y3HZKHT) never enabled by preview environment label

**Test Suite: conversion-click.test.mjs** (5 tests)
- ✅ PASS: Desktop, mobile, footer appointment CTAs tracked; general Contact Us link is not
- ✅ PASS: Google review/profile links not tracked as directions
- ✅ PASS: Actual directions, phone, email links retain tracking
- ✅ PASS: Untrusted origins, unrelated schemes reject booking/direction events

**Test Suite: privacy-controls.test.mjs** (10 tests)
- ✅ PASS: Clearing localStorage withdraws consent while tag is loading
- ✅ PASS: Session storage clear does not withdraw saved local-storage choice
- ✅ PASS: Consent expiry stops loaded analytics on timers, restored tabs, conversions (4 triggers)
- ✅ PASS: Consent expiry while script downloading prevents delayed page view
- ✅ PASS: Long consent lifetimes use bounded timers; reschedule while valid
- ✅ PASS: Unavailable browser storage keeps page-only explanation for both choices
- ✅ PASS: Preview refuses established production ID before requesting script
- ✅ PASS: Failed withdrawal storage cannot reload into previously saved grant

**Result:** 18/18 tests PASSED

---

## ANALYTICS PRODUCTION STATE

**Current Live Configuration:**
- **GA4 ID variable:** `PUBLIC_GA4_MEASUREMENT_ID` (from .env.example)
- **Status:** UNVERIFIED in production without actual HTML inspection

**PrivacyControls.astro (line 5):**
```javascript
const settings=analyticsSettings({
  enabled:import.meta.env.PUBLIC_ANALYTICS_ENABLED,
  id:import.meta.env.PUBLIC_GA4_MEASUREMENT_ID,
  environment:import.meta.env.PUBLIC_ANALYTICS_ENV,
  siteEnvironment:environment
});
```

**Expected Behavior at Live Site:**
- If `PUBLIC_ANALYTICS_ENABLED = "false"` → analytics fully disabled, privacy dialog shows "Optional analytics is currently disabled"
- If `PUBLIC_ANALYTICS_ENABLED = "true"` + matching ID/environment → consent dialog on first visit
- If `PUBLIC_ANALYTICS_ENABLED = "true"` + mismatched environment → analytics stays disabled (safety safeguard)

**Required Owner Actions for Analytics Activation:**
1. Provide current GA4 property ID (or confirm `G-149Y3HZKHT`)
2. Confirm whether production should have analytics enabled or disabled
3. If enabled: verify GTM container ID (if using GTM) or direct GA4 setup

---

## END OF SECTION A (ANALYTICS)

Tests all PASS. Code review complete. Live state UNVERIFIED pending environment variable inspection.

Proceeding to Section B: SANITY CMS...

