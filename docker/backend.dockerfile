FROM oven/bun:1 AS builder

WORKDIR /app/backend

# Copy package files and lockfile
COPY backend/package.json backend/bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code and prisma
COPY backend/src ./src
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./
COPY backend/tsconfig.json ./

# Build TypeScript (no prisma generate - done at runtime)
RUN bun run build

# Production stage
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Copy built files, node_modules, and prisma schema
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/prisma.config.ts ./
COPY --from=builder /app/backend/package.json ./

# At runtime: generate client, push schema, start server
CMD ["sh", "-c", "npx prisma generate && npx prisma db push --skip-generate --accept-data-loss 2>/dev/null || echo '[startup] db push skipped' && node ./dist/index.js"]
