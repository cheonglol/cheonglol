# cheonglol

Personal site with a profile and a blog. The frontend is Astro 4 + React, deployed to GitHub Pages. The backend is Fastify + Prisma, deployed to Railway.

## Monorepo layout

| Directory   | Contents                                                        |
|-------------|-----------------------------------------------------------------|
| `frontend/` | Astro site. Blog posts live in `frontend/public/content/blog/`. |
| `backend/`  | Fastify API with oRPC-style routes.                             |
| `docker/`   | Dockerfiles for frontend and backend (dev and production).      |
| `scripts/`  | Resume generation scripts.                                      |

The repo uses Bun workspaces. The root `package.json` manages both `frontend/` and `backend/`.

## Links

- Site: https://cheonglol.github.io/cheonglol/
- Backend: https://cheonglol-backend-production.up.railway.app/
- Health check: https://cheonglol-backend-production.up.railway.app/health

## Commands

Run these from the repo root.

| Command                 | What it does                                                    |
|-------------------------|-----------------------------------------------------------------|
| `bun install`           | Install all workspace dependencies.                             |
| `bun run dev`           | Start frontend and backend with Docker Compose.                 |
| `bun run dev:frontend`  | Start the Astro dev server.                                     |
| `bun run dev:backend`   | Start the backend with hot reload.                              |
| `bun run build`         | Generate the resume, run tests, build frontend and backend.     |
| `bun test`              | Run the test suite.                                             |
| `bun run preview`       | Preview the built frontend.                                     |
| `bun run smoke`         | Build the frontend and check that `frontend/dist` exists.       |
| `bun run generate:resume` | Regenerate the resume PDF.                                    |
