// Single source for blog post metadata and content.
//
// The blog page, the per-post JSON endpoint, and llms.txt all read from
// here. Add a Markdown file to public/content/blog/ and every surface
// picks it up on the next build. No list is hand-maintained.

const modules = import.meta.glob("../../public/content/blog/*.md", {
  eager: true,
}) as Record<
  string,
  {
    frontmatter?: Record<string, unknown>;
    compiledContent?: () => string;
  }
>;

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateISO: string;
  categories: string[];
  agentWritten: boolean;
}

export function slugFromPath(path: string): string {
  return path.split("/").pop()?.replace(/\.md$/, "") ?? "";
}

function toPost(path: string, mod: { frontmatter?: Record<string, unknown> }): Post {
  const fm = mod.frontmatter ?? {};
  const cats = fm.categories ?? fm.category ?? [];
  const dateISO = String(fm.pubDate ?? "");
  return {
    slug: slugFromPath(path),
    title: String(fm.title ?? ""),
    description: String(fm.description ?? ""),
    dateISO,
    date: dateISO
      ? new Date(dateISO).toLocaleDateString("en-SG", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "",
    categories: Array.isArray(cats) ? (cats as string[]) : [],
    agentWritten: Boolean(fm.agentWritten ?? false),
  };
}

/** All posts, newest first. */
export function getPosts(): Post[] {
  return Object.entries(modules)
    .map(([path, mod]) => toPost(path, mod))
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
}

/** Every post slug, for getStaticPaths. */
export function getPostSlugs(): string[] {
  return Object.keys(modules).map(slugFromPath);
}

/** Rendered HTML for one post, or null when the slug is unknown. */
export function getPostHtml(slug: string): string | null {
  const path = Object.keys(modules).find((p) => slugFromPath(p) === slug);
  if (!path) return null;
  return modules[path].compiledContent?.() ?? null;
}

// Raw Markdown, for the full-corpus file. Same source files, read as text.
const rawModules = import.meta.glob("../../public/content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

/** Original Markdown for one post, or null when the slug is unknown. */
export function getPostMarkdown(slug: string): string | null {
  const path = Object.keys(rawModules).find((p) => slugFromPath(p) === slug);
  return path ? rawModules[path] : null;
}
