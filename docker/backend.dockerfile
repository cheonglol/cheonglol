FROM oven/bun:1 AS builder

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

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

# Generate Prisma client
RUN bun prisma generate

# Build TypeScript
RUN bun run build

# Production stage - use Node for smaller runtime
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Copy built files and node_modules from builder
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/prisma.config.ts ./
COPY --from=builder /app/backend/package.json ./

# At runtime: db push then start
CMD ["sh", "-c", "npx prisma db push --skip-generate --accept-data-loss 2>/dev/null || echo '[startup] db push skipped' && node ./dist/index.js"]
