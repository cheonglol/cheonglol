---
title: "oRPC: when your frontend and backend drift, TypeScript screams before you deploy"
pubDate: 2025-07-15
description: "Contract-first RPC that catches API mismatches at build time instead of runtime."
categories: ["patterns", "typescript"]
---

A REST API between two repos drifts. You change a response shape in the backend, forget to update the frontend, and nothing breaks until a user hits that endpoint in production. Or worse — nothing breaks, the data just goes missing silently.

oRPC solves this by making the contract **the single source of truth that both sides import from**. If they disagree, `tsc` fails the build. You know before deploying.

## How it works

In themelios, the contract lived in a shared package (`shared-types/`). It defined every procedure — its input schema, output schema, and name — in one place. Both the backend and frontend installed this package as a dependency.

**The contract** (`shared-types/src/contracts/orpc/collections.ts`):

```ts
export const ListCollectionsInputSchema = z.object({
  tenantId: z.string().min(1),
  groupBy: z.enum(["stage", "customer", "none"]).default("stage"),
  filterStage: ReminderStageSchema.optional(),
  searchQuery: z.string().optional(),
});

export const ListCollectionsOutputSchema = z.object({
  collections: z.array(CollectionSchema),
  totalCount: z.number(),
});
```

**The backend** registers it:

```ts
const collectionsRouter = {
  listCollections: os
    .input(ListCollectionsInputSchema)
    .output(ListCollectionsOutputSchema)
    .handler(async (opt) => {
      const rows = await db.collections.findMany({ where: opt.input });
      return { collections: rows, totalCount: rows.length };
    }),
};
```

**The frontend** calls it:

```ts
const result = await orpc.receivables.collections.listCollections({
  tenantId: "abc",
  groupBy: "customer",
});
// result is typed: { collections: Collection[], totalCount: number }
```

If the backend handler returns a wrong shape — say it forgets `totalCount` — TypeScript errors at compile time. If the frontend passes a wrong field name — same thing. The contract file is imported by both sides, so neither can drift.

## Why this matters for solo devs

When you maintain both the frontend and backend alone, it's easy to miss a field rename or a type change. Tests catch some of it, but tests have to be written. oRPC catches it for free because the Zod schemas run at runtime *and* their inferred types run at compile time.

It also means you can work on the frontend and backend independently — in separate repos, separate deploy cycles — and still know they'll fit together. The shared contract package is the interface.

## Tradeoffs

oRPC is newer than tRPC. Smaller community, fewer examples, less battle-tested. The contract has to live in a shared package, which means either a monorepo or a publish step for the shared types. In themelios we used a monorepo with `shared-types` as a workspace — no publish step needed, just `pnpm install`.

For a single-person operation, the payoff is: **one less class of production bug**. No more "the API changed and I forgot to update the client." TypeScript handles it.
