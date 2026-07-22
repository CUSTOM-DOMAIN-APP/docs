import fs from "node:fs";
import { source } from "@/lib/source";

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
