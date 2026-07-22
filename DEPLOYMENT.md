# Deploying docs.customdomain.ai

This repo now ships a standalone renderer for its own `content/` at
[`site/`](site/) (Fumadocs + Next.js — see [`site/README.md`](site/README.md)).
The infra side (container + reverse proxy) lives in the `custom-domains` repo,
matching its existing single-box Caddy + Docker Compose pattern exactly —
see [CUSTOM-DOMAIN-APP/custom-domains#78](https://github.com/CUSTOM-DOMAIN-APP/custom-domains/pull/78).

This doc covers what changed operationally and the one manual step a human
still has to do.

## What ships where

| Piece | Repo | Path |
|---|---|---|
| Content (MDX) | `docs` (this repo) | `content/` |
| Standalone renderer | `docs` (this repo) | `site/` |
| Production container definition | `custom-domains` | `infra/docker-compose.prod.yml` (`docs` service) |
| Reverse proxy + TLS | `custom-domains` | `infra/Caddyfile` (`docs.customdomain.ai` block) |
| `/docs` in the old product app | `custom-domains` | `apps/app` — now redirects to `docs.customdomain.ai` (see below) |

## How the container gets built

The `docs` service in `infra/docker-compose.prod.yml` builds from a **sibling
checkout of this repo** on the production host:

```yaml
docs:
  build:
    context: ../../docs      # sibling of the custom-domains checkout
    dockerfile: site/Dockerfile
```

This mirrors how every other service in that file is built (`context:
../apps/app`, `context: ../services/edge`, ...) from source on the host at
deploy time — nothing is pulled from a container registry, matching the
existing all-built-on-host pattern for this single-box deployment. The
difference is that this source lives in a **different repo**, so the host
needs a checkout of it at `<custom-domains checkout>/../docs` (e.g.
`/home/ubuntu/docs` next to `/home/ubuntu/justeasy`).

`CUSTOM-DOMAIN-APP/docs` is a **public** repo, so this is a plain
unauthenticated clone — no deploy key, no new secret, no new credential
surface:

```sh
# one-time, on the host
git clone --depth 1 https://github.com/CUSTOM-DOMAIN-APP/docs.git /home/ubuntu/docs

# before every deploy (until this is automated into deploy-host.sh)
git -C /home/ubuntu/docs fetch --depth 1 origin main
git -C /home/ubuntu/docs reset --hard origin/main
```

**This is intentionally not wired into `infra/scripts/deploy-host.sh` /
`deploy.sh` by this change.** Those scripts drive the live production
deploy (backups, DB migrations, health-checked rollback for
`control-plane`/`edge`) and editing them was judged out of the safe, isolated
scope of adding one new container + one new vhost — a mistake there has a much
bigger blast radius than a docs container failing to update. Wiring the two
snippets above into `deploy-host.sh` (so the docs container always rebuilds
against the latest `docs@main` on every deploy) is a small, well-scoped
follow-up for a human to make deliberately, not something this change forces
through as a side effect.

Until that's wired in, the `docs` container simply keeps serving whatever
`content/` was checked out last time someone ran the clone/pull above (or
`docker compose build docs` locally on the host) — it does not silently break;
it just doesn't auto-update yet.

## The one manual step: DNS

Everything else (the container, the reverse-proxy block, TLS — see
[CUSTOM-DOMAIN-APP/custom-domains#78](https://github.com/CUSTOM-DOMAIN-APP/custom-domains/pull/78))
is ready to go the moment DNS resolves. The **only remaining manual step** is
adding one DNS record in the Cloudflare dashboard for the `customdomain.ai`
zone:

> **Type:** CNAME
> **Name:** `docs`
> **Target:** `app.customdomain.ai`
> **Proxy status:** Proxied (orange cloud) — same as the existing `app`,
> `www`, and apex records.

### Why a CNAME to `app.customdomain.ai`, not a raw IP

`docs.customdomain.ai` needs to reach the exact same origin host that already
serves `app.customdomain.ai` (one EC2 box running every service behind one
Caddy instance — see `infra/docker-compose.prod.yml` /
`infra/Caddyfile`). Caddy dispatches to the right container purely by the
incoming Host/SNI header (that's what the new `docs.customdomain.ai { ... }`
block in the Caddyfile matches on), so it does not matter *how* traffic
arrives at the origin, only that it arrives at the same origin `app` already
does.

**We could not find the origin's raw IP/Elastic IP anywhere in this
organization's version-controlled infrastructure** to hand you a literal IP
instead. Checked specifically:
- `terraform/edge-apex` in `custom-domains` — this provisions a *separate*
  pair of Elastic IPs + NLB for the **customer-facing edge** (end-user custom
  domains connecting directly, bypassing Cloudflare). It is not the target
  used by `app`/`www`/apex/`docs`, which all go through Cloudflare.
- The rest of `custom-domains/terraform/**` (`aws-adopt`, `bootstrap`,
  `grafana`, `sentry`, `posthog`, `backups`) — none of it defines a
  `cloudflare_record` (no Cloudflare Terraform provider is used anywhere in
  the repo) or an `aws_eip`/`aws_instance` for the primary Caddy host.
- `infra/Caddyfile` / `infra/docker-compose.prod.yml` — confirm the pattern
  (Cloudflare zone on SSL mode "Full", Caddy's internal CA on the origin) but
  contain no IP literals.
- `.github/workflows/deploy.yml` has an illustrative example IP in a comment
  (`e.g. 34.234.249.128`) documenting the *shape* of the `DEPLOY_HOST` repo
  secret, not a real, current value — it is not something we can respond
  responsibly with as "the" target.

The `customdomain.ai` zone's actual DNS records are managed by hand in the
Cloudflare dashboard, outside version control (consistent with why this is a
manual step at all — we do not have, and did not ask for, Cloudflare
credentials). **CNAME-to-`app.customdomain.ai`** sidesteps needing that IP at
all: whatever the `app` A/AAAA record currently points to, `docs` will too,
automatically, and stays correct if that origin IP ever changes.

If your Cloudflare setup for any reason cannot proxy a CNAME to another
proxied hostname in the same zone, the equivalent alternative is: open the
existing `app` DNS record in the dashboard, copy its A/AAAA value, and create
an identical `docs` A/AAAA record (Proxied) with that same value.

### TLS after the DNS record is added

**No further action needed.** This zone runs Cloudflare SSL mode "Full"
(non-strict): Cloudflare terminates public TLS for visitors, and only requires
*some* certificate on the origin, which it does not validate the trust chain
of. Caddy already provisions that origin certificate automatically and
identically for every hostname listed in its config (`tls internal` — Caddy's
own internal CA, no ACME/Let's Encrypt call-out, no extra Cloudflare token
permissions) — see the comment at the top of `infra/Caddyfile`. The
`docs.customdomain.ai` block added in that PR uses the exact same `tls
internal` directive as `app`/`api`/`mcp`, so once the CNAME above resolves,
Caddy issues that block's certificate the same automatic way it already does
for the other four hostnames. There is no public ACME certificate involved for
any of these origin hostnames today; upgrading to a real Cloudflare Origin CA
cert + "Full (strict)" is an existing, separate follow-up noted in
`docker-compose.prod.yml`, unrelated to this change.

## The old `/docs` route in `apps/app`

`apps/app` now redirects `/docs` and `/docs/*` to the matching path on
`docs.customdomain.ai` (see that PR). It is a **temporary (307/302, not
permanent 308)** redirect deliberately: it's one line to flip to
`permanent: true` in `apps/app/next.config.ts` once `docs.customdomain.ai` has
been live and stable for a while, but starting temporary avoids browsers/CDNs
hard-caching the redirect before that's confirmed.

Two things this change deliberately does **not** do (left for a human
decision, out of scope here):
1. **`sync-to-product.yml`** (this repo's workflow that rsyncs `content/` into
   `apps/app/src/content/docs/` and opens a `docs-sync` PR) still runs as-is.
   Once the redirect above is live, nothing renders that synced copy anymore
   (the redirect fires before any page match), so the workflow becomes
   redundant — but it's still harmless, and deciding whether/when to retire it
   is a separate call (e.g. some teams keep a synced fallback during a
   transition window).
2. A few hardcoded internal `/docs` links inside `apps/app`
   (`src/components/app/Sidebar.tsx`, `CommandPalette.tsx`,
   `src/components/legal/Footer.tsx`, `src/app/sitemap.ts`, and others) still
   point at the in-app path. They keep working (the redirect catches them),
   just with one extra hop. Repointing them straight at
   `https://docs.customdomain.ai` is a cosmetic follow-up, not required for
   correctness.

## OpenAPI spec duplication (pre-existing tradeoff, noted not solved)

`site/openapi-v1.yaml` is a vendored copy of `apps/app/openapi-v1.yaml`, kept
so the standalone docs site can render `content/api-reference/**` without
depending on the product repo at build time. Keeping the two copies in sync
going forward (e.g. a small CI check, or a follow-up decision to have one
repo fetch from the other at build time) is unsolved by this change and left
as a deliberate follow-up.
