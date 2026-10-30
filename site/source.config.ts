/**
 * Fumadocs MDX config for the docs site: the content collection (../content, read in place), its frontmatter
 * schema and processed Markdown, the brand code themes for every code block, and git based "last updated"
 * dates that stay blank on a shallow clone rather than show a wrong date.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { stringifyComponent } from "./mdx-markdown";
import { codeThemes } from "./src/lib/code-themes";

// Fumadocs MDX collection config. `dir` points at the repo's real content/
// directory (one level up from this app), so there is no copy or sync step:
// this app renders the same MDX files that are the canonical source of truth
// for the docs, in place.
//
// THERE IS DELIBERATELY NO BLOG COLLECTION HERE. Articles live on the Odoo
// blog at customdomain.ai/blog/custom-domain-blog-2/, published through the
// marketing app's blog rail. A second blog on this host would compete with
// that one for the same queries and split our own ranking — which is exactly
// what happened when one was briefly added here.
export const docs = defineDocs({
  dir: "../content",
  docs: {
    // `metaTitle` (optional) is the page's whole <title>, written out in full and used as it is, without the
    // " | CustomDomain docs" suffix the site template adds to `title`. It lets a page keep a short H1 and sidebar
    // label while its search title says what the page answers (docs/dns/providers, docs/dns/email-dns).
    schema: frontmatterSchema.extend({
      metaTitle: frontmatterSchema.shape.title.optional(),
    }),
    // Exposes page.data.getText("processed"): the page as Markdown, which the
    // /docs/<slug>.md route serves and the "Copy Markdown" button copies.
    // Heading ids are left out and components are written as plain Markdown
    // (mdx-markdown.ts), so the output reads as an ordinary Markdown page.
    postprocess: {
      includeProcessedMarkdown: { headingIds: false, stringify: stringifyComponent },
    },
  },
});

// "Last updated" comes from git: the newest commit that touched the file.
//
// A shallow clone needs care. Its oldest commit has no parent, so git reports
// every file in the tree as added by it, and every page untouched since would
// claim that commit's date. Files are dated only from commits below the shallow
// boundary; a file seen only in a boundary commit gets no date, and the page
// shows none rather than a wrong one. Production builds from a depth 1 clone in
// an image without git, so no page there shows a date until that changes.
let gitDates: Promise<Map<string, Date>> | undefined;

function readGitDates(): Map<string, Date> {
  const dates = new Map<string, Date>();
  try {
    const run = (args: string[], cwd?: string) =>
      execFileSync("git", args, {
        cwd,
        encoding: "utf8",
        maxBuffer: 256 * 1024 * 1024,
        stdio: ["ignore", "pipe", "ignore"],
      });
    const root = run(["rev-parse", "--show-toplevel"]).trim();
    const gitDir = run(["rev-parse", "--absolute-git-dir"]).trim();
    let boundary = new Set<string>();
    try {
      boundary = new Set(fs.readFileSync(path.join(gitDir, "shallow"), "utf8").split("\n").filter(Boolean));
    } catch {
      // Not a shallow clone: every commit's file list is real.
    }
    const log = run(["-c", "core.quotepath=off", "log", "--format=commit:%H %cI", "--name-only", "--", "content"], root);
    let date: Date | undefined;
    for (const line of log.split("\n")) {
      if (line.startsWith("commit:")) {
        const [hash, iso] = line.slice(7).split(" ");
        const parsed = new Date(iso);
        date = boundary.has(hash) || Number.isNaN(parsed.getTime()) ? undefined : parsed;
      } else if (line.length > 0 && date) {
        const file = path.join(root, line);
        if (!dates.has(file)) dates.set(file, date);
      }
    }
  } catch {
    // No git, or not a checkout: no dates.
  }
  return dates;
}

export default defineConfig({
  // Code blocks use the brand kit's two code themes (src/lib/code-themes.ts) in place of Fumadocs' GitHub
  // themes. Only `themes` is set: every other default (the line highlight, diff and focus notations, the
  // title and icon) stays as Fumadocs ships it.
  mdxOptions: {
    rehypeCodeOptions: { themes: codeThemes },
  },
  plugins: [
    lastModified({
      versionControl: async (filePath) => {
        gitDates ??= Promise.resolve(readGitDates());
        return (await gitDates).get(path.resolve(filePath));
      },
    }),
  ],
});
