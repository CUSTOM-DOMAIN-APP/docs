# Custom Domain documentation

This repository is the source of truth for the [Custom Domain documentation](https://app.customdomain.ai/docs): the guides, concepts, and API reference for connecting customer-owned domains to a SaaS platform with automatic DNS configuration, domain ownership verification, and automatic TLS issuance and renewal. Everything the docs site renders lives here as MDX, and edits merged into this repo sync to the product site automatically. If you are looking for how to add a "connect your domain" flow to your product, start with the [quickstart](content/getting-started/quickstart.mdx) or read the rendered docs at [app.customdomain.ai/docs](https://app.customdomain.ai/docs).

## What this repo is

[Custom Domain](https://customdomain.ai) lets a platform's users connect their own domain in one click. Under the hood that means provider detection across 63 DNS and registrar providers, one-click provider authorization (or an API token, or a guided manual flow with automatic verification), ownership verification, TLS certificates that issue and renew on their own, and a managed reverse-proxy edge that terminates TLS with strict multi-tenant isolation. A domain is typically live in about 30 seconds via authorization.

Documenting that accurately takes some room. This repo holds 100+ MDX files covering the full surface: the hosted connect flow, the [embeddable widget and SDK](https://customdomain.ai/connect-domain-widget), the [REST API](https://customdomain.ai/custom-domain-api), and the [hosted MCP server](https://customdomain.ai/mcp-server) that AI agents use to manage domains. (Exact count drifts as content is added; run `find content -name "*.mdx" | wc -l` for the current number rather than trusting a hardcoded figure here.)

## Repo map

All documentation lives under `content/`:

| Path | What it covers |
| --- | --- |
| `content/getting-started/` | Connect a first custom domain end to end, in about five minutes |
| `content/connect-flow/` | The connect flow itself: provider detection, one-click provider authorization, API token setup, and the guided manual path with automatic verification |
| `content/concepts/` | Architecture, connections, and how domains are classified into setup types |
| `content/dns/` | DNS providers and coverage, record management, email DNS and SPF merge, propagation and verification behavior |
| `content/api-reference/` | 60+ endpoint pages: tokens, domains, connections, applications, members, tenancy, providers, templates, registrar search and purchase, monitoring, webhooks, and billing |
| `content/authentication/` | API credential types and widget tokens |
| `content/webhooks/` | Webhook events, delivery, retries, and signature verification |
| `content/agents/` | Delegated AI agent access: the OAuth flow and managing access (not yet enabled in production) |
| `content/mcp/` | The hosted MCP server for AI agents: streamable HTTP at `mcp.customdomain.ai/mcp`, OAuth client credentials, and the domain tool reference |
| `content/widget-sdk/` | The embeddable connect widget and SDK: installation, configuration, JWT gating, theming, and events |
| `content/billing/`, `content/sell/`, `content/self-hosting/`, `content/security/` | Plans and quotas, buying a domain, self-hosting configuration, and the security overview, one topic per directory |
| `content/user-journeys.mdx`, `content/reference.mdx`, `content/faq.mdx`, `content/troubleshooting.mdx`, `content/changelog.mdx` | Top-level single pages: end-to-end user journeys, an API reference appendix, FAQ, troubleshooting, and the changelog |

## How the sync works

This repo is canonical. The product site does not edit docs independently; it consumes them from here.

1. A change merges into `main` in this repo.
2. Automation opens a sync branch against the product repository with the updated content.
3. Once that branch merges, the docs site at [app.customdomain.ai/docs](https://app.customdomain.ai/docs) redeploys with the new content.

In practice a merged docs fix usually appears on the live site within the same day. If you spot a discrepancy between this repo and the rendered site, the repo version is newer and the sync simply has not landed yet.

## Moving to a standalone site

This repo also now ships its own standalone renderer at [`site/`](site/)
(Fumadocs + Next.js, reading `content/` directly, no sync step). It's built
and verified, but not yet publicly reachable: it will go live at
`docs.customdomain.ai` once its companion infra PR in `custom-domains` merges
and one DNS record is added. Until then, [app.customdomain.ai/docs](https://app.customdomain.ai/docs)
below remains the real, current, live URL. See [`DEPLOYMENT.md`](DEPLOYMENT.md)
for the full rollout plan and current status.

## Where to read the docs

GitHub will render most of these files, but the live site renders them best: MDX components, navigation, search, and runnable API examples all work there.

- Humans: [app.customdomain.ai/docs](https://app.customdomain.ai/docs)
- Agents and LLM tooling: the docs publish an index at [app.customdomain.ai/docs/llms.txt](https://app.customdomain.ai/docs/llms.txt), which lists every page with a short description so an agent can fetch exactly what it needs
- MCP clients: connect directly to the hosted server described in `content/mcp/`, or see the client examples at [github.com/ever-just/customdomain-mcp](https://github.com/ever-just/customdomain-mcp)

## Scope: what belongs here vs. the product repo

This repo is for customer-facing content only: anything a customer or a
third-party integrator would read on their own, independent of working on
the product's codebase. Internal engineering docs (architecture write-ups,
security audits, operations runbooks, ADRs, product investigations) belong in
the `custom-domains` repo's own `docs/` folder instead, not here. See that
repo's [`ORGANIZATION.md`](https://github.com/CUSTOM-DOMAIN-APP/custom-domains/blob/main/ORGANIZATION.md#4-this-repo-vs-the-other-three)
for the full rule and the test to apply when you're not sure which side a
new page belongs on.

## Contributing

Typo and clarity fixes are welcome as direct pull requests, no issue needed. For anything larger (new pages, restructuring, changed API behavior), open an issue first so we can confirm the change against the current product behavior.

Content rules, applied to every file:

- No em dashes or en dashes anywhere. Use commas, colons, periods, or "and".
- Plain language. Short sentences. Write for a developer who has never configured DNS before and an operator who has configured too much of it.
- Second person ("you"), active voice.
- Every DNS record, API request, and response in a code block must be real and current. No placeholder output pretending to be real output.
- One H1 per page, sentence-case headings, tables only where they genuinely clarify.

## About Custom Domain

[Custom Domain](https://customdomain.ai) is the managed custom-domain layer for platforms: your users connect their own domain in one click, and DNS configuration, ownership verification, and TLS issuance and renewal happen automatically. Coverage spans 63 DNS and registrar providers, 25+ of them fully auto-configured through one-click provider authorization, which builds on open standards such as the Domain Connect protocol (an open standard from the Domain Connect Association) and covers more providers than the protocol alone. Pricing starts at $0. This repository is maintained by the Custom Domain team.

Useful starting points:

- [How to set up a custom domain](https://customdomain.ai/guides/how-to-set-up-a-custom-domain), a plain-language walkthrough of the whole process
- [Custom domain vs subdomain](https://customdomain.ai/glossary/custom-domain-vs-subdomain), if you are deciding what to offer your users
- [Custom domains for SaaS](https://customdomain.ai/custom-domains-for-saas) and [one-click DNS setup](https://customdomain.ai/one-click-dns-setup), the core product pages
- Solutions for [site builders](https://customdomain.ai/for/site-builders), [agencies and white-label platforms](https://customdomain.ai/for/agencies-white-label), and [AI agents](https://customdomain.ai/for/ai-agents)
- [Create a free account](https://app.customdomain.ai/signup) and connect your first domain today
