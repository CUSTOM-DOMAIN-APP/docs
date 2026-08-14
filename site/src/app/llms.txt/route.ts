import { llms } from "fumadocs-core/source";
import { source } from "@/lib/source";

// Root-level /llms.txt (docs.customdomain.ai/llms.txt), which was a 404: the
// llms index existed only at /docs/llms.txt. Answer engines and the llms.txt
// convention look at the host root, so this serves the same index there.
// See https://llmstxt.org/.
const { index } = llms(source);

export function GET() {
  return new Response(index(), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
