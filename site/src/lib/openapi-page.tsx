"use client";

import { createOpenAPIPage } from "fumadocs-openapi/ui";

// The interactive "operation" renderer (params/schema/try-it) used by every
// generated api-reference page. Kept in its own client-only module: importing
// it from a server-only module (lib/source.ts, the search route) breaks the
// build with "Attempted to call createOpenAPIPage() from the server".
export const OpenAPIPage = createOpenAPIPage();
