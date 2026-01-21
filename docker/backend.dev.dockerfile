FROM node:20-slim

WORKDIR /app

# Install nodemon and tsx globally for hot-reload (tsx works with ESM)
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
COPY docker/backend.entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /app/backend

# Generate Prisma client and start with nodemon
ENTRYPOINT ["/entrypoint.sh"]
