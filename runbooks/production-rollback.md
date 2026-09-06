# Azure Production Rollback Runbook

## Purpose

Use this runbook to restore the Azure Static Web Apps production site to a
known-good commit when a release causes material customer impact and waiting for
a normal fix or revert pull request would prolong the incident.

For a minor issue with no meaningful customer impact, use a normal revert pull
request instead of the emergency workflow.

## Scope and Safety

- This procedure changes only Azure Static Web Apps production content.
- The public custom domain currently uses GitHub Pages and is not changed by an
  Azure rollback.
- The rollback target must be an exact 40-character commit SHA already contained
  in `main`.
- The emergency deployment still requires approval through the GitHub `PROD`
  environment.
- Never copy deployment tokens, credentials, account identifiers, or other
  sensitive values into an incident record or workflow input.

## Immediate Mitigation

1. Open the current Azure production metadata:

   ```text
   https://<azure-static-web-app-hostname>/deployment-info.json
   ```

2. Record the current content commit, deployment type, workflow run ID, and
   deployment time in the incident notes.
3. Identify the last known-good commit from a previous successful deployment or
   from the protected `main` history.
4. Confirm the selected commit predates the faulty change and is already part of
   `main`.
5. In GitHub, open **Actions** and select
   **Emergency rollback Azure production**.
6. Select **Run workflow**, keep the workflow branch on `main`, and enter the
   full known-good commit SHA.
7. Wait for **Validate rollback candidate** to pass. Do not approve a candidate
   that fails validation.
8. Review and approve **Deploy approved rollback** for the `PROD` environment.
9. Monitor the workflow until it completes successfully.

## Mitigation Verification

1. Confirm the Azure site root returns HTTP 200.
2. Confirm representative assets load successfully.
3. Verify that the customer-facing symptom is gone.
4. Open `/deployment-info.json` and confirm:
   - `content_commit` equals the requested known-good commit;
   - `deployment_type` is `rollback`;
   - `workflow_run_id` identifies the successful rollback run;
   - both deployment timestamps are present.
5. Record the successful rollback run and verification result.

GitHub Environments may display the current workflow-definition commit for a
rollback deployment. Use `/deployment-info.json` as the authoritative record of
the website content commit.

## Prevent Reintroduction

An emergency rollback changes deployed Azure content but does not change
`main`. Until source is corrected, do not approve another normal `PROD`
deployment; it could redeploy the faulty version.

## Align Source with Production

1. Create a feature branch from the latest `main`.
2. Apply the inverse of the faulty commit without committing immediately:

   ```powershell
   git revert --no-commit <FAULTY_COMMIT_SHA>
   ```

3. Review the staged diff and confirm it reverses only the intended change.
4. Run the repository checks:

   ```powershell
   npm run ci
   npm audit --audit-level=high
   npm run security
   ```

5. Commit and push the revert, then open a pull request to `main`.
6. Verify CI and the Azure DEV preview. Confirm the original symptom is absent.
7. Merge the pull request.
8. Review and approve the resulting normal `PROD` deployment.
9. Verify the production site and confirm `/deployment-info.json` now reports:
   - the new merged source commit;
   - `deployment_type` as `production`.

At this point, `main` and Azure production are aligned and the temporary
deployment freeze can end.

## If the Rollback Fails

- If candidate validation fails, correct the SHA or select another known-good
  commit; do not bypass validation.
- If deployment fails transiently, inspect the failed step and rerun it once.
- If the chosen version does not restore service, repeat the emergency workflow
  with an earlier verified commit.
- Do not modify public DNS as a rollback shortcut.
- Use [deployment-failure.md](deployment-failure.md) for deployment-system
  failures.

## Incident Record

Record the following without including sensitive information:

- Detection time and customer symptom
- Faulty content commit and workflow run ID
- Selected known-good commit
- Rollback workflow run ID and approver decision time
- Mitigation verification time
- Source-revert pull request and final production run ID
- Root cause and prevention actions

## Validated Exercise

This procedure was validated in Phase 2 by deploying a visible test badge,
restoring the preceding known-good commit through the emergency workflow, and
then reverting the badge in source through a normal pull request. The live
deployment metadata confirmed both the rollback target and the final aligned
production commit.
