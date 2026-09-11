# Session Checkpoint

## Current State

- Phase 2 CI/CD foundations are active.
- Pull requests run validation and deploy a temporary Azure preview through the
  GitHub `DEV` environment.
- Merges to `main` start an Azure deployment through the GitHub `PROD`
  environment, which requires manual approval.
- The permanent Azure Static Web Apps endpoint has been validated independently
  from the public site.
- The public custom domain still uses GitHub Pages and therefore deploys changes
  from `main` without the Azure `PROD` approval gate.
- GitHub Pages and its DNS records have not been disabled or redirected.
- The Azure custom-domain binding failed after TXT validation and needs separate
  troubleshooting before any DNS cutover.

## Latest Exercise

- The manual emergency rollback workflow was merged and validated.
- Azure production was rolled back to the known-good commit before the visible
  Phase 2 badge.
- The rollback succeeded and the badge is absent from the permanent Azure site.
- `main` still contains the badge, so approving any new normal PROD deployment
  would reintroduce it.
- GitHub Pages still contains the badge because the Azure rollback did not alter
  source history or the existing Pages deployment.
- PR #5 adds public `deployment-info.json` provenance to Azure preview, normal
  production, and rollback deployments.
- PR #5 is committed and pushed on `phase-2-deployment-metadata`; its local CI,
  formatting, functional metadata tests, and sensitive-data checks passed.

## Continue Next Session

1. Check PR #5 CI and Azure DEV preview results.
2. Verify the preview's `/deployment-info.json` reports the correct content
   commit, `preview` type, workflow run ID, and timestamps.
3. Create a source-level revert PR for the Phase 2 badge so `main` matches the
   known-good Azure production content.
4. Merge the metadata and source-revert changes in a safe order. Do not approve
   a normal PROD deployment while `main` still contains the badge.
5. Approve the aligned normal PROD deployment and verify both the missing badge
   and `/deployment-info.json` on the permanent Azure endpoint.
6. Create a rollback runbook and update the Phase 2 roadmap.
7. Remove the temporary repository-level Azure deployment secret after the
   environment-scoped workflow is fully validated.
8. Troubleshoot the failed Azure custom-domain binding without changing the
   existing GitHub Pages DNS records.

## Safety Constraints

- Do not commit credentials, tokens, account identifiers, usernames, email
  addresses, subscription or tenant identifiers, or other sensitive data.
- Review staged changes and run the sensitive-data check before every commit or
  push.
- Do not change GitHub Pages or public DNS until Azure production and the custom
  domain have both been validated.
