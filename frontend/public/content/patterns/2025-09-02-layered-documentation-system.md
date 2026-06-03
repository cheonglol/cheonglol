---
title: "A layered documentation system for AI-assisted development"
pubDate: 2025-09-02
description: "How to make AI assistants consistently follow your conventions — with a documentation system that loads the right rules at the right time."
categories: ["patterns", "ai"]
---

I got tired of AI assistants guessing my conventions wrong. Every project has different rules — backend patterns that evolved across six projects, database conventions that caught subtle bugs, frontend approaches I settled on after rewrites.

The solution: a four-layer documentation system. Each layer serves a different purpose and a different audience (human or AI).

## Layer 1 — Code Standards

Single source of truth for all coding rules. One file per topic, numbered for reference:

```
documents/code-standards/
  00-principles.mdx
  01-git.mdx
  04-backend.mdx
  05-database.mdx
  06-frontend.mdx
  08-testing.mdx
```

These are the authoritative rules. The backend file covers Fastify patterns — security (CORS, rate limiting, request validation), environment variable handling, error handling, logging. The database file covers Prisma conventions, migration rules, query patterns.

No rule lives in two places. If a rule drifts between files, you have two different versions of "correct" and neither is trustworthy.

## Layer 2 — Scoped Instructions

VS Code can auto-inject instruction files based on the file path you're editing. If you open `src/api/orders.ts`, the backend instructions load automatically. If you open a database file, the database instructions appear.

These are short — just the key constraints that apply to that area:

```
- Route handlers only call repo functions from src/db/ — no direct Prisma queries in routes
- All write-endpoint request bodies require a JSON Schema with additionalProperties: false
- External API calls always follow a DB write and are wrapped in try/catch
- Webhook handlers must not throw after a DB write
- Never access process.env outside src/config/index.ts
```

Each instruction file also points to the relevant code-standards file for the full rules.

## Layer 3 — Agent Prompts

These are workflow scripts for AI agents. Each one walks through a specific task step by step:

- `audit-code-standards.prompt.md` — scan the codebase for violations, produce a prioritized remediation plan
- `audit-deployment.prompt.md` — check that CI config matches the documented deployment flow
- `implement-feature.prompt.md` — pre-implementation checklist (spec → design → code layer mapping)

Each prompt starts by loading context — reading the project's audit config, product spec, system design — then executing a structured process. No guessing, no skipping steps.

## Layer 4 — Per-Project Documentation

Each project with meaningful domain logic gets three files at its root:

- `_product-specification.mdx` — domain truth: actors, core flows, invariants, what-it-is-NOT
- `_system-design.mdx` — architecture truth: process model, data model, module boundaries, job architecture
- `_features.mdx` — feature registry: status, scope, billing surfaces

Before any code changes, the AI reads these to understand what the project is, how it's structured, and what the constraints are.

## What this system enforces

The documentation isn't just for the AI — it's for me. Writing down the rules forces clarity. If I can't describe a convention clearly, I probably don't have one and I'm just operating on instinct. That's fine until something breaks differently in two places because I applied the instinct inconsistently.

The layered approach also means rules are loaded at the right level of detail. The AI doesn't need 50 pages of backend standards when it's fixing a CSS bug. It gets the scoped instruction for that area, plus a pointer to the full rules if it needs depth.

## The real win

With enough structure in the docs, the AI's output is consistent without hand-holding. I don't have to correct it on conventions — they're already loaded. The bottleneck shifts from "can the AI write this code" to "is this actually what we need." That's where human attention should be.
