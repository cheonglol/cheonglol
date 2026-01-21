<!-- Auto-generated for an empty repository snapshot. Update when repository gains source files. -->

# copilot-instructions — cheonglol

Repository state (discovered):

- Path: `c:\Users\leste\repos\cheonglol\cheonglol`
- Git: repository present, branch `main` (monorepo-like layout: `frontend/`, `backend/`, `docker/`).
- Environment: Windows (default shell: `cmd.exe`).

Purpose for AI coding agents

- Primary objective: implement a minimal, production-ready portfolio + blog scaffold matching the owner's preferences: Bun (package manager) + Astro (frontend SPA with multiple pages), Fastify + Prisma backend (TypeScript), and CI that publishes the frontend to GitHub Pages.
- Be conservative with private data: provide local-only helpers to surface private GitHub data (via `gh`) but do not publish private repo/org names in the public site or commits.

Immediate workplan (priority)

1. Confirm one small open question: which ORPC implementation does the owner mean (provide repo or npm package name)?
2. If confirmed, scaffold the monorepo (one focused PR):
   - `frontend/` — Astro (TypeScript + React) with content-driven blog in `frontend/content/blog/` and static build for GitHub Pages.
   - `backend/` — Fastify (TypeScript) skeleton, Prisma schema for `Post`, JSON-RPC fallback + pluggable ORPC adapter.
   - CI — GitHub Actions workflow that builds the frontend with Bun and deploys to `gh-pages`.
3. Provide a small set of deterministic smoke checks and an explicit list of follow-ups that require owner input (ORPC package, production DATABASE_URL, license choice).

Project-specific, discoverable conventions

- Stack choices (owner preference): Bun, Astro, TypeScript everywhere, Fastify, Prisma, GitHub Pages for hosting.
- Content conventions:
  - Blog posts: `frontend/content/blog/<yyyy-mm-dd>-slug.md` (Astro collection).
  - Blog posts: `frontend/content/blog/<yyyy-mm-dd>-slug.md` (Astro collection).
  - Categories / labels: use `categories: ["tag"]` in frontmatter. The site also accepts the legacy `category` key and will normalize it to `categories`.
  - Resume: generated at build-time if the owner runs a local script that calls the `gh` CLI; public site will only show curated/approved items.
  - Backend schema: `backend/prisma/schema.prisma` (dev: SQLite; production: set DATABASE_URL to Postgres).
- Docker: lightweight images in `docker/` (optional for dev); existing files are placeholders — update them when containerizing.

Developer workflows (exact commands for Windows `cmd.exe`)

- Install (root, Bun workspace):
  - bun install
- Frontend dev (inside `frontend`):
  - cd frontend && bun dev
- Frontend build (static output for Pages):
  - cd frontend && bun build
- Backend dev (inside `backend`):
  - cd backend && bun run dev
- Resume (local-only, uses `gh`):
  - node scripts/gh-resume.js # run only locally after authenticating `gh`

Prisma / database

- Dev flow (SQLite):
  - cd backend && bun prisma generate
  - cd backend && bun prisma migrate dev --name init
- Production: set DATABASE_URL to a Postgres connection string and run `prisma migrate deploy` in CI.

ORPC guidance (important)

- Do not assume a specific ORPC implementation. The canonical directory name is `backend/src/orpc/` (matches `@orpc/*` packages). Provide a small JSON-RPC fallback implementation in `backend/src/orpc/fallback/` and a pluggable adapter so the owner can supply the official `@orpc/*` packages. Ask the owner to confirm the package — the scaffold will include clear TODOs and an adapter interface.

oRPC (unnoq) + TanStack Query — recommended quickstart

