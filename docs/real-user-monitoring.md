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
- Push-triggered production deployments keep telemetry disabled.
- To start an exercise, manually run **Deploy to Azure Static Web Apps**, set
  `enable_rum` to `true`, and approve `PROD`. The workflow then generates
  `RUM_CUTOFF_UTC` immediately before the approval-gated build.
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

A normal main-branch deployment also publishes telemetry-disabled configuration
and can be used as a non-emergency stop after review. Future RUM exercises must
always use the explicit manual `enable_rum` input; ordinary merges never start a
new exercise.

## First supervised exercise

- Production content commit: `2f3143e`.
- Deployment workflow run: `34548331059`.
- Started: 2026-09-11.
- Absolute browser cutoff: `2026-09-11T02:53:31Z`.
- Sampling: 10%.
- Ingestion validation: Azure returned HTTP 204 for a sampled browser request.
- Query validation: `AppPageViews` contained the sanitized root URL with empty
  anonymous and authenticated user-ID fields.
- Availability test: remained disabled.
- Pre-exercise resource-group cost: `$0.0538` month to date.

After the cutoff, verify that no later page-view timestamp appears and record the
post-exercise cost when Cost Management has finished processing usage.

## Closeout verification

Closeout was verified on September 17, 2026 UTC (September 16 local time), after
device-code authentication restored Azure CLI access. Source code alone was not
used as evidence that telemetry stopped.

| Live observation | Result |
|---|---|
| Page views since September 11 | 3 |
| Last page view | September 11, 01:07:27.152 UTC |
| Browser timing events | 3 |
| Last browser timing event | September 11, 01:08:44.661 UTC |
| Exception events in the queried window | None returned |
| Events after the 02:53:31 UTC cutoff | 0 across these tables |
| Events with user identity fields | 0 |
| URLs with query strings or fragments | 0 |
| Paid availability test | Disabled (`Enabled=false`) |

These are observed, sampled results through the verification time; they do not
prove that every browser generated no telemetry. No new exercise was enabled.

Azure Cost Management returned **$0.05376 USD** actual resource-group cost month
to date, with usage rows through September 16 and no additional result pages.
Azure Monitor accounts for $0.05376; Automation and Log Analytics each report
$0.00. The nonzero charge is dated September 6. Rows for September 11 report
$0.00 for Azure Monitor and Log Analytics. At four decimal places, the total
matches the recorded pre-exercise $0.0538; no additional charge is reported.
These are reported costs as of verification, subject to billing adjustments.

The cost request used `ActualCost`, `MonthToDate`, daily granularity, a sum of
`Cost`, and grouping by `ServiceName`, scoped to the project resource group.

Run this query in the exercise's Log Analytics workspace. Use event timestamps,
not ingestion timestamps: buffered events may arrive after the cutoff.

```kusto
let ExerciseStart = datetime(2026-09-11T00:00:00Z);
let Cutoff = datetime(2026-09-11T02:53:31Z);
AppPageViews
| where TimeGenerated between (ExerciseStart .. now())
| summarize PageViews=count(), FirstEvent=min(TimeGenerated),
    LastEvent=max(TimeGenerated), EventsAfterCutoff=countif(TimeGenerated > Cutoff),
    UnsanitizedUrls=countif(Url contains '?' or Url contains '#'),
    EventsWithUserIds=countif(isnotempty(UserId) or isnotempty(UserAuthenticatedId))
```

Require a nonzero sample before interpreting zero violations as evidence. Check
`AppExceptions` and `AppBrowserTimings` for later events as well if those tables
contain exercise telemetry. Investigate later events before closing the exercise,
including whether a subsequent exercise generated them.

Query resource-group actual cost month to date, grouped daily by service. Record
currency, query time, latest usage date, total, and service totals. Compare with
the pre-exercise `$0.0538`, but do not attribute the entire difference to RUM:
other resource-group usage can contribute. Incomplete billing data stays pending.

Confirm the availability test is disabled and run all five deployed workbook
queries. Record coverage alongside the error-budget result; an observed sample
does not establish continuous 30-day availability.
