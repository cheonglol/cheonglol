#!/usr/bin/env sh
set -e
cd /app/backend || exit 1
npx prisma generate
npx prisma db push --skip-generate
npm run start
