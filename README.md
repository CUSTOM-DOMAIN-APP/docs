# Custom Domain documentation

The source of truth for docs.customdomain.ai — the guides that teach a developer to ship a
connect-your-domain flow.

**Status:** Live · 119 MDX pages · rendered straight from this repo, no sync step

[![docs](https://img.shields.io/badge/docs-docs.customdomain.ai-1c1917?style=flat)](https://docs.customdomain.ai/docs)
[![status](https://img.shields.io/badge/status-status.customdomain.ai-1c1917?style=flat)](https://status.customdomain.ai)
[![license](https://img.shields.io/badge/license-MIT-1c1917?style=flat)](./LICENSE)

|  |  |
|---|---|
| **What it is** | The MDX content and the Next.js renderer behind the Custom Domain docs site |
| **Who it's for** | Developers integrating custom domains, and anyone debugging a stuck connection |
| **Live at** | [docs.customdomain.ai/docs](https://docs.customdomain.ai/docs) · uptime at [status.customdomain.ai](https://status.customdomain.ai) |
| **Stack** | MDX · Fumadocs 16 · Next.js 16 · React 19 · Tailwind 4 · Docker on the production host |
| **Status** | Live · 119 MDX pages, 71 of them API reference · `site/` reads `content/` directly |

[Custom Domain](https://customdomain.ai) lets a platform's users connect a domain they already
own in one click. This repository holds everything the documentation site renders: the concepts,
the connect flow, the REST API reference, the widget and SDK guides, the hosted MCP server, and
the DNS and TLS troubleshooting. If you want the rendered version, read
[docs.customdomain.ai/docs](https://docs.customdomain.ai/docs) — it has search, navigation and
runnable API examples that GitHub's MDX preview does not.

## What it covers

Connecting a customer's domain means provider detection across 63 DNS and registrar providers,
one-click provider authorisation (or a scoped API token, or a guided manual flow with automatic
verification), TLS certificates that issue and renew on their own, and a managed reverse-proxy
edge that terminates TLS with strict multi-tenant isolation. A domain connected through provider
authorisation is typically live in about thirty seconds.

There is no separate ownership challenge and no verification TXT record to paste: control is
proven by the rail that writes the DNS, or by the records appearing in the domain's own
authoritative DNS. Documenting that honestly takes room, which is why this is 119 files and not
a single page.

The honest limit, stated here as plainly as it is stated in the docs: **38 of the 63 providers
have no working automated write rail**, because they ship no delegated DNS-write API or ship one
that replaces a whole zone. Those domains go through the guided manual path — the app shows the
exact records and verifies them automatically, but a human still pastes them. Verified against
the live census on 2026-09-04: 63 catalogued, 17 provider-API, 6 OAuth, 2 Domain Connect, 38 manual.

Where to start, depending on why you are here:

- **Shipping the feature** — [getting started](content/getting-started/) walks a first domain end to end in about five minutes.
- **Embedding it** — [widget and SDK](content/widget-sdk/) for the drop-in flow, [API reference](content/api-reference/) for the 71 endpoints behind it.
- **Automating it from an agent** — [the hosted MCP server](content/mcp/), streamable HTTP with OAuth client credentials.
- **Something is stuck** — [troubleshooting](content/troubleshooting.mdx) and [DNS behaviour](content/dns/) cover propagation, CAA and the pending states.

## Quickstart

Run the docs site locally. It renders `../content` directly, so an edit to any MDX file shows up
on save — there is no build-and-copy step between what you edit and what you read.

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

## How it's organised

```text
.
├── content/              # every documentation page, as MDX — this is the product
│   ├── getting-started/  # connect a first domain end to end, in about five minutes
│   ├── connect-flow/     # provider detection, authorisation, API tokens, the manual path
│   ├── concepts/         # architecture, connections, how domains classify into setup types
│   ├── dns/              # records, coverage, email DNS and SPF merge, propagation
│   ├── providers/        # nine per-provider walkthroughs plus the coverage breakdown
│   ├── api-reference/    # 71 endpoint pages: tokens, domains, connections, tenancy, billing
│   ├── widget-sdk/       # installing, configuring, gating and theming the connect widget
│   ├── mcp/              # the hosted MCP server for AI agents, and its domain tools
│   └── webhooks/         # events, delivery, retries, signature verification
├── site/                 # the Fumadocs + Next.js renderer; source.config.ts points at ../content
├── AGENTS.md             # the short version of this repo, for LLM tooling
└── DEPLOYMENT.md         # how the container is built on the production host
```

Agents and LLM tooling should start at [docs.customdomain.ai/docs/llms.txt](https://docs.customdomain.ai/docs/llms.txt),
which lists every page with a description so a client can fetch exactly what it needs.

## Build and deploy

`docs.customdomain.ai` is served by the renderer in [`site/`](site/), built as a Docker container
on the production host from a sibling checkout of this repo. A change merges to `main`, the host
pulls, the container rebuilds, and the page is live. `app.customdomain.ai/docs*` permanently
redirects (308) here. Full commands are in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

Two things worth knowing before you file a bug about stale content. The container does not yet
rebuild on every product deploy, so a merged fix appears once the host has pulled again. And
`content/providers/*.mdx` is **generated** from the product repo's provider enrichment data — a
hand edit there is correct for the live site until the next generation run overwrites it, so a
fix to those pages needs the same fix in the generator.

## Contributing

Typo and clarity fixes are welcome as direct pull requests. For new pages, restructuring, or
changed API behaviour, open an issue first so the change can be checked against current product
behaviour. [`CONTRIBUTING.md`](./CONTRIBUTING.md) has the full rules; the short version is that
every DNS record, request and response in a code block must be real and current, and every number
must trace to something a reader can open — `GET /v1/providers/census` for provider coverage,
`GET /v1/plans` for pricing and quotas. No placeholder output pretending to be real output.

Customer-facing content only. Internal engineering docs belong in the product repo. The test when
you are unsure: would this page make sense to someone who will never see the source code?

For billing, security disclosure, or anything account-specific, email **connect@customdomain.ai**
rather than opening a public issue.

## License

[MIT](./LICENSE) © EVERJUST Company. Custom Domain is a product of EVERJUST.
