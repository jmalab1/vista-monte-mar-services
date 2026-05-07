# Vista Monte Mar Services

Infrastructure and deployment repo for Vista Monte Mar.

This repo owns:
- Kubernetes manifests and cluster wiring
- Helm chart assets
- frontend k3s deploy scripts
- SSH/bootstrap helpers for the k3s machine

Frontend remote deploy files:
- `scripts/setup-k3s-ssh.sh`
- `scripts/build-and-deploy-dev.sh`
- `scripts/deploy-frontend-k3s.sh`
- `k8s/remote-frontend/`

Frontend deploy example:

```bash
K3S_USER=<remote-user> REMOTE_SUDO_PASSWORD=<sudo-password> bash scripts/build-and-deploy-dev.sh
```

Lower-level frontend deploy flow:

```bash
bash scripts/setup-k3s-ssh.sh 192.168.68.54 <remote-user>
K3S_USER=<remote-user> REMOTE_SUDO_PASSWORD=<sudo-password> bash scripts/deploy-frontend-k3s.sh
```

Helm assets for broader stack management live under `helm/`.

Dev deploy scripts automatically source `.env` from this repo. Start from the template:

```bash
cp .env.template .env
```

Fill in `K3S_USER`, `REMOTE_SUDO_PASSWORD`, `AUTH_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`, then run:

```bash
bash scripts/build-and-deploy-all-dev.sh
```

Generate a fresh `AUTH_SECRET` with:

```bash
bash scripts/generate-auth-secret.sh
```

Use `ENV_FILE=/path/to/dev.env bash scripts/build-and-deploy-all-dev.sh` to load a different env file. If applying `k8s/local-stack.yaml` directly, create `server-auth-secret` in the `vista-monte-mar` namespace first with `AUTH_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`.
