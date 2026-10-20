import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { stringifyComponent } from "./mdx-markdown";

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
  plugins: [
    lastModified({
      versionControl: async (filePath) => {
        gitDates ??= Promise.resolve(readGitDates());
        return (await gitDates).get(path.resolve(filePath));
      },
    }),
  ],
});
