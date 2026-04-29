#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICES_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
DEV_ROOT_DEFAULT="$(cd "${SERVICES_ROOT}/.." && pwd)"

APP_ROOT="${APP_ROOT:-${DEV_ROOT_DEFAULT}/vista-monte-mar-app}"
BE_ROOT="${BE_ROOT:-${DEV_ROOT_DEFAULT}/vista-monte-mar-be}"

REMOTE_HOST="${K3S_HOST:-192.168.68.54}"
REMOTE_USER="${K3S_USER:-}"
SSH_KEY_PATH="${K3S_SSH_KEY_PATH:-$HOME/.ssh/vista_monte_mar_k3s}"
REMOTE_SUDO_PASSWORD="${REMOTE_SUDO_PASSWORD:-}"
API_UPSTREAM="${API_UPSTREAM:-http://server:8135}"

ADMIN_USERNAME="${ADMIN_USERNAME:-admin}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin123}"

APP_IMAGE_NAME="${APP_IMAGE_NAME:-jmalab24/vista-monte-mar-app}"
APP_IMAGE_TAG="${APP_IMAGE_TAG:-dev}"
APP_FULL_IMAGE="${APP_IMAGE_NAME}:${APP_IMAGE_TAG}"

BE_IMAGE_NAME="${BE_IMAGE_NAME:-jmalab24/vista-monte-mar-be}"
BE_IMAGE_TAG="${BE_IMAGE_TAG:-dev}"
BE_FULL_IMAGE="${BE_IMAGE_NAME}:${BE_IMAGE_TAG}"

REMOTE_APP_TAR="/tmp/${APP_IMAGE_NAME//\//-}-${APP_IMAGE_TAG}.tar"
REMOTE_BE_TAR="/tmp/${BE_IMAGE_NAME//\//-}-${BE_IMAGE_TAG}.tar"

SSH_COMMON_ARGS=(-F /dev/null -o StrictHostKeyChecking=accept-new)
SCP_COMMON_ARGS=(-F /dev/null -o StrictHostKeyChecking=accept-new)

