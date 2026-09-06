# Azure Deployment Plan

## Status

Validated — the approved Azure observability lab passed Bicep compilation,
Azure template validation, what-if review, CI, security, cost, policy, provider,
and static RBAC checks. Deployment must create the budget before the inactive
monitoring foundation and must not enable the web test.

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
| Project showcase CI | `npm run ci` with command-scoped Git safe-directory configuration | Pass — HTML validation, 7 tests, sensitive-data scan, and build | 2026-09-06 |
| Project showcase regression | `node --test tests` through the CI command | Pass — verifies project title, tools, rollback capability, and metadata link | 2026-09-06 |
| Dependency security | `npm audit --audit-level=high` | Pass — 0 vulnerabilities | 2026-09-06 |
| Source diff hygiene | `git diff --check` | Pass | 2026-09-06 |
| Project showcase RBAC | Static infrastructure and application review | Not applicable — content-only change with no identity or role changes | 2026-09-06 |
| Monitoring current cost | Cost Management `ActualCost`, month-to-date, scoped to `rg-personal-site-prod` | Pass — no cost rows returned before deployment | 2026-09-06 |
| Monitoring Bicep compilation | `az bicep build --file infrastructure/monitoring/main.bicep --stdout` | Pass | 2026-09-06 |
| Monitoring template validation | `Test-AzResourceGroupDeployment` using the compiled template | Pass — no validation errors | 2026-09-06 |
| Monitoring what-if | `Get-AzResourceGroupDeploymentWhatIfResult` with `ResourceIdOnly` | Pass — six creates, no deletes or changes to the Static Web App | 2026-09-06 |
| Monitoring providers | `Get-AzResourceProvider` | Pass — Insights, Operational Insights, and Automation registered | 2026-09-06 |
| Monitoring policy | `Get-AzPolicyAssignment` at subscription scope | Pass — three assignments reviewed; template validation found no denial | 2026-09-06 |
| Monitoring runbook syntax | PowerShell AST parser | Pass | 2026-09-06 |
| Monitoring CI and security | `npm run ci` with command-scoped Git safe directory | Pass — seven tests, sensitive-data scan, and build | 2026-09-06 |
| Monitoring RBAC | Static Bicep and runbook review | Pass — system identity receives Monitoring Contributor only at the web-test resource scope | 2026-09-06 |

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

## 11. Portfolio Project Showcase

Approved by the user on 2026-09-06.

- Replace the generic website project card with a featured case-study card.
- Describe the Azure migration, CI/CD controls, deployment versioning, emergency
  rollback, custom-domain validation, HTTPS, and DNS cutover.
- Show the tools and skills used without exposing account identifiers or other
  sensitive information.
- Link to the public deployment metadata using a relative site URL.
- Validate locally, deploy to an Azure DEV preview, and publish only after PR
  review and `PROD` approval.

## 12. Production Availability Monitoring

Approved by the user on 2026-09-06 with a strict `$10` annual ceiling.

- Monitor `https://jayaprakashkupparaju.com` from outside the application so a
  hosting, DNS, TLS, or page-availability failure can be detected.
- Use Application Insights backed by Log Analytics as the Azure Monitor data
  destination for an availability test.
- Add an actionable availability alert only after its threshold, evaluation
  window, notification destination, and expected cost are reviewed.
- Keep notification addresses and Azure account identifiers out of source
  control; configure them out of band if an action group is approved.
- Do not add browser-side telemetry in this step. Client telemetry and its
  privacy implications will be evaluated separately.
- Document the signal, alert behavior, verification steps, and response
  procedure in `docs/monitoring.md` and a focused availability runbook.
- Preserve the existing Static Web Apps deployment, custom domain, DNS, CI/CD,
  and production approval controls.

### Proposed Azure resources

Create these resources in the existing `rg-personal-site-prod` resource group
in Central US:

| Resource | Proposed name | Purpose |
|---|---|---|
| Log Analytics workspace | `log-personal-site-prod` | Store and query availability results |
| Application Insights | `appi-personal-site-prod` | Observability experience linked to the workspace |
| Standard availability test | `webtest-personal-site-prod` | Exercise the public production URL from Azure test locations |
| Azure Monitor action group | `ag-personal-site-prod` | Notify an out-of-band recipient; address is never committed |
| Availability alert | `alert-personal-site-unavailable` | Detect customer-visible failures across multiple locations |
| Automation account | `aa-personal-site-guard` | Run the independent test-disable safety control |
| Automation runbook | `Disable-PersonalSiteWebTest` | Disable the billable test at the fixed cutoff |

