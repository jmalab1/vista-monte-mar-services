# Production Deployment Runbook

This runbook records the production v2 deployment performed on 2026-05-09.
It intentionally omits secret values, tokens, private keys, and database data.

## Production Facts

- Host: `3.218.9.199`
- SSH user: `ec2-user`
- OS: Amazon Linux 2023
- Runtime: k3s with containerd
- Namespace: `vista-monte-mar`
- kubectl command: `sudo kubectl`
- Public host: `casajadecr.com`
- Ingresses: `app-ingress-web`, `app-ingress-websecure`
- Frontend deployment/container: `app` / `app`
- Backend deployment/container: `server` / `server`
- Database deployment/container: `postgres` / `postgres`
- Existing database secret: `pg-secret` with key `postgres-password`
- Generated first-run auth secret: `server-auth-secret`
- Generated auth keys: `AUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`

## Current V2 Images

- Frontend: `docker.io/jmalab24/vista-monte-mar-app:v2-20260509-dff57ec`
- Backend: `docker.io/jmalab24/vista-monte-mar-be:v2-20260509-66246f8`

The images were built locally, copied to the EC2 host as tar archives, imported
with `sudo k3s ctr images import`, and deployed with `imagePullPolicy:
IfNotPresent`.

## Safety Rules

- Do not commit `.env`, `.local/`, kubeconfig files, PEM/private key files, token files, or secret backups.
- Do not run `RESET_NAMESPACE=1` in production.
- Do not delete the `vista-monte-mar` namespace.
- Do not run `scripts/build-and-deploy-all-dev.sh` against production as-is.
- Treat `.local/prod-scout-*` folders as sensitive because they may contain generated credentials, deployment YAML with env literals, token smoke-test responses, and database dumps.
- Preserve `pg-secret`; the production Postgres deployment uses it.
- Preserve `server-auth-secret` after bootstrap; it contains the generated admin credentials used by v2.

## Pre-Deploy Checks

```bash
git -C /mnt/c/Users/malab/Documents/dev/vista-monte-mar-app status --short --branch
git -C /mnt/c/Users/malab/Documents/dev/vista-monte-mar-be status --short --branch
git -C /mnt/c/Users/malab/Documents/dev/vista-monte-mar-services status --short --branch
```

Expected deploy branches:

```text
app:      v2 at dff57ec16de0b0842ec67744a86a8d55159eb529
backend:  v2 at 66246f876ed8c7a9e921a6955944150f3ddefa45
services: v2 at c40bc7548bc136b21d543d88ea35ffa1dba1dd6c
```

Run local verification before building images:

```bash
cd /mnt/c/Users/malab/Documents/dev/vista-monte-mar-app
npm test
npm run build

cd /mnt/c/Users/malab/Documents/dev/vista-monte-mar-be
npm test
```

## Production Scout And Backups

Create a sensitive local scout folder:

```bash
SCOUT_DIR=/mnt/c/Users/malab/Documents/dev/vista-monte-mar-services/.local/prod-scout-$(date +%Y%m%d-%H%M%S)
mkdir -p "$SCOUT_DIR"
chmod 700 "$SCOUT_DIR"
```

Capture non-secret status and rollback inputs:

```bash
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo kubectl get nodes -o wide' > "$SCOUT_DIR/kubernetes-nodes.txt"
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo kubectl get pods,svc,ingress,pvc -n vista-monte-mar -o wide' > "$SCOUT_DIR/k8s-inventory.txt"
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo kubectl get deploy -n vista-monte-mar -o jsonpath="{range .items[*]}{.metadata.name}{\"\\t\"}{range .spec.template.spec.containers[*]}{.name}{\"=\"}{.image}{\" \"}{end}{\"\\n\"}{end}"' > "$SCOUT_DIR/rollback-images.txt"
```

Back up sensitive production state:

