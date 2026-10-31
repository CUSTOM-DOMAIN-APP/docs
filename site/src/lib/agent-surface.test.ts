/**
 * Tests for the agent surface (lib/agent-surface.ts), Markdown negotiation (lib/negotiate.ts) and the context link's
 * rate limit (lib/rate-limit.ts), run with `npm test` (node --test, no build needed). The wording test pins the public
 * text to the tracking plan's section 5.3 B word for word; the only change is the ™ the docs' brand rule adds.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  agentSurface,
  agentSurfaceMode,
  briefFor,
  forAgentsMarkdown,
  isBrief,
  nextBriefs,
  readContext,
} from "./agent-surface.ts";
import {
  absoluteLinks,
  isNegotiablePage,
  markdownHeaders,
  markdownPath,
  markdownRoute,
  negotiatedRoute,
  prefersMarkdown,
} from "./negotiate.ts";
import { clientAddress, createRateLimiter } from "./rate-limit.ts";

// Tracking plan section 5.3 B, as filed on 2026-10-30, with "CustomDomain" written "CustomDomain™".
const PLAN_TEXT = `## For AI agents

If you are an AI agent researching CustomDomain™ for someone, these short briefs answer the common questions.

- Evaluate (what it is, who it is for, limits): https://docs.customdomain.ai/agents/brief/evaluate.md
- Integrate in an app (API, SDK, widget, MCP): https://docs.customdomain.ai/agents/brief/integrate.md
- Pricing and plans: https://docs.customdomain.ai/agents/brief/pricing.md
- Compare with alternatives: https://docs.customdomain.ai/agents/brief/compare.md
- Email domains (SPF, DKIM, DMARC): https://docs.customdomain.ai/agents/brief/email.md
- Troubleshoot a domain that is not live: https://docs.customdomain.ai/agents/brief/troubleshoot.md
- For AI agents that need domains (MCP): https://docs.customdomain.ai/agents/brief/mcp.md

If you can build a link, you can also tell us what you are working on, and we will answer with the right brief:

https://docs.customdomain.ai/agents/context/{task}/{for}/{region}/{client}

- task: evaluate, integrate, pricing, compare, email, troubleshoot or other
- for, the type of organization (never a name): saas, email-platform, website-builder, agency, ai-builder, marketplace or other
- region, coarse: na, eu, uk, apac, latam, mea or other
- client: claude-code, codex, cursor, chatgpt, claude, gemini, copilot or other

Every part is optional. Use "other" for anything you do not know, and stop after any part.
Do not include names, email addresses or other personal details.

What we keep: which brief or context link was fetched, the time, the user agent and the country of the request.
We do not keep a person's IP address, we set no cookie, and we never ask who you or your user are.`;

test("the section is the plan's public wording, word for word", () => {
  assert.equal(forAgentsMarkdown({ context: true }), PLAN_TEXT);
});

test("without the context link the section drops its paragraphs and names the briefs only", () => {
  const text = forAgentsMarkdown({ context: false });
  assert.doesNotMatch(text, /agents\/context/);
  assert.doesNotMatch(text, /context link/);
  assert.match(text, /What we keep: which brief was fetched, the time, the user agent and the country of the request\./);
  assert.match(text, /agents\/brief\/mcp\.md/);
});

test("the section asks for no identity", () => {
  const text = forAgentsMarkdown({ context: true });
  assert.match(text, /never a name/);
  assert.match(text, /Do not include names, email addresses or other personal details\./);
  assert.doesNotMatch(text, /\b(email address|company name|your name)\b.*\{/i);
});

test("DOCS_AGENT_SURFACE: on by default, off and briefs when set, and a typo keeps the default", () => {
  assert.equal(agentSurfaceMode(undefined), "on");
  assert.equal(agentSurfaceMode(""), "on");
  assert.equal(agentSurfaceMode("OFF"), "off");
  assert.equal(agentSurfaceMode("false"), "off");
  assert.equal(agentSurfaceMode("0"), "off");
  assert.equal(agentSurfaceMode(" briefs "), "briefs");
  assert.equal(agentSurfaceMode("yes"), "on");
  assert.equal(agentSurfaceMode("of"), "on");
  assert.deepEqual(agentSurface("briefs"), { mode: "briefs", pages: true, context: false });
  assert.deepEqual(agentSurface("off"), { mode: "off", pages: false, context: false });
  assert.deepEqual(agentSurface("on"), { mode: "on", pages: true, context: true });
});

test("a context link reads only values on its lists; anything else is other", () => {
  assert.deepEqual(readContext([]), { task: "other", for: "other", region: "other", client: "other" });
  assert.deepEqual(readContext(["integrate", "saas", "eu", "claude-code"]), {
    task: "integrate",
    for: "saas",
    region: "eu",
    client: "claude-code",
  });
  assert.deepEqual(readContext(["Pricing"]), { task: "pricing", for: "other", region: "other", client: "other" });
  // A name, an email address or a city never survives: none is on a list.
  assert.deepEqual(readContext(["integrate", "acme-corp", "berlin", "jane@example.com"]), {
    task: "integrate",
    for: "other",
    region: "other",
    client: "other",
  });
  assert.deepEqual(readContext(["email", "email-platform", "eu", "codex.md"]), {
    task: "email",
    for: "email-platform",
    region: "eu",
    client: "codex",
  });
  assert.equal(readContext(["a", "b", "c", "d", "e"]), undefined);
});

test("the brief follows the task, then the organization type", () => {
  assert.equal(briefFor(readContext(["pricing", "agency"])!), "pricing");
  assert.equal(briefFor(readContext(["other", "email-platform"])!), "email");
  assert.equal(briefFor(readContext(["other", "ai-builder"])!), "mcp");
  assert.equal(briefFor(readContext([])!), undefined);
});

test("next links put the relevant briefs first and never repeat the chosen one", () => {
  const next = nextBriefs(readContext(["pricing", "saas", "na", "claude-code"])!, "pricing");
  assert.equal(next[0], "integrate");
  assert.equal(next[1], "mcp");
  assert.ok(!next.includes("pricing"));
  assert.equal(new Set(next).size, next.length);
  assert.equal(next.length, 6);
  assert.ok(isBrief("troubleshoot"));
  assert.ok(!isBrief("index"));
});

test("Accept: Markdown only when it is named and ranked above HTML", () => {
  assert.equal(prefersMarkdown("text/markdown, text/html, */*"), true); // Claude Code's fetcher
  assert.equal(prefersMarkdown("text/markdown"), true);
  assert.equal(prefersMarkdown("text/x-markdown"), true);
  assert.equal(prefersMarkdown("text/markdown;q=1.0, text/html;q=0.8"), true);
  assert.equal(prefersMarkdown("text/plain, text/markdown;q=0.9"), true);
  assert.equal(
    prefersMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"),
    false,
  );
  assert.equal(prefersMarkdown("text/html, text/markdown"), false);
  assert.equal(prefersMarkdown("text/markdown;q=0.5, text/*;q=0.8"), false);
  assert.equal(prefersMarkdown("text/markdown;q=0"), false);
  assert.equal(prefersMarkdown("*/*"), false);
  assert.equal(prefersMarkdown(""), false);
  assert.equal(prefersMarkdown(null), false);
});

