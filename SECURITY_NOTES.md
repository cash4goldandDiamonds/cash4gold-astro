# Security, ownership and cost notes

September 10, 2026 — **NOT READY**. These are observed controls and unresolved acceptance checks, not a security certification.

## Observed owners and dependencies

| Service | Actual evidence | Remaining action / cost limit |
|---|---|---|
| GitHub | Private `cash4goldandDiamonds/cash4gold-astro`; connected repository API reports admin, maintain and push access | Complete source/artifact backup and remotely run CI; inspect branch protection/hooks before any push that might trigger another pipeline |
| Cloudflare | Authenticated owner account; domain Free; 0 Workers/Pages projects and 0 routes observed; 12 DNS records captured | Confirm Access/D1/Workers/logging entitlements and limits; configure protected staging and scoped secrets; no paid upgrade authorized |
| Sanity | Owner Administrator, one member, Growth Trial with 30 days shown; production public and migration-staging private; empty datasets at inspection | Resolve post-trial cost/features, named editor roles, dataset access and actual lifecycle; never infer production privacy from a staging flag |
| GoDaddy | Managed WordPress Basic active; backup recovery point/size visible | Download and test restoration; staging entitlement not established; keep current hosting until rollback is proven |
| Meta / Instagram | Owner-created publishing app and business profile; current state in account observations | Verify granted scopes/asset IDs, token lifetime/renewal, app requirements and real publishing; keep tokens out of source and logs |
| Calendly | Existing owner booking link returns availability | Verify owner account, confirmation/cancellation, delivery and entitlement without booking a real customer |
| Analytics / local tracker | Current account/property/recipient ownership not fully verified | Confirm exact IDs and consent configuration; no fabricated imported metrics or automatic purchase |

## Implemented controls

Preview builds emit noindex, noarchive, private/no-store and a restrictive CSP. No production/draft mix is permitted. Production content must come from a complete approved published CMS snapshot. Secrets are not prefixed PUBLIC_, not stored in content fields, and not embedded in public code. Examples contain empty values. `.env*`, `.dev.vars*`, `.cache`, private exports/backups, archives and key files are ignored, with only empty examples retained.

CMS HTML is sanitized; references, path/canonical rules, navigation URLs and redirect loops are checked. The staging importer refuses a public/wrong dataset or conflicting document overwrite and makes private before/after snapshots. Account roles still need real tests; a hidden field or boolean is not an authorization boundary.

Social posting is server-side, explicitly paused, and requires the correct production CMS, approvals and matching public revision. A separate status secret protects queue diagnostics; no anonymous publishing endpoint exists. Tokens travel in provider authorization headers. Ambiguous external writes are held for reconciliation; no blind retry creates duplicates. Renewals and actual operational alerts are incomplete.

## Dependency audit

The latest `migration/pre-deployment/dependency-audit-final.json` records zero high and zero critical findings after compatible updates/overrides. One moderate `adm-zip` advisory remains; a patched published package was unavailable at the observed registry check. Do not process untrusted ZIPs through that dependency. This package concern is not a reason to disable package policy or the browser sandbox. Recheck current advisories and compatible updates before release.

Lockfile integrity and mature package versions are retained. GitHub Actions references official commit pins; the workflow is PR/manual, read-only, with no deployment step or secrets. A local configuration is not proof of remote CI execution.

## Still required

A source/public-output scan completed with no findings under the high-confidence patterns and forbidden public-artifact rules in `migration/pre-deployment/secret-boundary-scan.json`. This is a constrained static scan, not proof that credentials were never exposed historically. Retain the current scan and complete actual Cloudflare header/CSP/cache tests, scoped credentials and rotation checks, private preview access/CORS tests, rate limiting/spam protection for the real inquiry backend, consent/event validation, actual alert delivery and isolated backup restoration. Never put private leads or full database archives into public evidence.

The local Wrangler runtime failed on filesystem permissions, Sanity CLI failed before authentication and headless performance tools failed. Do not bypass the operating-system/browser sandbox to obtain passing results. Use a supported owner-authorized environment for those tests and record its identity.
