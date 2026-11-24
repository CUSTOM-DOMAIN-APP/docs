/**
 * The docs' content source: every page under ../content plus the generated API reference, with the sidebar group
 * icons resolved from meta.json. Every route, the search index and llms.txt read pages through this one loader.
 */

import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { openapi } from "@/lib/openapi";
import { sectionIcon } from "@/components/section-icons";

// The Fumadocs content source: every page under ../content, including the
// generated API-reference pages (content/api-reference/**) which depend on
// the openapi loader plugin below. `icon` turns a group's `---[Name]Group---`
// icon name in meta.json into one of our sidebar icons.
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [openapi.loaderPlugin()],
  icon: sectionIcon,
});
