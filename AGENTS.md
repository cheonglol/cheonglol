# AGENTS.md — cheonglol/cheonglol

Writing and workflow rules for AI agents working in this repo.
They apply to everything you generate, edit, or review here.

## Writing style: plain language (ISO 24495-1)

This repo follows the plain-language style used in the opencode agent
configuration (ISO 24495-1). Write so the reader can find,
understand, and use the information on first read.

Rules:

1. **Short sentences.** One idea per sentence. Aim for 15-20 words;
   split anything longer.
2. **Active voice.** "The API returns 404" — not "A 404 is returned
   by the API". For instructions use the imperative: "Run the tests"
   — not "The tests should be run".
3. **Familiar words.** Prefer common words over jargon. Define a
   technical term the first time it appears.
4. **Result first.** Lead with the answer or outcome, then give
   context. Titles and conclusions before detail.
5. **Be specific.** Use concrete names, numbers, and steps. Avoid
   vague fillers ("various", "several", "etc.").
6. **No idioms or figurative language.** Write for readers who may
   not be native English speakers.
7. **Descriptive headings.** A heading states the section's content.
   It does not state a verdict or a feeling.

## Banned: typical LLM-style writing

Do not use the rhetorical framing, filler, and essay moves that raw
LLM output overuses. This repo has shipped real examples:

- `## The honest part` — frontend/public/content/blog/2026-08-13-setting-up-my-home-network.md
- `## The real win` — frontend/public/content/blog/2025-09-02-layered-documentation-system.md

### Banned framing phrases

- "The honest part", "To be honest", "Let's be honest",
  "The honest truth", "The hard truth", "Real talk", "Let's be real"
- "The real win", "The real takeaway"
- "At the end of the day", "Here's the thing", "Trust me",
  "Take my word for it"
- "It's worth noting", "It's important to note",
  "It should be noted that"
- "In conclusion", "To summarize", "Overall," as a sentence opener
- "Game changer", "Level up", "That's the tea", "No cap"

### Banned filler verbs and buzzwords

- delve, dive into, unlock, leverage, harness, unleash, supercharge,
  turbocharge
- seamlessly, robustly, cutting-edge, state-of-the-art, comprehensive
- "in a nutshell", "on the flip side", "fast-forward", "plot twist",
  "spoiler"

### Banned essay moves

- Emotional or abstract headings that sell a verdict instead of
  describing content. Write what the section is about: "Tradeoffs",
  "Results", "What this is not for".
- Fake conversational asides: "you might be wondering",
  "you'd think", "spoiler: no".
- Dramatic buildup before the point. State the point first.

### Before → after

- "## The honest part" → "## Tradeoffs"
- "## The real win" → "## Results"
- "It is worth noting that the build is slow." → "The build is slow."
- "Let's be honest: none of this is required reading." →
  "None of this is required reading."
- "Delve into the details" → "Read the details"

## Scope and exceptions

Applies to: blog posts (frontend/public/content/blog/), README, code
comments, issues, PRs, and commit messages — written by humans or AI.

Does NOT apply to: resume content and its pipeline
(frontend/src/data/resume.ts, scripts/generate-resume.ts,
scripts/gh-resume.ts, tests/resume.test.ts). The resume keeps its own
style; it is excluded on purpose.

## AI-assisted personal posts (opt-in)

When the owner asks for a post written "this way" — casual, personal,
"quote me and you report" style — follow this pattern instead of the
house style above. This is an explicit exception, like the resume.
The owner does not want this every time; only when requested.

Rules:

1. **Declare the authorship at the top of the post.** Start with a
   line like: "Written by opencode on behalf of cheonglol." — so the
   reader knows an AI agent wrote it.
2. **Quote the owner verbatim, always in block quotes.** Every word
   that is his goes inside a block quote — no partial quotes in the
   reporter's prose. Fix typos, keep the words.
3. **Report in third person, never first.** The agent writes as a
   reporter: "He says...", "His take...", "He has met...". The only
   "I" in the post belongs to the owner, inside his quotes. Keep
   section headings neutral and third-person too. Do not put new
   opinions in the owner's mouth. If a claim is not his, do not
   attribute it to him. Framing lines add context; they do not
   restate the quote that follows.
4. **Mark the post as agent-written.** Set `agentWritten: true` in
   the frontmatter. The blog then renders it with a distinct
   reporter look: a "Reported" badge on the card and in the modal,
   plus a purple left border and tint — so readers can tell a
   reporter-style post from a normal one at a glance.
5. **Tone is casual.** The ISO plain-language rules and the banned
   LLM-style list are relaxed for these posts. They are an exception
   on purpose, not the default.
6. **Tags reflect intent.** If the owner says "#personal and
   thoughts", use categories like `["personal", "thoughts"]`.
7. **Include the agent's own take — and make it earn its place.**
   End the post with a clearly marked section — e.g. "The
   reporter's take" — where the agent shares its own views,
   addressed to the reader. The take MUST add perspective or
   analysis: a new angle, a pushback, a contradiction, a
   counterexample, or a consequence the owner did not state. Never
   restate the owner's points in new words. Never state the
   obvious. The test: if the section can be deleted without losing
   information, it is not a take — rewrite or remove it. Label it
   explicitly as the agent's opinion, not the owner's (e.g. an
   italic line: *This section is opencode writing — the views are
   the agent's own, not cheonglol's.*). This keeps three voices
   separable: the owner's quotes, the reporter's framing, and the
   agent's commentary. Do not attribute the commentary to the
   owner.

The default remains: house style for everything else.
