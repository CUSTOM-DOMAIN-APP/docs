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
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
