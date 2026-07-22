import { defineDocs, defineConfig } from "fumadocs-mdx/config";

// Fumadocs MDX collection config. `dir` points at the repo's real content/
// directory (one level up from this app), so there is no copy or sync step:
// this app renders the same MDX files that are the canonical source of truth
// for the docs, in place.
export const docs = defineDocs({
  dir: "../content",
});

export default defineConfig();
