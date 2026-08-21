# jayaprakashkupparaju.com

Personal website and hands-on **Site Reliability Engineering (SRE) learning lab**.

The website is intended to serve two purposes:

1. A personal website for documenting my career, technical projects, Toastmasters/public-speaking journey, running, and blog posts.
2. A practical engineering environment for learning and demonstrating modern SRE, Azure, DevOps, automation, Kubernetes, observability, and AI-assisted operations.

**Website:** `https://jayaprakashkupparaju.com`

---

## Project Philosophy

This project is not only about building a website.

The goal is to operate a small real-world system and continuously improve its reliability using the same engineering practices used for production platforms.

The learning cycle is:

> **Build → Deploy → Observe → Break → Detect → Investigate → Recover → Automate → Document**

Each stage of the project will introduce another layer of production engineering.

---

## Current Status

The project currently consists of a static HTML website hosted using **GitHub Pages**, with the custom domain managed through **Cloudflare DNS**.

```text
User Browser
     |
     v
jayaprakashkupparaju.com
     |
     v
Cloudflare DNS
     |
     v
GitHub Pages
     |
     v
GitHub Repository
     |
     v
index.html
```

### Current Stack

| Area | Technology |
|---|---|
| Domain | jayaprakashkupparaju.com |
| Registrar | Cloudflare Registrar |
| DNS | Cloudflare DNS |
| Source Control | GitHub |
| Hosting | GitHub Pages |
| Frontend | HTML / CSS |
| CI/CD | GitHub Pages built-in deployment |
| Infrastructure as Code | Planned |
| Observability | Planned |
| Containers | Planned |
| Kubernetes | Planned |
| AI-assisted SRE | Planned |

---

## Website Content

The website will contain several areas representing both professional and personal development.

### Career

Professional experience, skills, certifications, technologies, and career-related content.

### Projects

Technical projects involving:

- Azure
- DevOps
- CI/CD
- Automation
- SRE
- AI Agents
- Infrastructure as Code
- Kubernetes

### Toastmasters

Public-speaking experiences, Toastmasters speeches, communication lessons, and reflections.

### Running

Running progress, race experiences, training lessons, and personal milestones.

### Blog

Articles and notes covering:

- Technology
- AI
- Cloud
- DevOps
- SRE
- Career development
- Continuous learning
- Communication
- Running

---

## SRE Learning Objectives

This repository will gradually become a hands-on lab covering:

### Cloud

- Microsoft Azure
- Azure Static Web Apps
- Azure Functions
- Azure Container Apps
- Azure Kubernetes Service (AKS)
- Azure Container Registry
- Azure Front Door

### DevOps

- Git
- GitHub
- Pull Requests
- GitHub Actions
- CI/CD
- Environment promotion
- Deployment approvals
- Rollbacks

### Infrastructure as Code

- Terraform
- Azure resource provisioning
- Remote state
- Infrastructure CI/CD
- Environment management

### Containers & Kubernetes

- Docker
- Container registries
- Kubernetes
- AKS
- Pods
- Deployments
- Services
- Ingress
- ConfigMaps
- Secrets
- Health probes
- Resource requests and limits
- Horizontal Pod Autoscaling

### Observability

- Azure Monitor
- Application Insights
- Log Analytics
- KQL
- OpenTelemetry
- Prometheus
- Grafana
- Metrics
- Logs
- Distributed tracing

### Reliability Engineering

- SLIs
- SLOs
- SLAs
- Error budgets
- Availability
- Latency
- Error rates
- Capacity planning
- Autoscaling
- Resilience testing

### Incident Management

- Monitoring
- Alerting
- Incident detection
- Investigation
- Mitigation
- MTTA / MTTD / MTTR
- Runbooks
- Root Cause Analysis
- Blameless postmortems
- Game Days

### AI-Assisted SRE

- Azure SRE Agent
- AI-assisted incident investigation
- Operational knowledge
- Runbooks
- `SKILL.md`
- AI-assisted troubleshooting
- Human-approved remediation
- Operational automation

### Advanced Topics

- Chaos Engineering
- GitOps
- Argo CD / Flux
- DevSecOps
- Managed Identity
- RBAC
- Disaster Recovery
- RTO / RPO
- FinOps

---

## Architecture Evolution

The project will intentionally evolve in stages.

```text
GitHub Pages
     |
     v
Azure Static Web Apps
     |
     v
GitHub Actions CI/CD
     |
     v
Terraform
     |
     v
Azure Monitor + Application Insights
     |
     v
SLIs / SLOs / Error Budgets
     |
     v
Backend API
     |
     v
Docker
     |
     v
Azure Container Apps
     |
     v
Kubernetes
     |
     v
AKS
     |
     v
OpenTelemetry / Prometheus / Grafana
     |
     v
Incident Management
     |
     v
Azure SRE Agent
     |
     v
Chaos Engineering
     |
     v
GitOps
```

