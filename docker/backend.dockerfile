FROM oven/bun:1

WORKDIR /app/backend

# Copy package files and lockfile
COPY backend/package.json backend/bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code and prisma
COPY backend/src ./src
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./

# Run TypeScript directly with Bun (no build step)
CMD ["sh", "-c", "bunx prisma generate && bunx prisma db push --skip-generate --accept-data-loss 2>/dev/null || echo '[startup] db push skipped' && bun src/index.ts"]
