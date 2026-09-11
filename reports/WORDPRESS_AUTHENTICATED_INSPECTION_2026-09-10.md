# Authenticated WordPress and GoDaddy inspection

**Access and the bounded content-export checks PASS. Full migration, backup and launch acceptance remain BLOCKED.**

The owner signed into GoDaddy. The actual hosting dashboard listed cash4goldanddiamond.com as Active on Managed WordPress Basic. WordPress authentication also succeeded as the existing Navid account. No hosting settings, DNS, nameservers, plugins or live content were changed.

## Downloaded content export

The native WordPress Tools → Export screen had All content selected. Download Export File produced `cash4goldanddiamond.WordPress.2026-09-11.xml` in Downloads. The UTC filename is September 11; the inspection occurred September 10 Pacific time.

- Size: **5,701,906 bytes**.
- SHA256: **21550c5f5c974531effef8e7be440d6c5f740925faf66ec49649c2c802dcfb31**.
- Offline XML parsing passed with DTD/entity declarations prohibited. The site origin matched cash4goldanddiamond.com; 419 unique record IDs were found.
- Private copies were saved under ignored `exports/wordpress/`. `git check-ignore` passed. The raw export and private custom content must remain outside Git, static builds and public artifacts.
- There are **111 published posts and 13 published pages**, with no new or missing numeric WordPress IDs and no changed modification timestamps against the prior inventory.
- The export includes **223 attachments**. The previous public API capture contained 222; the additional record is attachment **3103**, `https://cash4goldanddiamond.com/wp-content/uploads/2024/12/IMG-20241218-WA0008.webp`. Identifying this record does not prove its image binary was downloaded or its usage rights approved.
- Additional record types include templates, menus, forms, schema and private drafts. None were published, deleted or silently imported. Their migration dispositions still need review.

Command: bundled Python `scripts/inspect-wordpress-wxr.py <downloaded XML>`. Detailed scope, counts and comparison evidence: `migration/pre-deployment/wordpress-authenticated-export.json`. The first comparison incorrectly included an inventory placeholder (`unavailable`) as a WordPress ID; the preserved initial report and corrected numeric-ID check document that resolved issue.

## SEO comparison requiring follow-up

Among 372 title/description/canonical override comparisons, 182 explicit stored values match the preserved metadata; 187 have no explicit override and need the plugin's global defaults; three explicit overrides differ:

| WordPress ID | Existing path | Fields requiring review |
|---|---|---|
| 3728 | `/best-gold-jewelry-buyers-los-angeles-2026/` | SEO title and meta description |
| 4012 | `/loose-diamond-appraisal-downtown-los-angeles/` | SEO title |

These are comparison findings, not authorization to rewrite content. The separate Rank Math global settings/redirect export and comparison against current rendered output remain incomplete. No SEO setting was changed in WordPress.

## Backup limitation

GoDaddy's backup history returned its “trouble loading your backups” error on two attempts, including one reload. WordPress's GoDaddy dashboard separately displayed Last Backup **Sep 10, 2026 @ 16:11:52**. That dashboard label is not evidence of a completed archive download or usable restore point.

The WXR export is content/metadata only. It does not provide the complete database, plugin/theme files or media binaries needed for full disaster recovery. Complete backup download, integrity checks and isolated restore remain BLOCKED. No production restore, paid upgrade or add-on was requested.
