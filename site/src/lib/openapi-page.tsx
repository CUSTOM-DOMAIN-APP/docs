"use client";

/**
 * The interactive "operation" renderer (parameters, schema, try it) used by every generated api-reference page,
 * with its request and response samples highlighted in the brand code themes (lib/code-themes.ts), the same as
 * the code blocks in the MDX pages. Kept in its own client-only module: importing it from a server-only module
 * (lib/source.ts, the search route) breaks the build with "Attempted to call createOpenAPIPage() from the server".
 */

import { createOpenAPIPage } from "fumadocs-openapi/ui";
import { codeThemes } from "@/lib/code-themes";

export const OpenAPIPage = createOpenAPIPage({
  shikiOptions: { themes: codeThemes },
});
