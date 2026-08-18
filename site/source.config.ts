import { defineDocs, defineConfig } from "fumadocs-mdx/config";

// Fumadocs MDX collection config. `dir` points at the repo's real content/
// directory (one level up from this app), so there is no copy or sync step:
// this app renders the same MDX files that are the canonical source of truth
// for the docs, in place.
//
// THERE IS DELIBERATELY NO BLOG COLLECTION HERE. Articles live on the Odoo
// blog at customdomain.ai/blog/custom-domain-blog-2/, published through the
// marketing app's blog rail. A second blog on this host would compete with
// that one for the same queries and split our own ranking — which is exactly
// what happened when one was briefly added here.
export const docs = defineDocs({
  dir: "../content",
});

export default defineConfig();
