# Deploying docs.customdomain.ai

`docs.customdomain.ai` serves the Fumadocs + Next.js renderer in [`site/`](site/)
(see [`site/README.md`](site/README.md)), which reads this repo's `content/`
directly. The container and the reverse proxy are defined in the product repo,
`custom-domains`, next to every other service on the production host. That repo
is private, so this page describes the parts that matter here: what ships where,
how the container is built, and when a change merged here goes live.

## What ships where

| Piece | Repo | Path |
|---|---|---|
| Content (MDX) | `docs` (this repo) | `content/` |
| Standalone renderer | `docs` (this repo) | `site/` |
| Production container definition | `custom-domains` | `infra/docker-compose.prod.yml` (`docs` service, in its own `docs` profile) |
| Reverse proxy and TLS | `custom-domains` | `infra/Caddyfile` (`docs.customdomain.ai` block) |
| Checkout refresh and rebuild | `custom-domains` | `infra/scripts/deploy-host.sh` |
| `/docs` in the product app | `custom-domains` | `apps/app/next.config.ts`: a permanent (308) redirect to `docs.customdomain.ai` |

## When a change goes live

This repo has no deploy workflow of its own. A change reaches the live site in
three steps:

1. The change merges to `main` here.
2. The next product deploy runs `infra/scripts/deploy-host.sh` on the production
   host. Early in the script it refreshes a sibling checkout of this repo to
   `origin/main` (a shallow fetch and hard reset, or a fresh clone when the
   checkout is missing).
3. After it rebuilds the core product stack, the same script rebuilds and
   restarts the `docs` container from that checkout
   (`docker compose --profile docs up -d --build docs`).

Product deploys run after CI passes on the product repo's `main`, and can also be
started by hand. So a merge here goes live at the next product deploy of any
kind, not at merge time. If a docs fix is urgent, ask for a product deploy.

The docs step is best effort and never blocks the product. The checkout refresh
and the docs rebuild are each guarded, and a failure in either is logged without
failing the product deploy. If the refresh fails, the container is rebuilt from
the checkout already on the host, so the live site can lag `main` until the next
successful refresh. The `docs` service sits in its own compose profile precisely
so that a docs build failure cannot abort the core deploy.

## How the container is built

The `docs` service builds from the sibling checkout with the repo root as the
build context, because `site/source.config.ts` reads `../content`:

```yaml
docs:
  profiles: ["docs"]
  build:
    context: ../../docs      # the sibling checkout of this repo
    dockerfile: site/Dockerfile
```

Nothing is pulled from a container registry; like every other service on the
host, it is built from source at deploy time. `CUSTOM-DOMAIN-APP/docs` is public,
so the checkout is a plain unauthenticated clone: no deploy key and no secret.

[`site/Dockerfile`](site/Dockerfile) runs `npm ci` and `npm run build` in `site/`
and ships the Next.js standalone server. To reproduce the production image,
build from the repo root, not from `site/`:

```sh
docker build -f site/Dockerfile -t docs-site .
docker run -p 3000:3000 docs-site
```

## DNS and the old `/docs` route

`docs.customdomain.ai` is a proxied `CNAME` to `app.customdomain.ai` in the
Cloudflare zone for `customdomain.ai`, so it reaches the same origin as the
product, where the reverse proxy routes it by hostname. The record is managed in
the Cloudflare dashboard, outside version control. Nothing about DNS or TLS
changes when content changes.

The product app redirects `/docs` and `/docs/*` to the same path here with a
permanent `308` (`permanent: true` in `apps/app/next.config.ts`). Check it with
`curl -sI https://app.customdomain.ai/docs`, which returns `308` with
`location: https://docs.customdomain.ai/docs`.

## Open follow-ups

Each is a deliberate decision for a human, and none blocks a docs change.

1. **`sync-to-product.yml`.** On every push to `main` that touches `content/`,
   this repo's workflow copies `content/` over the product repo's docs mirror and
   force-pushes the result to a `docs-sync` branch there (never to its `main`). The
   workflow cannot open the PR (a deploy key has no API access), so after docs merge
   a maintainer with product repo access runs `scripts/docs-sync-pr.sh` there, which
   checks the branch and opens the PR for a person to review and merge. Before it
   pushes, the workflow fails the run, naming the component, if the content uses one
   that the product app does not register (that would break the product build).
   Nothing renders that mirror, because the redirect fires first. Whether to keep or
   retire the workflow is a separate call.
2. **Old in-app links.** A few links inside the product app still point at the
   in-app `/docs` path. They keep working through the redirect, with one extra
   hop. Pointing them straight at `https://docs.customdomain.ai` is cosmetic.
3. **The vendored API spec and reference.** `site/openapi-v1.yaml` is a
   hand-vendored copy of the product repo's `apps/app/openapi-v1.yaml`, and
   `content/api-reference/**` (every page except `index.mdx`) is generated from
   that spec in the product repo. Both are copied here by hand, together, when the
   API changes. No check compares them with the product today, so a missed copy
   shows up only as a stale reference page.