usage() {
  cat <<'USAGE'
Build and deploy full dev stack (frontend + backend + postgres) to remote k3s.

Usage:
  K3S_USER=<remote-user> REMOTE_SUDO_PASSWORD=<sudo-password> bash scripts/build-and-deploy-all-dev.sh

Optional environment variables:
  APP_ROOT             Path to vista-monte-mar-app repo (default: ../vista-monte-mar-app)
  BE_ROOT              Path to vista-monte-mar-be repo (default: ../vista-monte-mar-be)
  K3S_HOST             Remote host (default: 192.168.68.54)
  K3S_SSH_KEY_PATH     SSH key path (default: ~/.ssh/vista_monte_mar_k3s)
  APP_IMAGE_NAME       Frontend image name (default: jmalab24/vista-monte-mar-app)
  APP_IMAGE_TAG        Frontend image tag (default: dev)
  BE_IMAGE_NAME        Backend image name (default: jmalab24/vista-monte-mar-be)
  BE_IMAGE_TAG         Backend image tag (default: dev)
  SKIP_INGRESS         Set to 1 to skip applying k8s/ingress-https.yaml
  API_UPSTREAM         Frontend API upstream (default: http://server:8135)
  ADMIN_USERNAME       Backend login username (default: admin)
  ADMIN_PASSWORD       Backend login password (default: admin123)
USAGE
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

require_cmd docker
require_cmd ssh
require_cmd scp

if [[ -z "$REMOTE_USER" ]]; then
  echo "K3S_USER is required." >&2
  echo "Example: K3S_USER=admin REMOTE_SUDO_PASSWORD=admin bash scripts/build-and-deploy-all-dev.sh" >&2
  exit 1
fi

if [[ ! -d "$APP_ROOT" ]]; then
  echo "App repo not found: $APP_ROOT" >&2
  exit 1
fi

if [[ ! -d "$BE_ROOT" ]]; then
  echo "Backend repo not found: $BE_ROOT" >&2
  exit 1
fi

if [[ ! -f "$SSH_KEY_PATH" ]]; then
  echo "SSH key not found at $SSH_KEY_PATH" >&2
  exit 1
fi

SSH_TARGET="${REMOTE_USER}@${REMOTE_HOST}"

LOCAL_APP_TAR="$(mktemp /tmp/${APP_IMAGE_NAME//\//-}-${APP_IMAGE_TAG}-XXXXXX.tar)"
LOCAL_BE_TAR="$(mktemp /tmp/${BE_IMAGE_NAME//\//-}-${BE_IMAGE_TAG}-XXXXXX.tar)"

cleanup() {
  rm -f "$LOCAL_APP_TAR" "$LOCAL_BE_TAR"
}
trap cleanup EXIT

echo "==> Building frontend image: $APP_FULL_IMAGE"
(
  cd "$APP_ROOT"
  docker build --platform linux/amd64 -t "$APP_FULL_IMAGE" .
)

echo "==> Building backend image: $BE_FULL_IMAGE"
(
  cd "$BE_ROOT"
  docker build --platform linux/amd64 -t "$BE_FULL_IMAGE" .
)

echo "==> Saving images to tar"
docker save -o "$LOCAL_APP_TAR" "$APP_FULL_IMAGE"
docker save -o "$LOCAL_BE_TAR" "$BE_FULL_IMAGE"

echo "==> Copying images to remote k3s host: $SSH_TARGET"
scp "${SCP_COMMON_ARGS[@]}" -i "$SSH_KEY_PATH" "$LOCAL_APP_TAR" "$SSH_TARGET:$REMOTE_APP_TAR"
scp "${SCP_COMMON_ARGS[@]}" -i "$SSH_KEY_PATH" "$LOCAL_BE_TAR" "$SSH_TARGET:$REMOTE_BE_TAR"

if [[ -n "$REMOTE_SUDO_PASSWORD" ]]; then
  REMOTE_IMPORT_CMD="printf '%s\\n' '$REMOTE_SUDO_PASSWORD' | sudo -S k3s ctr images import '$REMOTE_APP_TAR' && printf '%s\\n' '$REMOTE_SUDO_PASSWORD' | sudo -S k3s ctr images import '$REMOTE_BE_TAR' && rm -f '$REMOTE_APP_TAR' '$REMOTE_BE_TAR'"
else
  REMOTE_IMPORT_CMD="sudo k3s ctr images import '$REMOTE_APP_TAR' && sudo k3s ctr images import '$REMOTE_BE_TAR' && rm -f '$REMOTE_APP_TAR' '$REMOTE_BE_TAR'"
fi

echo "==> Importing images into remote k3s containerd"
ssh "${SSH_COMMON_ARGS[@]}" -i "$SSH_KEY_PATH" "$SSH_TARGET" "$REMOTE_IMPORT_CMD"

echo "==> Applying Kubernetes manifests and restarting workloads"
ssh "${SSH_COMMON_ARGS[@]}" -i "$SSH_KEY_PATH" "$SSH_TARGET" \
  "REMOTE_SUDO_PASSWORD='$REMOTE_SUDO_PASSWORD' APP_IMAGE='$APP_FULL_IMAGE' BE_IMAGE='$BE_FULL_IMAGE' SKIP_INGRESS='${SKIP_INGRESS:-0}' ADMIN_USERNAME='$ADMIN_USERNAME' ADMIN_PASSWORD='$ADMIN_PASSWORD' API_UPSTREAM='$API_UPSTREAM' bash -s" <<'EOM'
set -euo pipefail

run_sudo() {
  if [[ -n "${REMOTE_SUDO_PASSWORD:-}" ]]; then
    printf '%s\n' "$REMOTE_SUDO_PASSWORD" | sudo -S "$@"
  else
    sudo "$@"
  fi
}

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

cat > "$TMP_DIR/local-stack.yaml" <<YAML
apiVersion: v1
kind: Namespace
metadata:
  name: vista-monte-mar
---
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
  namespace: vista-monte-mar
type: Opaque
stringData:
  POSTGRES_DB: visitor_analytics
  POSTGRES_USER: visitor_user
  POSTGRES_PASSWORD: change-me
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
  namespace: vista-monte-mar
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-init-sql
  namespace: vista-monte-mar
data:
  01_create_visitors_table.sql: |
    CREATE TABLE IF NOT EXISTS visitors (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      path TEXT NOT NULL,
      referrer TEXT,
      user_agent TEXT,
      ip INET
    );

    CREATE TABLE IF NOT EXISTS form_submissions (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      firstname TEXT NOT NULL,
      lastname TEXT NOT NULL,
      email TEXT NOT NULL,
      phone_number TEXT,
      comment TEXT NOT NULL,
      referrer TEXT,
      user_agent TEXT,
      ip TEXT,
      email_sent BOOLEAN NOT NULL DEFAULT FALSE,
      email_error TEXT
    );
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: vista-monte-mar
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:16-alpine
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 5432
        envFrom:
        - secretRef:
            name: postgres-secret
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
        - name: postgres-init-sql
          mountPath: /docker-entrypoint-initdb.d
      volumes:
      - name: postgres-data
        persistentVolumeClaim:
          claimName: postgres-data
      - name: postgres-init-sql
        configMap:
          name: postgres-init-sql
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: vista-monte-mar
spec:
  type: ClusterIP
  selector:
    app: postgres
  ports:
  - name: postgres
    port: 5432
    targetPort: 5432
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: server
  namespace: vista-monte-mar
spec:
  replicas: 1
  selector:
    matchLabels:
      app: server
  template:
    metadata:
      labels:
        app: server
    spec:
      containers:
      - name: server
        image: ${BE_IMAGE}
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8135
        env:
        - name: SMTP_USER
          value: ""
        - name: SMTP_PASS
          value: ""
        - name: SEND_TO
          value: ""
        - name: ADMIN_USERNAME
          value: "${ADMIN_USERNAME}"
        - name: ADMIN_PASSWORD
          value: "${ADMIN_PASSWORD}"
        - name: DB_HOST
          value: postgres
        - name: DB_PORT
          value: "5432"
        - name: DB_NAME
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_DB
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_USER
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: POSTGRES_PASSWORD
---
apiVersion: v1
kind: Service
metadata:
  name: server
  namespace: vista-monte-mar
spec:
  type: ClusterIP
  selector:
    app: server
  ports:
  - port: 8135
    targetPort: 8135
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
  namespace: vista-monte-mar
spec:
  replicas: 1
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
      - name: app
        image: ${APP_IMAGE}
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
        env:
        - name: DOMAIN
          value: localhost
        - name: API_UPSTREAM
          value: ${API_UPSTREAM}
---
apiVersion: v1
kind: Service
metadata:
  name: app
  namespace: vista-monte-mar
spec:
  type: ClusterIP
  selector:
    app: app
  ports:
  - port: 80
    targetPort: 80
YAML

cat > "$TMP_DIR/ingress-https.yaml" <<'YAML'
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: vmm-selfsigned
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: vmm-localhost-tls
  namespace: vista-monte-mar
spec:
  secretName: vmm-localhost-tls
  issuerRef:
    name: vmm-selfsigned
    kind: ClusterIssuer
  dnsNames:
    - vmm.localhost
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress-web
  namespace: vista-monte-mar
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web
spec:
  rules:
  - host: vmm.localhost
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: server
            port:
              number: 8135
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app
            port:
              number: 80
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress-websecure
  namespace: vista-monte-mar
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
spec:
  tls:
  - hosts:
    - vmm.localhost
    secretName: vmm-localhost-tls
  rules:
  - host: vmm.localhost
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: server
            port:
              number: 8135
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app
            port:
              number: 80
YAML

run_sudo kubectl delete deployment app server -n vista-monte-mar --ignore-not-found=true
run_sudo kubectl apply -f "$TMP_DIR/local-stack.yaml"
if [[ "${SKIP_INGRESS:-0}" != "1" ]]; then
  run_sudo kubectl apply -f "$TMP_DIR/ingress-https.yaml"
fi

run_sudo kubectl rollout restart deployment/app -n vista-monte-mar
run_sudo kubectl rollout restart deployment/server -n vista-monte-mar
run_sudo kubectl rollout status deployment/app -n vista-monte-mar --timeout=180s
run_sudo kubectl rollout status deployment/server -n vista-monte-mar --timeout=180s
run_sudo kubectl get pods,svc,ingress -n vista-monte-mar
EOM

echo "==> Done. Deployed full dev stack to ${REMOTE_HOST}"
