#!/bin/bash
set -eu

REMOTE_HOST="${1:-192.168.68.54}"
REMOTE_USER="${2:-}"
KEY_PATH="${3:-$HOME/.ssh/vista_monte_mar_k3s}"

if [ -z "$REMOTE_USER" ]; then
    echo "Usage: $0 <remote-host> <remote-user> [key-path]" >&2
    exit 1
fi

mkdir -p "$(dirname "$KEY_PATH")"
chmod 700 "$(dirname "$KEY_PATH")"

if [ ! -f "$KEY_PATH" ]; then
    ssh-keygen -t ed25519 -f "$KEY_PATH" -N "" -C "vista-monte-mar-k3s"
fi

if command -v ssh-copy-id >/dev/null 2>&1; then
    ssh-copy-id -i "${KEY_PATH}.pub" "${REMOTE_USER}@${REMOTE_HOST}"
else
    PUB_KEY="$(cat "${KEY_PATH}.pub")"
    ssh "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ~/.ssh && chmod 700 ~/.ssh && grep -qxF '${PUB_KEY}' ~/.ssh/authorized_keys 2>/dev/null || echo '${PUB_KEY}' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
fi

cat <<EOM
SSH key ready.

Host vista-monte-mar-k3s
    HostName ${REMOTE_HOST}
    User ${REMOTE_USER}
    IdentityFile ${KEY_PATH}
    IdentitiesOnly yes
EOM
