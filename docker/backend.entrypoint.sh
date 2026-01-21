#!/usr/bin/env sh
set -e
cd /app/backend || exit 1
echo "[entrypoint] Generating Prisma client..."
npx prisma generate
echo "[entrypoint] Pushing schema to database..."
npx prisma db push --skip-generate || echo "[entrypoint] db push failed (may be ok if already synced)"
echo "[entrypoint] Starting server..."
if [ -f nodemon.json ]; then
  exec nodemon
else
  exec npm run start
fi
