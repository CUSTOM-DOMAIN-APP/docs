import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { pageDescription } from "@/lib/page-description";
import { SITE, pageMarkdown } from "@/lib/markdown";

// Every docs page as Markdown. next.config.ts rewrites /docs/<slug>.md (and
// /docs.md for the docs home) here, so this path itself is never linked. Built
// once per page at build time, like the HTML.
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
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
