# Website Availability Failure

## Trigger

Use this runbook when the Azure availability test reports that the production
website is unavailable or its TLS validation fails.

## Triage

1. Open `https://jayaprakashkupparaju.com` from a separate network.
2. Check `https://jayaprakashkupparaju.com/deployment-info.json` and record the
   deployed content commit and workflow run ID.
3. Check the latest production deployment in GitHub Actions.
4. Inspect the Application Insights availability result for response code,
   duration, location, TLS details, and returned content.
5. Check Azure Static Web Apps resource health and custom-domain status.
6. Resolve the public DNS records and compare the result with the documented
   Azure Static Web Apps target.

## Mitigation

- Failed deployment: follow the production rollback runbook.
- Azure endpoint healthy but custom domain failing: investigate Cloudflare DNS
  and the Azure custom-domain binding before changing records.
- Certificate failure: confirm the custom domain is validated and managed TLS is
  active in Azure Static Web Apps.
- Single synthetic-location failure with successful manual checks: treat it as
  a possible regional false positive and wait for a retry before making changes.

Do not delete resources, change DNS, or start a rollback until evidence points
to that component.

## Cost safety

Availability monitoring is enabled only during a supervised lab. When the lab
ends, disable the web test and verify the setting. If the scheduled safety
runbook fails, disable the test directly before troubleshooting the automation.

## Resolution record

Record the detection time, customer impact, deployed commit, evidence, action
taken, recovery time, and follow-up work in an incident note.
