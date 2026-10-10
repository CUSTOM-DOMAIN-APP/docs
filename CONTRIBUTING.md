# Contributing to the CustomDomain™ docs

This repo is the source of truth for [docs.customdomain.ai](https://docs.customdomain.ai/docs). Content lives in `content/` as MDX; the renderer lives in [`site/`](site/). Editing a file in `content/` and restarting `next dev` is the whole loop, and the production container builds from the same tree.

## What to send where

| You want to | Do this |
| --- | --- |
| Fix a typo, a broken link, a confusing sentence | Open a pull request directly. No issue needed. |
| Add a page, restructure a section, or change documented API behavior | Open an issue first, so the change can be checked against current product behavior before anyone writes prose. |
| Report that the docs and the product disagree | Open an issue and say which one you observed. Include the request and response if it is an API question. |
| Ask about billing or your account | Email **connect@customdomain.ai**. Do not open a public issue for these. |
| Report a security issue | Email **security@customdomain.ai** privately, never in a public issue. Policy: [app.customdomain.ai/security](https://app.customdomain.ai/security). |

## Running the site locally

```sh
cd site
npm install
npm run dev       # http://localhost:3000 -> redirects to /docs
```

`source.config.ts` points `fumadocs-mdx` at `../content`, so there is no copy step: what you see locally is what the site renders.

## Content rules

- **Plain language. Short sentences.** Write for a developer who has never configured DNS before and an operator who has configured too much of it.
- **Second person ("you"), active voice.**
- **One H1 per page**, sentence-case headings, tables only where they genuinely clarify.
- **Every DNS record, API request, and response in a code block must be real and current.** No placeholder output pretending to be real output. If you cannot run the call, say the shape is illustrative.
- **No hype.** Skip "unlock", "seamless", "robust", "leverage", "empower", "game-changing". Skip "it's not just X, it's Y". If a sentence would survive being cut, cut it.
- **Say the limitation out loud** wherever the page makes a comparison or a claim about coverage. The pages that already do this (`content/guides/choosing-a-custom-domain-solution.mdx`, `content/billing/plans-and-quotas.mdx`) are the model.
- **Punctuation:** no em dashes or en dashes in new or edited text. Restructure with a period, comma, colon, semicolon or parentheses, and write numeric ranges with "to" ("30 to 60 seconds"). Older pages still contain dashes: rewrite them in any line you change, but do not mass-convert a file in an unrelated change.

## Numbers must trace to something checkable

This project has a documented history of overclaiming, and every number in these docs is one someone will quote back. Before you publish a figure, get it from the source:

| Figure | Source |
| --- | --- |
| Provider coverage and the mode split | `GET https://api.customdomain.ai/v1/providers/census` |
| Plan prices, domains per year, domains per month | `GET https://api.customdomain.ai/v1/plans` |
| Endpoint count | `site/openapi-v1.yaml`, counted, not remembered |
| MCP tool count | `GET https://mcp.customdomain.ai/.well-known/agent/mcp.json`, the live server's tool list |

Three provider numbers are true and mean different things. Keep them apart (all as of 2026-10-09):

- **178** providers are catalogued in the census: DNS hosts, registrars (every one of the 100 largest) and domain platforms. Counting the adapters the census does not list, "more than 170 providers are known" is the safe phrasing.
- **62** of those have an automatic path (6 provider OAuth, 1 Domain Connect, 55 scoped API key); the other 116 are connected by hand.
- **77** built-in adapters ship in the Go registry (`GET /v1/providers`), a different quantity again: 63 of them belong to a catalogued provider through the census adapter link, and 14 do not. Ten of those 14 cover providers the census does not list, PowerDNS only reaches a server you run, and three (Unstoppable Domains, XServer Domain, Muumuu Domain) only sign in through the provider's MCP server. The hosted service switches on the Unstoppable Domains sign-in but not the other two, so it writes records at 74.

Never attach 178 to an automatic verb. "One-click across 178 providers" is false. "62 of 178 auto-configure" is true.

## The product name

The product is **CustomDomain™**: one word, capital C and capital D, with the ™, every time the product is meant (titles, headings, prose, alt text, table cells). The spaced form "custom domain" is the generic thing a customer connects, and reads as a category rather than a name, so use it lowercase and only when you mean the category.

Never rename a machine-readable identifier to match: Domain Connect `providerId` / `serviceId` values, npm package names (`customdomain-js`, `@customdomain/react`), `window.customdomain`, `customdomain:*` events, `CustomDomainError`, env var names, hostnames, and URL paths stay exactly as they are.

## Generated files

`content/providers/*.mdx` are generated by `infra/seo/gen_provider_guides.py` in the product repo, from its `enrichment.json`. A hand edit here is correct for the live site until the next generation run overwrites it. If you fix one of those pages, say so in the pull request so the same fix can land in the generator.

`site/openapi-v1.yaml` is a vendored copy of the product repo's spec, and `content/api-reference/**` (every page except `index.mdx`) is generated from that spec in the product repo. Both are copied here by hand when the API changes. Do not edit either here to change API behavior; they follow the product.

## Syncing to the product repo

You do not copy anything by hand. After a content change merges, a workflow pushes it to the `docs-sync` branch of the private product repo, and a maintainer there runs `scripts/docs-sync-pr.sh` to open the PR. If your page uses a component that exists only in this site (`site/src/components/mdx.tsx`), the workflow fails and names it until the product app registers a no-op for it, so mention that in your PR.

## Scope

Customer-facing content only. Internal engineering docs (architecture write-ups, security audits, operations runbooks, ADRs) belong in the private `custom-domains` repo. The test: would this page make sense to someone who will never see the source code?
