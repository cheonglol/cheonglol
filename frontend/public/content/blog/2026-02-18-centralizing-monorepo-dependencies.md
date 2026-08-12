---
title: "Centralizing Dependencies in a pnpm Monorepo"
pubDate: 2026-02-18
description: "Procedure for eliminating silent version drift across pnpm workspaces via root-level dependency declaration."
categories: ["pnpm", "monorepo"]
---

I found this problem while working with oRPC and Prisma in a pnpm monorepo. oRPC is a contract-first TypeScript RPC framework. Zod schemas go into a shared contract. Typed server handlers and typed client calls are derived from it, with no codegen step. Prisma is a TypeScript ORM where a declarative schema file produces a typed database client. Prisma 7 introduced `prisma.config.ts` for configuration.

Both libraries ship frequent minor releases. Both were declared separately in the backend and frontend `package.json` files. Both resolved to different concrete versions in the lockfile without producing any warning, error, or log output.

## The problem

In a pnpm monorepo, each child workspace independently declares and resolves its dependencies. When two workspaces declare the same package with compatible but non-identical ranges, pnpm MAY resolve them to different versions over time.

For example, `backend/package.json` declares `"@orpc/server": "^1.10.0"`. `frontend/package.json` declares `"@orpc/client": "^1.10.0"`. Both satisfy `^1.10.0`, but the backend MAY end up on `1.11.2` while the frontend sits on `1.10.0`. Neither workspace knows what the other resolved to. This is version drift — silent, diagnostic-free, and only observable by inspecting the lockfile manually.

To detect it:

```bash
grep -rn "@orpc/" backend/package.json frontend/package.json package.json
```

If the same package appears across multiple workspace manifests with differing ranges, drift SHOULD be assumed.

## The solution

Shared dependencies MUST be declared in the root `package.json`. Corresponding entries in child workspace manifests MUST be removed.

```json
{
  "dependencies": {
    "@orpc/client": "^1.13.2",
    "@orpc/server": "^1.13.2",
    "@orpc/openapi": "^1.13.2",
    "@prisma/client": "^7.0.0"
  }
}
```

This produces a single declaration site, a single resolved version, and a single place to bump when updating.

## How `shamefully-hoist=true` makes this work

Under default pnpm configuration, workspaces are strictly isolated. A workspace can only resolve packages declared in its own `package.json`. Node's module resolution checks the workspace-local `node_modules`. It fails to find undeclared packages and terminates without walking up to root.

When `shamefully-hoist=true` is set in `.npmrc`, pnpm hoists all packages to a single flat `node_modules` at the project root. Resolution then behaves identically to npm — any workspace MAY import any package installed anywhere in the tree.

This means child workspace declarations become documentation, not functional requirements. The root `package.json` is the sole authoritative source for what version gets resolved.

## When to use this

This procedure applies when: deployment uses Dockerfiles that copy the full project tree and run `pnpm install` from root; `pnpm deploy` is not used for standalone workspace bundling; `shamefully-hoist=true` is a permanent configuration.

This procedure SHOULD NOT be applied when: `pnpm deploy` is used to produce isolated workspace bundles; there is intent to disable hoisting in the future; explicit per-workspace dependency documentation is a project requirement.

## The procedure

```bash
# Identify duplicated declarations
grep -rn "@orpc/" backend/package.json frontend/package.json package.json

# Consolidate to root package.json; remove from child manifests

# Reinstall
pnpm install

# Verify single version resolution
grep -A1 "@orpc/" pnpm-lock.yaml | head -30
```

## Summary

Version drift across pnpm workspaces is silent, produces no diagnostics, and manifests only at runtime. Centralizing shared dependency declarations at the root workspace, together with `shamefully-hoist=true`, eliminates the condition entirely. One declaration site, one resolution, zero ambiguity.
