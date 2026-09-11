# Protected staging scope and source verification

**NOT READY TO GO LIVE. No staging Worker or staging URL exists at this checkpoint.** The owner subsequently answered “approved” to the prepared staging scope. The root task acknowledged only `cash4gold-private-preview` in the named account, explicitly explaining that the credential can edit Workers across that account. Source/document preservation and free-plan/protection checks still precede execution; production launch is not approved.

## Source actually verified

- Existing private repository: `cash4goldandDiamonds/cash4gold-astro`.
- Branch: `audit/pre-deployment-2026-09-10`.
- Verified implementation and audit commit: `c4ea1238669f1385e80deb998ae5a09455191dcb`.
- Complete reviewed source tree: `89bd404ad96b7b1cd181a17e2afc2b3e856ab4b7`, **1,046 files**. The clean local safety checkpoint has the same tree; its differing historical commit ID must not be force-pushed over GitHub.
- GitHub Actions run `34557899635`, job `103134392646`, succeeded after a fresh checkout and frozen-lockfile install: **33 tests passed, zero failed**, followed by schema, source security, Astro checks/build and remaining configured checks. The root task independently inspected the authenticated GitHub job, its exact commit/tree/file-count log and test totals. GitHub connector access returned 404; that API attempt is not represented as a pass.
- `main` and original work are preserved. Raw WordPress exports, credentials, environment files, private backups and unused source captures are excluded from Git. Later documentation commits must retain passing fresh-checkout CI; record their exact commit separately rather than reusing this result.

## Proposed Cloudflare destination

| Item | Exact scope |
|---|---|
| Account | **Cash4goldanddiamond@gmail.com's Account** |
| Account ID | **51297d0a5f91f93ec6100eeabcac7939** |
| New staging Worker | **cash4gold-private-preview** |
| Expected hostname, not enabled | `cash4gold-private-preview.cash4goldanddiamond.workers.dev` |
| Zero Trust | **Free only**; no paid upgrades or add-ons |
| Verified plans | The deployment task inspected Workers Free ($0, Current plan), Workers Builds Free and Zero Trust Free ($0 monthly). No paid enrollment or add-on was submitted. |
| Existing Workers | Authenticated inventory returned an empty list at inspection; this is a point-in-time observation |
| Public routing at creation | `workers_dev:false`, `preview_urls:false`, no routes |
| Protection being prepared | Worker-specific Access, All traffic, Cloudflare account Allow policy, 24-hour session |

The rejected account-wide Access change remains unapplied. The dashboard's default broad build credential was not created. No production Worker, DNS, nameserver, GoDaddy setting or live WordPress content may be modified.

## Minimum permissions for the selected Builds workflow

The registered credential `cash4gold-staging-deploy-limited` has only these account permissions on the account above:

1. **Workers Scripts Edit** — upload and update Worker scripts. **This permission covers Workers across that account; it is not technically limited to the staging Worker name.** The operational scope is only the new staging Worker.
2. **Workers Builds Configuration Edit** (API Workers CI Write) — register and configure the build integration.
3. **Account Settings Read** — read account configuration required by the chosen deployment tooling.

There are no zone/DNS, storage or account-wide Access permissions in this credential. The owner explicitly approved its creation/storage in the existing deployment task with “Approve restricted staging credential.” It was registered with Cloudflare Builds; no raw token file was saved locally. That recorded approval must not be represented as a separate final deployment confirmation.

Cloudflare's generic warning lists optional permissions for other products. Do not add them unless a concrete requirement arises and the owner separately approves a changed scope. This static staging proposal does not require KV, R2, D1, AI, Queues, Pipelines, Containers or zone route editing.

## Preconditions before a staging website can be exposed to authorized users

1. Preserve this inspection follow-up on the existing private audit branch and verify the final fresh-checkout CI result.
2. Workers/Builds Free and Zero Trust Free were confirmed separately in the authenticated dashboard; evidence is the deployment task's `work/cloudflare-free-plan-review.json`. Stop if any paid enrollment, add-on or paid quota increase is later required.
3. The owner answered “approved” for this prepared staging scope; the account-wide Worker editing boundary was explicitly acknowledged. The Deploy button remains unclicked until source/document verification completes. Do not repeat the same scope approval, and do not extend it to production or broader permissions.
4. Configure the exact audit branch/build before serving its output. The initial creation form does not expose a branch selector; its default must not be assumed to be the reviewed branch. Keep all public endpoints disabled during any required bootstrap/configuration.
5. Verify Worker-specific Access is effective before enabling access to the website. Confirm anonymous requests cannot retrieve page HTML/assets and permitted account members can sign in. Keep staging noindex and retain preview cache/robots protections.
6. Run hosted route, redirect, 404, caching, mobile/desktop performance and accessibility checks. Local build success does not satisfy those checks.

The existing approval covers use of the account-scoped credential to create/configure **only cash4gold-private-preview**, with public routes disabled until its reviewed source and Worker-specific Access are verified. A newly rejected action or any scope expansion must be reported separately. Production launch remains prohibited without its separate explicit approval.

Primary references checked for the permission/protection interpretation: [Builds API permissions](https://developers.cloudflare.com/workers/ci-cd/builds/api-reference/), [Build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), [Worker-specific Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/). Actual configuration/account observations come from the authenticated deployment task and its `work/cloudflare-predeployment-review-2026-09-10.json`, `cloudflare-staging-registration.json` and `cloudflare-worker-inventory.json` records.
