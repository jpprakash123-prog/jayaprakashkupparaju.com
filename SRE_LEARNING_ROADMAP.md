# Personal Website SRE Lab — End-to-End Learning & Execution Plan

**Project:** jayaprakashkupparaju.com  
**Purpose:** Use a real personal website as a hands-on lab to learn and demonstrate modern Site Reliability Engineering (SRE), Azure, CI/CD, Infrastructure as Code, observability, Kubernetes, automation, AI-assisted operations, incident management, and reliability engineering.

---

## 1. Project Goal

The goal is not simply to build a website. The goal is to operate the website like a small production platform.

The operating loop for this project is:

> **Build → Deploy → Observe → Break → Detect → Investigate → Recover → Automate → Document**

By the end of this project, the repository itself should demonstrate practical experience with:

- Azure
- Git and GitHub
- CI/CD
- GitHub Actions
- Infrastructure as Code
- Terraform
- Docker
- Kubernetes
- AKS
- Azure Monitor
- Application Insights
- Log Analytics
- KQL
- OpenTelemetry
- Prometheus
- Grafana
- SLIs / SLOs / Error Budgets
- Alerting
- Incident Management
- Runbooks
- Root Cause Analysis
- Postmortems
- Autoscaling
- Reliability Testing
- Chaos Engineering
- GitOps
- Security / DevSecOps
- Azure SRE Agent
- AI-assisted operations
- Cost / FinOps
- Disaster Recovery

---

# 2. Guiding Principles

1. **Build incrementally.** Do not introduce Kubernetes, AI, or multi-region architecture before the simpler layers work.
2. **Everything goes through source control.**
3. **Automate repeatable work.**
4. **Infrastructure should eventually be created through code.**
5. **Every production-like component should be observable.**
6. **Every important alert should have a runbook.**
7. **Every failure exercise should produce a lesson or action item.**
8. **Prefer measurable reliability targets over vague goals.**
9. **Use least privilege and managed identities whenever possible.**
10. **Control Azure spending from the beginning.**

---

# 3. Target Architecture — Evolution

The architecture will intentionally evolve as skills are learned.

## Stage A — Initial Static Website

```text
User
  |
  v
Cloudflare DNS
  |
  v
GitHub Pages
  |
  v
index.html
```

## Stage B — Azure Static Website

```text
User
  |
  v
Cloudflare DNS
  |
  v
Azure Static Web Apps
  |
  v
Static HTML / CSS / JavaScript
```

Source remains in GitHub.

```text
Developer
   |
 git push
   |
   v
GitHub
   |
GitHub Actions
   |
   v
Azure Static Web Apps
```

## Stage C — Website + Backend API

```text
Browser
   |
   +------------------------+
   |                        |
   v                        v
Static Web App          Azure Function
                             |
                             v
                       Application Insights
```

## Stage D — Containerized API

```text
GitHub
   |
GitHub Actions
   |
   v
Docker Build
   |
   v
Azure Container Registry
   |
   v
Azure Container Apps
```

## Stage E — Kubernetes / AKS

```text
Internet
   |
   v
Ingress / Load Balancer
   |
   v
AKS
   |
   +-- Deployment
   |      |
   |      +-- Pod
   |      +-- Pod
   |      +-- Pod
   |
   +-- Service
   +-- ConfigMap
   +-- Secrets
   +-- HPA
```

## Stage F — Advanced Reliability

```text
                     Azure Front Door
                           |
               +-----------+-----------+
               |                       |
               v                       v
           Region A                 Region B
              AKS                      AKS
               |                       |
               +-----------+-----------+
                           |
                    Shared Services
```

Only build the multi-region stage if there is a clear learning objective and Azure cost is acceptable.

---

# 4. Suggested Repository Structure

```text
jayaprakashkupparaju.com/
|
├── src/
│   ├── website/
│   └── api/
│
├── infrastructure/
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── providers.tf
│   └── kubernetes/
│       ├── deployment.yaml
│       ├── service.yaml
│       ├── ingress.yaml
│       ├── configmap.yaml
│       └── hpa.yaml
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-dev.yml
│       ├── deploy-prod.yml
│       ├── terraform-plan.yml
│       └── terraform-apply.yml
│
├── docs/
│   ├── architecture.md
│   ├── deployment.md
│   ├── cicd.md
│   ├── slo.md
│   ├── monitoring.md
│   ├── security.md
│   ├── disaster-recovery.md
│   └── cost-management.md
│
├── runbooks/
│   ├── api-500-errors.md
│   ├── high-latency.md
│   ├── pod-crashloop.md
│   ├── deployment-failure.md
│   ├── dns-failure.md
│   └── certificate-failure.md
│
├── incidents/
│   └── README.md
│
├── sre-agent/
│   ├── knowledge/
│   └── skills/
│       └── aks-troubleshooting/
│           └── SKILL.md
│
├── README.md
└── SRE_LEARNING_ROADMAP.md
```

