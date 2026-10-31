/**
 * The docs' agent surface (tracking plan step 6, owner decision 8): the "For AI agents" text, the seven briefs at
 * /agents/brief/<name>.md and the optional context link /agents/context/{task}/{for}/{region}/{client}, behind one
 * setting, DOCS_AGENT_SURFACE: "on" (the default, the plan's recommended answer), "briefs" (page and briefs, no
 * context link) or "off" (none of it). The text is the plan's public wording, served word for word by the page, both
 * llms.txt files and the context link, so people and agents read the same thing. It asks for an organization type and
 * a coarse region at most, never identity. No imports: proxy.ts, the routes and the node:test suite all load it.
 */

export const DOCS_ORIGIN = "https://docs.customdomain.ai";

// ---- the setting ----

export type AgentSurfaceMode = "on" | "briefs" | "off";

/** Decision 8's recommended answer. The owner flips it with DOCS_AGENT_SURFACE, or by changing this line. */
export const AGENT_SURFACE_DEFAULT: AgentSurfaceMode = "on";

/** Reads DOCS_AGENT_SURFACE. Anything it does not recognize keeps the default, so a typo never changes what is served. */
export function agentSurfaceMode(value: string | undefined = process.env.DOCS_AGENT_SURFACE): AgentSurfaceMode {
  switch (value?.trim().toLowerCase()) {
    case "off":
    case "0":
    case "false":
    case "no":
      return "off";
    case "briefs":
      return "briefs";
    case "on":
    case "1":
    case "true":
    case "yes":
      return "on";
    default:
      return AGENT_SURFACE_DEFAULT;
  }
}

/** What the current setting serves: the page and briefs, and the context link. */
export function agentSurface(value?: string): { mode: AgentSurfaceMode; pages: boolean; context: boolean } {
  const mode = agentSurfaceMode(value ?? process.env.DOCS_AGENT_SURFACE);
  return { mode, pages: mode !== "off", context: mode === "on" };
}

// ---- where the pages live ----

/** The content folder (content/for-ai-agents) and so the docs path of the page and its briefs. */
export const AGENT_FOLDER = "for-ai-agents";
export const AGENT_PAGE_PATH = `/docs/${AGENT_FOLDER}`;
/** Where links to the page go while the setting is "off" (proxy.ts), so the pages that mention it never 404. */
export const AGENT_PAGE_FALLBACK = "/docs/use-cases/ai-agents";

export const BRIEFS = [
  { slug: "evaluate", label: "Evaluate (what it is, who it is for, limits)" },
  { slug: "integrate", label: "Integrate in an app (API, SDK, widget, MCP)" },
  { slug: "pricing", label: "Pricing and plans" },
  { slug: "compare", label: "Compare with alternatives" },
  { slug: "email", label: "Email domains (SPF, DKIM, DMARC)" },
  { slug: "troubleshoot", label: "Troubleshoot a domain that is not live" },
  { slug: "mcp", label: "For AI agents that need domains (MCP)" },
] as const;

export type BriefSlug = (typeof BRIEFS)[number]["slug"];

export function isBrief(name: string): name is BriefSlug {
  return BRIEFS.some((b) => b.slug === name);
}

export function briefLabel(slug: BriefSlug): string {
  return BRIEFS.find((b) => b.slug === slug)?.label ?? slug;
}

/** The brief's Markdown address, the one agents are given. */
export function briefUrl(slug: BriefSlug): string {
  return `${DOCS_ORIGIN}/agents/brief/${slug}.md`;
}

/** The same brief as a docs page, for people. */
export function briefPagePath(slug: BriefSlug): string {
  return `${AGENT_PAGE_PATH}/${slug}`;
}

// ---- the context link ----

export const CONTEXT_TEMPLATE = `${DOCS_ORIGIN}/agents/context/{task}/{for}/{region}/{client}`;

export const CONTEXT_PARTS = [
  {
    name: "task",
    describe: "task",
    values: ["evaluate", "integrate", "pricing", "compare", "email", "troubleshoot", "other"],
  },
  {
    name: "for",
    describe: "for, the type of organization (never a name)",
    values: ["saas", "email-platform", "website-builder", "agency", "ai-builder", "marketplace", "other"],
  },
  { name: "region", describe: "region, coarse", values: ["na", "eu", "uk", "apac", "latam", "mea", "other"] },
  {
    name: "client",
    describe: "client",
    values: ["claude-code", "codex", "cursor", "chatgpt", "claude", "gemini", "copilot", "other"],
  },
] as const;

export type AgentContext = { task: string; for: string; region: string; client: string };

/**
 * The parts of a context link, in order. A part left out, or one that is not on its list, reads as "other", so no
 * value outside the four lists is ever used. A ".md" an agent adds to the last part is ignored. More than four parts
 * is not a context link (undefined).
 */
