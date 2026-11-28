/**
 * Root-level /llms.txt (docs.customdomain.ai/llms.txt), which was a 404 while the index lived only at
 * /docs/llms.txt. Answer engines and the llms.txt convention (https://llmstxt.org/) look at the host root, so this
 * serves the same text there: the agent instructions (lib/agent-instructions.ts), the "For AI agents" section, then
 * every page (lib/llms.ts).
 */

import { llmsIndex } from "@/lib/llms";
import { withAgentInstructions } from "@/lib/agent-instructions";

export function GET() {
  return new Response(withAgentInstructions(llmsIndex()), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