---

# 5. Phase 0 — Establish Baseline

## Objective

Document the current website before changing the hosting platform.

## Tasks

- [ ] Confirm `jayaprakashkupparaju.com` loads successfully.
- [ ] Confirm GitHub Pages deployment works.
- [ ] Confirm DNS records are documented.
- [ ] Record the current architecture.
- [ ] Create this roadmap in the repository.
- [ ] Create a `docs/` folder.
- [ ] Create `docs/architecture.md`.
- [ ] Create a simple architecture diagram.
- [ ] Record the GitHub Pages URL.
- [ ] Record Cloudflare DNS configuration.

## Deliverable

A documented baseline from which all future changes can be compared.

---

# 6. Phase 1 — Host the Static Website on Azure

## Objective

Move the website runtime from GitHub Pages to Azure while keeping GitHub as the source repository.

## Azure Resources

Suggested naming:

```text
Resource Group:
rg-personal-site-prod

Azure Static Web App:
swa-personal-site-prod
```

## Tasks

- [ ] Create an Azure Resource Group.
- [ ] Create Azure Static Web Apps.
- [ ] Connect the GitHub repository.
- [ ] Deploy the existing static HTML website.
- [ ] Validate the Azure-generated `azurestaticapps.net` URL.
- [ ] Add the custom domain to Azure.
- [ ] Complete DNS validation.
- [ ] Point Cloudflare DNS from GitHub Pages to Azure.
- [ ] Verify `https://jayaprakashkupparaju.com`.
- [ ] Confirm HTTPS.
- [ ] Remove obsolete GitHub Pages custom-domain configuration only after Azure works.
- [ ] Update `docs/architecture.md`.
- [ ] Update `docs/deployment.md`.

## Success Criteria

- Website is served from Azure.
- Source code remains in GitHub.
- HTTPS works.
- Domain remains unchanged.

---

# 7. Phase 2 — Build a Real CI/CD Workflow

## Objective

Stop making production changes directly.

## Desired Flow

```text
Feature Branch
      |
      v
Pull Request
      |
      v
CI Checks
      |
      +-- Validation
      +-- Linting
      +-- Tests
      +-- Security Checks
      +-- Build
      |
      v
Review
      |
      v
Merge to main
      |
      v
Production Deployment
```

## Tasks

- [x] Learn Git feature branches.
- [ ] Protect `main`.
- [ ] Require Pull Requests.
- [x] Create `.github/workflows/ci.yml`.
- [x] Validate HTML.
- [x] Add linting.
- [x] Add basic automated tests.
- [x] Add dependency/security scanning where applicable.
- [x] Deploy only after successful CI.
- [ ] Create a GitHub `DEV` environment.
- [ ] Create a GitHub `PROD` environment.
- [x] Store deployment secrets securely.
- [ ] Add deployment approval for production.
- [ ] Practice a rollback.
- [ ] Document the rollback procedure.

## Documentation

Create:

```text
docs/cicd.md
runbooks/deployment-failure.md
```

## Success Criteria

A normal website update follows:

```text
branch → commit → push → PR → CI → approval → merge → deployment
```

---

# 8. Phase 3 — Infrastructure as Code

## Objective

Create Azure resources using Terraform rather than manually.

## Skills

- Terraform providers
- Resources
- Variables
- Outputs
- State
- Modules
- Remote state
- Plan/apply workflow

## Tasks

- [ ] Install Terraform.
- [ ] Create `infrastructure/terraform/`.
- [ ] Configure the Azure provider.
- [ ] Represent the Resource Group in Terraform.
- [ ] Represent the Static Web App where appropriate.
- [ ] Add Log Analytics.
- [ ] Add Application Insights.
- [ ] Add monitoring resources.
- [ ] Run `terraform fmt`.
- [ ] Run `terraform validate`.
- [ ] Run `terraform plan`.
- [ ] Review changes before `apply`.
- [ ] Configure remote Terraform state.
- [ ] Protect production applies.
- [ ] Add Terraform checks to Pull Requests.

## CI Flow

```text
Pull Request
    |
terraform fmt
    |
terraform validate
    |
terraform plan
    |
Review
    |
Merge
    |
terraform apply
```

## Success Criteria

A new environment can be recreated primarily from source-controlled infrastructure code.

---