- Use the official oRPC packages (docs: https://orpc.unnoq.com). Recommended packages:

  - Server/contract: `@orpc/contract`, `@orpc/server`, `@orpc/standard-server-fastify`
  - Frontend (React + TanStack Query): `@orpc/react-query`, `@tanstack/react-query`

- Why: end-to-end TypeScript contracts (define procedure signatures once in `@orpc/contract`) and consume them in the frontend with first-class TanStack Query hooks via `@orpc/react-query`.

- Minimal developer flow:

  1. Define contract in `backend/src/orpc/contract.ts` using `@orpc/contract`.
  2. Implement handlers and register them with Fastify via the official Fastify adapter.
  3. Export or generate a typed client (local workspace import or publish to npm/private registry).
  4. In the frontend import the generated contract/client and use `createReactQueryHooks` from `@orpc/react-query` to get typed hooks that integrate with TanStack Query.

- Example (conceptual):

  - Install: bun --cwd frontend add @tanstack/react-query @orpc/react-query
  - Usage: `const rpc = createReactQueryHooks<AppContract>();` then `rpc.useQuery(['posts.getAll'])` — hooks are fully typed.

- CI / deployment notes:
  - CI should build the backend contract (type-check) and ensure the generated client used by `frontend/` is up-to-date. Add a check in CI that `frontend` and `backend` contracts match (simple `tsc` step or a unit that imports the contract from the backend workspace).

Important: do not publish or expose private procedure names or private repo/org data in the public site. Keep any `gh`-driven resume generation local-only unless the owner explicitly opts in.

Files and locations an AI should modify or inspect

- Frontend: `frontend/src/pages/` (landing + blog), `frontend/content/blog/` (markdown posts), `frontend/package.json`, `astro.config.*`.
- Backend: `backend/src/` (Fastify routes + RPC shim), `backend/prisma/schema.prisma`, `backend/.env.example`.
- Devops: `docker/` (Dockerfiles + entrypoints), `.github/workflows/pages.yml` (Pages CI), `scripts/gh-resume.ts` (local-only resume generator).

Safety & privacy rules (must-follow)

- NEVER publish or display the owner's private repos/org names in the public site or commits. Provide local scripts that the owner runs to inject private data.
- Implement ORPC as a pluggable adapter with a secure default (JSON-RPC fallback) until the owner confirms the exact library.

What to include in the initial PR from an agent

- One-line summary and chosen stack (Astro + Bun frontend; Fastify + Prisma backend).
- How to run locally (Windows `cmd.exe`) with exact commands and expected smoke outputs.
- Files added and why (list of high-impact files).
- A tiny smoke test: frontend builds and serves; backend returns sample posts at `/api/posts`.
- Explicit list of follow-ups that require owner input (ORPC package, production DATABASE_URL, license choice).

If anything in these instructions is unclear or you want the scaffold adjusted (different CSS, prefer `docs/`→Pages vs `gh-pages` branch, or a different DB), tell me which option to implement and I will update the scaffold and the PR accordingly.

Examples an agent may propose (include when the user approves a stack)

- Node (recommended minimal):

  - Files to add: `package.json`, `src/index.js`, `tests/smoke.test.js`, GitHub Actions `ci.yml`.
  - Example run instructions to include in `README.md` (Windows `cmd.exe`):
    - npm install
    - npm test

- Python (recommended minimal):
  - Files to add: `pyproject.toml` or `requirements.txt`, `src/`, `tests/`, GitHub Actions `ci.yml`.
  - Windows quick commands to document: `py -3 -m venv .venv` then `.venv\Scripts\pip.exe install -r requirements.txt`

When to ask the user (explicit, required questions)

- What language / framework do you want this repository to be? (show 2–3 presets with trade-offs)
- Preferred package manager / Python version / Node LTS? Any internal templates or license preference?
- Do you want CI on push + PR (GitHub Actions) and a coverage badge in the README?

What to include in the initial PR (agent checklist)

- Purpose and chosen stack (1–2 sentences).
- Files added with short rationale (README, src example, tests, CI).
- How to run locally on Windows (`cmd.exe`) and the expected smoke-test output.
- A tiny test that passes on CI and locally.
- Suggested next tasks (API design, feature A, add integration tests).

Behavior rules for agents working in this repo

- Do not fabricate domain knowledge or implement features without explicit owner approval.
- If the repo is empty, always present choices and a minimal plan before creating code.
- Prefer minimal, well-documented commits — each change must be reversible and covered by a smoke test.

Where to look later (when code appears)

- Root manifests: `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`.
- Source: `src/`, `app/`, or language-specific defaults.
- Tests: `tests/`, `spec/`, or `__tests__/`.

Contact / escalation

- If the owner is unresponsive for >72 hours after a proposed scaffold, open a draft PR and add a clear PR description with the questions the agent asked.

If anything in these instructions is unclear or you expected different priorities, tell me which areas to expand or which stacks to prepare templates for and I'll iterate.
