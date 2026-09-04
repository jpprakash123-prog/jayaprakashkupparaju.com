# Azure Deployment Plan

## Status

Validated — public deployment version metadata is ready for an Azure preview,
normal production, and rollback deployment pull request. The Azure endpoint
remains deployed and DNS safety gates remain in force.

## Objective

Deploy the existing static website to Azure Static Web Apps as a parallel target. Preserve the existing GitHub Pages deployment unchanged until the Azure-hosted site has been deployed and validated.

## 1. Workload and Repository Analysis

- Mode: modify an existing application by adding a parallel Azure hosting target.
- Workload: static HTML and image assets served directly from the repository root.
- Entry point: `index.html`.
- Build system: none; no package manager, compilation, API, or generated output directory.
- Source repository: `<GITHUB_OWNER>/jayaprakashkupparaju.com` on GitHub.
- Current production path: Cloudflare DNS to GitHub Pages.
- Current GitHub Pages artifacts: root-level `CNAME` and built-in Pages deployment.
- Specialized technology scan: no Azure Functions or GitHub Copilot SDK markers found.

## 2. Requirements and Constraints

- Existing application; additive Azure deployment.
- Do not modify or disable the GitHub Pages deployment before Azure validation.
- Current SRE learning roadmap phase: Phase 1.
- Use the roadmap names `rg-personal-site-prod` and `swa-personal-site-prod`.
- Start with the Azure-generated HTTPS hostname; custom-domain and DNS migration are a later, explicitly gated step.
- Prefer the Azure Static Web Apps Free plan for this learning phase unless subscription policy prevents it.
- Azure subscription ID: `<AZURE_SUBSCRIPTION_ID>` (provided out of band; subscription name will be resolved after authentication).
- Deployment location: `Central US` (`centralus`), confirmed by the user.
- Azure authentication values remain outside version control.

## 3. Proposed Architecture

```text
GitHub repository
  |-- existing GitHub Pages deployment (unchanged)
  `-- new Azure Static Web Apps workflow
          |
          v
      Azure Static Web Apps (Free)
          |
          v
      generated azurestaticapps.net HTTPS endpoint