# 9. Phase 4 — Observability Foundation

## Objective

Learn how to understand system behavior from telemetry rather than logging into servers and guessing.

## Learn the Three Major Signals

```text
Metrics
Logs
Traces
```

## Azure Stack

- Azure Monitor
- Application Insights
- Log Analytics
- KQL

## Open Standards

- OpenTelemetry

## Tasks

- [ ] Create Application Insights.
- [ ] Create a Log Analytics workspace.
- [ ] Understand request telemetry.
- [ ] Understand dependency telemetry.
- [ ] Understand exception telemetry.
- [ ] Learn basic KQL.
- [ ] Build a dashboard.
- [ ] Add deployment information to dashboards where possible.
- [ ] Create an availability test.
- [ ] Capture baseline request latency.
- [ ] Capture baseline error rate.
- [ ] Capture baseline availability.

## KQL Exercises

Count requests:

```kusto
requests
| summarize count()
```

Requests by status:

```kusto
requests
| summarize count() by resultCode
```

Requests over time:

```kusto
requests
| summarize Requests=count() by bin(timestamp, 5m)
```

Average request duration:

```kusto
requests
| summarize AvgDuration=avg(duration) by bin(timestamp, 5m)
```

## Documentation

Create:

```text
docs/monitoring.md
```

---

# 10. Phase 5 — SLIs, SLOs and Error Budgets

## Objective

Move from "the website should be reliable" to measurable reliability objectives.

## Initial SLIs

### Availability

```text
Successful requests
------------------- × 100
Total requests
```

### Latency

Measure P50, P95 and P99 request latency.

### Error Rate

```text
Failed requests
--------------- × 100
Total requests
```

## Initial SLOs

Start with reasonable laboratory targets:

```text
Availability: 99.9%
Latency:      95% of requests < 500 ms
Error rate:   < 1% HTTP 5xx
```

## Error Budget

For a 99.9% availability SLO:

```text
100% - 99.9% = 0.1% error budget
```

Approximately 43 minutes per 30-day month.

## Tasks

- [ ] Define availability SLI.
- [ ] Define latency SLI.
- [ ] Define error-rate SLI.
- [ ] Define 30-day SLOs.
- [ ] Calculate the error budget.
- [ ] Build an SLO dashboard.
- [ ] Track remaining error budget.
- [ ] Document what happens when the error budget is exhausted.
- [ ] Review SLOs monthly.

## Documentation

Create:

```text
docs/slo.md
docs/error-budget-policy.md
```

---

# 11. Phase 6 — Add a Backend API

## Objective

Create a more realistic workload with dependencies, latency, failures and telemetry.

## Suggested Initial Endpoints

```text
GET /api/health
GET /api/projects
GET /api/blogs
```

## Initial Hosting

Azure Functions.

## Architecture

```text
Browser
   |
   +---- Static Website
   |
   +---- API
            |
            v
      Azure Functions
            |
            v
      Application Insights
```

## Tasks

- [ ] Create a small API.
- [ ] Add `/api/health`.
- [ ] Deploy to Azure Functions.
- [ ] Call the API from the website.
- [ ] Instrument the API.
- [ ] Generate controlled HTTP 500 errors.
- [ ] Generate artificial latency.
- [ ] Observe telemetry.
- [ ] Create alerts.

---

# 12. Phase 7 — Docker

## Objective

Learn container fundamentals before Kubernetes.

## Concepts

- Image
- Container
- Dockerfile
- Layers
- Ports
- Environment variables
- Health checks
- Container registry
- Image tags

## Tasks

- [ ] Install Docker.
- [ ] Create a Dockerfile for the API.
- [ ] Build locally.
- [ ] Run locally.
- [ ] Test the health endpoint.
- [ ] Use environment variables.
- [ ] Add a container health check.
- [ ] Create Azure Container Registry (ACR).
- [ ] Build container in CI.
- [ ] Push to ACR.
- [ ] Tag images with immutable versions.

## Pipeline

```text
GitHub
   |
   v
CI
   |
   v
Docker Build
   |
   v
Tests
   |
   v
Azure Container Registry
```

---

# 13. Phase 8 — Azure Container Apps

## Objective

Operate the container in Azure before introducing full Kubernetes complexity.

## Tasks

- [ ] Deploy API container to Azure Container Apps.
- [ ] Configure ingress.
- [ ] Configure environment variables.
- [ ] Configure Managed Identity.
- [ ] Configure scaling.
- [ ] Send logs to Log Analytics.
- [ ] Monitor revision deployments.
- [ ] Practice rollback between revisions.

## Why This Phase Matters

