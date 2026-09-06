# Production Website Monitoring

## Purpose

This lab introduces Azure Monitor, workspace-based Application Insights, Log
Analytics, availability testing, alerting, KQL, managed identity, and automated
cost protection for the production website.

## Cost boundary

The project has a strict target of less than $10 USD per year. A Standard web
test is therefore disabled by default and may be enabled only during a supervised
two-hour exercise. It must be disabled directly afterward, with an independent
Azure Automation runbook scheduled as a backup.

Two one-time schedules invoke the idempotent runbook 15 minutes apart. The
second invocation verifies the disabled state after a successful first run or
retries the disable operation if the first job failed.

An Azure budget is an alerting mechanism, not a spending cap. The test-disable
control is what prevents unattended recurring test executions.

The Action Group recipient is supplied through the secure `alertEmail` Bicep
parameter at deployment time. The budget recipient is configured directly in
Azure. The actual address must not be added to parameters files, documentation,
workflow files, or Git history.

## Signal

The Standard availability test requests the public production URL and checks:

- HTTP status 200;
- TLS certificate validity;
- at least seven days of remaining certificate lifetime;
- completion within 30 seconds.

The initial lab uses one test location every 15 minutes. One location is less
resilient to regional false positives than the five locations recommended for a
production monitor, but keeps the supervised exercise within the learning
budget.

## Initial KQL

```kusto
availabilityResults
| where timestamp > ago(2h)
| project timestamp, name, location, success, duration, resultCode, message
| order by timestamp desc
```

```kusto
availabilityResults
| where timestamp > ago(2h)
| summarize
    Checks = count(),
    Successful = countif(success == true),
    AvailabilityPercent = 100.0 * countif(success == true) / count(),
    AverageDurationMs = avg(duration / 1ms)
```

## Safety verification

Before enabling the test:

1. Confirm the annual resource-group budget exists.
2. Confirm the Automation runbook is published.
3. Confirm its managed identity is scoped only to the web test.
4. Test the runbook while the web test is already disabled.
5. Schedule the cutoff job.

After the exercise, directly disable the test and verify its `Enabled` property
is false. Then verify the scheduled runbook also completes successfully.

## Response

Follow the [website availability failure runbook](../runbooks/availability-failure.md)
when the test or alert indicates a customer-visible failure.