```

Initial validation will not involve Cloudflare DNS or the custom domain.

## 4. Deployment Recipe and Artifacts

- Recipe: imperative Azure provisioning for the intentionally small Phase 1 workload, using the installed Azure PowerShell modules. Infrastructure as Code remains intentionally deferred to roadmap Phase 3.
- Azure resources:
  - 1 resource group: `rg-personal-site-prod`.
  - 1 `Microsoft.Web/staticSites` resource: `swa-personal-site-prod`, Free SKU.
- Application location: `/`.
- API location: empty.
- Output location: empty because the site has no build step.
- Repository changes expected during execution:
  - a new Azure Static Web Apps GitHub Actions workflow under `.github/workflows/` using a GitHub secret for the deployment token;
  - deployment documentation after successful validation.
- Explicitly excluded before Azure validation:
  - modifying or deleting `CNAME`;
  - changing Cloudflare DNS;
  - disabling GitHub Pages;
  - claiming the custom domain migration is complete.

Microsoft's current Azure Static Web Apps documentation uses Central US for Static Web Apps deployments. The Free plan supports GitHub integration, global static-content distribution, managed TLS, two custom domains, and up to 250 MB per app. The current deployable website assets (`index.html`, `profile.jpg`, and `CNAME`) total approximately 301 KB.

## 5. Execution Plan

1. Confirm Azure subscription and location, then verify service availability/limits.
2. Install or otherwise make Azure CLI available and authenticate, with user approval where required.
3. Create the resource group and Azure Static Web App connected to the GitHub repository's default branch.
4. Verify that the new workflow deploys the root-level static content.
5. Validate the generated Azure hostname over HTTPS and compare representative content/assets with the current site.
6. Document the Azure deployment and updated parallel architecture.
7. Stop before custom-domain/DNS cutover and present the validation result. DNS migration remains a separate approved action.

## 6. Validation Plan

- Confirm configuration targets `/` with no API or build directory.
- Confirm the existing `CNAME` and GitHub Pages configuration are unchanged.
- Confirm the GitHub Actions deployment completes successfully.
- Request the generated endpoint and require HTTPS success.
- Check `index.html` content and `profile.jpg` from the Azure endpoint.
- Compare key page markers against the local source/current site.
- Record commands, workflow result, endpoint, and timestamp in Section 7.

Provisioning inventory and limits:

| Resource type | Planned | Current usage | Limit | Result |
|---|---:|---:|---:|---|
| `Microsoft.Web/staticSites` (Free) | 1 | To be queried after authentication | 10 apps per subscription | Pre-deployment check required |

Azure Static Web Apps uses an app-count subscription limit rather than a vCPU-style capacity quota. Execution will query existing Static Web Apps in the selected subscription and stop if creating one would exceed the documented Free-plan limit. Subscription policy, `Microsoft.Web` provider registration, Central US availability, and resource-creation permissions will also be checked before creation.

## Azure Context

- Subscription: `<AZURE_SUBSCRIPTION_ID>` (provided out of band; name resolved after authentication).
- Location: Central US (`centralus`).
- Resource group: `rg-personal-site-prod`.
- Static Web App: `swa-personal-site-prod`.

## 7. Validation Proof

| Check | Command or method | Result | Timestamp |
|---|---|---|---|
| Azure authentication | `Get-AzContext` for the approved subscription | Pass — subscription verified out of band | 2026-08-20T23:40:32-05:00 |
| Provider registration | `Get-AzResourceProvider -ProviderNamespace Microsoft.Web` | Pass — Registered | 2026-08-20T23:40:32-05:00 |
| Capacity | `Get-AzStaticWebApp` plus documented Free-plan limit | Pass — 0 existing + 1 planned <= 10 | 2026-08-20T23:40:32-05:00 |
| Region availability | `Microsoft.Web/staticSites` provider locations | Pass — Central US supported | 2026-08-20T23:40:32-05:00 |
| Effective permissions | Azure permissions API at subscription scope | Pass — resource-group and Static Web App writes allowed | 2026-08-20T23:40:32-05:00 |
| Azure policy | `Get-AzPolicyAssignment` at subscription scope | Pass — no blocking location/resource policy found | 2026-08-20T23:40:32-05:00 |
| Workflow YAML | `npx --yes prettier@3.6.2 --check .github/workflows/azure-static-web-apps.yml` | Pass | 2026-08-20T23:40:32-05:00 |
| Site source | HTML/JPEG/reference checks | Pass | 2026-08-20T23:40:32-05:00 |
| GitHub Pages safety | Git blob hash comparison for `CNAME` | Pass — unchanged | 2026-08-20T23:40:32-05:00 |
| Rollback workflow YAML | `prettier@3.6.2 --check` on workflow and plan files | Pass | 2026-09-03 |
| Rollback workflow build | `npm run ci` | Pass — HTML, tests, sensitive-data scan, and build | 2026-09-03 |
| Rollback target control | Static review of SHA format and `main` ancestry checks | Pass — unmerged commits rejected | 2026-09-03 |
| Rollback secret isolation | Static review of job environment and permissions | Pass — token limited to approval-gated `PROD` job | 2026-09-03 |
| Rollback RBAC | Static infrastructure and application review | Not applicable — no identity or role changes | 2026-09-03 |
| Metadata workflow and script format | `prettier@3.6.2 --check` on modified executable, workflow, and documentation files | Pass | 2026-09-03 |
| Metadata build verification | `npm run ci` | Pass — HTML, tests, sensitive-data scan, and build | 2026-09-03 |
| Metadata functional verification | Generate and parse `dist/deployment-info.json` with representative deployment values | Pass — content commit, type, run ID, UTC, and Central weekday values verified | 2026-09-03 |
| Metadata input validation | Run generator with a malformed commit value | Pass — rejected with nonzero exit | 2026-09-03 |
| Metadata exposure review | Static review of generated fields | Pass — public build provenance only; no identity, account, or secret fields | 2026-09-03 |
| Metadata RBAC | Static infrastructure and application review | Not applicable — no identity or role changes | 2026-09-03 |

Validated by: Azure validation workflow.

## Role Assignment Verification

- Status: verified; not applicable to the application runtime.
- Identities checked: none — this static site has no backend, managed identity, or data-service access.
- Roles generated: none.
- Deployment identity: effective subscription permissions confirm resource-group and Static Web App write access.

## 8. Rollback and Safety

The existing GitHub Pages deployment remains the production-safe fallback and will not be changed by this plan.

If Azure deployment or validation fails, no DNS rollback is needed because traffic remains on GitHub Pages. Any partially created Azure resource will be reported; it will not be deleted without explicit approval.

## Execution Checklist

- [x] Analyze workspace and documentation.
- [x] Scan codebase and specialized technology markers.
- [x] Select deployment recipe and architecture.
- [x] Confirm subscription identifier out of band.
- [x] Confirm Central US location.
- [x] User approves this plan.
- [x] Authenticate using the installed Azure PowerShell modules.
- [x] Resolve and verify the selected subscription out of band.
- [x] Verify `Microsoft.Web` registration and Static Web Apps app-count limit (0 existing; 1 planned; limit 10).
- [x] Generate the Azure deployment workflow.
- [x] Run pre-deployment validation and record proof.
- [x] Deploy the Azure resource and website.
- [x] Validate the generated HTTPS endpoint.
- [x] Document the parallel deployment.
- [ ] Separately approve any future custom-domain/DNS cutover.

## Files Expected During Execution

| File | Purpose |
|---|---|
| `.azure/deployment-plan.md` | Deployment decisions, checklist, and validation proof |
| `.github/workflows/<azure-static-web-apps-workflow>.yml` | New Azure deployment workflow; existing Pages behavior remains unchanged |
| `docs/deployment.md` | Deployment and validation record |
| `docs/architecture.md` | Parallel-hosting architecture after successful Azure validation |

## Research Summary

- Central US (`centralus`) is a supported Azure Static Web Apps region.
- The Free SKU is appropriate for a personal learning project and requires no supporting Azure resources.
- The workflow stages only `index.html` and `profile.jpg` into a temporary `_site` directory. This avoids publishing repository documentation or the GitHub Pages `CNAME` file to Azure.
- The Azure deployment token will be stored only as the masked GitHub Actions secret `AZURE_STATIC_WEB_APPS_API_TOKEN`; it will not be written to repository files, command output, Bicep outputs, or deployment logs.
- The initial resource will not contain a custom-domain binding, preserving the existing Cloudflare-to-GitHub Pages request path.

## 9. Emergency Rollback Workflow

Approved by the user on 2026-09-03.

- Add a separate manually triggered GitHub Actions workflow.
- Require an exact 40-character commit SHA as the rollback target.
- Reject commits that are not ancestors of `main`, preventing deployment of
  unmerged code through the emergency path.
- Run the existing CI suite before making a production deployment available for
  approval.
- Rebuild the verified commit after approval instead of retaining a deployment
  artifact.
- Use the existing protected `PROD` environment and its encrypted environment
  secret.
- Serialize normal and rollback production deployments through a shared
  concurrency group.
- Keep GitHub Pages and public DNS unchanged.

## 10. Deployment Version Metadata

Approved by the user on 2026-09-03.

- Generate `deployment-info.json` inside the built `dist/` directory immediately
  before each Azure deployment.
- Include the actual content commit, deployment type, workflow run ID, an ISO
  UTC timestamp, and a human-readable timestamp with weekday in America/Chicago
  time.
- Generate rollback metadata from the requested rollback commit rather than the
  commit containing the workflow definition.
- Publish only non-sensitive build provenance; do not include users, account
  identifiers, subscription identifiers, or secrets.
- Keep the file out of source-controlled site content because it describes a
  specific deployment, not a source revision.
- Keep GitHub Pages and public DNS unchanged.

## Functional Verification

- Status: verified locally at source level and against the deployed HTTPS endpoint.
- Backend: not applicable.
- UI source: valid HTML document marker and non-empty title found; `profile.jpg` reference resolves to an existing JPEG file.
- Workflow isolation: confirmed that only `index.html` and `profile.jpg` are staged for Azure; `CNAME` is excluded.
- Deployed rendering: the root page returned HTTP 200 with the expected title, and `profile.jpg` returned HTTP 200 with an image content type.

## Deployment Result

- GitHub Actions run: successful.
- Azure endpoint: `https://black-dune-07c4abe10.7.azurestaticapps.net`.
- Deployment contents: `index.html` and `profile.jpg` only.
- GitHub Actions secret: `AZURE_STATIC_WEB_APPS_API_TOKEN` exists as an encrypted repository secret; its value is not present in repository files.
- Custom domains attached to Azure: 0.
- GitHub Pages `CNAME`: unchanged.
- Cloudflare DNS: unchanged.
