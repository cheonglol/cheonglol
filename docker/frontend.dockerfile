FROM oven/bun:latest

WORKDIR /app/frontend

# Copy package files first for caching
COPY frontend/package.json frontend/bun.lockb* ./

# Install dependencies
RUN bun install

# Copy source code and config
COPY frontend/src ./src
COPY frontend/content ./content
COPY frontend/public ./public
COPY frontend/astro.config.mjs ./
COPY frontend/tsconfig.json ./

# Build static site
RUN bun run build

# Serve with preview
CMD ["bun", "run", "preview", "--host", "0.0.0.0"]
