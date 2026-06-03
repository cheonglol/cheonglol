---
title: "How I structure AI prompts for consistent code output"
pubDate: 2026-06-03
description: "A layered documentation system that makes AI assistants actually follow my conventions."
categories: ["ai", "workflow"]
---

I got tired of AI assistants guessing my conventions wrong. Every project has different rules, and telling the AI "follow my style" doesn't work when it has no reference for what that means.

So I built a layered documentation system.

## Layer 1 — Code Standards

These are the authoritative rules, organized by topic. One file for backend patterns, one for database, one for frontend, one for testing. They're numbered so you can tell new people (human or AI) to "read 04-backend and 05-database before touching anything."

Single source of truth. If a rule lives in more than one place, it'll drift.

## Layer 2 — Scoped Instructions

VS Code has a feature where it auto-injects instruction files based on the file path you're editing. If you open `src/api/orders.ts`, the backend instructions file gets loaded automatically. You don't have to remember to fetch it — it's just there.

These are short. Just the key constraints that apply to that area, plus a pointer to the full standards file if you need depth.

## Layer 3 — Agent Prompts

These are workflow scripts, not reference docs. They tell the AI what to do step by step. Things like:

- "Audit this codebase against the standards"
- "Prepare a new project into this workspace"
- "Run the pre-implementation checklist"

Each one starts by loading context, then walks through the steps. No guessing, no skipping.

## What I learned

The bottleneck isn't whether the AI can write code — it's whether it knows what good code looks like for *your* project. A layered documentation system removes the guesswork. The AI reads the right rules for the right context, and the output is consistent without hand-holding.

Also forces you to actually write down your conventions, which means you have to know what they are. That alone is worth it.
