#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICES_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "${SERVICES_ROOT}/../vista-monte-mar-app" 2>/dev/null && pwd || true)}"
DEPLOY_SCRIPT="${SCRIPT_DIR}/deploy-frontend-k3s.sh"

usage() {
  cat <<'EOF'
Build and deploy the Vista Monte Mar frontend to the dev k3s server.

Usage:
  scripts/build-and-deploy-dev.sh

Optional environment variables:
  APP_ROOT                 Path to the vista-monte-mar-app repo
  K3S_USER                 Remote SSH user (required)
  REMOTE_SUDO_PASSWORD     Remote sudo password (optional, but used in this environment)
  K3S_HOST                 Remote host (defaults inside deploy helper)
  K3S_SSH_KEY_PATH         SSH key path (defaults inside deploy helper)
  API_UPSTREAM             Backend upstream for the frontend container
  IMAGE_NAME               Docker image name override
  IMAGE_TAG                Docker image tag override
  RESET_NAMESPACE          Set to 1 to recreate the namespace before deploy

Example:
  K3S_USER=admin REMOTE_SUDO_PASSWORD=admin scripts/build-and-deploy-dev.sh
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ -z "${APP_ROOT}" ]]; then
  echo "Could not locate the sibling vista-monte-mar-app repo." >&2
  echo "Set APP_ROOT to the app repo path and try again." >&2
  exit 1
fi

if [[ ! -x "${DEPLOY_SCRIPT}" ]]; then
  echo "Deploy helper not found or not executable: ${DEPLOY_SCRIPT}" >&2
  exit 1
fi

if [[ -z "${K3S_USER:-}" ]]; then
  echo "K3S_USER is required." >&2
  echo "Example: K3S_USER=admin REMOTE_SUDO_PASSWORD=admin scripts/build-and-deploy-dev.sh" >&2
  exit 1
fi

cd "${APP_ROOT}"

echo "Services root: ${SERVICES_ROOT}"
echo "App root: ${APP_ROOT}"
echo "Deploy script: ${DEPLOY_SCRIPT}"
echo "Starting frontend build and deploy..."

bash "${DEPLOY_SCRIPT}"
