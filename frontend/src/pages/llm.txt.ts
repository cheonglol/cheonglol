/**
 * Static endpoint: renders the resume as plain text for LLM and ATS crawlers.
 * Output is served at /llm.txt. Generated from the single source of truth at
 * frontend/src/data/resume.ts, so it never drifts from the PDF.
 */
import type { APIRoute } from "astro";
import { resume, type Resume } from "../data/resume";

const SITE = "https://cheonglol.github.io/cheonglol";
const BACKEND = "https://cheonglol-backend-production.up.railway.app";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function fmtDate(date?: string): string {
  if (!date) return "Present";
  const [year, month] = date.split("-");
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : year;
}

function render(r: Resume): string {
  const lines: string[] = [];
  const { basics, work = [], education = [], skills = [], projects = [] } = r;

  lines.push(`# ${basics.name} — ${basics.label}`, "");

  lines.push("## Contact");
  lines.push(`- Email: ${basics.email}`);
  if (basics.location?.city) {
    const region = basics.location.countryCode
      ? `, ${basics.location.countryCode}`
      : "";
    lines.push(`- Location: ${basics.location.city}${region}`);
  }
  lines.push(`- Portfolio: ${SITE}`);
  for (const profile of basics.profiles ?? []) {
    if (profile.url) lines.push(`- ${profile.network}: ${profile.url}`);
  }
  lines.push("");

  lines.push("## Summary", basics.summary, "");

  if (work.length) {
    lines.push("## Experience", "");
    for (const job of work) {
      const period =
        job.startDate || job.endDate
          ? ` (${fmtDate(job.startDate)} to ${fmtDate(job.endDate)})`
          : "";
      lines.push(`### ${job.name} — ${job.position}${period}`);
      if (job.summary) lines.push(job.summary);
      for (const highlight of job.highlights ?? []) lines.push(`- ${highlight}`);
      lines.push("");
    }
  }

  if (education.length) {
    lines.push("## Education", "");
    for (const edu of education) {
      const parts = [edu.studyType, edu.area].filter(Boolean).join(", ");
      const period =
        edu.startDate || edu.endDate
          ? ` (${fmtDate(edu.startDate)} to ${fmtDate(edu.endDate)})`
          : "";
      lines.push(`- ${edu.institution} — ${parts}${period}`);
    }
    lines.push("");
  }

  if (skills.length) {
    lines.push("## Skills", "");
    for (const group of skills) {
      lines.push(`### ${group.name}`);
      if (group.keywords?.length) lines.push(group.keywords.join(", "));
      lines.push("");
    }
  }

  if (projects.length) {
    lines.push("## Projects", "");
    for (const project of projects) {
      lines.push(`### ${project.name}`);
      lines.push(project.description);
      for (const highlight of project.highlights ?? [])
        lines.push(`- ${highlight}`);
      if (project.url) lines.push(`- Link: ${project.url}`);
      lines.push("");
    }
  }

  lines.push("## Site");
  lines.push(`- Portfolio: ${SITE}`);
  lines.push(`- Blog: ${SITE}/blog`);
  lines.push(`- Resume (PDF): ${SITE}/resume.pdf`);
  lines.push(`- Backend API: ${BACKEND}`);
  lines.push(`- Health check: ${BACKEND}/health`);
  lines.push("");

  lines.push("## Source");
  lines.push(
    "This file is generated at build time from frontend/src/data/resume.ts.",
  );
  lines.push("");

  return lines.join("\n");
}

export const GET: APIRoute = () =>
  new Response(render(resume), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
