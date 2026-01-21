FROM node:20-slim
WORKDIR /app/backend
COPY backend/package.json backend/
RUN npm ci --no-audit --no-fund
COPY backend/ backend/
RUN npm run build
CMD ["node", "./dist/index.js"]
