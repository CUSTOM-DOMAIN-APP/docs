/**
 * Every docs page as Markdown, built once per page at build time like the HTML. Three addresses reach it, and this
 * path itself is never linked: /docs/<slug>.md (and /docs.md for the docs home) through next.config.ts, the page's own
 * address when the request's Accept prefers text/markdown (proxy.ts), and /agents/brief/<name>.md (proxy.ts).
 */

import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { pageDescription } from "@/lib/page-description";
import { SITE, pageMarkdown } from "@/lib/markdown";

export const revalidate = false;

export async function GET(_req: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return new Response(await pageMarkdown(page, pageDescription(slug, page)), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // The HTML page is the one to index; this is the same content for agents and tools.
      Link: `<${SITE}${page.url}>; rel="canonical"`,
      "X-Robots-Tag": "noindex",
      // The page's own address answers with this or with HTML, by Accept (proxy.ts). Set here, because Next appends
      // a route's own Vary to its list but replaces a Vary the proxy sets. Harmless on the .md addresses.
      Vary: "Accept",
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
