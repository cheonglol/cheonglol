# copilot-instructions — cheonglol

Write direct, factual prose. No marketing language, no filler adjectives.
Technical documentation style: concise, specific, verifiable.
You are an assistant helping this user's personal assistant.

## Repository state

- Path: `c:\Users\leste\repos\cheonglol\cheonglol`
- Git: branch `main`, monorepo layout (`frontend/`, `backend/`, `docker/`, `scripts/`).
- Environment: Windows (default shell: `cmd.exe`).

## Production URLs

- Frontend: https://cheonglol.github.io/cheonglol/
- Backend: https://cheonglol-backend-production.up.railway.app/
- Health check: `GET /health`
- Issue tracker: https://github.com/cheonglol/cheonglol/issues

## Stack (confirmed & deployed)

| Layer              | Technology                                   |
| ------------------ | -------------------------------------------- |
| Package manager    | Bun (workspaces at root)                     |
| Frontend           | Astro 4 + React 18 + TanStack Query 5 + SASS |
| Backend            | Fastify 5 + Prisma 7 + oRPC-style routes     |
| Database           | PostgreSQL (Railway; dev can use SQLite)     |
| Hosting (frontend) | GitHub Pages via Actions                     |
| Hosting (backend)  | Railway (Nixpacks via `railway.json`)        |
| Fonts              | Inter (sans), JetBrains Mono (code)          |

## Content conventions

- Blog posts: `frontend/content/blog/<yyyy-mm-dd>-slug.md` (Astro collection).
- Post images: `frontend/content/blog/image/<slug>/` folder.
- Categories: `categories: ["tag"]` in frontmatter (legacy `category` key also accepted).
- Resume: local-only script `scripts/gh-resume.ts` uses `gh` CLI; never publish private repos/orgs.

## Features implemented

### Likes (💖)

- UUID-based user tracking: each browser stores `cheonglol-user-id` in localStorage.
- Toggle: clicking heart likes or unlikes; server returns `{ slug, count, userLiked }`.
- Model: `UserLike { id, slug, userId, createdAt }` with `@@unique([slug, userId])`.
- Rate limiting: 10 POST/min global, 3 s per-slug cooldown, 48 hr ban for spam (25+ in 1 min).

### UI

- Sticky sidebar nav with emoji icons and tooltips.
- Blog post modal (min-height 75 vh, scrollable body).
- Skill bars with proficiency labels.

## Prisma 7 configuration

- Config file: `backend/prisma.config.ts` (must remain at backend root, NOT inside `prisma/`).
- Uses `env('DATABASE_URL')` imported from `prisma/config`.
- No migrations folder; we use `prisma db push` (idempotent, diffs schema directly against DB).
- Production dockerfile runs `prisma db push --skip-generate` at container start.

## Docker

- `docker/backend.dockerfile` — production image; runs `prisma db push` then `node ./dist/index.js`.
- `docker/backend.dev.dockerfile` — dev image with nodemon.
- `docker/frontend.dockerfile` / `frontend.dev.dockerfile` — Astro builds.
- No entrypoint scripts; commands are inlined in `CMD`.

## Developer workflows (Windows `cmd.exe`)

```sh
# Install (root)
bun install

# Frontend dev
cd frontend && bun dev

# Frontend build (static for Pages)
cd frontend && bun run build

# Backend dev
cd backend && bun run dev

# Prisma generate + push (dev)
cd backend && bun prisma generate && bun prisma db push
```

## GitHub Actions

- Workflow: `.github/workflows/deploy-astro-to-pages.yml`
- Triggers on push to `main`.
- Uses repository variable `PUBLIC_API_URL` (set in repo settings → Variables).
- Cleans up caches older than 24 hours before each run.

## Railway deployment

- Config: `backend/railway.json`
- Build: `bun install && bun prisma generate && bun run build`
- Start: `node ./dist/index.js` (dockerfile runs db push at start)
- Env vars: set `DATABASE_URL` in Railway dashboard.

## oRPC structure

- Contract: `backend/src/orpc/contract.ts` — Zod schemas for routes.
- Handlers: `backend/src/orpc/handlers/` — Prisma operations.
- Routes: `backend/src/orpc/routes/` — Fastify route registration with rate limiting.
- Frontend client: `frontend/src/orpc/client.ts` — typed fetch wrappers.
- React hooks: `frontend/src/hooks/usePosts.ts` — TanStack Query hooks.

## Key files

| Purpose       | Path                                     |
| ------------- | ---------------------------------------- |
| Prisma schema | `backend/prisma/schema.prisma`           |
| Prisma config | `backend/prisma.config.ts`               |
| Fastify entry | `backend/src/index.ts`                   |
| Astro config  | `frontend/astro.config.mjs`              |
| Landing page  | `frontend/src/pages/index.astro`         |
| Blog page     | `frontend/src/pages/blog.astro`          |
| Like button   | `frontend/src/components/LikeButton.tsx` |
| Posts hooks   | `frontend/src/hooks/usePosts.ts`         |

## Pending work

1. **Thoughts page** (Issue #1) — requires GitHub OAuth; currently blocked.
2. **GitHub OAuth** — needed for authenticated features.
3. **License** — owner to choose (MIT, ISC, etc.).

## Safety & privacy rules

- NEVER publish private repo/org names in the public site or commits.
- Resume script (`scripts/gh-resume.ts`) runs locally only.
- Rate limiting protects backend from spam.

## Behavior rules for agents

- Do not fabricate domain knowledge or implement features without owner approval.
- Prefer minimal, well-documented commits; each change should be reversible.
- When modifying Prisma schema, run `prisma db push` (not migrations) for dev/prod.
- CORS is configured for `https://cheonglol.github.io`; update `backend/src/index.ts` if domain changes.

## Contact

- If owner is unresponsive >72 h, open a draft PR with clear description of pending questions.
