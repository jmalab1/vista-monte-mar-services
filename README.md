# costa-rica-condo

## Local k3s one-command startup

From this repo root:

```powershell
.\start-local-k3s.ps1
```

This will:
- Start (or reuse) local k3s container `vmm-k3s`
- Expose ingress ports on localhost (`8080` HTTP, `8443` HTTPS)
- Apply the stack in `k8s/local-stack.yaml` (app + server + postgres)
- Install cert-manager if missing
- Apply `k8s/ingress-https.yaml` for domain-based ingress on `vmm.localhost`
- Import local backend image `vmm-be:local` into k3s when available
- Serve UI via ingress:
  - `http://vmm.localhost:8080/vista_monte_mar/`
  - `https://vmm.localhost:8443/vista_monte_mar/`

Optional domain override:

```powershell
.\start-local-k3s.ps1 -Domain your.domain.example
```

Stop:

```powershell
.\stop-local-k3s.ps1
```
