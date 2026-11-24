/**
 * The instructions an AI agent reads at the top of the llms.txt indexes (/llms.txt and /docs/llms.txt): how to
 * read these docs as Markdown, which API version the index describes, and the few rules that keep an agent's use of
 * the product safe. Public text: it says only what an agent needs to use the product, nothing about how it works.
 */

export const AGENT_INSTRUCTIONS = `> CustomDomain™ lets your users connect a domain they already own: it finds the DNS provider, sets up or shows the records, checks them and issues HTTPS.

## Instructions for agents

- Every page is also served as Markdown: add \`.md\` to its URL, or send \`Accept: text/markdown\`.
- This index describes API v1 (\`https://api.customdomain.ai/v1\`), which changes only by addition. The [API reference](/docs/api-reference) and the OpenAPI document (\`https://api.customdomain.ai/v1/openapi.json\`) list every route.
- Keep API keys and client secrets on a server. Never put one in browser code, and never ask a person to paste one into a chat.
- Take DNS records from the API's answers. Do not invent or edit them.
- To act for a person through tools, connect the MCP server: see [MCP](/docs/mcp/overview).
`;

/** Puts the agent instructions under the index's title line (the first line, "# ..."). */
export function withAgentInstructions(index: string): string {
  const nl = index.indexOf("\n");
  if (!index.startsWith("# ") || nl < 0) return `${AGENT_INSTRUCTIONS}\n${index}`;
  return `${index.slice(0, nl)}\n\n${AGENT_INSTRUCTIONS}\n${index.slice(nl + 1).replace(/^\n+/, "")}`;
}
