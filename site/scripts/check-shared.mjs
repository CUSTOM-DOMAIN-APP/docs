/**
 * Drift check for src/shared: the docs' exact copies of site v2's tokens, Fumadocs color map and Shiki themes
 * (CUSTOM-DOMAIN-APP/custom-domain-site2, site/shared). Fails when a copy no longer matches the hash recorded in
 * src/shared/SOURCE.json (someone edited the copy) or, when the site repo is checked out beside this one or named
 * by SHARED_SOURCE, when it differs from the source file (the copy is stale). Runs before every build.
 * To re-sync: copy the files from site/shared, then run `node scripts/check-shared.mjs --write`.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const sharedDir = path.join(here, "..", "src", "shared");
const manifestPath = path.join(sharedDir, "SOURCE.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

if (process.argv.includes("--write")) {
  for (const f of Object.keys(manifest.files)) manifest.files[f] = sha(path.join(sharedDir, f));
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log("check-shared: hashes written");
  process.exit(0);
}

const candidates = [
  process.env.SHARED_SOURCE,
  path.join(here, "..", "..", "..", "customdomain-marketing-site", "site", "shared"),
  path.join(here, "..", "..", "..", "custom-domain-site2", "site", "shared"),
].filter(Boolean);
const sourceDir = candidates.find((dir) => fs.existsSync(path.join(dir, "tokens.css")));

const problems = [];
for (const [f, expected] of Object.entries(manifest.files)) {
  const copy = path.join(sharedDir, f);
  if (!fs.existsSync(copy)) {
    problems.push(`${f}: missing`);
    continue;
  }
  if (sha(copy) !== expected) problems.push(`${f}: edited by hand (hash differs from SOURCE.json)`);
  if (sourceDir) {
    const src = path.join(sourceDir, f);
    if (fs.existsSync(src) && sha(src) !== sha(copy)) problems.push(`${f}: stale against ${src}`);
  }
}

if (problems.length) {
  console.error("check-shared: src/shared drifted from site v2's site/shared\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log(`check-shared: ${Object.keys(manifest.files).length} files match${sourceDir ? " the source checkout" : " their recorded hashes"}`);
