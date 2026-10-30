/**
 * robots.txt for docs.customdomain.ai: allow every crawler, with explicit allow groups for search crawlers,
 * assistant fetchers and AI training crawlers (decision D-14), and point at the sitemap.
 */

import type { MetadataRoute } from "next";

// The origin had no robots.txt, so the live file was Cloudflare's edge-injected
// content-signals comment block with zero crawl directives and no Sitemap line.
// This serves a real one from the origin. Everything is allowed, and the
// crawlers that decide whether the docs show up in search and in AI answers
// are named in their own groups, so the policy is deliberate rather than an
// accident of default-allow. The groups follow D-14: search crawlers,
// assistant fetchers (a person asked an assistant to read a page) and
// training crawlers.
//
// No Host line: it is a Yandex-only directive that Google and Bing ignore.
//
// Note for operators: if Cloudflare's "managed robots.txt" feature is enabled
// on this zone it can still override the origin file at the edge. Confirm the
// live robots.txt matches this after deploy; if it does not, disable the
// managed-robots setting in the Cloudflare dashboard.
const BASE = "https://docs.customdomain.ai";

// Search and answer-engine indexes: Google, Bing (which also feeds Copilot and
// ChatGPT search), ChatGPT search, Claude search, Perplexity and Apple.
const SEARCH_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Applebot",
];

// Fetches made when a person asks an assistant to read a page.
const ASSISTANT_FETCHERS = ["ChatGPT-User", "Claude-User", "Perplexity-User"];

// Model training crawlers, allowed on purpose: a developer product wants
// coding assistants to describe it correctly.
const TRAINING_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: SEARCH_CRAWLERS, allow: "/" },
      { userAgent: ASSISTANT_FETCHERS, allow: "/" },
      { userAgent: TRAINING_CRAWLERS, allow: "/" },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
