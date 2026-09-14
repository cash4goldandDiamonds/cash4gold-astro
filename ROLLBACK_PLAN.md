# Backup and rollback plan

**BLOCKED: no complete downloaded WordPress backup or isolated restoration verified.** Do not restore production as a test.

The original local checkout is retained at `C:/Users/judit/Documents/Codex/2026-09-09/cash-for-gold/cash4gold-astro`. Its pre-audit backup and 1,752-file hash manifest are recorded in `migration/pre-deployment/baseline.json`. These preserve source work; they are not a WordPress database/uploads or Sanity backup.

GoDaddy showed a scheduled September 9, 2026 4:12 p.m. backup: 918 MB, comprising 820 MB files and 97.6 MB database. A download was prepared and requested, but no completed archive was found in the checked Downloads location. Retention, archive integrity and restoration remain unverified. Managed WordPress Basic was observed; isolated staging entitlement was not proven.

## Before any release

Obtain the complete archive through authorized hosting access; record its exact private location, recovery point, size and SHA256. Store access-limited copies outside the source repository. Include uploads, active configuration/plugin/theme records, database and relevant redirects/SEO settings. Keep private customer data and credentials out of public output and audit attachments.

Restore into an isolated, access-protected environment with search engines blocked, mail/payment/webhooks disabled or sandboxed, and no route to the production database. Verify login, representative pages, media, metadata, links and database counts. Record the restore procedure and elapsed recovery time. Do not claim RPO/RTO values until measured.

For Sanity, export the actual dataset and assets immediately before import or promotion. The private staging importer creates before/source/after snapshots under ignored `.cache/cms-backups/` and refuses conflicting document overwrites. A successful export is not a restoration test. Test restoration to a separate private dataset and reconcile IDs/references/counts before relying on it.

Capture exact prelaunch DNS (`migration/pre-deployment/dns-observed.json` is an earlier baseline requiring refresh), TLS, current host target, Cloudflare route/deployment version, code commit and immutable artifact. Retain the last accepted production artifact and content snapshot together. Source-only rollback cannot recover incompatible CMS changes.

## If production fails after a future cutover

1. Pause social publishing and promotions. Preserve logs and the failed release identity; do not delete queue history.
2. For an artifact-only regression, roll traffic back to the previously tested Cloudflare deployment with its matching content snapshot. Verify real pages, 404/redirects, TLS, forms/delivery and robots. Do not rebuild an old commit against a newer incompatible CMS state and call it the old release.
3. If web routing must return to WordPress, restore only the recorded web targets/routes while preserving mail and unrelated DNS. WordPress must still be intact and verified; do not overwrite production data from an untested archive.
4. Reconcile any new valid submissions/content edits and any social posts created during the incident. Do not replay ambiguous submission/publishing writes blindly. Retain the evidence needed to prevent duplicate leads/posts.
5. Notify the owner of impact, restored service and unresolved data issues through a tested alert path. Keep indexing and monitoring accurate for the site actually serving traffic.

This is a future procedure. No actual deployment rollback, DNS reversal or production restore was performed during this audit.
