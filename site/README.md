# site/

Standalone [Fumadocs](https://fumadocs.dev) + Next.js app that renders this
repo's `../content/` directly. This is the entire deployable artifact for
`docs.customdomain.ai` — there is no copy/sync step: `source.config.ts` points
`fumadocs-mdx` straight at `../content`, so editing a file in `content/` and
restarting `next dev` (or shipping a new container) is the whole update loop.

## Why this exists

Docs used to be rendered only inside `apps/app` (the main product) in the
`custom-domains` repo, synced in one direction from this repo's `content/` via
`.github/workflows/sync-to-product.yml`. That workflow still exists and still
runs, but nothing renders its output any more: this app is what serves
`docs.customdomain.ai` today, straight from this repo, and `apps/app/docs*`
permanently redirects here. See `../DEPLOYMENT.md` for the production
deployment and the follow-ups still open.

## Layout

- `source.config.ts` — the Fumadocs MDX collection config; `dir: "../content"`
  is the one line that makes this render the real content directory instead of
  a copy.
- `src/app/docs/` — the `/docs` route group: `[[...slug]]/page.tsx` renders
  any content page (including generated OpenAPI reference pages), `layout.tsx`
  wraps it in Fumadocs' `DocsLayout` (sidebar nav + search), `llms.txt/route.ts`
  serves an [llms.txt](https://llmstxt.org/) index of the whole tree.
- `src/app/api/search/route.ts` — the search index endpoint (Fumadocs' built-in
  static Orama search: no external search service/account).
- `src/lib/source.ts` — wires the content collection + the OpenAPI loader
  plugin into one Fumadocs "source".
- `src/lib/openapi.ts` + `openapi-v1.yaml` — `content/api-reference/**/*.mdx`
  pages embed `<OpenAPIPage document="./openapi-v1.yaml" .../>`-style
  components that resolve against this spec. `openapi-v1.yaml` here is a
  **vendored copy** of `apps/app/openapi-v1.yaml` in the product repo, not a
  new canonical location — see `../DEPLOYMENT.md` for the reconciliation note.
- `src/lib/layout.shared.tsx` — nav/header options (deliberately plain: default
  Fumadocs chrome, no brand restyle — this is a minimal scaffold, not a
  redesign).
- `next.config.ts` — `output: "standalone"` for the Docker image, plus
  `outputFileTracingRoot`/`turbopack.root` pinned to the repo root (required
  because content lives one level above `site/`; see the comments in that file
  and in `Dockerfile` for exactly why).

## Local development

```sh
cd site
npm install
npm run dev       # http://localhost:3000 -> redirects to /docs
```

## Production build

```sh
# from the REPO ROOT (not site/) -- source.config.ts needs ../content present
docker build -f site/Dockerfile -t docs-site .
docker run -p 3000:3000 docs-site
```

Verified manually: `npm run build` (Next 16 / Turbopack) compiles all ~80
content pages (including OpenAPI reference pages) to static HTML, and the
`.next/standalone` server serves `/docs`, `/docs/<slug>`, `/docs/llms.txt`, and
`/api/search` correctly in production mode (`NODE_ENV=production node
site/server.js`).

## What's intentionally NOT here

- No custom branding/theme beyond Fumadocs' defaults — the ask was to render
  the existing content with basic nav/search, not a redesign.
- No CMS, no MDX authoring UI — content is still hand-edited MDX in
  `../content`, same as before.
- No changes to `sync-to-product.yml` — that workflow still runs, but nothing
  renders what it produces; retiring it is a separate call (see
  `../DEPLOYMENT.md`).
