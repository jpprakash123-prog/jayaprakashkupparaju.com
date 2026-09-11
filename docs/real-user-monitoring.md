# Privacy-Safe Real User Monitoring

## Purpose

This supervised lab uses the Application Insights browser SDK to compare real
visitor experience with synthetic availability checks. It measures sampled page
views, browser performance, and JavaScript failures for no more than two hours.

## Privacy boundary

The implementation disables cookies, local storage, session storage, dependency
tracking, click analytics, and authenticated user context. It removes query
strings and fragments from page and referrer URLs and removes SDK user identity
fields before telemetry is sent.

Do not add names, email addresses, usernames, form values, DOM contents, request
headers, or arbitrary custom properties. Review any future custom telemetry as a
privacy and security change.

## Deployment controls

- Local and pull-request builds produce `rum-config.js` with telemetry disabled.
- Production requires the protected `PROD` environment secret
  `APPLICATIONINSIGHTS_CONNECTION_STRING`.
- The production workflow generates `RUM_CUTOFF_UTC` immediately before the
  approval-gated build.
- The build rejects missing, expired, malformed, or greater-than-two-hour
  configurations.
- The browser refuses to initialize after the cutoff and unloads the SDK at the
  cutoff if a page remains open.
- Emergency rollback builds do not receive the telemetry configuration, so RUM
  is disabled during incident recovery.

The connection string is visible in the delivered browser asset by design. It is
not an authorization credential, but it remains outside Git to avoid storing
account-specific configuration in repository history.

## Validation queries

Run these from `appi-personal-site-prod` or the linked Log Analytics workspace.

```kusto
AppPageViews
| where TimeGenerated > ago(3h)
| project TimeGenerated, Name, Url, DurationMs
| order by TimeGenerated desc
```

```kusto
AppExceptions
| where TimeGenerated > ago(3h)
| summarize Failures = count() by ProblemId
| order by Failures desc
```

Confirm that URLs contain no query strings or fragments and that telemetry stops
after the recorded cutoff.

## Cost verification

Application Insights browser telemetry is billed through Log Analytics
ingestion and retention. This exercise creates no Azure resource and uses 10%
sampling, a two-hour cutoff, 30-day retention, the existing `0.023 GB/day`
workspace cap, the annual `$10` resource-group budget, and weekly cost email.

Record resource-group cost immediately before the exercise and again after cost
data becomes available. Budget alerts do not stop spending, so do not remove the
cutoff control.

## Disable and recovery

The automatic cutoff is the normal stop mechanism. For immediate mitigation,
run the emergency rollback workflow against the last known-good pre-RUM commit.
The rollback build disables telemetry by default. Follow with a normal revert
pull request if the instrumentation must remain removed.