```bash
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo kubectl get secret pg-secret -n vista-monte-mar -o yaml' > "$SCOUT_DIR/pg-secret.backup.yaml"
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo kubectl get deploy app server -n vista-monte-mar -o yaml' > "$SCOUT_DIR/pre-rollout-app-server-deployments.yaml"
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo kubectl exec deploy/postgres -n vista-monte-mar -- sh -c '\''PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"'\''' > "$SCOUT_DIR/postgres.dump.sql"
chmod 600 "$SCOUT_DIR"/*
```

## First-Run Auth Bootstrap

Run this only if `server-auth-secret` does not already exist:

```bash
SCOUT_DIR=/mnt/c/Users/malab/Documents/dev/vista-monte-mar-services/.local/prod-scout-YYYYMMDD-HHMMSS

AUTH_SECRET="$(openssl rand -base64 48)"
ADMIN_USERNAME="admin_$(openssl rand -hex 4)"
ADMIN_PASSWORD="$(openssl rand -base64 24)"

umask 077
{
  printf 'AUTH_SECRET=%s\n' "$AUTH_SECRET"
  printf 'ADMIN_USERNAME=%s\n' "$ADMIN_USERNAME"
  printf 'ADMIN_PASSWORD=%s\n' "$ADMIN_PASSWORD"
} > "$SCOUT_DIR/initial-server-auth.env"

scp -i ~/.ssh/vista_monte_mar_prod.pem "$SCOUT_DIR/initial-server-auth.env" ec2-user@3.218.9.199:/tmp/initial-server-auth.env
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo kubectl create secret generic server-auth-secret -n vista-monte-mar --from-env-file=/tmp/initial-server-auth.env && rm -f /tmp/initial-server-auth.env'
```

Store `initial-server-auth.env` securely. It contains the generated admin login.

## Build And Import Images

```bash
docker build --platform linux/amd64 -t jmalab24/vista-monte-mar-app:v2-20260509-dff57ec /mnt/c/Users/malab/Documents/dev/vista-monte-mar-app
docker build --platform linux/amd64 -t jmalab24/vista-monte-mar-be:v2-20260509-66246f8 /mnt/c/Users/malab/Documents/dev/vista-monte-mar-be

mkdir -p /mnt/c/Users/malab/Documents/dev/vista-monte-mar-services/.local/prod-images
docker save -o /mnt/c/Users/malab/Documents/dev/vista-monte-mar-services/.local/prod-images/app-v2-20260509-dff57ec.tar jmalab24/vista-monte-mar-app:v2-20260509-dff57ec
docker save -o /mnt/c/Users/malab/Documents/dev/vista-monte-mar-services/.local/prod-images/be-v2-20260509-66246f8.tar jmalab24/vista-monte-mar-be:v2-20260509-66246f8

scp -i ~/.ssh/vista_monte_mar_prod.pem /mnt/c/Users/malab/Documents/dev/vista-monte-mar-services/.local/prod-images/app-v2-20260509-dff57ec.tar ec2-user@3.218.9.199:/tmp/vmm-app-v2-20260509-dff57ec.tar
scp -i ~/.ssh/vista_monte_mar_prod.pem /mnt/c/Users/malab/Documents/dev/vista-monte-mar-services/.local/prod-images/be-v2-20260509-66246f8.tar ec2-user@3.218.9.199:/tmp/vmm-be-v2-20260509-66246f8.tar

ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo k3s ctr images import /tmp/vmm-app-v2-20260509-dff57ec.tar && sudo k3s ctr images import /tmp/vmm-be-v2-20260509-66246f8.tar && rm -f /tmp/vmm-app-v2-20260509-dff57ec.tar /tmp/vmm-be-v2-20260509-66246f8.tar'
```

## Deploy V2

The v2 backend needs env names that the older production deployment did not
have. Add the new names while preserving the existing SMTP literals and
`pg-secret` database password.

