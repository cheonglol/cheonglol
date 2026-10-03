import type { APIRoute } from "astro";

// Hand-written sitemap. The site has two HTML pages: the profile and the
// blog index. Posts open in a modal, so they have no page of their own.

const site = (import.meta.env.SITE || "").replace(/\/+$/, "");
const base = (import.meta.env.BASE_URL || "").replace(/\/+$/, "");

export const GET: APIRoute = () => {
  const urls = [`${site}${base}/`, `${site}${base}/blog/`];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url><loc>${u}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
