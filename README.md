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
