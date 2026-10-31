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

This repo has no deploy workflow of its own, and a merge here is not live until it
is published. Two things touch the docs on the production host:

1. **The docs deploy** (`scripts/deploy-docs-local.sh` in the product repo, run by
   hand from a machine with the production deploy credentials). It refreshes the
   host's checkout of this repo to `origin/main` (or `--ref <sha>`), rebuilds only
   the `docs` container, waits for it to be healthy, then checks the public pages.
   It tags the running image as a rollback image first and puts the previous
   checkout and image back if the build or the health check fails. This is the
   only way a merged change here goes live.
2. **The product deploy** (`infra/scripts/deploy-host.sh`). It clones this repo
   when the host has no checkout and rebuilds the `docs` container as a best effort
   step at the end, but it never moves an existing checkout: the checkout stays at
   the commit the docs deploy last published, so a docs rollback with `--ref`
   survives the next product deploy. A product deploy alone therefore rebuilds the
   docs that are already live and publishes nothing new from here.

So after a merge, ask for a docs deploy (`scripts/deploy-docs-local.sh --check`,
then `scripts/deploy-docs-local.sh`); the product repo's
`docs/operations/LOCAL-CI-CD.md`, section "Docs only deploy", has the options.

The docs step of the product deploy never blocks the product. The `docs` service
sits in its own compose profile precisely so that a docs build failure cannot abort
the core deploy (a 2026-07 incident turned a docs failure into a site-wide 525).

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

1. **Product export.** The product repo no longer mirrors `content/`. It keeps only
   `apps/app/src/content/llms/pages.json`, a slim text export that its `/llms/<slug>`
   route serves to agents. After docs merge, a maintainer runs `scripts/docs-sync-pr.sh`
   in the product repo; it clones this repo, rebuilds the export and opens a PR for a
   person to review and merge. The old `sync-to-product.yml` workflow and its deploy key
   were retired on 15 October 2026; the `SYNC_SSH_KEY` secret and the deploy key on the
   product repo can be deleted.
2. **Old in-app links.** A few links inside the product app still point at the
   in-app `/docs` path. They keep working through the redirect, with one extra
   hop. Pointing them straight at `https://docs.customdomain.ai` is cosmetic.
3. **The vendored API spec and reference.** `site/openapi-v1.yaml` is a
   hand-vendored copy of the product repo's `apps/app/openapi-v1.yaml`, and
   `content/api-reference/**` (every page except `index.mdx`) was generated from
   that spec by `gen:api` in the product repo. That script was removed on 15 October
   2026 with the product's docs tree, so the reference pages are now edited here by
   hand, or regenerated with `fumadocs-openapi`'s `generateFiles` (already a site
   dependency) if a generator is added to `site/`. Both change together when the
   API changes. No check compares them with the product today, so a missed copy
   shows up only as a stale reference page.

   **Known differences from the product spec (2026-10-31): none.** `site/openapi-v1.yaml`
   is the product's `apps/app/openapi-v1.yaml` at `2bfc3760` (release batch 1b, final),
   byte for byte. The two edits this copy carried on 2026-10-30 are the product's now:
   `createApplication` is `required: [name]`, and `tenant_id` says it is required only
   with the management key and ignored with a tenant API key (docs #82); and the five
   descriptions that name the product write CustomDomain™. Check that with
   `git show <sha>:apps/app/openapi-v1.yaml | cmp - site/openapi-v1.yaml` before
   you commit the next vendored copy, and read `git diff` of the file for a docs
   correction the product spec lacks.
