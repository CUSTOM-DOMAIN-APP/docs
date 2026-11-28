/**
 * A docs page's Markdown at the page's own address, for a request whose Accept prefers text/markdown. proxy.ts rewrites
 * it here and marks the request (NEGOTIATED_HEADER); this path is never linked, and asked for directly it is a 404. It
 * is the page itself in another format, not a copy: no noindex, Vary: Accept, and private, so a shared cache that
 * ignores Vary never hands it to a browser (lib/negotiate.ts, markdownHeaders). Rendered on request, because a
 * prerendered route answers with Next's own Cache-Control; each page's text is kept in memory after its first answer.
 */

import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { pageDescription } from "@/lib/page-description";
import { pageMarkdown } from "@/lib/markdown";
import { NEGOTIATED_HEADER, markdownHeaders } from "@/lib/negotiate";

export const dynamic = "force-dynamic";

// One entry per docs page at most: only an address that names a page is rendered.
const rendered = new Map<string, string>();

export async function GET(request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  if (request.headers.get(NEGOTIATED_HEADER) !== "1") notFound();
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  let body = rendered.get(page.url);
  if (body === undefined) {
    body = await pageMarkdown(page, pageDescription(slug, page));
    rendered.set(page.url, body);
  }
  return new Response(body, { headers: markdownHeaders(page.url, "page") });
}
