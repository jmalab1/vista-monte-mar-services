# Learned Repo Memory

## Memory Metadata
- created_at_unix: 1777953218
- created_at_utc: 2026-05-05T03:53:38Z
- refreshed_at_unix: 1777953218
- refreshed_at_utc: 2026-05-05T03:53:38Z
- refresh_policy: Refresh this file if it is older than 7 days and repo development has continued.

## Repo
- name: vista-monte-mar-services
- purpose: Infrastructure and deployment repo for Vista Monte Mar.
- project types: kubernetes, helm, scripts
- active branch: v2

## Read First
- `AGENTS.md`: repo instruction to run context-pack and read this memory before edits.
- `README.md`: deploy repo ownership and frontend remote deploy flow.
- `CODEBASE_WIKI.md`: local operations/runbook notes.
- `k8s/local-stack.yaml`: local stack manifest and app/database wiring.
- `helm/`: Helm chart templates for broader stack management.
- `scripts/`: k3s SSH/bootstrap/build/deploy helpers.

## Entry Points
- `scripts/build-and-deploy-dev.sh`: frontend dev deploy entrypoint.
- `scripts/deploy-frontend-k3s.sh`: lower-level frontend k3s deploy flow.
- `scripts/setup-k3s-ssh.sh`: SSH/bootstrap helper.
- `k8s/local-stack.yaml`: main local Kubernetes manifest.

## Hotspots
- Postgres templates live under `helm/templates/postgres-*`.
- Ingress and local stack wiring live under `k8s/`.
- Frontend deployment scripts depend on remote user/sudo/cluster assumptions.

## Known Pitfalls
- Do not commit sensitive local kubeconfig data. Before committing or refreshing this memory, run `rg "password|token|secret|key|kubeconfig|192\\.168|REMOTE" .context-pack/memory.md`.
- `.local/kubeconfig.yaml` may contain certificate/key material; treat it as sensitive even if a diff looks metadata-only.
- Windows file-mode noise has happened in this workspace; repo config should keep `core.filemode=false`.
- This repo owns infrastructure/deploy assets; frontend source belongs in `vista-monte-mar-app`.

## Operational Notes
- Frontend remote deploy example uses `K3S_USER` and `REMOTE_SUDO_PASSWORD` with `scripts/build-and-deploy-dev.sh`.
- Lower-level flow: run `scripts/setup-k3s-ssh.sh`, then `scripts/deploy-frontend-k3s.sh`.
- Helm assets live under `helm/`; raw manifests live under `k8s/`.

## Debugging Notes
- Context-pack initially omitted many services changes as low-signal because they were mode-only changes.

## Open Questions
- Document which deployment path is canonical when Helm and raw `k8s/` manifests diverge.