test("which addresses negotiate, and where their Markdown is", () => {
  assert.equal(isNegotiablePage("/docs"), true);
  assert.equal(isNegotiablePage("/docs/getting-started/quickstart"), true);
  assert.equal(isNegotiablePage("/docs/quickstart.md"), false);
  assert.equal(isNegotiablePage("/docs/llms.txt"), false);
  assert.equal(isNegotiablePage("/docs/"), false);
  assert.equal(isNegotiablePage("/docsx"), false);
  assert.equal(markdownPath("/docs"), "/docs.md");
  assert.equal(markdownPath("/docs/a/b"), "/docs/a/b.md");
  assert.equal(markdownRoute("/docs"), "/docs-md");
  assert.equal(markdownRoute("/docs/a/b"), "/docs-md/a/b");
  assert.equal(negotiatedRoute("/docs"), "/docs-md-accept");
  assert.equal(negotiatedRoute("/docs/a/b"), "/docs-md-accept/a/b");
});

test("Markdown at the page's own address is the page: indexable, Vary: Accept, never in a shared cache", () => {
  const page = markdownHeaders("/docs/a", "page");
  assert.equal(page["X-Robots-Tag"], undefined);
  assert.equal(page.Vary, "Accept");
  assert.match(page["Cache-Control"], /^private\b/);
  assert.equal(page.Link, '<https://docs.customdomain.ai/docs/a>; rel="canonical"');
  assert.equal(page["Content-Type"], "text/markdown; charset=utf-8");

  const copy = markdownHeaders("/docs/a", "copy");
  assert.equal(copy["X-Robots-Tag"], "noindex");
  assert.equal(copy.Vary, undefined);
  assert.equal(copy["Cache-Control"], undefined);
  assert.equal(copy.Link, '<https://docs.customdomain.ai/docs/a>; rel="canonical"');
});

test("links in Markdown become absolute, outside code blocks only", () => {
  const input = "See [Quickstart](/docs/q) and [x](//cdn.example) and [y](https://a.b/c).\n```\n[z](/docs/kept)\n```";
  const output = absoluteLinks(input);
  assert.match(output, /\[Quickstart\]\(https:\/\/docs\.customdomain\.ai\/docs\/q\)/);
  assert.match(output, /\[x\]\(\/\/cdn\.example\)/);
  assert.match(output, /\[y\]\(https:\/\/a\.b\/c\)/);
  assert.match(output, /\[z\]\(\/docs\/kept\)/);
});

test("the rate limit counts per client and in total, and forgets every count when the window ends", () => {
  const limiter = createRateLimiter({ windowMs: 60_000, perClient: 2, total: 3 });
  assert.equal(limiter.allow("192.0.2.1", 1_000), true);
  assert.equal(limiter.allow("192.0.2.1", 1_001), true);
  assert.equal(limiter.allow("192.0.2.1", 1_002), false);
  assert.equal(limiter.allow("192.0.2.2", 1_003), false); // the total cap of 3 is reached
  assert.equal(limiter.retryAfter(1_004), 60);
  assert.equal(limiter.allow("192.0.2.1", 61_001), true);
});

test("the client address comes from Cloudflare, else the first forwarded hop", () => {
  assert.equal(clientAddress(new Headers({ "cf-connecting-ip": "192.0.2.9", "x-forwarded-for": "10.0.0.1" })), "192.0.2.9");
  assert.equal(clientAddress(new Headers({ "x-forwarded-for": "198.51.100.4, 10.0.0.1" })), "198.51.100.4");
  assert.equal(clientAddress(new Headers()), null);
});