It separates learning container operations from learning Kubernetes itself.

---

# 14. Phase 9 — Kubernetes Fundamentals

## Objective

Learn Kubernetes locally before paying for a production-like AKS cluster.

## Suggested Local Options

- Docker Desktop Kubernetes
- kind
- minikube

## Learn in This Order

1. Pod
2. Deployment
3. ReplicaSet
4. Service
5. Namespace
6. ConfigMap
7. Secret
8. Ingress
9. Requests / Limits
10. Liveness Probe
11. Readiness Probe
12. Startup Probe
13. Horizontal Pod Autoscaler
14. Persistent Volumes
15. Nodes and scheduling

## Tasks

- [ ] Deploy the API into local Kubernetes.
- [ ] Scale replicas.
- [ ] Delete a pod.
- [ ] Observe Kubernetes recreate it.
- [ ] Configure readiness checks.
- [ ] Configure liveness checks.
- [ ] Inject bad configuration.
- [ ] Investigate `CrashLoopBackOff`.
- [ ] Inspect events.
- [ ] Inspect logs.
- [ ] Use `kubectl describe`.
- [ ] Use ConfigMaps.
- [ ] Use Secrets.

---

# 15. Phase 10 — AKS

## Objective

Move the Kubernetes workload to Azure Kubernetes Service.

## Architecture

```text
Internet
   |
   v
Ingress
   |
   v
AKS Service
   |
   v
Deployment
   |
   +-- Pod
   +-- Pod
   +-- Pod
```

## Tasks

- [ ] Create AKS using Terraform.
- [ ] Integrate ACR.
- [ ] Deploy the application.
- [ ] Configure namespaces.
- [ ] Configure CPU requests.
- [ ] Configure memory requests.
- [ ] Configure CPU limits.
- [ ] Configure memory limits.
- [ ] Configure readiness probe.
- [ ] Configure liveness probe.
- [ ] Configure startup probe.
- [ ] Configure ingress.
- [ ] Configure TLS.
- [ ] Configure autoscaling.
- [ ] Enable Azure Monitor integration.
- [ ] Study node pools.
- [ ] Study Kubernetes RBAC.
- [ ] Study Managed Identity / Workload Identity.

---

# 16. Phase 11 — Kubernetes Reliability Exercises

## Exercise 1 — Pod Failure

```bash
kubectl delete pod <pod-name>
```

Observe:

- Detection
- Traffic impact
- Pod recreation
- Recovery time

## Exercise 2 — Bad Deployment

Deploy an invalid version.

Observe:

- Readiness behavior
- Error rates
- Rollout status
- Rollback process

## Exercise 3 — Resource Pressure

Create CPU or memory pressure.

Observe:

- CPU usage
- throttling
- OOMKilled events
- scaling
- latency

## Exercise 4 — Dependency Failure

Make an external dependency unavailable.

Observe:

- timeouts
- retries
- cascading failures
- alerts

Document each exercise.

---

# 17. Phase 12 — Prometheus, Grafana and OpenTelemetry

## Objective

Learn observability technologies that are portable beyond Azure.

## Skills

- Prometheus metrics
- PromQL
- Grafana dashboards
- OpenTelemetry SDK
- OpenTelemetry Collector
- Distributed tracing

## Tasks

- [ ] Add application metrics.
- [ ] Understand counters.
- [ ] Understand gauges.
- [ ] Understand histograms.
- [ ] Export metrics.
- [ ] Build Grafana dashboards.
- [ ] Learn basic PromQL.
- [ ] Instrument the API with OpenTelemetry.
- [ ] Trace requests across components.
- [ ] Correlate logs, metrics and traces.

---

# 18. Phase 13 — Alerting

## Objective

Create alerts that indicate customer impact rather than only infrastructure activity.

## Avoid

```text
CPU > 50%
```

as the only type of alert.

## Prefer

```text
HTTP 5xx rate elevated
P95 latency above SLO
Availability below SLO
Error-budget burn rate too high
No healthy replicas
Deployment failed
```

## Tasks

- [ ] Create availability alert.
- [ ] Create latency alert.
- [ ] Create error-rate alert.
- [ ] Create failed-deployment alert.
- [ ] Create AKS health alert.
- [ ] Associate each actionable alert with a runbook.
- [ ] Reduce noisy alerts.
- [ ] Add severity levels.

---

# 19. Phase 14 — Incident Management

## Objective

Operate failures like a real production incident.

## Incident Metrics

Track:

- MTTD — Mean Time to Detect
- MTTA — Mean Time to Acknowledge
- MTTR — Mean Time to Recover/Resolve

## Incident Template

