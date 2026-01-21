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
COPY backend/tsconfig.json ./

WORKDIR /app/backend

# Use nodemon with config file
CMD ["nodemon"]
