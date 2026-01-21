#!/usr/bin/env sh
set -e
cd /app/frontend || exit 1
bun install --production
bun --cwd . preview --host 0.0.0.0
