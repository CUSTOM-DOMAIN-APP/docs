/**
 * The llms.txt index (https://llmstxt.org/) served at /llms.txt and /docs/llms.txt, and raw page text for tools that
 * want a page's source. The index opens with the "For AI agents" section (lib/agent-surface.ts), the same text as the
 * docs page of that name, then lists every page in sidebar order under "Pages". The section follows
 * DOCS_AGENT_SURFACE: with it off the index is the page list alone.
 */

import fs from "node:fs";
import { llms } from "fumadocs-core/source";
import { source } from "@/lib/source";
import { agentSurface, forAgentsMarkdown } from "@/lib/agent-surface";
import { absoluteLinks } from "@/lib/negotiate";

/** Strip a leading YAML frontmatter block (--- ... ---) from raw file text. */
function stripFrontmatter(raw: string): string {
  return raw.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
}

export function getAllDocsPages() {
  return source.getPages();
}

/**
 * Raw markdown/MDX source for a page, frontmatter stripped. Reads the file
 * directly from disk rather than the compiled MDX body, so it works the same
 * for hand-written pages and the generated OpenAPI reference pages.
 */
export function readPageRaw(page: ReturnType<typeof source.getPages>[number]): string {
  if (!page.absolutePath) return "";
  try {
    const raw = fs.readFileSync(page.absolutePath, "utf8");
    return stripFrontmatter(raw);
  } catch {
    return "";
  }
}

/**
 * The llms.txt text. Fumadocs' index is an H1 (the docs title, then its description if it has one) and a bulleted
 * outline of the sidebar; the agent section goes between them, and the outline gets its own heading so it does not
 * read as part of that section. Page links are made absolute, so an assistant may follow them (lib/negotiate.ts).
 */
export function llmsIndex(): string {
  const index = absoluteLinks(llms(source).index());
  if (!agentSurface().pages) return index;
  const blocks = index.split("\n\n");
  const headCount = blocks[1]?.startsWith("> ") ? 2 : 1;
  const head = blocks.slice(0, headCount).join("\n\n");
  const outline = blocks.slice(headCount).join("\n\n").replace(/^\n+/, "");
  return `${head}\n\n${forAgentsMarkdown()}\n\n## Pages\n\n${outline}\n`;
}
