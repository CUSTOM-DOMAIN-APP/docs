import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { postsNewestFirst } from "@/lib/blog";

// docs.customdomain.ai had no sitemap (404) before this: the only sitemap that
// covered docs was app.customdomain.ai's, and it listed app-host /docs/* URLs
// that 308-redirect here, which Search Console discards ("Page with redirect").
// This makes the canonical docs host advertise its own canonical, 200-status
// URLs. BASE is this host, where every source page is genuinely canonical, so
// the app-host generator bug (building doc URLs on the wrong host) can't recur.
const BASE = "https://docs.customdomain.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Blog posts and the blog index. Enumerated the same way as the docs tree, so
  // publishing a post advertises it without a sitemap edit. lastModified is the
  // post's own date rather than build time — a dated article that claims to
  // have changed on every deploy is noise to a crawler.
  const posts = postsNewestFirst();
  const blogEntries: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/blog`,
      lastModified: posts[0] ? new Date(`${posts[0].data.date}T00:00:00Z`) : now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...posts.map((post) => ({
      url: BASE + post.url,
      lastModified: new Date(`${post.data.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];

  // Every rendered docs page (guides, providers, API reference, concepts, ...),
  // enumerated from the Fumadocs source so a new page is advertised the day it
  // ships and a deleted one drops out, with nothing to maintain by hand.
  const docsEntries: MetadataRoute.Sitemap = source.getPages().map((page) => {
    const isApiRef = page.url.startsWith("/docs/api-reference");
    return {
      url: BASE + page.url,
      lastModified: now,
      changeFrequency: (isApiRef ? "monthly" : "weekly") as
        MetadataRoute.Sitemap[number]["changeFrequency"],
      // The API reference is generated per-endpoint and large; it is not what a
      // problem-shaped search lands on, so it ranks below the written guides.
      priority: isApiRef ? 0.4 : 0.7,
    };
  });

  return [...blogEntries, ...docsEntries];
}
