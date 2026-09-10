# Website SLIs and SLOs

## Purpose

This document defines the first measurable reliability objectives for the
production website. These are laboratory objectives for learning SRE practices;
they are not a contractual SLA or evidence of continuous 30-day compliance.

An **SLI** is a measured indicator of customer experience. An **SLO** is the
target for that indicator over an evaluation window. The difference between
perfect performance and the SLO is the **error budget**.

## Service and customer journey

The measured service is the public HTTPS website at
`https://jayaprakashkupparaju.com/`. A successful customer journey requires:

1. public DNS resolution;
2. a valid TLS connection;
3. an HTTP response from Azure Static Web Apps; and
4. completion within the latency objective.

The Azure availability test exercises this path from outside the application,
so it can detect DNS, certificate, routing, hosting, and response failures.

## Measurement source

| Item | Definition |
|---|---|
| Telemetry table | `AppAvailabilityResults` in Log Analytics |
| Measurement point | Azure Standard availability test |
| Evaluation window | Rolling 30 days when continuous data is available |
| Current collection mode | Supervised, time-boxed learning exercises only |
| Excluded periods | Periods with no scheduled checks are unknown, not successful |

The availability test is disabled outside supervised exercises to protect the
strict annual cost boundary. Therefore, current telemetry cannot prove a
continuous 30-day SLO. Missing observations must never be counted as successful
service time.

## Initial objectives

| SLI | Good event | Initial 30-day SLO |
|---|---|---:|
| Availability | Test completes successfully with the expected HTTP response and valid TLS | 99.9% of valid checks |
| Latency | A successful test completes in less than 500 ms | 95% of successful checks |
| Synthetic error rate | Availability test does not fail | Fewer than 1% of valid checks fail |

These targets begin the learning process. They should be revised only after a
representative dataset exists and the cost of collecting it is understood.

## SLI formulas

```text
Availability (%) = successful checks / valid checks * 100

Latency compliance (%) = successful checks under 500 ms / successful checks * 100

Synthetic error rate (%) = failed checks / valid checks * 100
```

A valid check is an availability-test result generated while the test is
intentionally enabled. Configuration tests and missing monitoring periods are
not included as successful customer events.

## Initial learning baseline

The supervised exercise from September 6, 2026 produced this sample:

| Measurement | Observed value |
|---|---:|
| Observation period | 22:56:35 UTC to 01:04:48 UTC |
| Valid checks | 10 |
| Successful checks | 10 |
| Failed checks | 0 |
| Sample availability | 100% |
| Average duration | 508 ms |
| P50 duration | 409 ms |
| P95 duration | 1,282 ms |
| P99 duration | 1,282 ms |
| Checks under 500 ms | 7 of 10 |
| Latency compliance | 70% |
| Synthetic error rate | 0% |

The sample met the availability objective but did not meet the proposed P95
latency objective. Ten checks over about two hours are too few to establish a
production trend. The results demonstrate the calculation method only.

## KQL: 30-day SLI summary

```kusto
let EvaluationWindow = 30d;
let LatencyTargetMs = 500.0;
AppAvailabilityResults
| where TimeGenerated >= ago(EvaluationWindow)
| summarize
    TotalChecks = count(),
    SuccessfulChecks = countif(Success == true),
    FailedChecks = countif(Success == false),
    ChecksUnderLatencyTarget = countif(Success == true and DurationMs < LatencyTargetMs),
    P50DurationMs = percentile(DurationMs, 50),
    P95DurationMs = percentile(DurationMs, 95),
    P99DurationMs = percentile(DurationMs, 99)
| extend
    AvailabilityPercent = round(100.0 * SuccessfulChecks / TotalChecks, 3),
    LatencyCompliancePercent = round(100.0 * ChecksUnderLatencyTarget / SuccessfulChecks, 3),
    SyntheticErrorRatePercent = round(100.0 * FailedChecks / TotalChecks, 3)
```

Run the query only when the selected period contains results. A zero-row period
means there is no evidence, not 100% reliability.

The current availability table does not expose an HTTP response-code column.
A separate HTTP 5xx SLI cannot be measured honestly with this data source. Add
that indicator when request telemetry from a backend or another validated data
source becomes available.

## KQL: error-budget status

```kusto
let EvaluationWindow = 30d;
let AvailabilityObjective = 0.999;
AppAvailabilityResults
| where TimeGenerated >= ago(EvaluationWindow)
| summarize TotalChecks = count(), FailedChecks = countif(Success == false)
| extend AllowedFailedChecks = TotalChecks * (1.0 - AvailabilityObjective)
| extend RemainingFailedChecks = AllowedFailedChecks - FailedChecks
| extend RemainingBudgetPercent = round(
    100.0 * RemainingFailedChecks / AllowedFailedChecks,
    2)
| project TotalChecks, FailedChecks, AllowedFailedChecks,
    RemainingFailedChecks, RemainingBudgetPercent
```

The calculated allowance may be fractional. Operational decisions should use
the SLO percentage and supporting incident evidence rather than rounding the
allowance upward.

## Review

- Review the objectives after each supervised monitoring exercise.
- Review cost before enabling another test window.
- Use the [error-budget policy](error-budget-policy.md) when the measured
  availability begins consuming the allowed budget.
- Do not build a continuously refreshing paid dashboard until its annual cost
  fits within the approved project budget.
