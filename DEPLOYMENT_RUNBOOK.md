# Vista Monte Mar Local Deployment Runbook (Agent Reference)

_Last updated: 2026-04-26_

This is the canonical local deployment flow for this environment (Windows + Docker Desktop + local k3s-in-docker).

## Preconditions

1. Docker Desktop is running.
2. `kubectl` is installed and available in PATH.
3. Repos exist at:
   - `C:\Users\malab\Documents\dev\vista-monte-mar-app`
   - `C:\Users\malab\Documents\dev\vista-monte-mar-be`
   - `C:\Users\malab\Documents\dev\vista-monte-mar-services`
4. Use Dockerized Node build for frontend (do not rely on host `npm` in this environment).

Quick checks:

```powershell
docker version
kubectl version --client
```

## Full Deploy (Frontend + Backend + Postgres on k3s)

### 1) Build frontend static assets and local image

```powershell
cd C:\Users\malab\Documents\dev\vista-monte-mar-app

docker run --rm -v C:\Users\malab\Documents\dev\vista-monte-mar-app:/src node:18-bullseye sh -lc "rm -rf /tmp/work && cp -a /src /tmp/work && cd /tmp/work && npm ci && npm run build && rm -rf /src/dist && cp -a dist /src/"

docker build -t vmm-app:local .
```

### 2) Build backend local image

```powershell
cd C:\Users\malab\Documents\dev\vista-monte-mar-be
docker build -t vmm-be:local .
```

### 3) Start/reconcile k3s stack and deploy

```powershell
cd C:\Users\malab\Documents\dev\vista-monte-mar-services
powershell -ExecutionPolicy Bypass -File .\start-local-k3s.ps1
```

What this script does:
- Starts/reuses container `vmm-k3s`
- Writes kubeconfig to `.local\kubeconfig.yaml`
- Applies `k8s\local-stack.yaml` (app + server + postgres)
- Ensures cert-manager and applies `k8s\ingress-https.yaml`
- Imports and patches `vmm-be:local` and `vmm-app:local` when present

## Access URLs

- HTTP: `http://vmm.localhost:8080/vista_monte_mar/`
- HTTPS: `https://vmm.localhost:8443/vista_monte_mar/`

Note: HTTPS cert is self-signed locally; browser warning is expected.

## Verification Commands

```powershell
cd C:\Users\malab\Documents\dev\vista-monte-mar-services
$env:KUBECONFIG = "C:\Users\malab\Documents\dev\vista-monte-mar-services\.local\kubeconfig.yaml"
kubectl -n vista-monte-mar get deploy,po,svc,ingress
kubectl -n vista-monte-mar get deployment app -o jsonpath="{.spec.template.spec.containers[0].image}"
kubectl -n vista-monte-mar get deployment server -o jsonpath="{.spec.template.spec.containers[0].image}"
```

Quick endpoint check:

```powershell
curl.exe -k -I https://vmm.localhost:8443/vista_monte_mar/
```

## Partial Deploys

### Frontend-only changes

```powershell
cd C:\Users\malab\Documents\dev\vista-monte-mar-app
docker run --rm -v C:\Users\malab\Documents\dev\vista-monte-mar-app:/src node:18-bullseye sh -lc "rm -rf /tmp/work && cp -a /src /tmp/work && cd /tmp/work && npm ci && npm run build && rm -rf /src/dist && cp -a dist /src/"
docker build -t vmm-app:local .

cd C:\Users\malab\Documents\dev\vista-monte-mar-services
powershell -ExecutionPolicy Bypass -File .\start-local-k3s.ps1
```

### Backend-only changes

```powershell
cd C:\Users\malab\Documents\dev\vista-monte-mar-be
docker build -t vmm-be:local .

cd C:\Users\malab\Documents\dev\vista-monte-mar-services
powershell -ExecutionPolicy Bypass -File .\start-local-k3s.ps1
```

## Stop Stack

```powershell
cd C:\Users\malab\Documents\dev\vista-monte-mar-services
powershell -ExecutionPolicy Bypass -File .\stop-local-k3s.ps1
```

## Common Troubleshooting

1. Script blocked by PowerShell policy:
   - Use `powershell -ExecutionPolicy Bypass -File .\start-local-k3s.ps1`
2. `kubectl` points to wrong API (often `127.0.0.1:6443`):
   - Set:
     ```powershell
     $env:KUBECONFIG = "C:\Users\malab\Documents\dev\vista-monte-mar-services\.local\kubeconfig.yaml"
     ```
3. UI looks stale after deploy:
   - Hard refresh browser (`Ctrl+Shift+R`)
   - Confirm new asset hash in HTML:
     ```powershell
     curl.exe -k -s https://vmm.localhost:8443/vista_monte_mar/ | Select-String "assets/index-.*\.js"
     ```
4. Wrong image imported due parallel build/deploy timing:
   - Ensure build finishes before running `start-local-k3s.ps1`
   - Re-run `start-local-k3s.ps1` once after completed image build

