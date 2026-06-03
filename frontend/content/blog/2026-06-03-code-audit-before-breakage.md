---
title: "Why I audit my own code (and you should too)"
pubDate: 2026-06-03
description: "Running structured audits on your own codebase catches problems before they reach production — no second pair of eyes needed."
categories: ["workflow", "engineering"]
---

I audit my own code. Not with a human reviewer — there's no team for that — but with structured prompts that tell an AI exactly what to check.

## What the audit covers

Each project has an audit config that lists what files to check. The prompt then walks through:

**Standards violations:** Is anyone accessing `process.env` outside the config layer? Are DB queries leaking into route handlers? Are write endpoints missing input validation? These are things you *know* are wrong but miss when you're moving fast.

**General malpractices:** Hardcoded secrets, unhandled promise rejections, `any` types that could be properly typed, N+1 query patterns, missing await on async calls. The checklist is long but the prompt runs it every time.

**Deployment wiring:** Does the CI config match the documented deployment flow? Are the right branches mapped to the right environments? Is the healthcheck path actually implemented? Deployment configs drift from docs faster than anything else.

## Severity classification

Every finding gets tagged: critical (will break production), high (violates a hard rule), medium (against standards but not urgent), low (style/naming).

The output is a prioritized remediation list. Fix the criticals first, then highs, then decide if the mediums matter.

## Why not just rely on review

Because there's no reviewer. And even when there is, humans miss things that scripts don't. A structured audit catches the boring stuff so human attention goes to what actually matters.

Also: the act of writing down what "good" means — in the standards files — forces clarity. If you can't describe a rule, you probably don't have one.
