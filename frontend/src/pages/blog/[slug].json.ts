import type { APIRoute } from "astro";
import { getPostSlugs, getPostHtml } from "../../lib/posts";

const JSON_HEADERS = { "Content-Type": "application/json" };

export function getStaticPaths() {
  return getPostSlugs().map((slug) => ({ params: { slug } }));
}

// Pre-rendered at build time. Each post becomes /blog/<slug>.json with
// its rendered HTML. The blog index ships metadata only and fetches
// this file lazily when a post is opened.
export const GET: APIRoute = ({ params }) => {
  const slug = params.slug ?? "";
  const content = getPostHtml(slug);

  if (content === null) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: JSON_HEADERS,
    });
  }

  return new Response(JSON.stringify({ slug, content }), {
    headers: JSON_HEADERS,
  });
};
