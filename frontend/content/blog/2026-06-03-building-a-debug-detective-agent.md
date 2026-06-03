---
title: "Building an AI agent that debugs for me"
pubDate: 2026-06-03
description: "An agent that investigates bugs, traces root causes, and reports findings — without writing a single line of fix code."
categories: ["ai", "agents"]
---

I built an AI agent whose only job is to debug. It reads logs, traces call paths, checks git history, and reports what it finds. It never writes fixes.

That constraint is deliberate.

## Why no fixes

When an AI debugs and fixes in one pass, it often makes the wrong fix because it didn't fully understand the problem. Separating investigation from remediation forces clarity. The agent reports the root cause with evidence, and a human (or a different agent) decides what to do about it.

## How it works

1. **Reproduce** — Understand the symptoms. What happened vs what was expected.
2. **Trace** — Follow the call path from entry point to failure. Check logs, source files, recent git history.
3. **Isolate** — Narrow down to the specific module, function, or line where behavior diverges.
4. **Hypothesize** — Form a theory of the root cause. Try to disprove it with additional evidence.
5. **Document** — Record the symptom, trace path, root cause (with file:line), supporting evidence, and what a fix would need to address.

## The output

```
## Symptom
{what went wrong, how to reproduce}

## Trace Path
{call chain from entry to failure}

## Root Cause
{file:line — what is actually wrong}

## Evidence
{logs, stack traces, git blame, test output}

## Fix Requirements
{what a correct fix needs to address — no code}
```

## What this changes

Instead of "this thing is broken, can you fix it," the workflow becomes "here's the root cause report, here's what needs to happen." The investigation is done once, thoroughly, and the fix can be evaluated against the findings.

Also keeps the AI from accidentally making things worse by fixing the wrong thing.
