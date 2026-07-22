import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { openapi } from "@/lib/openapi";

// The Fumadocs content source: every page under ../content, including the
// generated API-reference pages (content/api-reference/**) which depend on
// the openapi loader plugin below.
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [openapi.loaderPlugin()],
});
