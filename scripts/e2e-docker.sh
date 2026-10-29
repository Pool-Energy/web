#!/usr/bin/env bash
#
# Build the production Docker image, run it on a private port and execute the
# Playwright smoke tests against it.
#
# The app container is published on 8081 by default so it can run alongside a
# local instance already bound to 8080.
#
# Usage:
#   npm run test:e2e              # build + run + test
#   bash scripts/e2e-docker.sh --grep farmer
#
# Environment:
#   E2E_IMAGE            image tag (default: pool-energy-web:e2e)
#   E2E_CONTAINER        container name (default: pool-energy-web-e2e)
#   E2E_PORT             public port (default: 8081)
#   E2E_CONTAINER_PORT   container port (default: 8080)
#   E2E_BASE_URL         tested URL (default: http://127.0.0.1:$E2E_PORT)
#   E2E_READY_TIMEOUT    seconds to wait for the container (default: 90)
#   E2E_SKIP_BUILD       set to 1 to reuse the existing image
#   E2E_KEEP_CONTAINER   set to 1 to leave the container running for debugging
#   PLAYWRIGHT_CHANNEL   chrome (default), chromium, msedge, ...
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

IMAGE="${E2E_IMAGE:-pool-energy-web:e2e}"
CONTAINER="${E2E_CONTAINER:-pool-energy-web-e2e}"
HOST_PORT="${E2E_PORT:-8081}"
CONTAINER_PORT="${E2E_CONTAINER_PORT:-8080}"
BASE_URL="${E2E_BASE_URL:-http://127.0.0.1:${HOST_PORT}}"
READY_TIMEOUT="${E2E_READY_TIMEOUT:-90}"

cleanup() {
  status=$?
  trap - EXIT

  if [ "$status" -ne 0 ]; then
    echo "==> E2E failed (exit ${status}), last container logs:"
    docker logs --tail 60 "$CONTAINER" 2>&1 || true
  fi

  if [ "${E2E_KEEP_CONTAINER:-0}" = "1" ]; then
    echo "==> Container kept for debugging: docker logs -f ${CONTAINER}"
  else
    docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
  fi

  exit "$status"
}

if ! docker info >/dev/null 2>&1; then
  echo "Docker is not available. Start Docker and retry." >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required to wait for the container." >&2
  exit 1
fi

if [ "${E2E_SKIP_BUILD:-0}" != "1" ]; then
  echo "==> Building image ${IMAGE}"
  docker build -t "$IMAGE" .
else
  echo "==> Reusing image ${IMAGE}"
fi

# Always start from a clean container so a previous crashed run cannot hijack
# the port or serve a stale build.
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true

if command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:"$HOST_PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port ${HOST_PORT} is already in use. Set E2E_PORT to another port." >&2
  exit 1
fi

trap cleanup EXIT

echo "==> Starting ${CONTAINER} on ${HOST_PORT}:${CONTAINER_PORT}"
docker run -d --rm --name "$CONTAINER" -p "${HOST_PORT}:${CONTAINER_PORT}" "$IMAGE" >/dev/null

printf '==> Waiting for %s ' "$BASE_URL"
ready=0
for _ in $(seq 1 "$READY_TIMEOUT"); do
  if curl -fsS -o /dev/null "$BASE_URL/"; then
    ready=1
    break
  fi
  printf '.'
  sleep 1
done
printf '\n'

if [ "$ready" != "1" ]; then
  echo "The container did not become ready within ${READY_TIMEOUT}s." >&2
  exit 1
fi

if [ ! -d e2e/node_modules ]; then
  echo "==> Installing e2e dependencies"
  npm --prefix e2e ci --no-audit --no-fund
fi

echo "==> Running Playwright smoke tests"
BASE_URL="$BASE_URL" npm --prefix e2e test -- "$@"
