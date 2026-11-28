/**
 * The optional context link (tracking plan section 5.3 B): /agents/context/{task}/{for}/{region}/{client}, every part
 * optional. It answers in Markdown with the brief that fits, the next links and the line that says what is kept. The
 * values live in the path, so the edge log records them with no store here: this route writes nothing, sets no cookie
 * and keeps no address (the rate limit counts in memory, lib/rate-limit.ts). A part that is not on its list reads as
 * "other", so nothing outside the four lists is used. Served only while DOCS_AGENT_SURFACE is "on".
 */

import { source } from "@/lib/source";
import { pageMarkdown } from "@/lib/markdown";
import { pageDescription } from "@/lib/page-description";
import {
  AGENT_FOLDER,
  CONTEXT_ANSWER_LINE,
  DOCS_ORIGIN,
  agentSurface,
  briefFor,
  briefLabel,
  briefUrl,
  nextBriefs,
  readContext,
} from "@/lib/agent-surface";
import { clientAddress, createRateLimiter } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// 30 answers a minute for one client and 600 for all of them together, per server process.
const limiter = createRateLimiter({ windowMs: 60_000, perClient: 30, total: 600 });

function markdown(body: string, status: number, headers: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // Every combination of parts is its own address; none is a page to index.
      "X-Robots-Tag": "noindex",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export async function GET(request: Request, { params }: { params: Promise<{ parts?: string[] }> }) {
  if (!agentSurface().context) return markdown("Not found.\n", 404);
  if (!limiter.allow(clientAddress(request.headers))) {
    return markdown("Too many requests. Try again in a minute.\n", 429, { "Retry-After": String(limiter.retryAfter()) });
  }

  const { parts = [] } = await params;
  const context = readContext(parts);
  if (!context) {
    return markdown("Not found. A context link has at most four parts: task, for, region and client.\n", 404);
  }

  const chosen = briefFor(context);
  const slug = chosen ? [AGENT_FOLDER, chosen] : [AGENT_FOLDER];
  const page = source.getPage(slug);
  if (!page) return markdown("Not found.\n", 404);

  const lines = [(await pageMarkdown(page, pageDescription(slug, page))).trimEnd(), "", "## Next links", ""];
  // With no brief chosen the answer is the briefs index, which already lists every brief.
  if (chosen) for (const next of nextBriefs(context, chosen)) lines.push(`- ${briefLabel(next)}: ${briefUrl(next)}`);
  lines.push(`- Every docs page, listed: ${DOCS_ORIGIN}/llms.txt`, "");
  lines.push(
    `Your link read as: task ${context.task}, for ${context.for}, region ${context.region}, client ${context.client}. ` +
      "A part left out, or one not on its list, reads as other.",
    "",
    CONTEXT_ANSWER_LINE,
    "",
  );
  return markdown(lines.join("\n"), 200, { Link: `<${DOCS_ORIGIN}${page.url}>; rel="canonical"` });
}
