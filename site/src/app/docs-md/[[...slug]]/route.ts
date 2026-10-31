/**
 * Every docs page's Markdown copy, built once per page at build time like the HTML. Two addresses reach it, and this
 * path itself is never linked: /docs/<slug>.md (and /docs.md for the docs home) through next.config.ts, and
 * /agents/brief/<name>.md (proxy.ts). A copy is noindex and names the HTML page as canonical (lib/negotiate.ts,
 * markdownHeaders). The page's own address, asked for as Markdown, is answered by app/docs-md-accept instead.
 */

import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { pageDescription } from "@/lib/page-description";
import { pageMarkdown } from "@/lib/markdown";
import { markdownHeaders } from "@/lib/negotiate";

export const revalidate = false;

export async function GET(_req: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return new Response(await pageMarkdown(page, pageDescription(slug, page)), {
    headers: markdownHeaders(page.url, "copy"),
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
