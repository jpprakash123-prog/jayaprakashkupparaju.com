# Current Architecture

## Overview

The personal website is a static site hosted in production by Azure Static Web
Apps. GitHub remains the source repository and GitHub Actions provides CI,
pull-request previews, approval-gated production deployment, version metadata,
and emergency rollback.

Cloudflare manages public DNS. Both the apex domain and `www` hostname route to
Azure. The previous GitHub Pages configuration remains temporarily available as
a rollback target during the post-cutover observation period.

## Production Request Flow

```text
User browser
     |
     | HTTPS
     v
jayaprakashkupparaju.com or www.jayaprakashkupparaju.com
     |
     | DNS resolution
     v
Cloudflare DNS
     |
     | apex CNAME flattening / www CNAME
     v
Azure Static Web Apps
     |
     v
index.html + profile.jpg + deployment-info.json
```

1. A visitor requests either the apex or `www` HTTPS URL.
2. Cloudflare resolves the hostname to the Azure Static Web Apps hostname.
3. Azure terminates HTTPS using its managed certificate for the custom domain.
4. Azure serves the static production deployment.
5. `/deployment-info.json` identifies the exact content commit and deployment
   that is currently live.

## Domain and DNS

| Area                 | Current state                                          |
| -------------------- | ------------------------------------------------------ |
| Domain               | `jayaprakashkupparaju.com`                             |
| DNS provider         | Cloudflare DNS                                         |
| Apex routing         | CNAME flattening to the Azure Static Web Apps hostname |
| `www` routing        | CNAME to the Azure Static Web Apps hostname            |
| Proxy mode           | DNS only during the initial Azure production period    |
| Ownership validation | `_dnsauth` TXT records for apex and `www`              |
| HTTPS                | Azure Static Web Apps managed certificates             |

The TXT records prove domain ownership and do not route visitor traffic. Their
token values are operational DNS data and are not stored in this repository.

## Delivery Flow

```text
Feature branch
     |
     v
Pull request
     |
     +-- CI validation
     |
     `-- DEV environment -> temporary Azure preview
                              |
                              v
                         review and merge
                              |
                              v
                            main
                              |
                              v
                     PROD approval gate
                              |
                              v
                  Azure production deployment
```

The repository uses these controls:

- `main` is protected and requires the website validation status check.
- Pull requests deploy temporary Azure previews through GitHub `DEV`.
- Merges to `main` start a deployment through GitHub `PROD`.
- A reviewer must approve the `PROD` deployment before its secret is released.
- `DEV` and `PROD` have separate encrypted environment-scoped deployment
  secrets.
- Normal and emergency production deployments share a concurrency group so they
  cannot update production simultaneously.

## Deployment Contents

The build places only public website assets in `dist/`:

```text
dist/
|-- index.html
|-- profile.jpg
`-- deployment-info.json
```

`deployment-info.json` is generated for each Azure deployment and contains:

- the actual website content commit;
- deployment type (`preview`, `production`, or `rollback`);
- GitHub workflow run ID;
- ISO UTC deployment time;
- a human-readable Central Time value with weekday.

It contains no credentials, user identities, account identifiers, or Azure
subscription information.

## Emergency Recovery

The manual emergency workflow can redeploy an exact known-good commit already
contained in `main`. It validates the candidate before requesting `PROD`
approval and publishes rollback-specific version metadata.

An emergency deployment is temporary mitigation. A normal source-revert pull
request must follow so that `main` and production return to the same state. See
[production-rollback.md](../runbooks/production-rollback.md).

## GitHub Pages Fallback

GitHub Pages no longer receives public-domain traffic. During the observation
period, its repository configuration remains available as a rollback option.

The recorded GitHub Pages DNS rollback values are:

```text
A @ -> 185.199.108.153
A @ -> 185.199.109.153
A @ -> 185.199.110.153
A @ -> 185.199.111.153
CNAME www -> <GITHUB_OWNER>.github.io
```

If Azure fails during the observation period, restore these routing records in
Cloudflare. Do not remove unrelated TXT, MX, or email records.

After Azure has remained stable for the agreed observation period, the obsolete
GitHub Pages custom-domain configuration can be removed through a separate,
reviewed change.

## Current Technology Stack

| Area                         | Current technology                                  |
| ---------------------------- | --------------------------------------------------- |
| Domain and DNS               | Cloudflare                                          |
| Source control               | GitHub                                              |
| Hosting                      | Azure Static Web Apps                               |
| Frontend                     | Static HTML and CSS                                 |
| CI/CD                        | GitHub Actions                                      |
| Deployment controls          | GitHub `DEV` and approval-gated `PROD` environments |
| Build provenance             | Public `deployment-info.json`                       |
| Recovery                     | Emergency rollback workflow and documented runbook  |
| Infrastructure as Code       | Not implemented                                     |
| Monitoring and observability | Not implemented                                     |
| Containers and Kubernetes    | Not implemented                                     |

## Architecture Status

- [x] Static website deployed to Azure Static Web Apps.
- [x] Azure-generated HTTPS endpoint validated.
- [x] Apex and `www` custom domains validated in Azure.
- [x] Cloudflare DNS cut over from GitHub Pages to Azure.
- [x] HTTPS, website content, assets, and deployment metadata verified.
- [x] CI, preview, production approval, version tracking, and rollback tested.
- [ ] Complete the post-cutover observation period.
- [ ] Remove obsolete GitHub Pages custom-domain configuration.
- [ ] Manage Azure infrastructure through Terraform.
- [ ] Implement monitoring, observability, SLOs, and error budgets.

## Next Architecture Stage

The next major stage is Infrastructure as Code. The existing Azure resources and
configuration will be represented in Terraform so the environment can be
reviewed, reproduced, and changed through source control rather than manual
operations.
