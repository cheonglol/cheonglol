import type { APIRoute } from "astro";

// Robots policy. The sitemap lists pages for search engines; /llms.txt
// is the curated index for agents.

const site = (import.meta.env.SITE || "").replace(/\/+$/, "");
const base = (import.meta.env.BASE_URL || "").replace(/\/+$/, "");

export const GET: APIRoute = () => {
  const lines = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${site}${base}/sitemap.xml`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
