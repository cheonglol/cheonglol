FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install nodemon and tsx globally for hot-reload
RUN npm install -g nodemon tsx

# Copy package files first for caching
COPY backend/package.json backend/package-lock.json* ./backend/
WORKDIR /app/backend
RUN npm install

# Copy nodemon config and source code
COPY backend/nodemon.json ./
COPY backend/src ./src
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./
COPY backend/tsconfig.json ./

WORKDIR /app/backend

# Generate Prisma client, push schema, then start nodemon
CMD ["sh", "-c", "npx prisma generate && npx prisma db push --skip-generate || true && nodemon"]
