import type { APIRoute } from "astro";

// Load all blog posts once at build time.
const postModules = import.meta.glob("../../../public/content/blog/*.md", {
  eager: true,
});

function slugFromPath(path: string): string {
  return path.split("/").pop()?.replace(/\.md$/, "") ?? "";
}

export function getStaticPaths() {
  return Object.keys(postModules).map((path) => ({
    params: { slug: slugFromPath(path) },
  }));
}

// Pre-rendered at build time. Each post becomes /blog/<slug>.json with
// its rendered HTML. The blog index ships metadata only and fetches
// this file lazily when a post is opened.
export const GET: APIRoute = ({ params }) => {
  const path = Object.keys(postModules).find(
    (p) => slugFromPath(p) === params.slug,
  );
  if (!path) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  const mod = postModules[path] as { compiledContent: () => string };
  const content = mod.compiledContent();
  return new Response(
    JSON.stringify({
      slug: params.slug,
      content,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};
