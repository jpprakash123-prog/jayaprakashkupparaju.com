# Azure Static Web Apps Deployment

## Current State

The website is deployed to Azure Static Web Apps on the Free plan in Central
US. The Azure-hosted copy is available at:

`https://black-dune-07c4abe10.7.azurestaticapps.net`

The custom domain still uses GitHub Pages. No Cloudflare DNS records or GitHub
Pages custom-domain settings have been changed.

## Deployment Flow

```text
Commit to main
      |
      v
GitHub Actions
      |
      v
Stage index.html and profile.jpg
      |
      v
Azure Static Web Apps
```

The workflow is defined in `.github/workflows/azure-static-web-apps.yml`. It
copies only the public website files into a temporary `_site` directory before
deployment. Repository documentation, local Azure state, and `CNAME` are not
uploaded to Azure.

## Secret Handling

The workflow reads the Azure deployment token from the encrypted GitHub Actions
secret `AZURE_STATIC_WEB_APPS_API_TOKEN`. The token value must never be placed in
source files, documentation, workflow YAML, command output, or Git history.

## Validation

The completed GitHub Actions deployment was validated as follows:

- The workflow completed successfully.
- The Azure root page returned HTTP 200 and the expected page title.
- `profile.jpg` returned HTTP 200 with an image content type.
- No Azure custom domain is configured.
- The repository `CNAME` remains unchanged.
- Cloudflare DNS remains unchanged.

## Rollback

No traffic rollback is currently required because the custom domain continues
to use GitHub Pages. If an Azure deployment fails, correct the source or
workflow and rerun the GitHub Actions deployment. Do not change DNS as part of
deployment recovery.
