FROM oven/bun:latest
WORKDIR /app/frontend
COPY frontend/package.json frontend/
COPY .bun /root/.bun
RUN bun install
COPY frontend/ frontend/
RUN bun build
CMD ["bun", "--cwd", "frontend", "preview"]
