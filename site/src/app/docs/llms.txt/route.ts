/**
 * llms.txt for the /docs tree (docs.customdomain.ai/docs/llms.txt; https://llmstxt.org/): the "For AI agents"
 * section, then a Markdown outline of every page in sidebar order with its title and description (lib/llms.ts).
 * Rendered on each request from the page list the site was built with.
 */

import { llmsIndex } from "@/lib/llms";

export function GET() {
  return new Response(llmsIndex(), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
