import type { APIRoute } from "astro";
import { resume } from "../data/resume";
import { renderResumeText } from "../lib/resume-text";
import { getPosts, getPostMarkdown } from "../lib/posts";

// The full corpus in one file: the resume plus every post, as Markdown.
// Agents fetch this only when they need depth. The small index lives at
// /llms.txt.

function stripFrontmatter(md: string): string {
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
}

export const GET: APIRoute = () => {
  const lines: string[] = [
    `# ${resume.basics.name} — full corpus`,
    "",
    "> The complete resume and every blog post, in one file. Generated at",
    "> build time. For a shorter overview, see /llms.txt.",
    "",
    renderResumeText(resume),
    "# Writing",
    "",
  ];

  for (const post of getPosts()) {
    const md = getPostMarkdown(post.slug);
    lines.push(`## ${post.title}`, "");
    if (post.dateISO) lines.push(`Date: ${post.dateISO}`, "");
    lines.push(md ? stripFrontmatter(md) : "", "");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
