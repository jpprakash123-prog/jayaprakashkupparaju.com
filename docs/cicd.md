# CI/CD Workflow

## Objective

Website changes should move through a feature branch, pull request, automated
validation, review, and merge before Azure deployment.

```text
Feature branch
      |
      v
Pull request
      |
      v
Continuous Integration
      |-- HTML validation
      |-- Site tests
      |-- Sensitive-data check
      |-- Static-site build
      `-- Dependency audit
      |
      v
Review and merge to main
      |
      v
Production approval
      |
      v
Azure Static Web Apps deployment
```

## Local Checks

Install the pinned validation dependency and run the complete CI suite:

```powershell
npm ci
npm run ci
npm audit --audit-level=high
```

The build command creates `dist/` containing only `index.html` and
`profile.jpg`. The generated directory is ignored by Git.

## GitHub Workflows

- `.github/workflows/ci.yml` validates pushes and pull requests targeting
  `main`.
- `.github/workflows/azure-static-web-apps.yml` deploys pull requests through
  the `DEV` environment and merged changes through the approval-gated `PROD`
  environment.

The Azure deployment token is stored separately as an encrypted environment
secret in `DEV` and `PROD`. It is not available to the CI workflow. `PROD`
allows deployments only from protected branches and requires approval before
its secret is released to a job.

## Live Deployment Version

Every Azure preview, production, and rollback deployment publishes a public
`deployment-info.json` file at the root of that deployment. For example:

```text
https://<azure-static-web-app-hostname>/deployment-info.json
```

The file identifies the commit whose website content was built, rather than the
commit that merely started the workflow. This distinction is important for an
emergency rollback, where the workflow runs from current `main` but deploys an
older known-good commit.

```json
{
  "schema_version": 1,
  "content_commit": "<40-character-commit-sha>",
  "content_commit_short": "<7-character-sha>",
  "deployment_type": "production",
  "workflow_run_id": "<run-id>",
  "deployed_at_utc": "2026-09-04T03:30:00.000Z",
  "deployed_at_central": "Thursday, September 3, 2026 at 10:30:00 PM CDT"
}
```

The UTC value is machine-readable and unambiguous. The Central Time value is
intended for human incident review and includes the weekday and time-zone
abbreviation. The file contains no credentials, user identity, account data, or
Azure subscription information.

## Intended Change Process

1. Create a feature branch from an up-to-date `main`.
2. Make and validate the change locally.
3. Push the feature branch and open a pull request.
4. Wait for all required checks to pass.
5. Review the diff and approve the pull request.
6. Merge to `main`.
7. Approve the pending `PROD` deployment in GitHub Actions.
8. Verify the Azure deployment workflow and live endpoint.

The `main` branch is protected and requires the `Validate static website`
status check. Force pushes and branch deletion are blocked.

## Operational Runbooks

- [Deployment failure](../runbooks/deployment-failure.md)
- [Azure production rollback](../runbooks/production-rollback.md)
