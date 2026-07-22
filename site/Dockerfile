# Standalone Fumadocs site — renders ../content (this repo's MDX) directly.
#
# IMPORTANT: the build context must be the REPO ROOT, not this `site/`
# directory. source.config.ts resolves its content dir as `../content`
# relative to this app, so the image needs `content/` and `site/` present
# together with the same layout as the source repo. Build from the repo root:
#
#   docker build -f site/Dockerfile -t docs-site .
#
# (infra/docker-compose.prod.yml in the custom-domains repo sets `context`/
# `dockerfile` this way for the `docs` service.)

FROM node:22-alpine AS build
WORKDIR /repo
# Copy the whole repo (content/ + site/): fumadocs-mdx's postinstall step
# reads source.config.ts and walks ../content, so both must be present
# before `npm ci`.
COPY . .
WORKDIR /repo/site
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm ci
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
# Next "standalone" output. outputFileTracingRoot is pinned to the repo root
# (see next.config.ts -- required so the build can resolve ../content), so
# the trace preserves that layout and server.js lands at ./site/server.js
# here, not at the top level. Verified by an actual `npm run build` +
# inspecting .next/standalone/ during development of this scaffold.
COPY --from=build /repo/site/.next/standalone ./
COPY --from=build /repo/site/.next/static ./site/.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "site/server.js"]
