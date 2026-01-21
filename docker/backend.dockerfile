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

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Start the server
CMD ["node", "./dist/index.js"]
