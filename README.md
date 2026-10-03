# cheonglol

Personal site with a profile and a blog. The frontend is Astro 4 + React. It builds to static files and deploys to GitHub Pages.

## Layout

| Directory   | Contents                                                        |
|-------------|-----------------------------------------------------------------|
| `frontend/` | Astro site. Blog posts live in `frontend/public/content/blog/`. |
| `scripts/`  | Resume PDF generator.                                           |
| `tests/`    | Tests for the resume generator.                                 |

The repo uses Bun workspaces under the root `package.json`.

## Content sources

- `frontend/src/data/resume.ts` — profile and resume data. The profile page, the resume PDF, and `/llm.txt` all render from this one file.
- `frontend/public/content/blog/*.md` — blog posts.

## Links

- Site: https://cheonglol.github.io/cheonglol/
- Resume: https://cheonglol.github.io/cheonglol/resume.pdf
- Plain text: https://cheonglol.github.io/cheonglol/llm.txt

## Commands

Run these from the repo root.

| Command                   | What it does                                              |
|---------------------------|-----------------------------------------------------------|
| `bun install`             | Install workspace dependencies.                           |
| `bun run dev`             | Start the Astro dev server.                               |
| `bun run build`           | Generate the resume, run tests, build the frontend.       |
| `bun test`                | Run the test suite.                                       |
| `bun run preview`         | Preview the built frontend.                               |
| `bun run smoke`           | Build the frontend and check that `frontend/dist` exists. |
| `bun run generate:resume` | Regenerate the resume PDF.                                |
