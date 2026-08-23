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
- `.github/workflows/azure-static-web-apps.yml` deploys merged changes to Azure
  Static Web Apps.

The Azure deployment token remains in an encrypted GitHub Actions secret and is
not available to the CI workflow.

## Intended Change Process

1. Create a feature branch from an up-to-date `main`.
2. Make and validate the change locally.
3. Push the feature branch and open a pull request.
4. Wait for all required checks to pass.
5. Review the diff and approve the pull request.
6. Merge to `main`.
7. Verify the Azure deployment workflow and live endpoint.

Branch protection and required-review settings will be enabled after this first
CI pull request proves that the checks work correctly.
