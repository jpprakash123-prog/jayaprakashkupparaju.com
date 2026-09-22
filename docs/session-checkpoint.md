# Session Checkpoint

## Current state

- The website and custom domain use Azure Static Web Apps; GitHub Pages is a documented fallback. See [deployment](deployment.md).
- CI/CD includes validation, preview deployments, production approval, deployment metadata, and emergency rollback.
- Phase 5 SLI definitions, SLOs, an error-budget policy, and Azure Workbook source are implemented. Continuous 30-day compliance is not established.
- Privacy-safe real-user monitoring (RUM) was exercised on September 11, 2026. Ingestion and sanitized page views were validated during that exercise.
- Normal builds disable RUM. The exercise cutoff was `2026-09-11T02:53:31Z`.

## Closeout review — September 16, 2026

- Device-code login restored Azure CLI access. Live verification completed September 17 UTC (September 16 local time).
- Three page views and three browser timing events were returned, with none after the cutoff and no user IDs or unsanitized URLs. No exception rows were returned.
- The paid availability test is disabled. Reported actual cost is $0.05376 USD month to date, with usage rows through September 16 and no reported increase from the rounded baseline.
- The deployed workbook matches repository source, and all five queries executed successfully.
- The 10 observed checks show 100% availability, 70% latency compliance, 0% synthetic errors, and 100% remaining sample availability budget (0.01 allowed failed checks). The latency objective is not met. This small historical sample does not establish monthly compliance.
- See [RUM closeout](real-user-monitoring.md#closeout-verification) and [SLO validation](slo.md#live-dashboard-validation) for evidence.

## Continue next

1. Review and publish the portfolio engineering case study in PR #17. Introduce a backend when a visitor-facing feature needs it; a standalone health API is deferred. Terraform remains outstanding.
2. Investigate latency during the next supervised exercise; avoid drawing a production trend from ten checks.
3. Continue monthly SLO reviews and cost checks. Missing monitoring periods remain unknown.

## Safety constraints

- Keep credentials, personal information, and Azure account identifiers out of tracked files and command output.
- Keep paid availability testing disabled outside supervised exercises and preserve the annual project cost boundary.
- Production deployments retain their approval gate.
- Review changes and run the sensitive-data check before committing or pushing.
