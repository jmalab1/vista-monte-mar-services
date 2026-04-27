#!/bin/bash
set -eu

REMOTE_HOST="${K3S_HOST:-192.168.68.54}"
REMOTE_USER="${K3S_USER:-}"
SSH_KEY_PATH="${K3S_SSH_KEY_PATH:-$HOME/.ssh/vista_monte_mar_k3s}"
IMAGE_NAME="${IMAGE_NAME:-vista-monte-mar-app}"
IMAGE_TAG="${IMAGE_TAG:-dev}"
FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
REMOTE_TMP_IMAGE="/tmp/${IMAGE_NAME//\//-}-${IMAGE_TAG}.tar"
REMOTE_API_UPSTREAM="${API_UPSTREAM:-http://127.0.0.1:8135}"
KUBECTL_BIN="${KUBECTL_BIN:-kubectl}"
RESET_NAMESPACE="${RESET_NAMESPACE:-0}"
REMOTE_SUDO_PASSWORD="${REMOTE_SUDO_PASSWORD:-}"
SSH_COMMON_ARGS=(-F /dev/null -o StrictHostKeyChecking=accept-new)
SCP_COMMON_ARGS=(-F /dev/null -o StrictHostKeyChecking=accept-new)

if ! command -v docker >/dev/null 2>&1; then
    echo "Docker is not installed on the dev machine." >&2
    exit 1
fi

if ! command -v ssh >/dev/null 2>&1; then
    echo "SSH is not installed on the dev machine." >&2
    exit 1
fi

if ! command -v scp >/dev/null 2>&1; then
    echo "SCP is not installed on the dev machine." >&2
    exit 1
fi

if [ -z "$REMOTE_USER" ]; then
    echo "Set K3S_USER before deploying from the dev machine." >&2
    exit 1
fi

if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "SSH key not found at $SSH_KEY_PATH" >&2
    exit 1
fi

SSH_TARGET="${REMOTE_USER}@${REMOTE_HOST}"

docker build --platform linux/amd64 -t "$FULL_IMAGE" .

LOCAL_IMAGE_TAR="$(mktemp /tmp/${IMAGE_NAME//\//-}-${IMAGE_TAG}-XXXXXX.tar)"
cleanup() {
    rm -f "$LOCAL_IMAGE_TAR"
}
trap cleanup EXIT

docker save -o "$LOCAL_IMAGE_TAR" "$FULL_IMAGE"
scp "${SCP_COMMON_ARGS[@]}" -i "$SSH_KEY_PATH" "$LOCAL_IMAGE_TAR" "$SSH_TARGET:$REMOTE_TMP_IMAGE"

if [ -n "$REMOTE_SUDO_PASSWORD" ]; then
    REMOTE_IMPORT_CMD="printf '%s\n' '$REMOTE_SUDO_PASSWORD' | sudo -S k3s ctr images import '$REMOTE_TMP_IMAGE' && rm -f '$REMOTE_TMP_IMAGE'"
else
    REMOTE_IMPORT_CMD="sudo k3s ctr images import '$REMOTE_TMP_IMAGE' && rm -f '$REMOTE_TMP_IMAGE'"
fi

ssh "${SSH_COMMON_ARGS[@]}" -i "$SSH_KEY_PATH" "$SSH_TARGET" "$REMOTE_IMPORT_CMD"

ssh "${SSH_COMMON_ARGS[@]}" -i "$SSH_KEY_PATH" "$SSH_TARGET" \
    "API_UPSTREAM='$REMOTE_API_UPSTREAM' IMAGE_NAME='$IMAGE_NAME' IMAGE_TAG='$IMAGE_TAG' KUBECTL_BIN='$KUBECTL_BIN' RESET_NAMESPACE='$RESET_NAMESPACE' REMOTE_SUDO_PASSWORD='$REMOTE_SUDO_PASSWORD' bash -s" <<'EOM'
set -eu

TMP_DIR="$(mktemp -d)"
cleanup() {
    rm -rf "$TMP_DIR"
}
trap cleanup EXIT

run_sudo() {
    if [ -n "${REMOTE_SUDO_PASSWORD:-}" ]; then
        printf '%s\n' "$REMOTE_SUDO_PASSWORD" | sudo -S "$@"
    else
        sudo "$@"
    fi
}

cat > "$TMP_DIR/namespace.yaml" <<'YAML'
apiVersion: v1
kind: Namespace
metadata:
  name: vista-monte-mar
YAML

cat > "$TMP_DIR/deployment.yaml" <<YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vista-monte-mar-app
  namespace: vista-monte-mar
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vista-monte-mar-app
  template:
    metadata:
      labels:
        app: vista-monte-mar-app
    spec:
      containers:
        - name: vista-monte-mar-app
          image: ${IMAGE_NAME}:${IMAGE_TAG}
          imagePullPolicy: Never
          env:
            - name: API_UPSTREAM
              value: ${API_UPSTREAM}
          ports:
            - containerPort: 80
          readinessProbe:
            httpGet:
              path: /vista_monte_mar/
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /vista_monte_mar/
              port: 80
            initialDelaySeconds: 15
            periodSeconds: 20
YAML

cat > "$TMP_DIR/service.yaml" <<'YAML'
apiVersion: v1
kind: Service
metadata:
  name: vista-monte-mar-app
  namespace: vista-monte-mar
spec:
  selector:
    app: vista-monte-mar-app
  ports:
    - name: http
      port: 80
      targetPort: 80
YAML

cat > "$TMP_DIR/ingress.yaml" <<'YAML'
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: vista-monte-mar-app
  namespace: vista-monte-mar
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web,websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
spec:
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: vista-monte-mar-app
                port:
                  number: 80
YAML

if [ "$RESET_NAMESPACE" = "1" ]; then
    run_sudo "$KUBECTL_BIN" delete namespace vista-monte-mar --ignore-not-found=true --wait=true
fi

run_sudo "$KUBECTL_BIN" apply -f "$TMP_DIR/namespace.yaml"
run_sudo "$KUBECTL_BIN" apply -f "$TMP_DIR/deployment.yaml"
run_sudo "$KUBECTL_BIN" apply -f "$TMP_DIR/service.yaml"
run_sudo "$KUBECTL_BIN" apply -f "$TMP_DIR/ingress.yaml"
run_sudo "$KUBECTL_BIN" rollout restart deployment/vista-monte-mar-app -n vista-monte-mar
run_sudo "$KUBECTL_BIN" rollout status deployment/vista-monte-mar-app -n vista-monte-mar --timeout=120s
run_sudo "$KUBECTL_BIN" get ingress,svc,pods -n vista-monte-mar
EOM
