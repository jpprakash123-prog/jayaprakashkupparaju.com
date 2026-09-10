# Website Error-Budget Policy

## Purpose

This policy connects reliability measurements to engineering decisions. It
prevents feature delivery from taking priority over recovery when the service is
already missing its availability objective.

This is a learning policy for the personal website, not a contractual SLA.

## Availability budget

The initial availability SLO is 99.9% over a rolling 30-day window.

```text
Error budget = 100% - 99.9% = 0.1%

30 days * 24 hours * 60 minutes * 0.1% = 43.2 minutes
```

The monthly time-equivalent budget is therefore **43 minutes and 12 seconds**.
Synthetic checks measure discrete observations, so this time value is an aid to
reasoning rather than an exact downtime counter.

At a theoretical 15-minute continuous cadence, 30 days would produce 2,880
checks and a mathematical allowance of 2.88 failed checks. No continuous test
is currently running, so this value must not be presented as measured monthly
performance.

## Decision policy

| Remaining availability budget | Operating mode | Required action |
|---:|---|---|
| More than 50% | Normal | Continue reviewed changes and watch trends |
| 25% to 50% | Caution | Investigate failures and prioritize reliability work |
| More than 0% to 25% | At risk | Defer nonessential risky releases and prepare mitigation |
| 0% or less | Exhausted | Stop nonessential production releases; restore reliability first |

Security fixes and urgent reliability fixes may proceed when the budget is
exhausted, but they still require validation and the production approval gate.

## Response when budget is exhausted

1. Confirm the failure represents customer impact and is not a synthetic-test
   or regional false positive.
2. Record the affected time window, HTTP result, latency, deployed commit, and
   relevant Azure or DNS evidence.
3. Stop nonessential production changes.
4. Mitigate using the least risky option, including emergency rollback when a
   deployment caused the failure.
5. Follow the [availability-failure runbook](../runbooks/availability-failure.md).
6. Document the incident and corrective actions.
7. Resume normal delivery only after the service is stable and the recovery
   decision is recorded.

## Monitoring limitations

The cost-controlled Azure availability test is disabled by default. An absence
of checks does not demonstrate availability and cannot replenish an error
budget. Until affordable continuous telemetry is approved:

- calculate error-budget status only for explicitly observed test windows;
- label all results as laboratory samples;
- supplement telemetry with deployment verification and reported incidents;
- do not claim that the 30-day production SLO has been achieved.

## Cost and safety controls

- Enabling the paid availability test requires a supervised time window.
- A direct disable and two scheduled cutoff runs protect against unattended
  execution.
- Check actual Azure cost after each exercise.
- The annual Azure project budget remains less than $10 USD.
- Budget notifications warn about spend but do not stop resources.

## Monthly review questions

1. Did any observed event violate the availability, latency, or error-rate SLO?
2. Was the signal a real customer-impacting failure or monitoring noise?
3. How much error budget was consumed during measured periods?
4. Which deployment or infrastructure change contributed to the result?
5. What reliability improvement should be prioritized next?
6. Is the telemetry useful enough to justify its measured cost?
