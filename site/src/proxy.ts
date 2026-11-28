/**
 * The docs site's request proxy (Next.js 16's name for middleware), for tracking plan step 6. First, Markdown by
 * Accept: a GET or HEAD for a docs page whose Accept header prefers text/markdown gets that page's Markdown
 * (app/docs-md-accept: Vary: Accept, private, no noindex), the same content in another format, and HTML pages send a
 * Link header naming the Markdown. Second, the agent surface's addresses (lib/agent-surface.ts, DOCS_AGENT_SURFACE):
 * /agents goes to the "For AI agents" page, /agents/brief/<name>.md serves that brief's Markdown, /agents/context/...
 * reaches its route, and each answers 404 when the setting turns it off (the page's own links then go to the AI agents
 * use case page). It sets no cookie and reads none.
 */

import { NextResponse, type NextRequest } from "next/server";
import { AGENT_PAGE_FALLBACK, AGENT_PAGE_PATH, agentSurface, briefPagePath, isBrief } from "@/lib/agent-surface";
import {
  NEGOTIATED_HEADER,
  SITE,
  isNegotiablePage,
  markdownPath,
  markdownRoute,
  negotiatedRoute,
  prefersMarkdown,
} from "@/lib/negotiate";

function notFound(): NextResponse {
  return new NextResponse("Not found.\n", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}

function agentAddress(request: NextRequest, pathname: string): NextResponse {
  const surface = agentSurface();
  if (!surface.pages) return notFound();

  if (pathname === "/agents" || pathname === "/agents/brief") {
    return NextResponse.redirect(new URL(AGENT_PAGE_PATH, request.url), 307);
  }

  if (pathname === "/agents/context" || pathname.startsWith("/agents/context/")) {
    return surface.context ? NextResponse.next() : notFound();
  }

  const brief = pathname.match(/^\/agents\/brief\/([a-z]+)(\.md)?$/);
  if (brief && isBrief(brief[1])) {
    const page = briefPagePath(brief[1]);
    // The .md address is what agents are given; without .md it is a person's link, so it goes to the page.
    if (brief[2]) return NextResponse.rewrite(new URL(markdownRoute(page), request.url));
    return NextResponse.redirect(new URL(page, request.url), 307);
  }

  return notFound();
}

/** With the surface off, the page and its briefs are not built; links to them land on the AI agents use case page. */
function agentPageWhenOff(request: NextRequest, pathname: string): NextResponse | undefined {
  const isAgentPage =
    pathname === AGENT_PAGE_PATH || pathname === `${AGENT_PAGE_PATH}.md` || pathname.startsWith(`${AGENT_PAGE_PATH}/`);
  if (!isAgentPage || agentSurface().pages) return undefined;
  // An agent that followed a .md link gets the fallback page's Markdown, a person its HTML.
  const target = pathname.endsWith(".md") ? markdownPath(AGENT_PAGE_FALLBACK) : AGENT_PAGE_FALLBACK;
  return NextResponse.redirect(new URL(target, request.url), 307);
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname === "/agents" || pathname.startsWith("/agents/")) return agentAddress(request, pathname);
  const offRedirect = agentPageWhenOff(request, pathname);
  if (offRedirect) return offRedirect;
  if (!isNegotiablePage(pathname)) return NextResponse.next();

  const readsBody = request.method === "GET" || request.method === "HEAD";
  // A client side navigation (RSC) asks for the page's React payload, never for a format.
  const isNavigation = request.headers.has("rsc") || request.headers.has("next-router-prefetch");
  if (readsBody && !isNavigation && prefersMarkdown(request.headers.get("accept"))) {
    // That route sets Vary: Accept and Cache-Control itself (app/docs-md-accept): Next would replace a Vary set here.
    // It answers only a request this proxy marked, so its own address is not a second way to reach the page.
    const headers = new Headers(request.headers);
    headers.set(NEGOTIATED_HEADER, "1");
    return NextResponse.rewrite(new URL(negotiatedRoute(pathname), request.url), { request: { headers } });
  }

  // No Vary here: Next 16's page runtime replaces Vary on every page with its own list (app-page-runtime.js,
  // res.setHeader('Vary', ...)), so only the Markdown answer can say Vary: Accept. The Markdown answer is private, so
  // no shared cache keeps it and a browser is never served it; at worst a cache that keeps the HTML hands HTML to an
  // agent that asked for Markdown. To fix that too, add Vary: Accept in front of this server (DEPLOYMENT.md).
  const response = NextResponse.next();
  response.headers.set("Link", `<${SITE}${markdownPath(pathname)}>; rel="alternate"; type="text/markdown"`);
  return response;
}

export const config = {
  matcher: ["/docs", "/docs/:path*", "/agents", "/agents/:path*"],
};
