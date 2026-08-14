import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

// docs.customdomain.ai had no sitemap (404) before this: the only sitemap that
// covered docs was app.customdomain.ai's, and it listed app-host /docs/* URLs
// that 308-redirect here, which Search Console discards ("Page with redirect").
// This makes the canonical docs host advertise its own canonical, 200-status
// URLs. BASE is this host, where every source page is genuinely canonical, so
// the app-host generator bug (building doc URLs on the wrong host) can't recur.
const BASE = "https://docs.customdomain.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Every rendered docs page (guides, providers, API reference, concepts, ...),
  // enumerated from the Fumadocs source so a new page is advertised the day it
  // ships and a deleted one drops out, with nothing to maintain by hand.
  return source.getPages().map((page) => {
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
}
