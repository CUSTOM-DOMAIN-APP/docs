import type { MetadataRoute } from "next";

// The origin had no robots.txt, so the live file was Cloudflare's edge-injected
// content-signals comment block with zero crawl directives and no Sitemap line.
// This serves a real one from the origin: allow everything, name the AI answer
// engines explicitly (deliberate policy, not default-allow, since docs are the
// content those engines should retrieve), and point at the sitemap.
//
// Note for operators: if Cloudflare's "managed robots.txt" feature is enabled
// on this zone it can still override the origin file at the edge. Confirm the
// live robots.txt matches this after deploy; if it does not, disable the
// managed-robots setting in the Cloudflare dashboard.
const BASE = "https://docs.customdomain.ai";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
