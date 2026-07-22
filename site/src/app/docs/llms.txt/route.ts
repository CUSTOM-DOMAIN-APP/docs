import { llms } from "fumadocs-core/source";
import { source } from "@/lib/source";

// llms.txt index for the /docs tree: a Markdown outline of every page, in
// sidebar order, with titles/descriptions. See https://llmstxt.org/.
const { index } = llms(source);

export function GET() {
  return new Response(index(), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
