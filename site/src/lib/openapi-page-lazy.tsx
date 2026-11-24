"use client";

/**
 * The api-reference renderer loaded on demand. The docs route renders every page, so a static import of
 * lib/openapi-page.tsx put its highlighter (Shiki, several hundred KB) into the scripts of every docs page.
 * Through next/dynamic the chunk is fetched only on a page that renders an operation. Server rendering stays on.
 */

import dynamic from "next/dynamic";

export const OpenAPIPage = dynamic(() => import("./openapi-page").then((m) => m.OpenAPIPage));
