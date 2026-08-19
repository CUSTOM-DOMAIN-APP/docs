# AGENTS.md

Instructions for AI coding agents working with this repository or implementing custom domains.

## What this is

CustomDomain (customdomain.ai) is managed infrastructure that lets a platform's users connect their own domain in one click: automatic DNS configuration and automatic SSL/TLS issuance and renewal. 63 DNS and registrar providers are catalogued: exactly 25 are auto-configured (6 provider OAuth, 2 Domain Connect, 17 scoped API token) and the remaining 38 use a guided flow with automatic verification. The live split is served at `https://api.customdomain.ai/v1/providers/census` — read it rather than repeating a number from here.

There is **no separate ownership-challenge step and no verification TXT record to add** on the guided path. Control is proven by the rail itself: an OAuth authorization, a one-click provider apply, a scoped API token, or the records appearing in the domain's own authoritative DNS. See https://docs.customdomain.ai/docs/concepts/ownership-and-setup-types.

## Connect a domain in 3 steps (REST)

Base URL: `https://api.customdomain.ai` (API docs: https://docs.customdomain.ai/docs/api-reference)

```bash
# 1. Create a connection for the user's domain
curl -X POST https://api.customdomain.ai/v1/connections \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"domain": "app.customer.com", "application_id": "<app>"}'

# 2. Start one-click provider authorization (or fall back to guided manual records)
curl -X POST https://api.customdomain.ai/v1/connections/<ID>/oauth:start \
  -H "Authorization: Bearer $API_KEY"

# 3. Poll until live (DNS written, records value-checked, TLS issued)
curl https://api.customdomain.ai/v1/connections/<ID> \
  -H "Authorization: Bearer $API_KEY"
```

Connection status is one of `pending`, `propagating`, `live`, `failed`. A `failed` connection carries `error_code` of `propagation_timeout` or `setup_incomplete`, and clears automatically if the records later resolve. Do not invent other status names.

Endpoint shapes are illustrative; always follow https://docs.customdomain.ai/docs/api-reference for exact schemas.

## MCP server (for agents)

Hosted MCP endpoint: `https://mcp.customdomain.ai/mcp` (streamable HTTP, OAuth client credentials via `https://mcp.customdomain.ai/token`). Twelve tools: search for and register domains, create and re-apply connections, disconnect, discover a domain's provider, forward a domain, add email records, and read connection and order status. **No tool accepts DNS records as input** — record values are computed server-side from vetted templates, which closes off prompt-injection paths that end in arbitrary DNS writes.

```bash
claude mcp add --transport http customdomain https://mcp.customdomain.ai/mcp
```

Docs: https://docs.customdomain.ai/docs/mcp/overview

## Key references

- Product: https://customdomain.ai
- Documentation: https://docs.customdomain.ai/docs (agent index: https://docs.customdomain.ai/docs/llms.txt)
- Embeddable widget: https://customdomain.ai/connect-domain-widget
- Sign up (free tier): https://app.customdomain.ai/signup
- Questions this file does not answer: connect@customdomain.ai

## Conventions for edits in this repo

Markdown only. Plain, technically accurate language. American English. Keep files under 300 KB. Match the surrounding file's punctuation rather than converting dashes either way. Write the product name as **CustomDomain**, one word; "custom domain" lowercase is the generic thing a customer connects. Never rename a machine-readable identifier (Domain Connect `providerId`/`serviceId`, package names, URLs) to match the brand form.
