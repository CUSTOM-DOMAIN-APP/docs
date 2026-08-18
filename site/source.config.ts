import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

// Fumadocs MDX collection config. `dir` points at the repo's real content/
// directory (one level up from this app), so there is no copy or sync step:
// this app renders the same MDX files that are the canonical source of truth
// for the docs, in place.
export const docs = defineDocs({
  dir: "../content",
});

// The blog is a SECOND collection rather than a folder inside content/, because
// the two have genuinely different shapes: docs are an evergreen tree the
// sidebar walks, posts are a reverse-chronological list that needs a date and
// an author and must never appear in the docs navigation. Sharing one
// collection would have put announcements in the docs sidebar and given every
// post a /docs/ URL.
//
// Declared with defineDocs (not defineCollections) deliberately: it yields the
// same toFumadocsSource() the docs tree already uses, so /blog gets the same
// loader, the same MDX pipeline, and the same component map with no second
// code path to keep in step.
export const blog = defineDocs({
  dir: "../blog",
  docs: {
    schema: frontmatterSchema.extend({
      // ISO date (YYYY-MM-DD). Parsed, not just carried: a typo here would
      // otherwise surface as "Invalid Date" on a public page.
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
      author: z.string().default("Custom Domain"),
    }),
  },
});

export default defineConfig();
