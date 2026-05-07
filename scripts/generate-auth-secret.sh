#!/usr/bin/env bash
set -euo pipefail

if ! command -v openssl >/dev/null 2>&1; then
  echo "openssl is required to generate AUTH_SECRET." >&2
  exit 1
fi

openssl rand -base64 48 | tr '+/' '-_' | tr -d '=\n'
printf '\n'