```markdown
# Incident INC-001

## Summary

## Customer Impact

## Detection

## Timeline

## Investigation

## Root Cause

## Mitigation

## Resolution

## What Went Well

## What Went Poorly

## Action Items
```

## Tasks

- [ ] Create the first controlled incident.
- [ ] Record detection time.
- [ ] Record acknowledgement time.
- [ ] Record mitigation time.
- [ ] Record resolution time.
- [ ] Calculate MTTR.
- [ ] Produce a blameless postmortem.
- [ ] Convert lessons into action items.

## Repository Location

```text
incidents/INC-001-*.md
```

---

# 20. Phase 15 — Runbooks

## Objective

Make troubleshooting repeatable.

Create:

```text
runbooks/
├── api-500-errors.md
├── high-latency.md
├── pod-crashloop.md
├── deployment-failure.md
├── dns-failure.md
└── certificate-failure.md
```

## Example — CrashLoopBackOff

```text
1. Check pod status.
2. Describe the pod.
3. Review events.
4. Review current logs.
5. Review previous container logs.
6. Check recent deployments.
7. Check ConfigMaps.
8. Check secrets.
9. Check resource limits.
10. Roll back if required.
```

## Success Criteria

Every important alert links to a documented response procedure.

---

# 21. Phase 16 — Azure SRE Agent

## Objective

Introduce AI-assisted operations after sufficient observability and documentation exist.

## Inputs to Connect

Where supported and appropriate:

- Azure resources
- Application Insights
- Log Analytics
- deployment information
- GitHub/source repository
- architecture documents
- runbooks
- incident records

## Initial Safety Principle

Start with:

```text
Read-only investigation
```

Do not give automated write/remediation permissions until investigations are trusted.

## Tasks

- [ ] Create an Azure SRE Agent for the lab.
- [ ] Grant least-privilege read access.
- [ ] Connect Azure resources.
- [ ] Connect observability data.
- [ ] Provide architecture documentation.
- [ ] Provide runbooks.
- [ ] Test an investigation of HTTP 500 errors.
- [ ] Test an investigation of latency.
- [ ] Test an AKS failure investigation.
- [ ] Compare AI conclusions to your own investigation.
- [ ] Document false positives/incorrect conclusions.

---

# 22. Phase 17 — SRE Agent Skills

## Objective

Create reusable operational expertise.

Suggested structure:

```text
sre-agent/
└── skills/
    └── aks-troubleshooting/
        └── SKILL.md
```

## AKS Troubleshooting Skill Flow

```text
1. Check cluster status.
2. Check node status.
3. Check namespace health.
4. Check deployments.
5. Check pod states.
6. Review Kubernetes events.
7. Review container logs.
8. Check CPU/memory.
9. Check recent releases.
10. Check ingress/service health.
11. Check downstream dependencies.
12. Produce probable root cause.
13. Recommend mitigation.
```

## Tasks

- [ ] Create first `SKILL.md`.
- [ ] Keep tools read-only initially.
- [ ] Test skill against a known failure.
- [ ] Compare agent output with runbook.
- [ ] Improve instructions based on gaps.

---

# 23. Phase 18 — AI-Assisted Incident Workflow

## Target Flow

```text
Azure Monitor Alert
        |
        v
Azure SRE Agent
        |
        v
Investigation
        |
        v
Root Cause Hypothesis
        |
        v
Recommended Execution Plan
        |
        v
Human Approval
        |
        v
Mitigation
```

## Tasks

- [ ] Trigger a controlled alert.
- [ ] Let SRE Agent investigate.
- [ ] Review evidence.
- [ ] Require human approval for changes.
- [ ] Execute approved remediation.
- [ ] Record time saved.
- [ ] Document agent accuracy.

---

# 24. Phase 19 — Scheduled Operational Automation

## Objective

Reduce repetitive operational toil.

Create a daily or weekly health review covering:

```text
Website availability
HTTP errors
Latency
Failed deployments
AKS health
Pod restarts
Resource utilization
SLO status
Error budget
Cost anomalies
```

## Desired Output

A concise operational health report with:

- Current status
- New incidents
- SLO risks
- deployment changes
- unusual telemetry
- recommended actions

---

# 25. Phase 20 — Chaos Engineering

## Objective

Validate that reliability mechanisms actually work.

Start with controlled, reversible failures.

## Failure Experiments

1. Delete a pod.
2. Break readiness.
3. Deploy a bad container.
4. Increase CPU usage.
5. Increase memory usage.
6. Introduce dependency latency.
7. Make an API dependency unavailable.
8. Break DNS in a lab environment.
9. Test certificate-related failure.
10. Simulate node failure where practical.

