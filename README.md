# CustomDomain documentation

[![Docs](https://img.shields.io/badge/docs-docs.customdomain.ai-1c1917)](https://docs.customdomain.ai/docs)
[![SDK downloads](https://img.shields.io/npm/dm/customdomain-js?label=sdk%20downloads%2Fmonth&color=1c1917)](https://www.npmjs.com/package/customdomain-js)

This repository is the source of truth for the [CustomDomain documentation](https://docs.customdomain.ai/docs): the guides, concepts, and API reference for connecting customer-owned domains to a SaaS platform with automatic DNS configuration and automatic TLS issuance and renewal. Everything the docs site renders lives here as MDX, and the live site builds from this repo directly. If you are looking for how to add a "connect your domain" flow to your product, start with the [quickstart](content/getting-started/quickstart.mdx) or read the rendered docs at [docs.customdomain.ai/docs](https://docs.customdomain.ai/docs).

The rendered site is [docs.customdomain.ai](https://docs.customdomain.ai/docs); its live availability, along with the rest of the platform, is published at [status.customdomain.ai](https://status.customdomain.ai).

## What this repo is

[CustomDomain](https://customdomain.ai) lets a platform's users connect their own domain in one click. Under the hood that means provider detection across 63 DNS and registrar providers, one-click provider authorization (or an API token, or a guided manual flow with automatic verification), TLS certificates that issue and renew on their own, and a managed reverse-proxy edge that terminates TLS with strict multi-tenant isolation. A domain is typically live in about 30 seconds via authorization.

There is no separate ownership-challenge step and no verification TXT record to add: control is proven by the rail that writes the DNS, or by the records appearing in the domain's own authoritative DNS. [Setup types](content/concepts/ownership-and-setup-types.mdx) explains why.

Documenting that accurately takes some room. This repo holds 100+ MDX files covering the full surface: the hosted connect flow, the [embeddable widget and SDK](https://customdomain.ai/connect-domain-widget), the [REST API](https://customdomain.ai/custom-domain-api), and the [hosted MCP server](https://customdomain.ai/mcp-server) that AI agents use to manage domains. (Exact count drifts as content is added; run `find content -name "*.mdx" | wc -l` for the current number rather than trusting a hardcoded figure here.)

## Repo map

All documentation lives under `content/`:

| Path | What it covers |
| --- | --- |
| `content/getting-started/` | Connect a first custom domain end to end, in about five minutes |
| `content/connect-flow/` | The connect flow itself: provider detection, one-click provider authorization, API token setup, and the guided manual path with automatic verification |
| `content/concepts/` | Architecture, connections, and how domains are classified into setup types |
| `content/dns/` | DNS providers and coverage, record management, email DNS and SPF merge, propagation and verification behavior |
| `content/providers/` | Per-provider walkthroughs (9 of the 63 today) plus the coverage breakdown |
| `content/api-reference/` | 60+ endpoint pages: tokens, domains, connections, applications, members, tenancy, providers, templates, registrar search and purchase, monitoring, webhooks, and billing |
| `content/authentication/` | API credential types and widget tokens |
| `content/webhooks/` | Webhook events, delivery, retries, and signature verification |
| `content/agents/` | Delegated AI agent access: the OAuth flow and managing access (not yet enabled in production) |
| `content/mcp/` | The hosted MCP server for AI agents: streamable HTTP at `mcp.customdomain.ai/mcp`, OAuth client credentials, and the domain tool reference |
| `content/widget-sdk/` | The embeddable connect widget and SDK: installation, configuration, JWT gating, theming, and events |
| `content/billing/`, `content/sell/`, `content/self-hosting/`, `content/security/` | Plans and quotas, buying a domain, self-hosting configuration, and the security overview, one topic per directory |
| `content/user-journeys.mdx`, `content/reference.mdx`, `content/faq.mdx`, `content/troubleshooting.mdx`, `content/changelog.mdx` | Top-level single pages: end-to-end user journeys, an API reference appendix, FAQ, troubleshooting, and the changelog |

## How a change reaches the live site

This repo is canonical, and [docs.customdomain.ai](https://docs.customdomain.ai/docs) renders `content/` directly. There is no copy step in the path a reader sees.

1. A change merges into `main` in this repo.
2. The `docs` container on the production host rebuilds from this repo's `content/` using the renderer in [`site/`](site/).
3. [docs.customdomain.ai/docs](https://docs.customdomain.ai/docs) serves the new content.

The container does not yet rebuild on every product deploy, so a merged fix appears once the host has pulled this repo again; [`DEPLOYMENT.md`](DEPLOYMENT.md) has the exact commands and the follow-up that would automate it.

The legacy `.github/workflows/sync-to-product.yml` workflow still runs and still opens its sync branch against the product repo, but nothing renders that synced copy any more: `app.customdomain.ai/docs` and `/docs/*` permanently redirect (308) to `docs.customdomain.ai`. Retiring the workflow is an open decision, not a pending step.

## The standalone site

This repo ships its own renderer at [`site/`](site/) (Fumadocs + Next.js, reading `content/` directly, no sync step), and that renderer is what serves [docs.customdomain.ai/docs](https://docs.customdomain.ai/docs) today. The DNS record and the companion infra change have both landed. See [`DEPLOYMENT.md`](DEPLOYMENT.md) for how it is built and deployed, and [`site/README.md`](site/README.md) for the layout.

## Where to read the docs

GitHub will render most of these files, but the live site renders them best: MDX components, navigation, search, and runnable API examples all work there.

- Humans: [docs.customdomain.ai/docs](https://docs.customdomain.ai/docs)
- Agents and LLM tooling: the docs publish an index at [docs.customdomain.ai/docs/llms.txt](https://docs.customdomain.ai/docs/llms.txt), which lists every page with a short description so an agent can fetch exactly what it needs. [`AGENTS.md`](AGENTS.md) in this repo is the short version.
- MCP clients: connect directly to the hosted server described in `content/mcp/`, or see the client examples at [github.com/CUSTOM-DOMAIN-APP/customdomain-mcp](https://github.com/CUSTOM-DOMAIN-APP/customdomain-mcp)

## Scope: what belongs here vs. the product repo

This repo is for customer-facing content only: anything a customer or a
third-party integrator would read on their own, independent of working on
the product's codebase. Internal engineering docs (architecture write-ups,
security audits, operations runbooks, ADRs, product investigations) belong in
the `custom-domains` repo's own `docs/` folder instead, not here. (That repo is
private, so its `ORGANIZATION.md` — which carries the full rule — isn't
linkable from here.)

The test when you're unsure: **would this page make sense to someone who will
never see the source code?** If yes, it belongs here. If understanding it
requires knowing how the code is laid out, it belongs in the product repo.

Note that `content/providers/*.mdx` is **generated** (`infra/seo/gen_provider_guides.py` in the product repo, from its `enrichment.json`). A hand edit here is correct for the live site until the next generation run overwrites it, so a fix to those pages needs the same fix in the generator.

## Contributing

Typo and clarity fixes are welcome as direct pull requests, no issue needed. For anything larger (new pages, restructuring, changed API behavior), open an issue first so we can confirm the change against the current product behavior. [`CONTRIBUTING.md`](CONTRIBUTING.md) has the full content rules; the short version:

- Plain language. Short sentences. Write for a developer who has never configured DNS before and an operator who has configured too much of it.
- Second person ("you"), active voice.
- Every DNS record, API request, and response in a code block must be real and current. No placeholder output pretending to be real output.
- Numbers must trace to something a reader can check: `GET /v1/providers/census` for provider coverage, `GET /v1/plans` for pricing and quotas.
- One H1 per page, sentence-case headings, tables only where they genuinely clarify.
- Em dashes and en dashes are used throughout the existing content. Match the surrounding file rather than converting either way in an unrelated change.

## Questions this repo cannot answer

Open an issue for anything about the documentation itself. For billing, security disclosure, or anything account-specific, email **connect@customdomain.ai** instead: those need a person, not a public thread.

## About CustomDomain

[CustomDomain](https://customdomain.ai), a product of EverJust Company, is the managed custom-domain layer for platforms: your users connect their own domain in one click, and DNS configuration and TLS issuance and renewal happen automatically. Coverage spans 63 DNS and registrar providers, 25 of them auto-configured through one-click provider authorization or a scoped API token, which builds on open standards such as the Domain Connect protocol (an open standard maintained by a community of developers across multiple companies) and covers more providers than the protocol alone. Pricing starts at $0. This repository is maintained by the CustomDomain team.

**The honest limit on that coverage:** 38 of the 63 have no working automated write rail, because the provider ships no delegated DNS-write API, or ships one that replaces a whole zone. Those domains go through the guided manual path, where the app shows the exact records and verifies them automatically, but a human still pastes them. If most of your customers sit at one of those 38, that is the experience most of them will get. [Provider coverage](content/providers/index.mdx) lists the split, and `GET https://api.customdomain.ai/v1/providers/census` returns it live.

Useful starting points:

- [How to set up a custom domain](https://customdomain.ai/guides/how-to-set-up-a-custom-domain), a plain-language walkthrough of the whole process
- [Custom domain vs subdomain](https://customdomain.ai/glossary/custom-domain-vs-subdomain), if you are deciding what to offer your users
- [Custom domains for SaaS](https://customdomain.ai/custom-domains-for-saas) and [one-click DNS setup](https://customdomain.ai/one-click-dns-setup), the core product pages
- Solutions for [site builders](https://customdomain.ai/for/site-builders), [agencies and white-label platforms](https://customdomain.ai/for/agencies-white-label), and [AI agents](https://customdomain.ai/for/ai-agents)
- [Create a free account](https://app.customdomain.ai/signup) and connect your first domain today

Sibling repositories in this org, all public:

- [customdomain-mcp](https://github.com/CUSTOM-DOMAIN-APP/customdomain-mcp), the MCP server, including client configs
- [awesome-custom-domains](https://github.com/CUSTOM-DOMAIN-APP/awesome-custom-domains), a curated list of the whole solution space, competitors included
- Field guides by vertical: [website builders](https://github.com/CUSTOM-DOMAIN-APP/connect-domain-for-website-builders), [agencies](https://github.com/CUSTOM-DOMAIN-APP/connect-domain-for-agencies), [AI agents](https://github.com/CUSTOM-DOMAIN-APP/connect-domain-for-ai-agents), [email platforms](https://github.com/CUSTOM-DOMAIN-APP/connect-domain-for-email-platforms). These are written to be read on their own; where one of them and this repo disagree about product behavior, **this repo is right**.
