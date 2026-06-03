---
title: "Two ways to handle Prisma migrations: accept data loss vs. don't be stupid"
pubDate: 2025-08-10
description: "The difference between `prisma db push --accept-data-loss` and a pre-deploy safety script — and when to use each."
categories: ["patterns", "backend"]
---

I've used Prisma on every project for the last two years. Across them, I've ended up with two distinct approaches to schema migrations. One is for moving fast when the database doesn't matter. The other is for when it does.

## Approach 1: accept data loss

In the product-info-service (an internal catalog tool for a distribution team), the startup script runs this:

```sh
bunx prisma db push --accept-data-loss
```

Every time the service starts, Prisma reads `schema.prisma` and syncs the database to match. If a column was renamed, it drops the old one and creates a new one. Data loss is explicitly accepted.

**When to use this:**

- The database is non-critical — you can regenerate data
- You're the only developer
- You're iterating fast and the schema changes constantly
- The cost of a broken deploy is low

In practice, this means dev environments, internal tools, and early-stage projects where the schema hasn't stabilized. The tradeoff is speed for safety.

## Approach 2: pre-deploy guard

In themelios, the deploy script is 143 lines and handles three scenarios:

```sh
REAL_MIGRATIONS=$(find "$MIGRATIONS_DIR" -mindepth 1 -maxdepth 1 \
  -type d ! -name "0_init" 2>/dev/null | wc -l)

if [ "$REAL_MIGRATIONS" -gt 0 ]; then
  # Versioned migrations exist — safe deploy mode
  prisma migrate deploy

elif [ "$IS_PRODUCTION" = true ]; then
  # Production without migrations — refuse to deploy
  echo "FATAL: No migrations in production. Create one first."
  exit 1

else
  # Dev/UAT — fast iteration mode
  prisma db push --accept-data-loss
fi
```

The script auto-detects the environment from `RAILWAY_ENVIRONMENT_NAME`. Anything starting with "prod" is production, and production **never** gets `db push`. If no versioned migrations exist in production, the deploy hard-fails before any code runs.

**When to use this:**

- The database has data you can't recreate
- Multiple people (or AI agents) are touching the schema
- You're deploying to production
- You want to know *exactly* what changed between schema versions

## Bridging from approach 1 to approach 2

The transition is a script called `db:baseline`. It takes the current `schema.prisma`, generates a `migrations/0_init/` directory, and marks it as applied. After that, every schema change gets a versioned migration:

```sh
prisma migrate dev --name add_customer_notes
```

Now `migrate deploy` works, the pre-deploy script uses migration mode, and `db push` is locked out of production.

## Which approach lives where

| Project | Approach | Why |
|---------|----------|-----|
| product-info-service | `db push` on startup | Internal tool, data is regeneratable |
| themelios | Pre-deploy safety script | Production, multi-tenant, can't lose data |

Both are valid. The mistake is using one when you should be using the other. Rule of thumb: if you'd be upset losing the database, use approach 2.