```bash
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 '
set -eu
DB_NAME="$(sudo kubectl get deploy server -n vista-monte-mar -o jsonpath='\''{.spec.template.spec.containers[0].env[?(@.name=="POSTGRES_DB")].value}'\'')"
DB_USER="$(sudo kubectl get deploy server -n vista-monte-mar -o jsonpath='\''{.spec.template.spec.containers[0].env[?(@.name=="POSTGRES_USER")].value}'\'')"
sudo kubectl set env deployment/app -n vista-monte-mar API_UPSTREAM=http://server:8135
sudo kubectl set env deployment/server -n vista-monte-mar DB_HOST=postgres DB_PORT=5432 DB_NAME="$DB_NAME" DB_USER="$DB_USER"
sudo kubectl set env deployment/server -n vista-monte-mar --from=secret/server-auth-secret --keys=AUTH_SECRET,ADMIN_USERNAME,ADMIN_PASSWORD
sudo kubectl set env deployment/server -n vista-monte-mar DB_PASSWORD- >/dev/null || true
sudo kubectl patch deployment/server -n vista-monte-mar --type=json -p='\''[{"op":"add","path":"/spec/template/spec/containers/0/env/-","value":{"name":"DB_PASSWORD","valueFrom":{"secretKeyRef":{"name":"pg-secret","key":"postgres-password"}}}}]'\''
sudo kubectl patch deployment/app -n vista-monte-mar --type=json -p='\''[{"op":"replace","path":"/spec/template/spec/containers/0/imagePullPolicy","value":"IfNotPresent"}]'\''
sudo kubectl patch deployment/server -n vista-monte-mar --type=json -p='\''[{"op":"replace","path":"/spec/template/spec/containers/0/imagePullPolicy","value":"IfNotPresent"}]'\''
sudo kubectl set image deployment/app -n vista-monte-mar app=docker.io/jmalab24/vista-monte-mar-app:v2-20260509-dff57ec
sudo kubectl set image deployment/server -n vista-monte-mar server=docker.io/jmalab24/vista-monte-mar-be:v2-20260509-66246f8
'
```

Wait for rollouts:

```bash
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo kubectl rollout status deployment/app -n vista-monte-mar --timeout=180s'
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo kubectl rollout status deployment/server -n vista-monte-mar --timeout=180s'
```

## Validate

```bash
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo kubectl get pods,svc,ingress -n vista-monte-mar -o wide'
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo kubectl logs deployment/app -n vista-monte-mar --tail=80'
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 'sudo kubectl logs deployment/server -n vista-monte-mar --tail=120'

curl -fsSI https://casajadecr.com/vista_monte_mar/
curl -sS -o /tmp/vmm-verify-token.body -w '%{http_code}\n' https://casajadecr.com/api/verify-token
```

Expected:

- `app` pod is `Running` with `0` restarts.
- `server` pod is `Running` with `0` restarts.
- App path returns HTTP `200`.
- Unauthenticated `/api/verify-token` returns HTTP `401` with `{"valid":false}`.
- Generated admin login returns HTTP `200`.
- Generated admin token verification returns HTTP `200`.

## Rollback

Use `rollback-images.txt` from the scout folder to restore the previous image
tags. For the 2026-05-09 deploy, the previous images were:

```text
app:    jmalab24/vista-monte-mar-app:main
server: jmalab24/vista-monte-mar-be:main
```

Rollback commands:

```bash
ssh -i ~/.ssh/vista_monte_mar_prod.pem ec2-user@3.218.9.199 '
sudo kubectl set image deployment/app -n vista-monte-mar app=jmalab24/vista-monte-mar-app:main
sudo kubectl set image deployment/server -n vista-monte-mar server=jmalab24/vista-monte-mar-be:main
sudo kubectl rollout status deployment/app -n vista-monte-mar --timeout=180s
sudo kubectl rollout status deployment/server -n vista-monte-mar --timeout=180s
'
```

If credentials were accidentally changed, restore from the matching sensitive
backup file in `.local/prod-scout-*`. Do not print secret values while restoring.
