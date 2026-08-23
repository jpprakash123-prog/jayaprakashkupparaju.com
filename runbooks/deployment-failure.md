# Deployment Failure Runbook

## Trigger

Use this runbook when the Azure Static Web Apps GitHub Actions workflow fails or
the Azure endpoint does not show the expected version after a successful run.

## Impact

The custom domain currently remains on GitHub Pages, so an Azure deployment
failure does not affect custom-domain traffic during the migration phase.

## Investigation

1. Open the failed GitHub Actions run.
2. Identify whether the failure occurred during checkout, staging, or deploy.
3. Confirm the CI workflow passed for the same commit.
4. Confirm `index.html` and `profile.jpg` exist in the commit.
5. Confirm the encrypted deployment secret exists by name; never print its
   value.
6. Check the Azure Static Web App production environment status.
7. Test the Azure-generated HTTPS endpoint directly.

## Recovery

- For a source or validation failure, fix the issue on a feature branch and
  create a new pull request.
- For a transient GitHub or Azure failure, rerun the failed workflow once.
- For an invalid deployment secret, rotate it in Azure and replace the
  encrypted GitHub secret without exposing its value.
- Do not change Cloudflare DNS as a deployment-recovery action.

## Verification

1. Confirm the workflow completes successfully.
2. Confirm the Azure root page returns HTTP 200.
3. Confirm `profile.jpg` returns HTTP 200 with an image content type.
4. Confirm the expected page marker is visible.
5. Record the failed run, cause, correction, and successful run.