Azure Chaos Studio can be evaluated later for Azure-native experiments.

## For Every Experiment Record

```text
Hypothesis
Failure injected
Expected behavior
Actual behavior
Detection time
Alert behavior
Customer impact
Recovery behavior
SLO impact
Action items
```

---

# 26. Phase 21 — Game Days

## Objective

Practice end-to-end incident response.

Example:

```text
14:00  Begin test
14:03  Inject application failure
14:04  Error rate increases
14:05  Azure Monitor alert fires
14:06  Incident acknowledged
14:07  SRE Agent begins investigation
14:10  Root cause identified
14:12  Rollback executed
14:14  Service restored
14:20  Postmortem begins
```

## Review

- Was the failure detected?
- Was the alert actionable?
- Did the dashboard help?
- Was telemetry missing?
- Did the runbook work?
- Did the SRE Agent help?
- Was remediation safe?
- What should be automated next?

---

# 27. Phase 22 — GitOps

## Objective

Move Kubernetes deployment reconciliation to Git.

Evaluate:

- Argo CD
- Flux

## Target Model

```text
Git
 |
 v
GitOps Controller
 |
 v
AKS
```

## Skills

- Desired state
- Continuous reconciliation
- Drift detection
- Declarative delivery
- Rollback through Git
- Environment promotion

---

# 28. Phase 23 — DevSecOps and Platform Security

## Topics

- Secret scanning
- SAST
- Dependency scanning
- Container image scanning
- RBAC
- Azure Managed Identity
- AKS Workload Identity
- Key Vault
- Network Policies
- TLS
- Least privilege
- Supply-chain security
- SBOM awareness

## Tasks

- [ ] Remove plaintext secrets.
- [ ] Use GitHub/Azure secret stores appropriately.
- [ ] Prefer Managed Identity.
- [ ] Configure RBAC.
- [ ] Scan dependencies.
- [ ] Scan images.
- [ ] Enable secret scanning.
- [ ] Review container base images.
- [ ] Document threat considerations.

---

# 29. Phase 24 — Reliability Architecture & Disaster Recovery

Only perform this after the single-region system is mature.

## Learn

- Availability Zones
- Regional resilience
- RTO
- RPO
- Health probes
- Failover
- Backup/restore
- Multi-region routing

## Possible Architecture

```text
                    Azure Front Door
                          |
              +-----------+-----------+
              |                       |
              v                       v
          Region A                 Region B
             |                        |
             v                        v
            AKS                      AKS
```

## Tasks

- [ ] Define RTO.
- [ ] Define RPO.
- [ ] Document failure scenarios.
- [ ] Test backup/restore where relevant.
- [ ] Evaluate Azure Front Door.
- [ ] Evaluate zone redundancy.
- [ ] Conduct a failover exercise if cost permits.

---

# 30. Phase 25 — FinOps / Cost Engineering

## Objective

Understand reliability/cost tradeoffs.

## Track

- AKS compute
- Container Registry
- Log Analytics ingestion
- Application Insights
- data retention
- bandwidth
- Azure SRE Agent usage
- Azure Static Web Apps
- Azure Functions / Container Apps

## Tasks

- [ ] Create an Azure budget.
- [ ] Configure cost alerts.
- [ ] Review spending weekly during experiments.
- [ ] Tag Azure resources.
- [ ] Remove unused resources.
- [ ] Shut down expensive lab components when possible.
- [ ] Document cost per architecture stage.

## Engineering Question

> What reliability level can this platform achieve without unnecessary infrastructure cost?

---

# 31. Suggested 16-Week Execution Schedule

This schedule is flexible. The goal is progress, not speed.

| Week | Focus | Deliverable |
|---|---|---|
| 1 | Azure Static Web Apps | Website hosted in Azure |
| 2 | Git/GitHub workflow | PR-based development |
| 3 | GitHub Actions | CI/CD pipeline |
| 4 | Terraform | Basic Azure IaC |
| 5 | Azure Monitor | Monitoring dashboard |
| 6 | SLI/SLO | SLO and error-budget document |
| 7 | Backend API | Azure Function API |
| 8 | Docker | Containerized API |
| 9 | Container Apps | Azure container deployment |
| 10 | Kubernetes locally | Working manifests |
| 11 | AKS | API running in AKS |
| 12 | Kubernetes reliability | Probes, limits, scaling |
| 13 | Prometheus/OpenTelemetry | Improved observability |
| 14 | Incidents/runbooks | First Game Day + postmortem |
| 15 | Azure SRE Agent | AI-assisted investigation |
| 16 | Chaos/GitOps/Security | Advanced reliability experiment |

