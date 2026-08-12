---
title: "Why I removed the old cheonglol/cheonglol repo"
pubDate: 2026-01-21
description: "Using this workspace to experiment with developer experience and AI-assisted workflows."
categories: ["announcement", "meta"]
---

This workspace is an experiment in developer experience and building with AI.

## Why Bun

Bun handles package management, script running, and TypeScript execution in one tool. No separate `ts-node`, no slow `npm install`. Workspaces work out of the box. Cold starts are fast. That matters when iterating with AI-less waiting, more building.

## Why oRPC

I like the contract-first approach. Define schemas once in `@orpc/contract`, get typed handlers on the backend and typed hooks on the frontend. No codegen step, no manual sync between client and server types.

It also pairs well with Prisma. Zod schemas in the contract, Prisma models in the database-both TypeScript-native, both validating at runtime. The stack composes cleanly.

tRPC is the obvious alternative. oRPC is newer, less battle-tested. That's partly why I'm experimenting with it.

## Telegram workflow

Future goal: post to a Telegram bot, have it commit markdown to this repo, trigger a build. Write from my phone, publish without touching a laptop.

Not implemented yet. Documenting the intent.

## On AI and standards

With AI, any developer can move fast. The bottleneck shifts from "can I write this code" to "do I know what good code looks like."

Junior developers with taste now operate like seniors. They recognise when AI output is wrong, when abstractions are leaky, when tests are missing. The skill isn't prompting-it's judgement.

Developers without standards just ship faster garbage.

This workspace is partly about testing that thesis: can I maintain quality while moving at AI-assisted speed?
