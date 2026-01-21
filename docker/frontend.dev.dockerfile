FROM oven/bun:latest

WORKDIR /app

# Copy package files first for caching
COPY frontend/package.json frontend/bun.lockb* ./frontend/
WORKDIR /app/frontend
RUN bun install

# Copy source code and config
COPY frontend/src ./src
COPY frontend/content ./content
COPY frontend/public ./public
COPY frontend/astro.config.mjs ./
COPY frontend/tsconfig.json ./

WORKDIR /app/frontend

# Astro dev server with host flag for Docker networking
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]