Do not hesitate to spend two or more weeks on a phase.

---

# 32. Definition of Done for Each Phase

Every phase should produce five things:

## 1. Working Implementation

Something runs.

## 2. Source Code

Everything possible is stored in Git.

## 3. Automation

Repeatable operations are scripted/pipelined.

## 4. Observability

You can understand whether the component is healthy.

## 5. Documentation

Someone else could understand and operate what you built.

Use this checklist:

```text
[ ] Implementation completed
[ ] Code committed
[ ] CI/CD updated
[ ] Monitoring added
[ ] Failure tested
[ ] Runbook updated
[ ] Architecture updated
[ ] Lessons documented
```

---

# 33. Core SRE Concepts to Master

## Reliability

- Availability
- Durability
- latency
- error rates
- redundancy
- graceful degradation

## Service Management

- SLI
- SLO
- SLA
- Error Budgets

## Observability

- Metrics
- Logs
- Traces
- dashboards
- telemetry correlation

## Incident Response

- Detection
- triage
- mitigation
- resolution
- postmortem
- follow-up actions

## Automation

- CI/CD
- Infrastructure as Code
- auto-remediation
- scheduled operational checks

## Kubernetes

- scheduling
- health probes
- scaling
- resource management
- deployments
- networking
- security

## Resilience

- retries
- timeouts
- circuit breakers
- redundancy
- failover
- disaster recovery

## Operational Excellence

- runbooks
- change management
- rollback
- capacity planning
- toil reduction

---

# 34. Skills Matrix

Use this to track progress.

| Skill | Beginner | Working Knowledge | Comfortable | Can Explain/Design |
|---|---|---|---|---|
| Git | [ ] | [ ] | [ ] | [ ] |
| GitHub Actions | [ ] | [ ] | [ ] | [ ] |
| Azure | [ ] | [ ] | [ ] | [ ] |
| Terraform | [ ] | [ ] | [ ] | [ ] |
| Linux | [ ] | [ ] | [ ] | [ ] |
| Networking/DNS | [ ] | [ ] | [ ] | [ ] |
| HTTP/TLS | [ ] | [ ] | [ ] | [ ] |
| Docker | [ ] | [ ] | [ ] | [ ] |
| Kubernetes | [ ] | [ ] | [ ] | [ ] |
| AKS | [ ] | [ ] | [ ] | [ ] |
| Azure Monitor | [ ] | [ ] | [ ] | [ ] |
| Application Insights | [ ] | [ ] | [ ] | [ ] |
| Log Analytics/KQL | [ ] | [ ] | [ ] | [ ] |
| OpenTelemetry | [ ] | [ ] | [ ] | [ ] |
| Prometheus | [ ] | [ ] | [ ] | [ ] |
| Grafana | [ ] | [ ] | [ ] | [ ] |
| SLI/SLO/Error Budgets | [ ] | [ ] | [ ] | [ ] |
| Alerting | [ ] | [ ] | [ ] | [ ] |
| Incident Management | [ ] | [ ] | [ ] | [ ] |
| Postmortems | [ ] | [ ] | [ ] | [ ] |
| Chaos Engineering | [ ] | [ ] | [ ] | [ ] |
| GitOps | [ ] | [ ] | [ ] | [ ] |
| DevSecOps | [ ] | [ ] | [ ] | [ ] |
| Azure SRE Agent | [ ] | [ ] | [ ] | [ ] |
| AI-assisted Operations | [ ] | [ ] | [ ] | [ ] |
| FinOps | [ ] | [ ] | [ ] | [ ] |

---

# 35. Portfolio / Blog Documentation Strategy

Every major phase can become a short article on the website.

Suggested series:

1. **Building My Personal Website as an SRE Lab**
2. **Moving a Static Website from GitHub Pages to Azure**
3. **Building CI/CD with GitHub Actions**
4. **Managing Azure Infrastructure with Terraform**
5. **Adding Observability with Application Insights**
6. **Defining My First SLI, SLO and Error Budget**
7. **Containerizing My Website API with Docker**
8. **Deploying My First Workload to Kubernetes**
9. **Running the API on AKS**
10. **Implementing Kubernetes Health Probes and Autoscaling**
11. **Learning Prometheus, Grafana and OpenTelemetry**
12. **Running My First Production-Style Incident Exercise**
13. **Writing Runbooks and Postmortems**
14. **Using Azure SRE Agent for Incident Investigation**
15. **Building an AKS Troubleshooting SRE Skill**
16. **Running Chaos Experiments Against My Personal Platform**
17. **Implementing GitOps with Argo CD**
18. **What I Learned Building a Production-Style SRE Lab**

