/**
 * The docs' content source: every page under ../content plus the generated API reference (content/api-reference/**,
 * which depends on the openapi loader plugin below), with the sidebar group icons resolved from meta.json. Every
 * route, the search index and llms.txt read pages through this one loader. With DOCS_AGENT_SURFACE=off the "For AI
 * agents" page and its briefs (content/for-ai-agents) are left out here, so the sidebar, search, sitemap, llms.txt
 * and every route lose them together; the setting is read when the site is built (lib/agent-surface.ts).
 */

import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { openapi } from "@/lib/openapi";
import { sectionIcon } from "@/components/section-icons";
import { AGENT_FOLDER, agentSurface } from "@/lib/agent-surface";

const content = docs.toFumadocsSource();
const files = agentSurface().pages
  ? content.files
  : content.files.filter((file) => file.path !== AGENT_FOLDER && !file.path.startsWith(`${AGENT_FOLDER}/`));

// `icon` turns a group's `---[Name]Group---` icon name in meta.json into one of our sidebar icons.
export const source = loader({
  baseUrl: "/docs",
  source: { ...content, files },
  plugins: [openapi.loaderPlugin()],
  icon: sectionIcon,
});
