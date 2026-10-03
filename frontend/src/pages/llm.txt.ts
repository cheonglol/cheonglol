/**
 * Static endpoint: renders the resume as plain text for LLM and ATS crawlers.
 * Output is served at /llm.txt. Generated from the single source of truth at
 * frontend/src/data/resume.ts, so it never drifts from the PDF.
 */
import type { APIRoute } from "astro";
import { resume } from "../data/resume";
import { renderResumeText } from "../lib/resume-text";

export const GET: APIRoute = () =>
  new Response(renderResumeText(resume), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
