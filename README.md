# CustomDomain™ documentation

The source of truth for docs.customdomain.ai, the guides that teach a developer to ship a connect-your-domain flow.

**Status:** Live at docs.customdomain.ai · rebuilt from `main` at every product deploy

[![status](https://img.shields.io/badge/status-status.customdomain.ai-1c1917?style=flat)](https://status.customdomain.ai)
[![docs](https://img.shields.io/badge/docs-docs.customdomain.ai-1c1917?style=flat)](https://docs.customdomain.ai/docs)
[![license](https://img.shields.io/badge/license-MIT-1c1917?style=flat)](./LICENSE)

[Website](https://customdomain.ai) · [Docs](https://docs.customdomain.ai/docs) · [Console](https://app.customdomain.ai) · [API reference](https://docs.customdomain.ai/docs/api-reference) · [Changelog](https://docs.customdomain.ai/docs/changelog) · [llms.txt](https://docs.customdomain.ai/docs/llms.txt)

|  |  |
|---|---|
| **What it is** | The MDX content and the Next.js renderer behind the CustomDomain™ docs site |
| **Who it's for** | Developers integrating custom domains, and anyone debugging a stuck connection |
| **Live at** | [docs.customdomain.ai/docs](https://docs.customdomain.ai/docs) · uptime at [status.customdomain.ai](https://status.customdomain.ai) |
| **Stack** | MDX · Fumadocs 16 · Next.js 16 · React 19 · Tailwind 4 · Docker on the production host |
| **Status** | Live · `site/` reads `content/` directly · a merge to `main` goes live at the next product deploy |

[CustomDomain™](https://customdomain.ai) lets a platform's users connect a domain they already
own in one click. This repository holds everything the documentation site renders: the concepts,
the connect flow, the REST API reference, the widget and SDK guides, the hosted MCP server, and
the DNS and TLS troubleshooting. If you want the rendered version, read
[docs.customdomain.ai/docs](https://docs.customdomain.ai/docs): it has search, navigation and
runnable API examples that GitHub's MDX preview does not.

## What it covers

Connecting a customer's domain means provider detection across 63 DNS and registrar providers,
one-click provider authorization (or a scoped API token, or a guided manual flow with automatic
verification), TLS certificates that issue and renew on their own, and a managed reverse-proxy
edge that terminates TLS with strict multi-tenant isolation. A domain connected through provider
authorization is typically live in about thirty seconds.

There is no separate ownership challenge and no verification TXT record to paste: control is
proven by the rail that writes the DNS, or by the records appearing in the domain's own
authoritative DNS. Documenting that honestly takes room, which is why this runs to well over a
hundred pages and not a single one.

The honest limit, stated here as plainly as it is stated in the docs: **38 of the 63 providers
have no working automated write rail**, because they ship no delegated DNS-write API or ship one
that replaces a whole zone. Those domains go through the guided manual path: the app shows the
exact records and verifies them automatically, but a human still pastes them. Verified against
the live census on 2026-09-26: 63 catalogued, 17 provider API, 6 OAuth, 2 Domain Connect, 38 manual.

Where to start, depending on why you are here:

- **Shipping the feature:** [getting started](content/getting-started/) walks a first domain end to end in about five minutes.
- **Embedding it:** [widget and SDK](content/widget-sdk/) for the drop-in flow, [API reference](content/api-reference/) for every endpoint behind it.
- **Automating it from an agent:** [the hosted MCP server](content/mcp/), streamable HTTP with OAuth client credentials.
- **Something is stuck:** [troubleshooting](content/troubleshooting.mdx) and [DNS behavior](content/dns/) cover propagation, CAA and the pending states.

## Quickstart

Run the docs site locally. It renders `../content` directly, so an edit to any MDX file shows up
on save; there is no build-and-copy step between what you edit and what you read.

```sh
git clone https://github.com/CUSTOM-DOMAIN-APP/docs.git
cd docs/site
npm install
npm run dev          # http://localhost:3000/docs
```

Check any provider number the content claims, against the endpoint the content cites:

```sh
curl -s https://api.customdomain.ai/v1/providers/census | head -c 200
```

## How it's organized

```text
.
├── content/              # every documentation page, as MDX: this is the product
│   ├── getting-started/  # pick a path, one page per path (console, API, widget, MCP), self-hosted quickstart
│   ├── guides/           # task guides: set up, connect, choose a solution, serve from your app
│   ├── concepts/         # architecture, connections, how domains classify into setup types
│   ├── authentication/   # API keys, member roles, short-lived widget tokens
│   ├── connect-flow/     # create, verify and go live, forwarding, managed connections, offboarding
│   ├── dns/              # provider setup and coverage, root domains, your own records, email DNS
│   ├── providers/        # nine per-provider walkthroughs plus the coverage breakdown
│   ├── sell/             # buying a domain through the product
│   ├── webhooks/         # events, delivery, retries, signature verification
│   ├── api-reference/    # one generated page per endpoint, plus a hand-written index
│   ├── widget-sdk/       # installing, configuring, gating and theming the connect widget
│   ├── mcp/              # the hosted MCP server for AI agents, and its domain tools
│   ├── agents/           # delegated agent access: OAuth flow, grants, spend caps
│   ├── security/         # roles and permissions, credential handling
│   ├── billing/          # plans, quotas, checkout
│   └── self-hosting/     # configuration for running the stack yourself
├── site/                 # the Fumadocs + Next.js renderer; source.config.ts points at ../content
├── AGENTS.md             # the short version of this repo, for LLM tooling
└── DEPLOYMENT.md         # how the container is built and when a change goes live
```

Agents and LLM tooling should start at [docs.customdomain.ai/docs/llms.txt](https://docs.customdomain.ai/docs/llms.txt),
which lists every page with a description so a client can fetch exactly what it needs.

## Build and deploy

`docs.customdomain.ai` is served by the renderer in [`site/`](site/), built as a Docker container
on the production host from a sibling checkout of this repo. Every product deploy refreshes that
checkout to this repo's `main` and rebuilds the container, as a separate step that cannot fail
the product deploy. Nothing in this repo triggers a deploy by itself, so a change merged here
goes live at the next product deploy, not at merge time. `app.customdomain.ai/docs*` permanently
redirects (308) here. The full path is in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

Two things worth knowing before you file a bug about stale content. A merged fix appears at the
next product deploy, which can be some time after the merge. And `content/providers/*.mdx` is
**generated** from the product repo's provider enrichment data: a hand edit there is correct for
the live site until the next generation run overwrites it, so a fix to those pages needs the same
fix in the generator.

## Contributing

Typo and clarity fixes are welcome as direct pull requests. For new pages, restructuring, or
changed API behavior, open an issue first so the change can be checked against current product
behavior. [`CONTRIBUTING.md`](./CONTRIBUTING.md) has the full rules; the short version is that
every DNS record, request and response in a code block must be real and current, and every number
must trace to something a reader can open: `GET /v1/providers/census` for provider coverage,
`GET /v1/plans` for pricing and quotas. No placeholder output pretending to be real output.

Customer-facing content only. Internal engineering docs belong in the product repo. The test when
you are unsure: would this page make sense to someone who will never see the source code?

## Related

- [customdomain-sdk](https://github.com/CUSTOM-DOMAIN-APP/customdomain-sdk): the JavaScript and TypeScript client, published as `customdomain-js` and `@customdomain/react`
- [customdomain-mcp](https://github.com/CUSTOM-DOMAIN-APP/customdomain-mcp): the MCP server for AI agents, hosted at mcp.customdomain.ai
- [custom-domain-checks](https://github.com/CUSTOM-DOMAIN-APP/custom-domain-checks): a GitHub App for continuous DNS and TLS health checks on custom domains
- [awesome-custom-domains](https://github.com/CUSTOM-DOMAIN-APP/awesome-custom-domains): a curated list of tools, APIs and services for custom domains
- [connect-domain-for-ai-agents](https://github.com/CUSTOM-DOMAIN-APP/connect-domain-for-ai-agents): connecting domains from an AI agent through the MCP server and REST API
- [connect-domain-for-email-platforms](https://github.com/CUSTOM-DOMAIN-APP/connect-domain-for-email-platforms): SPF, DKIM, DMARC and MX setup for email platforms
- [connect-domain-for-agencies](https://github.com/CUSTOM-DOMAIN-APP/connect-domain-for-agencies): white-label client domains for agencies, with working examples
- [connect-domain-for-website-builders](https://github.com/CUSTOM-DOMAIN-APP/connect-domain-for-website-builders): domain connection for site builders and no-code platforms
- [customdomain-brand-kit](https://github.com/CUSTOM-DOMAIN-APP/customdomain-brand-kit): logos, wordmarks and color tokens

## Support

- **Docs:** [docs.customdomain.ai](https://docs.customdomain.ai/docs)
- **Questions and ideas:** [GitHub Discussions](https://github.com/CUSTOM-DOMAIN-APP/docs/discussions)
- **Bugs and corrections:** [open an issue](https://github.com/CUSTOM-DOMAIN-APP/docs/issues) on this repository
- **Service status:** [status.customdomain.ai](https://status.customdomain.ai)
- **Account and billing:** connect@customdomain.ai
- **Security:** report privately to security@customdomain.ai, never in a public issue. Policy: [app.customdomain.ai/security](https://app.customdomain.ai/security)

## License

[MIT](./LICENSE). CustomDomain™ is a product of EverJust Company.
