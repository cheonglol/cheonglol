---
title: "Fastify + Prisma conventions I stick to after 6 projects"
pubDate: 2026-06-03
description: "The patterns that survived production across multiple client projects."
categories: ["backend", "typescript"]
---

After 6 projects using Fastify with Prisma and PostgreSQL, some patterns stuck and some didn't. Here's what survived.

## Route handlers only call the DB layer

No Prisma queries in route files. Routes call functions from a `src/db/` layer, which handles the actual queries. Keeps routes thin, keeps query logic testable, and stops you from scattering `.findMany()` calls across the codebase.

## All write endpoints require `additionalProperties: false`

Fastify supports JSON Schema validation natively. Setting `additionalProperties: false` on request bodies means extra fields get rejected instead of silently ignored. Saved me from at least one bug where a client sent a field I didn't expect and the code just... didn't process it.

## External API calls always follow DB writes

If you're calling Stripe, Telegram, or any external API, do the DB write first, then make the call. If the external call fails, you have the data in your database and can retry. If you do it the other way, you have a payment but no record of it.

Wrap the external call in try/catch and handle the failure gracefully.

## Webhook handlers must not throw after a DB write

If a webhook handler writes to the database and then throws, the webhook provider retries. Now you have duplicate writes. Structure webhook handlers so all validation and idempotency checks happen before any writes.

## Never access `process.env` outside the config layer

One file reads environment variables, validates them, and exports a typed config object. Everything else imports from there. If a variable is missing, the app fails at startup instead of at runtime with a cryptic `undefined`.

## Why these work

They're boring. There's nothing clever about any of these rules. They're the kind of thing you learn after debugging the same type of bug three times. Write them down once and never make that mistake again.
