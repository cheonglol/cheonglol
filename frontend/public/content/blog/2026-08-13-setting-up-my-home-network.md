---
title: "How I let an AI run my home network (and actually liked it)"
pubDate: 2026-08-13
description: "I run my home infrastructure with an AI agent driving an open-source Docker manager. The setup, the rules, and the security thinking."
categories: ["homelab", "ai"]
---

I run my home infrastructure on a small machine in my apartment. Docker containers,
a web manager, a few game servers, some databases. Nothing special — except that I
built and maintain it by talking to an AI agent instead of clicking through UIs.

This post is about the setup, the rules I ended up with, and the security
thinking behind it.

## The stack

One machine is the **hub**. It runs a manager called **Arcane** — an open-source
Docker manager (a Portainer alternative). Arcane gives me a web UI and an API for
every container on the machine.

A second machine connects to the hub through an Arcane agent. The agent dials out;
no inbound ports needed. Both machines show up in the same manager, and I can
control containers on either one from a single dashboard.

The important part: the AI agent (opencode, running on the hub machine) talks to
Arcane's API directly. So it doesn't just edit config files — it creates projects,
redeploys stacks, renames containers, and reads live state. One AI sitting on top
of the manager can operate every machine underneath it.

## Why I let an AI do the config

I am not a networking person. Docker networking, DNS, reverse proxies — all of it
was a blur. With the AI agent I describe what I want, it proposes the exact
changes, and I greenlight before it touches anything. It explains every step in
plain language.

The rule that made this work: **no action without my approval.** The agent
investigates freely, but changes come with a proposal first. That split — read
anything, write only on approval — kept me in control while it did the actual work.

## The standards that emerged

After a few sessions, the agent and I converged on rules. They are now written in
the repo's README so any future session follows them.

**Naming.** Docker Compose auto-generates names like `project-service-1`, which
produces repeated-looking names. We now control names explicitly:

- `container_name:` on every service — clean, meaningful names.
- `name:` at the top of the compose file — the project name is explicit, and the
  folder name becomes irrelevant.
- Container names must be unique per machine.
- Internal links always use service names, never container names. That is what
  makes renaming safe.

**Organization.** The repo mirrors the manager's structure: `<machine>/<project>/`.
Each project lives in its own folder. A shared infrastructure stack (reverse proxy
+ tunnel) sits in its own folder too.

**Track what is reproducible.** Stateful apps (wordpress sites with uploads and
databases) are not in git — their compose file alone cannot rebuild them, so
tracking it would create false confidence. Reproducible projects (databases,
game servers with a Dockerfile) are tracked.

## What "deploy" means now

Edit a compose file, commit, push to a private repo, then push the same content to
the manager's copy of the project. The repo is the source of truth; the manager is
the deployer. The plan is to move to git-sync — the manager pulling straight from
the repo — so that `git push` becomes the deploy itself.

## Security considerations

This is the part I care about most, and the rules I'd defend:

**Control plane.** The manager UI and API stay on the LAN. The hub listens on a
LAN address only. Agents dial out to the hub — no inbound ports on the agent
machines. Admin tokens never leave the machine, never go into git.

**Repo hygiene.** The infrastructure repo is private. Secrets (tokens, passwords)
live in gitignored `.env` files with committed `.env.example` placeholders.
Plaintext credentials that slipped into compose files are on a cleanup list.

**Public exposure.** Nothing is exposed yet. When the time comes, the plan is a
Cloudflare tunnel (outbound pipe, no port forwarding) in front of a reverse proxy
that is the only thing with a key to every internal network. The manager stays
LAN-only forever — it is admin surface, not public surface.

**The isolation model.** Each project gets its own Docker network. Containers in
different networks cannot see each other. The reverse proxy is the only container
with access to multiple networks — a single, auditable choke point.

**AI-specific rules.** The agent's write access is gated on my approval. It never
commits tokens. It diffs local copies against the repo before deleting anything —
once, that caught a config drift that would otherwise have been lost. It signs
every GitHub issue so I know what came from where.

## The honest part

None of this is required reading for most people. If you run three containers, use
Portainer and move on. But if your setup is growing — multiple machines, a game
server, a couple of sites, a plan for public services — the combination of a
manager, a git repo as source of truth, and an AI agent that explains itself is
genuinely pleasant. The machine does the remembering; I do the deciding.
