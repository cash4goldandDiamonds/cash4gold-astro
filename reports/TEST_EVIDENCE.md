# Test evidence and limits

This file inventories actual logs; its generation time (2026-09-10T20:22:01.102Z) does not rerun tests. Tested environment: local Windows, base ed8571bd28de71525eec46b14f56956934e26410 plus audit changes.

| Check | Evidence | Result / limit |
|---|---|---|
| Astro build | migration/pre-deployment/build.log | 214 output routes including 198 content pages, 15 aliases and 404; preview defaults |
| Astro check | migration/pre-deployment/typecheck.log | Latest log: 0 errors / 0 warnings; hints retained |
| Unit checks | migration/pre-deployment/unit-tests.log | Read actual log for current count; includes SQL/provider mocks, not live social services |
| Built-site validation | migration/pre-deployment/built-site-verification.json | 198 pages; 0 errors; 107 unique guide images; no missing ALT/dimensions |
| CMS projection | migration/pre-deployment/cms-tests.log | 111 articles, 222 images, 2,688 anchors; local projection only |
| Editorial checks | migration/pre-deployment/editorial-tests.log | 111 articles, 107 canonical; 0 failures |
| Agent rewrite checks | migration/substantive-verification.json | 111 reviewed hashes, 0 errors; NOT human approval |
| Source/render check | migration/verification.json | 0 failures; 8 warnings; 266 exact blocks differ; disposition approval pending |
| Public REST reconciliation | migration/pre-deployment/wordpress-reconciliation.json | 111 posts + 13 pages; zero missing local routes; incomplete media/private SEO coverage |
| Browser widths | migration/pre-deployment/browser/ | Actual DOM checks and limitations retained; no Lighthouse score |
| Social backlog | migration/pre-deployment/social-backlog.json | 105 local drafts; no posts or permission approvals inferred |
| Dependency audit | migration/pre-deployment/dependency-audit-final.json | No high/critical findings; one moderate adm-zip issue remains |
| Cloudflare local runtime | migration/pre-deployment/cloudflare-local-runtime.log | BLOCKED: esbuild ancestor-directory Access denied; no runtime 301/CSP test claim |
| Sanity CLI / real lifecycle | account-observations.json | BLOCKED: uv_os_get_passwd ENOMEM; no remote import/edit/publish proof |
| Lighthouse/axe/CWV | Failed local tool attempts | No successful numeric measurement. Chrome DevTools MCP absent; headless browser attempts failed. |
| GitHub Actions | .github/workflows/quality.yml | Configured locally, pinned action commits; NOT run remotely |

Performance targets are in the master: mobile >=90, desktop >=95, other Lighthouse categories >=95; 3 runs/route/device, retain median and worst. Field LCP <=2.5s, INP <=200ms, CLS <=0.1 at p75 cannot be proven by local builds.

## Additional final checks

- `node scripts/verify-policy-output.mjs`: actual preview and isolated production files, 198 content pages each, 0 versus 118 sitemap entries, no errors; release without approved CMS remains blocked. See `migration/pre-deployment/policy-output-verification.json`.
- `node scripts/verify-preview-http.mjs`: actual loopback GET/HEAD for four real pages and a deliberately missing URL; expected 200/404 results and preview noindex verified. This does not prove Cloudflare runtime.
- `node scripts/audit-secret-boundaries.mjs`: high-confidence credential patterns and forbidden public artifacts, no findings in the recorded scan. Scope and counts are in `migration/pre-deployment/secret-boundary-scan.json`; not a historic or full security audit.
- Browser: 54 checks across nine representative routes and six verified widths, no overflow/landmark/H1/ALT/loaded-image errors. Native menu and FAQ keyboard checks passed. Skip-link focus was fixed and re-tested; see `migration/pre-deployment/browser/`. No screen-reader/contrast or Lighthouse pass is inferred.
- `node scripts/recheck-public-media.mjs`: stable ID-ordered pagination again returned 222 of 223 reported records; complete=false. Original capture preserved.
- Current remote integration status and owner-created Meta app are in `migration/pre-deployment/account-observations.json`.

## Social and source checkpoint checks

- `node --test tests/*.test.mjs`: 29 passed, 0 failed. The 13 social tests use actual SQLite and mocked providers; no live Meta or D1 result is inferred. See `migration/pre-deployment/social-queue-verification.json` and its linked initial failure/rerun logs.
- `node scripts/verify-original-preservation.mjs`: 1,752 original files compared, none changed or missing. See `migration/pre-deployment/original-preservation-check.json`.
- `node scripts/verify-checkpoint-assets.mjs`: 214 built HTML files, 434 local asset references (433 tracked public sources and one generated asset), no errors. This is not a fresh clone build or remote CI run.
- Meta: app/portfolio and Facebook Page ownership, accepted Instagram tester/account ID, and saved Pages-only 60-day login configuration were read back in authenticated browser views. Tokens, API grants, renewal and live posts remain untested.