For each article include:

```text
Problem
Architecture
Implementation
What failed
How I investigated
What I learned
What I would improve
```

---

# 36. Cost Control Rules

AKS and logging can create unnecessary costs if left running.

Follow these rules:

- Create an Azure monthly budget before AKS work.
- Use the smallest practical development resources.
- Use local Kubernetes first.
- Use Azure Container Apps before AKS.
- Delete unused resources.
- Avoid multi-region infrastructure until needed.
- Watch Log Analytics ingestion.
- Keep telemetry retention appropriate for a lab.
- Use tags such as:

```text
Environment = Lab
Project     = PersonalWebsite
Owner       = JP
ManagedBy   = Terraform
```

---

# 37. What Not to Do

Avoid these common mistakes:

- Do not start with AKS just because Kubernetes is popular.
- Do not create multi-region architecture before understanding single-region failures.
- Do not manually deploy production changes.
- Do not store secrets in Git.
- Do not create alerts for every metric.
- Do not use AI remediation with broad write permissions initially.
- Do not add observability after the application is complete; build it progressively.
- Do not treat dashboards as observability by themselves.
- Do not measure reliability only by CPU and memory.
- Do not skip incident/postmortem exercises.
- Do not leave expensive Azure lab resources running without a learning purpose.

---

# 38. Final Target State

At maturity, the personal website project should demonstrate:

```text
GitHub
  |
  +-- Application Code
  +-- Terraform
  +-- Kubernetes Manifests
  +-- Runbooks
  +-- SLOs
  +-- Incident Records
  +-- SRE Agent Skills
  |
  v
CI/CD
  |
  +-- Validate
  +-- Test
  +-- Security Scan
  +-- Terraform Plan
  +-- Build Containers
  +-- Deploy
  |
  v
Azure
  |
  +-- Static Web Apps
  +-- Container Registry
  +-- AKS
  +-- Application Insights
  +-- Log Analytics
  +-- Azure Monitor
  +-- Managed Identity
  +-- Azure SRE Agent
  |
  v
Observability & Reliability
  |
  +-- SLI/SLO
  +-- Error Budgets
  +-- Alerts
  +-- Dashboards
  +-- OpenTelemetry
  +-- Prometheus
  +-- Grafana
  |
  v
Operations
  |
  +-- Incident Management
  +-- Runbooks
  +-- Postmortems
  +-- SRE Agent Investigations
  +-- Chaos Testing
  +-- GitOps
```

---

# 39. Immediate Next Action

The current website already exists in GitHub and is hosted through GitHub Pages.

The next practical milestone is:

> **Deploy the existing static website to Azure Static Web Apps while keeping GitHub as the source repository.**

Do not remove GitHub Pages until the Azure-hosted version has been successfully validated.

## Phase 1 Execution Checklist

- [ ] Log in to Azure Portal.
- [ ] Create `rg-personal-site-prod`.
- [ ] Create an Azure Static Web App.
- [ ] Connect GitHub.
- [ ] Select the personal website repository.
- [ ] Deploy the current static site.
- [ ] Open the generated Azure URL.
- [ ] Verify the page.
- [ ] Inspect the automatically-created deployment workflow.
- [ ] Make a small test change through GitHub.
- [ ] Confirm automatic deployment.
- [ ] Add the custom domain.
- [ ] Update Cloudflare DNS.
- [ ] Verify HTTPS.
- [ ] Update `docs/architecture.md`.
- [ ] Commit the documentation.

---

# 40. Progress Log

Use this section to maintain a simple record.

| Date | Phase | Change | Result | Next Step |
|---|---|---|---|---|
| | Phase 0 | Roadmap created | | Deploy to Azure |
| | | | | |

---

## Useful Official References

Keep official documentation as the primary reference when implementing each phase:

- Azure Static Web Apps documentation
- GitHub Actions documentation
- Terraform AzureRM provider documentation
- Azure Monitor and Application Insights documentation
- OpenTelemetry documentation
- Kubernetes documentation
- Azure Kubernetes Service documentation
- Prometheus documentation
- Grafana documentation
- Google SRE Book / SRE Workbook
- Azure SRE Agent documentation
- Azure Chaos Studio documentation
- Argo CD / Flux documentation

---

## Final Reminder

The objective is not to complete the largest architecture.

The objective is to be able to explain:

> **Why the architecture exists, how it is deployed, how it is monitored, how failure is detected, how it is recovered, how reliability is measured, and how repetitive operational work is automated.**

That is the core of this SRE lab.