The intention is to understand each layer before introducing the next one.

---

## Repository Structure

The repository will evolve as the project grows.

```text
jayaprakashkupparaju.com/
|
├── README.md
├── SRE_LEARNING_ROADMAP.md
├── index.html
├── profile.jpg
|
├── docs/
│   └── architecture.md
|
├── src/
│   ├── website/
│   └── api/
|
├── infrastructure/
│   ├── terraform/
│   └── kubernetes/
|
├── .github/
│   └── workflows/
|
├── observability/
│   ├── dashboards/
│   ├── alerts/
│   ├── prometheus/
│   ├── opentelemetry/
│   └── queries/
|
├── sre/
│   ├── slos/
│   ├── runbooks/
│   ├── incidents/
│   └── game-days/
|
├── sre-agent/
│   ├── knowledge/
│   └── skills/
|
├── chaos/
│   ├── experiments/
│   └── results/
|
├── scripts/
└── tests/
```

Folders will be introduced only when the corresponding phase begins.

---

## Project Roadmap

The detailed execution plan is maintained in:

[`SRE_LEARNING_ROADMAP.md`](SRE_LEARNING_ROADMAP.md)

The roadmap covers the project from the initial static website through advanced SRE topics.

### Major Phases

- [x] Register custom domain
- [x] Create static website
- [x] Create GitHub repository
- [x] Configure GitHub Pages
- [x] Configure Cloudflare DNS
- [x] Document baseline architecture
- [ ] Deploy to Azure Static Web Apps
- [ ] Implement GitHub Actions CI/CD
- [ ] Implement Terraform
- [ ] Add Azure observability
- [ ] Define SLIs, SLOs, and error budgets
- [ ] Build backend API
- [ ] Containerize API with Docker
- [ ] Deploy to Azure Container Apps
- [ ] Learn Kubernetes locally
- [ ] Deploy workload to AKS
- [ ] Implement Kubernetes reliability practices
- [ ] Add OpenTelemetry
- [ ] Learn Prometheus and Grafana
- [ ] Implement production-style alerting
- [ ] Create runbooks
- [ ] Run incident simulations
- [ ] Configure Azure SRE Agent
- [ ] Create SRE Agent skills
- [ ] Run chaos experiments
- [ ] Implement GitOps
- [ ] Practice disaster recovery
- [ ] Track reliability versus cost

---

## Documentation

Architecture documentation:

[`docs/architecture.md`](docs/architecture.md)

Repository security and sensitive-information policy:

[`SECURITY.md`](SECURITY.md)

Detailed SRE learning roadmap:

[`SRE_LEARNING_ROADMAP.md`](SRE_LEARNING_ROADMAP.md)

As the project grows, documentation will also cover:

```text
docs/
├── architecture/
├── deployment/
├── monitoring/
├── security/
├── disaster-recovery/
└── cost/
```

---

## Reliability Goals

Once observability is implemented, initial laboratory SLOs will include:

| SLI | Initial Target |
|---|---:|
| Availability | 99.9% |
| Request latency | 95% under 500 ms |
| HTTP 5xx error rate | Less than 1% |

These targets will be refined based on actual telemetry and architecture.

---

## Engineering Principles

The project follows several operating principles:

- Everything possible should be stored in source control.
- Production changes should eventually go through Pull Requests.
- Repeatable deployments should be automated.
- Infrastructure should be managed through code.
- Important services should have measurable reliability objectives.
- Actionable alerts should have runbooks.
- Failures should be intentionally tested.
- Incidents should produce learning rather than blame.
- AI-assisted remediation should begin with read-only investigation and human approval.
- Security should follow least privilege.
- Reliability improvements should consider cost.

---

## Current Milestone

### Phase 1 — Azure Static Web Apps

The next milestone is to deploy the existing static website to Azure Static Web Apps while continuing to use GitHub as the source repository.

The existing GitHub Pages site will remain operational until the Azure-hosted version is validated.

Target flow:

```text
Developer
     |
     v
GitHub
     |
     v
GitHub Actions
     |
     v
Azure Static Web Apps
     |
     v
Cloudflare DNS
     |
     v
jayaprakashkupparaju.com
```

---

## Learning Journal

Important implementation decisions, failures, investigations, and lessons will be documented throughout the project.

The objective is not simply to show the final architecture, but to preserve the engineering journey:

> What was built, why it was built, what failed, how it was investigated, what was learned, and what was improved.

---

## Author

**Jayaprakash Kupparaju**

Cloud • DevOps • SRE • Automation • AI

---

## Project Status

🚧 **Active learning project — continuously evolving.**
