# Current Architecture

## Overview

The personal website is currently a static website hosted using GitHub Pages.

This document records the current baseline architecture before the website is migrated to Azure and expanded into a hands-on SRE learning environment.

---

## Current Architecture

```text
User Browser
     |
     | HTTPS
     v
jayaprakashkupparaju.com
     |
     | DNS Resolution
     v
Cloudflare DNS
     |
     | A / CNAME Records
     v
GitHub Pages
     |
     v
GitHub Repository
<GITHUB_OWNER>/jayaprakashkupparaju.com
     |
     v
index.html + static assets
```

### Request Flow

1. A visitor enters `https://jayaprakashkupparaju.com`.
2. DNS for the domain is managed by Cloudflare.
3. Cloudflare DNS resolves the domain to GitHub Pages.
4. The browser connects to GitHub Pages.
5. GitHub identifies the configured custom domain.
6. GitHub Pages serves the static website from the repository.

---

## Domain and DNS

**Domain**

`jayaprakashkupparaju.com`

**DNS Provider**

Cloudflare

### Root Domain Records

The root domain currently points to the GitHub Pages IPv4 addresses:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### WWW Record

```text
Type:   CNAME
Name:   www
Target: <GITHUB_OWNER>.github.io
```

These records allow the custom domain to resolve to the GitHub Pages hosting infrastructure.

---

## Source Repository

**Repository**

```text
<GITHUB_OWNER>/jayaprakashkupparaju.com
```

The repository currently contains the static website source code and assets.

Example:

```text
jayaprakashkupparaju.com/
|
├── index.html
├── profile.jpg
├── README.md
├── SRE_LEARNING_ROADMAP.md
└── docs/
    └── architecture.md
```

---

## Hosting

**Current hosting platform:** GitHub Pages

**Production URL:**

`https://jayaprakashkupparaju.com`

GitHub Pages serves the static HTML and related assets from the GitHub repository.

---

## Current Deployment Model

The current deployment process is intentionally simple.

```text
Edit Website
     |
     v
Commit to GitHub
     |
     v
GitHub Repository
     |
     v
GitHub Pages Deployment
     |
     v
Production Website
```

At this stage:

- The website is static.
- Source code is stored in GitHub.
- GitHub Pages hosts the website.
- DNS is managed through Cloudflare.
- There is no custom CI/CD pipeline yet.
- Infrastructure is not yet managed through Infrastructure as Code.
- Application observability has not yet been implemented.
- SLOs and error budgets have not yet been defined.

This represents the baseline against which future SRE improvements will be measured.

---

## Current Technology Stack

| Area | Current Technology |
|---|---|
| Domain | jayaprakashkupparaju.com |
| Domain Registrar | Cloudflare Registrar |
| DNS | Cloudflare DNS |
| Source Control | GitHub |
| Hosting | GitHub Pages |
| Frontend | HTML / CSS |
| CI/CD | GitHub Pages built-in deployment |
| Infrastructure as Code | Not implemented |
| Monitoring | Not implemented |
| Observability | Not implemented |
| Containers | Not implemented |
| Kubernetes | Not implemented |
| SRE Agent | Not implemented |

---

## Target — Phase 1

The next phase will move the hosting layer from GitHub Pages to Azure Static Web Apps.

GitHub will continue to be used as the source-code repository.

```text
Developer
     |
     | git push / Pull Request
     v
GitHub
     |
     | Deployment Workflow
     v
GitHub Actions
     |
     v
Azure Static Web Apps
     ^
     |
Cloudflare DNS
     ^
     |
jayaprakashkupparaju.com
     ^
     |
User Browser
```

The migration should be performed without removing the existing GitHub Pages site until the Azure-hosted version has been tested successfully.

---

## Long-Term SRE Lab Direction

The architecture will evolve gradually as new SRE skills are introduced.

```text
GitHub
   |
   +-- Application Code
   +-- Terraform
   +-- Kubernetes Manifests
   +-- Runbooks
   +-- SLO Definitions
   +-- Incident Records
   +-- SRE Agent Skills
   |
   v
CI/CD
   |
   v
Azure
   |
   +-- Static Web Apps
   +-- Application/API
   +-- Container Registry
   +-- AKS
   +-- Application Insights
   +-- Log Analytics
   +-- Azure Monitor
   +-- Managed Identity
   +-- Azure SRE Agent
   |
   v
Reliability Engineering
   |
   +-- Metrics
   +-- Logs
   +-- Traces
   +-- SLI/SLO
   +-- Error Budgets
   +-- Alerting
   +-- Runbooks
   +-- Incident Response
   +-- Postmortems
   +-- Chaos Testing
   +-- Automation
```

---

## Architecture Evolution

The project should evolve in this order:

```text
GitHub Pages
     |
     v
Azure Static Web Apps
     |
     v
CI/CD
     |
     v
Terraform
     |
     v
Azure Monitor + Application Insights
     |
     v
SLI / SLO / Error Budgets
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
Incident Management + Runbooks
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

---

## Baseline Status

- [x] Custom domain purchased.
- [x] Static website created.
- [x] GitHub repository created.
- [x] GitHub Pages configured.
- [x] Cloudflare DNS configured for GitHub Pages.
- [x] Custom domain connected to GitHub Pages.
- [x] Current architecture documented.
- [ ] Deploy website to Azure Static Web Apps.
- [ ] Implement custom CI/CD.
- [ ] Implement Infrastructure as Code.
- [ ] Implement observability.
- [ ] Define SLOs and error budgets.

---

## Next Step

Proceed to **Phase 1 — Azure Static Web Apps**.

The immediate objective is to deploy the existing static website to Azure while keeping the current GitHub Pages deployment operational until the Azure deployment has been fully validated.
