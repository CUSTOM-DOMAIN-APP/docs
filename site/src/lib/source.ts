/**
 * The Fumadocs content source: every page under ../content, including the generated API reference pages
 * (content/api-reference/**), which depend on the openapi loader plugin below. With DOCS_AGENT_SURFACE=off the "For
 * AI agents" page and its briefs (content/for-ai-agents) are left out here, so the sidebar, search, sitemap, llms.txt
 * and every route lose them together; the setting is read when the site is built (lib/agent-surface.ts).
 */

import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { openapi } from "@/lib/openapi";
import { AGENT_FOLDER, agentSurface } from "@/lib/agent-surface";

const content = docs.toFumadocsSource();
const files = agentSurface().pages
  ? content.files
  : content.files.filter((file) => file.path !== AGENT_FOLDER && !file.path.startsWith(`${AGENT_FOLDER}/`));

export const source = loader({
  baseUrl: "/docs",
  source: { ...content, files },
  plugins: [openapi.loaderPlugin()],
});
