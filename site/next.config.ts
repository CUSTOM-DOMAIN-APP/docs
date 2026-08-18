import path from "node:path";
import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

// This app's content lives one level up (../content, per source.config.ts),
// outside `site/` itself. Both Turbopack's and Next's file-tracing root must
// therefore be pinned to the REPO ROOT (not this directory) -- pinning to
// `site/` makes Turbopack treat `../content` as outside its project
// boundary and refuse to resolve the generated `.source/server.ts` imports
// ("Module not found", even though the files are really there). The repo
// root has no package.json/lockfile of its own (site/ is the only Node
// project in this repo), so this can't accidentally escape into some larger
// unrelated monorepo the way a bare `next dev` walk-up-and-guess would.
const repoRoot = path.join(__dirname, "..");

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker image (see Dockerfile).
  output: "standalone",
  outputFileTracingRoot: repoRoot,
  poweredByHeader: false,
  turbopack: {
    root: repoRoot,
  },
  async redirects() {
    return [
      // Friendly entry point: docs.customdomain.ai/ -> the docs index.
      { source: "/", destination: "/docs", permanent: false },
      // Section landing paths that external links (marketing site, older
      // in-product docs links) point at but that have no page of their own —
      // send them to the real entry page. Fumadocs only renders routes that
      // have an .mdx file. (Carried over from apps/app's next.config.ts in the
      // custom-domains repo, which used to own these same two redirects when
      // it rendered /docs itself — see that repo's DEPLOYMENT-adjacent PR.)
      { source: "/docs/mcp", destination: "/docs/mcp/overview", permanent: true },
      {
        source: "/docs/widget-sdk",
        destination: "/docs/authentication/widget-tokens",
        permanent: true,
      },
      // The Entri evaluation guide moved to the marketing blog, where dated,
      // promotable content belongs — docs and blog both ranking for "entri
      // alternative" split our own traffic between two of our hosts. A 301
      // (permanent: true) rather than a delete, because the docs page has
      // inbound links and accumulated ranking: dropping it to a 404 throws
      // that away, where a permanent redirect passes it to the new URL.
      // Cross-host, so the destination is absolute.
      {
        source: "/docs/guides/entri-alternative",
        destination:
          "https://customdomain.ai/blog/custom-domain-blog-2/how-to-evaluate-an-entri-alternative-46",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
