# Vista Monte Mar Services Wiki

_Last updated: 2026-04-25_

## Purpose

Infrastructure/deployment repo for Kubernetes via Helm, including app/server deployments and ingress/TLS templates.

## Key Structure

- `helm/Chart.yaml`: chart metadata and dependencies
- `helm/values.template.yaml`: image/env/domain/namespace configuration template
- `helm/templates/app-deployment.yaml`: frontend deployment
- `helm/templates/server-deployment.yaml`: backend deployment
- `helm/templates/app-service.yaml`, `server-service.yaml`: services
- `helm/templates/ingress-web.yaml`, `ingress-websecure.yaml`: ingress
- `helm/templates/letsencrypt-issuer.yaml`: cert-manager issuer template
- `helm/templates/postgres-*.yaml`: PostgreSQL deployment/service/secret/pvc/init SQL
- `helm/install.md`: k3s/helm install and usage notes
- `portainer.sh`: helper script for Portainer install/upgrade
- `k8s/local-stack.yaml`: compose-like local k3s stack manifest (app + server + postgres)
- `k8s/ingress-https.yaml`: domain-based ingress + cert-manager resources for HTTPS
- `k8s/remote-frontend/*`: remote frontend namespace/deployment/service/ingress manifests
- `scripts/setup-k3s-ssh.sh`: SSH key bootstrap for the k3s machine
- `scripts/deploy-frontend-k3s.sh`: frontend image build/import/deploy helper
- `DEPLOYMENT_RUNBOOK.md`: exact, copy-paste deployment commands for this environment

## Chart Behavior

- Chart name: `vista-monte-mar`
- Namespace default: `vista-monte-mar`
- Deploys both workloads:
  - `app` (frontend)
  - `server` (backend)
- Optional PostgreSQL service (`postgres`) for analytics/visitor tracking
- Selects prod/dev images based on `.Values.environment.SPACE`
- Injects SMTP-related vars into backend deployment
- Injects DB vars into backend deployment when Postgres is enabled (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`)

## Important Values (`helm/values.template.yaml`)

- `app.images.prod`, `app.images.dev`
- `server.images.prod`, `server.images.dev`
- `environment.SPACE`
- `environment.SMTP_USER`
- `environment.SMTP_PASS`
- `environment.SEND_TO`
- `postgres.enabled`
- `postgres.image`
- `postgres.auth.database`
- `postgres.auth.user`
- `postgres.auth.password`
- `postgres.storage.size`
- `domain`
- `namespace`

## Local/Cluster Usage

```bash
cd /path/to/vista-monte-mar-services/helm
helm dependency update
helm upgrade --install vmm . -n vista-monte-mar
```

## Remote Frontend Deploy

From the services repo root:

```bash
bash scripts/setup-k3s-ssh.sh 192.168.68.54 <remote-user>
K3S_USER=<remote-user> REMOTE_SUDO_PASSWORD=<sudo-password> bash scripts/deploy-frontend-k3s.sh
```

This path owns the remote frontend rollout to the k3s machine at `192.168.68.54`.

Detailed deployment runbook:

```text
DEPLOYMENT_RUNBOOK.md
```

## Portainer Helper

- Script: `portainer.sh`
- Namespace: `portainer`
- Default NodePort: `30081`

## First Files To Open

1. `helm/values.template.yaml`
2. `helm/templates/app-deployment.yaml`
3. `helm/templates/server-deployment.yaml`
4. `helm/templates/ingress-websecure.yaml`
5. `helm/install.md`
