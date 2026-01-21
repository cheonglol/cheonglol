# oRPC Implementation Guide

This directory contains the oRPC-first RPC contract and server implementation. The name `orpc` matches the upstream unnoq/oRPC packages (`@orpc/*`).

## Directory Structure

```
backend/src/orpc/
├── contract.ts          # Authoritative types and procedure signatures (Zod schemas)
├── handlers/            # Business logic handlers
│   ├── index.ts         # Re-exports all handlers
│   └── posts.handler.ts # Posts-related handlers
├── routes/              # Fastify route registration
│   ├── index.ts         # Dynamic route registration entry point
│   └── posts.route.ts   # Posts API routes
└── README.md            # This file
```

## Adding New Routes

1. Create handler: `handlers/foo.handler.ts`

   - Export a factory function: `createFooHandlers()`
   - Add to `handlers/index.ts` re-exports

2. Create route: `routes/foo.route.ts`

   - Import handler from `../handlers/foo.handler.js`
   - Export async function `fooRoutes(app: FastifyInstance)`

3. Register in `routes/index.ts`:

   ```ts
   import { fooRoutes } from "./foo.route.js";

   const routeModules = [
     { prefix: "/api/orpc", register: postsRoutes },
     { prefix: "/api/foo", register: fooRoutes }, // Add here
   ];
   ```

## Conventions

- **Contract**: `contract.ts` - Zod schemas defining types and procedure signatures
- **Handlers**: Pure business logic, no HTTP concerns, Prisma fallback to in-memory seed
- **Routes**: Fastify route definitions, delegates to handlers

## Quick Developer Flow

1. Define types/schemas in `contract.ts`
2. Implement handlers in `handlers/`
3. Wire routes in `routes/`
4. Frontend consumes via `@orpc/react-query` hooks
