# Azure Static Web Apps Deployment

## Current State

The website is deployed to Azure Static Web Apps on the Free plan in Central
US. The Azure-hosted copy is available at:

`https://black-dune-07c4abe10.7.azurestaticapps.net`

The custom domain routes through Cloudflare DNS to Azure Static Web Apps. GitHub
Pages remains available only as a documented fallback.

## Deployment Flow

```text
Commit to main
      |
      v
GitHub Actions
      |
      v
Build isolated public assets in dist/
      |
      v
Azure Static Web Apps
```

The workflow is defined in `.github/workflows/azure-static-web-apps.yml`. It
builds only public website files into `dist/` before deployment. Repository
documentation, local Azure state, infrastructure source, and `CNAME` are not
uploaded to Azure.

Normal and preview builds generate browser-monitoring assets with telemetry
disabled. The approval-gated production build can enable privacy-safe Real User
Monitoring for no more than two hours using protected environment configuration.

## Secret Handling

The workflow reads the Azure deployment token from the encrypted GitHub Actions
secret `AZURE_STATIC_WEB_APPS_API_TOKEN`. A production RUM exercise also reads
`APPLICATIONINSIGHTS_CONNECTION_STRING` from the protected `PROD` environment.
Neither value may be placed in source files, documentation, workflow YAML,
command output, or Git history. The RUM connection string becomes visible in the
deployed browser asset by design and is not an authorization credential.

## Validation

The completed GitHub Actions deployment was validated as follows:

- The workflow completed successfully.
- The Azure root page returned HTTP 200 and the expected page title.
- `profile.jpg` returned HTTP 200 with an image content type.
- The Azure custom domain and HTTPS endpoint respond successfully.
- Cloudflare DNS routes the public domain to Azure.
- Deployment metadata identifies the live content commit.

## Rollback

Use the manual emergency rollback workflow to redeploy an exact known-good
commit from `main`, then follow with a normal source-revert pull request. The
rollback build keeps RUM disabled by default. DNS recovery to GitHub Pages is a
separate last-resort procedure.
