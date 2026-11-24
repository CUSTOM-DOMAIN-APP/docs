/**
 * llms.txt for the /docs tree (docs.customdomain.ai/docs/llms.txt; https://llmstxt.org/): the agent instructions
 * (lib/agent-instructions.ts), the "For AI agents" section, then a Markdown outline of every page in sidebar order
 * with its title and description (lib/llms.ts). Rendered on each request from the page list the site was built with.
 */

import { llmsIndex } from "@/lib/llms";
import { withAgentInstructions } from "@/lib/agent-instructions";

export function GET() {
  return new Response(withAgentInstructions(llmsIndex()), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