export function readContext(parts: readonly string[]): AgentContext | undefined {
  if (parts.length > CONTEXT_PARTS.length) return undefined;
  const value = (i: number): string => {
    const raw = parts[i]?.trim().toLowerCase().replace(/\.md$/, "");
    const allowed: readonly string[] = CONTEXT_PARTS[i].values;
    return raw !== undefined && allowed.includes(raw) ? raw : "other";
  };
  return { task: value(0), for: value(1), region: value(2), client: value(3) };
}

const TASK_BRIEF: Readonly<Record<string, BriefSlug>> = {
  evaluate: "evaluate",
  integrate: "integrate",
  pricing: "pricing",
  compare: "compare",
  email: "email",
  troubleshoot: "troubleshoot",
};

const FOR_BRIEF: Readonly<Record<string, BriefSlug>> = {
  saas: "integrate",
  "website-builder": "integrate",
  marketplace: "integrate",
  "email-platform": "email",
  agency: "evaluate",
  "ai-builder": "mcp",
};

/** Clients that write code against the API, for whom the integration and MCP briefs come first among the next links. */
const CODING_CLIENTS: ReadonlySet<string> = new Set(["claude-code", "codex", "cursor"]);

/** The brief that answers a context link: the task's, else the organization type's, else none (the briefs index). */
export function briefFor(context: AgentContext): BriefSlug | undefined {
  return TASK_BRIEF[context.task] ?? FOR_BRIEF[context.for];
}

/** The other briefs, most relevant first. Region changes nothing: no brief differs by region. */
export function nextBriefs(context: AgentContext, chosen: BriefSlug | undefined): BriefSlug[] {
  const out: BriefSlug[] = [];
  const add = (slug: BriefSlug | undefined) => {
    if (slug && slug !== chosen && !out.includes(slug)) out.push(slug);
  };
  add(FOR_BRIEF[context.for]);
  if (CODING_CLIENTS.has(context.client) || context.for === "ai-builder") {
    add("integrate");
    add("mcp");
  }
  for (const brief of BRIEFS) add(brief.slug);
  return out;
}

// ---- the public wording (tracking plan section 5.3 B) ----

export const FOR_AGENTS_TEXT = {
  heading: "For AI agents",
  intro:
    "If you are an AI agent researching CustomDomain™ for someone, these short briefs answer the common questions.",
  contextIntro:
    "If you can build a link, you can also tell us what you are working on, and we will answer with the right brief:",
  contextRules: [
    'Every part is optional. Use "other" for anything you do not know, and stop after any part.',
    "Do not include names, email addresses or other personal details.",
  ],
  /**
   * PENDING COUNSEL (tracking plan section 5.3 B, "counsel words the last paragraph"; section 6, item 13). The plan's
   * wording, word for word, until counsel signs it off. It names the context link only while the link is served.
   */
  keep: (context: boolean): string[] => [
    `What we keep: which brief${context ? " or context link" : ""} was fetched, the time, the user agent and the country of the request.`,
    "We do not keep a person's IP address, we set no cookie, and we never ask who you or your user are.",
  ],
} as const;

/** The line every context link answer ends with (plan section 5.3 B). PENDING COUNSEL, with the paragraph above. */
export const CONTEXT_ANSWER_LINE =
  "We keep the parts of this link, the time, the user agent and the country. No address, no cookie.";

/**
 * What <ForAgents /> becomes in a page's processed Markdown (mdx-markdown.ts). pageMarkdown (lib/markdown.ts) puts
 * the section's text in its place when the page is served, so the text follows the setting the server runs with.
 */
export const FOR_AGENTS_PLACEHOLDER = "CUSTOMDOMAINFORAGENTSSECTION";

/** "a, b or c". */
export function listOr(values: readonly string[]): string {
  if (values.length < 2) return values.join("");
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}

/**
 * The "For AI agents" section as Markdown: the text of the llms.txt section and of the docs page's Markdown. With
 * the context link off, its three paragraphs are left out and the last paragraph names the briefs only.
 */
export function forAgentsMarkdown(options: { heading?: boolean; context?: boolean } = {}): string {
  const { heading = true, context = agentSurface().context } = options;
  const lines: string[] = [];
  if (heading) lines.push(`## ${FOR_AGENTS_TEXT.heading}`, "");
  lines.push(FOR_AGENTS_TEXT.intro, "");
  for (const brief of BRIEFS) lines.push(`- ${brief.label}: ${briefUrl(brief.slug)}`);
  lines.push("");
  if (context) {
    lines.push(FOR_AGENTS_TEXT.contextIntro, "", CONTEXT_TEMPLATE, "");
    for (const part of CONTEXT_PARTS) lines.push(`- ${part.describe}: ${listOr(part.values)}`);
    lines.push("", ...FOR_AGENTS_TEXT.contextRules, "");
  }
  lines.push(...FOR_AGENTS_TEXT.keep(context));
  return lines.join("\n");
}
