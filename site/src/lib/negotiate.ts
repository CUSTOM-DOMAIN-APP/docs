/**
 * Markdown by content negotiation (tracking plan step 6): which docs addresses have a Markdown twin, where that twin
 * is served, whether a request's Accept header prefers it to HTML, and the headers each Markdown answer carries
 * (indexing and caching differ between the .md copy and the page's own address). proxy.ts uses it to answer a request
 * that prefers text/markdown with the page's Markdown, and to send the Link header that names the twin on HTML pages.
 * No imports, so proxy.ts stays small and the node:test suite can load it.
 */

/** The public origin, used in Link headers and in the Markdown so every address an agent reads is absolute. */
export const SITE = "https://docs.customdomain.ai";

/** The .md URL of a page: /docs.md for the docs home, /docs/<slug>.md otherwise. */
export function markdownPath(url: string): string {
  return url === "/docs" ? "/docs.md" : `${url}.md`;
}

/**
 * The internal route that renders a docs page's Markdown copy (app/docs-md), for the .md addresses and the briefs:
 * /docs -> /docs-md, /docs/a/b -> /docs-md/a/b.
 */
export function markdownRoute(docsPath: string): string {
  return `/docs-md${docsPath.slice("/docs".length)}`;
}

/**
 * The internal route that answers a page's own address with its Markdown when Accept asks for it (app/docs-md-accept):
 * /docs -> /docs-md-accept, /docs/a/b -> /docs-md-accept/a/b.
 */
export function negotiatedRoute(docsPath: string): string {
  return `/docs-md-accept${docsPath.slice("/docs".length)}`;
}

/**
 * The request header proxy.ts adds when it rewrites a page's own address to app/docs-md-accept. That route answers
 * only requests that carry it, so /docs-md-accept/... asked for directly is a 404 and never a second, indexable
 * address for a page (its answers carry no noindex). A client that sends the header itself gets nothing a request
 * with Accept: text/markdown would not.
 */
export const NEGOTIATED_HEADER = "x-cd-markdown-negotiated";

/**
 * The headers of a page's Markdown. Both name the HTML page as canonical.
 * - "copy" (a .md address or a brief, app/docs-md): a second address for the same text, so noindex. It answers
 *   Markdown whatever the Accept header says, so it needs no Vary.
 * - "page" (the page's own address, chosen by Accept, app/docs-md-accept): the page itself in another format. No
 *   noindex, because an indexing rule must not depend on Accept (a crawler that prefers Markdown would otherwise drop
 *   the page). Vary: Accept, and private: a shared cache that ignores Vary (Cloudflare does unless told otherwise)
 *   must never keep the Markdown under the page's address and hand it to a browser. The HTML answer is the one a
 *   shared cache may keep.
 */
export function markdownHeaders(pageUrl: string, at: "copy" | "page"): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "text/markdown; charset=utf-8",
    Link: `<${SITE}${pageUrl}>; rel="canonical"`,
  };
  if (at === "copy") {
    headers["X-Robots-Tag"] = "noindex";
  } else {
    headers.Vary = "Accept";
    headers["Cache-Control"] = "private, max-age=300";
  }
  return headers;
}

/**
 * Whether a docs path is a page that has a Markdown twin: /docs and /docs/<slug>, but not a .md address itself, the
 * llms.txt index, or anything with a file extension.
 */
export function isNegotiablePage(pathname: string): boolean {
  if (pathname === "/docs") return true;
  if (!pathname.startsWith("/docs/")) return false;
  const last = pathname.slice(pathname.lastIndexOf("/") + 1);
  return last.length > 0 && !last.includes(".");
}

/**
 * Root-relative link targets ("](/docs/...)") made absolute, outside code blocks. An assistant's fetch tool may follow
 * only an address that appeared in full (Anthropic's web fetch, OpenAI's link safety), so an agent reading
 * /docs/x.md must see https://docs.customdomain.ai/docs/y, not /docs/y.
 */
export function absoluteLinks(markdown: string): string {
  let fence: string | undefined;
  return markdown
    .split("\n")
    .map((line) => {
      const marker = line.match(/^\s*(```|~~~)/)?.[1];
      if (marker) {
        if (!fence) fence = marker;
        else if (fence === marker) fence = undefined;
        return line;
      }
      return fence ? line : line.replace(/\]\(\/(?!\/)/g, `](${SITE}/`);
    })
    .join("\n");
}

type Range = { type: string; q: number; index: number };

function parseAccept(accept: string): Range[] {
  return accept
    .split(",")
    .map((part, index) => {
      const [type, ...params] = part.split(";").map((s) => s.trim());
      let q = 1;
      for (const param of params) {
        const [key, value] = param.split("=").map((s) => s.trim());
        if (key?.toLowerCase() === "q") {
          const parsed = Number.parseFloat(value ?? "");
          q = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : 0;
        }
      }
      return { type: (type ?? "").toLowerCase(), q, index };
    })
    .filter((range) => range.type.length > 0);
}

/**
 * True when the Accept header names text/markdown (or text/x-markdown) explicitly and ranks it above HTML. HTML's
 * rank comes from the most specific range that covers it (text/html, then text/*, then *\/*). A tie goes to the type
 * listed first, so "text/markdown, text/html, *\/*" (what Claude Code's fetcher sends) gets Markdown, and a browser's
 * Accept, which never names text/markdown, always gets HTML. A wildcard alone never selects Markdown.
 */
export function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;
  const ranges = parseAccept(accept);
  const markdown = ranges
    .filter((r) => r.type === "text/markdown" || r.type === "text/x-markdown")
    .sort((a, b) => b.q - a.q || a.index - b.index)[0];
  if (!markdown || markdown.q <= 0) return false;
  const html =
    ranges.find((r) => r.type === "text/html") ??
    ranges.find((r) => r.type === "text/*") ??
    ranges.find((r) => r.type === "*/*");
  if (!html || html.q <= 0) return true;
  if (markdown.q !== html.q) return markdown.q > html.q;
  return markdown.index < html.index;
}