No managed identity, role assignment, browser SDK, connection string, or
application change is required for this external test.

### Proposed signal and alert

- Create the Standard test in a disabled state. Enable it only for a supervised
  two-hour learning exercise, using one location at 15-minute intervals.
- Require HTTP 200, valid TLS, and the text `Production Website SRE Lab`.
- Enable test retries to reduce transient network noise.
- Enable proactive TLS certificate lifetime checking with a seven-day window.
- Alert after repeated failure from the configured location. A single-location
  test is less resilient to regional false positives but is required to stay
  within the learning-project budget.
- Notify through one email receiver configured directly in Azure. The address
  will not be stored in Git, documentation, output, or deployment metadata.
- Validate the action group separately, then verify availability results in
  Application Insights and with a basic KQL query.
- Before enabling the test, publish and validate a managed-identity Azure
  Automation runbook with permission scoped only to this web-test resource.
- Schedule the runbook for the fixed end of the two-hour exercise. It disables
  the test and verifies that `Enabled` is false. Also disable the test directly
  at the end of the supervised exercise; the runbook is the independent backup.

### Cost and retention guardrails

- Use Log Analytics pay-as-you-go with 30-day retention, no commitment tier,
  and the lowest practical daily ingestion cap where supported.
- Central US Standard web tests currently list at `$0.00056` USD per scheduled
  execution in the Azure Retail Prices API. One location at 15-minute intervals
  schedules approximately eight executions during two hours, estimated at less
  than one cent before any retry executions.
- Treat `$0.10` as the availability-test lab allowance to cover retries and
  pricing variation. Confirm actual cost in Cost Analysis after usage appears.
- Create a `$10` annual budget scoped to `rg-personal-site-prod`, with early
  actual and forecast notifications beginning at 10% of the budget.
- Do not leave the Standard test continuously enabled. At the end of the
  exercise, require both a direct disable operation and a read-back showing the
  resource is disabled; the scheduled runbook provides a second path.
- Azure Automation includes the first 500 job-runtime minutes per subscription
  each month. Confirm existing Automation usage before relying on that allowance;
  this guard requires only one short run.
- Azure budgets notify but do not stop consumption. The disable date and cost
  controls are mandatory safety mechanisms, not optional reminders.
- A pay-as-you-go subscription has no configurable hard dollar stop. Therefore,
  no continuously billable monitor is permitted under this plan; meeting an
  absolute `$10` ceiling takes precedence over continuous Azure monitoring.
- The first 5 GB/month of Analytics Logs ingestion per billing account is
  included under published Azure Monitor pricing; this small synthetic test is
  expected to remain far below that volume.
- Azure Monitor currently includes the first ten monitored metric time series
  per month and the first 1,000 email notifications per month. Unexpected alert
  volume will be treated as a configuration defect.

### Execution and validation

1. Confirm the existing subscription and Central US context out of band.
2. Check for existing resources with the proposed names and verify provider,
   quota, policy, and permissions without changing Azure.
3. Create the workspace, workspace-based Application Insights resource, and
   Standard availability test.
4. Wait for successful synthetic results before enabling notification.
5. Configure and test the action group out of band, then create the alert.
6. Verify the alert is enabled and healthy without deliberately disrupting the
   production website.
7. Add `docs/monitoring.md` and `runbooks/website-unavailable.md`, update the
   architecture and roadmap progress, and publish documentation through the
   normal pull-request process.

### Rollback

If the test or alert is noisy, disable the alert and test first. Resource
deletion is a separate destructive action and requires explicit approval. No
rollback of the website, DNS, or deployment workflow is involved.

### Live lab state

- Annual resource-group budget: `$10` USD, with actual notifications at 10%,
  50%, 80%, and 100%, plus a forecast notification at 10%.
- Inactive monitoring foundation deployment: succeeded.
- Cost-guard runbook: published and tested successfully while the web test was
  disabled.
- Managed identity role: `Monitoring Contributor` scoped to the individual web
  test and verified in live Azure state.
- Availability alert: deployed disabled, then enabled only for the supervised
  exercise.
- Standard web test: deployed disabled, then enabled only after the guard was
  tested and scheduled.
- Automatic cutoff: 2026-09-07T01:06:00Z.

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
