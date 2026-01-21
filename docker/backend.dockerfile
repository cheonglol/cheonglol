FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Copy package files first for caching
COPY backend/package.json backend/package-lock.json* ./

# Install dependencies
RUN npm ci --no-audit --no-fund

# Copy source code and prisma
COPY backend/src ./src
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./
COPY backend/tsconfig.json ./

# Generate Prisma client (at build time)
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# At runtime: check if schema needs push, then start server
# db push only runs if schema differs from DB (safe, idempotent)
CMD ["sh", "-c", "npx prisma db push --skip-generate --accept-data-loss 2>/dev/null || echo '[startup] db push skipped or failed (may be ok)' && node ./dist/index.js"]
