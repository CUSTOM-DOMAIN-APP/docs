import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

// Built-in, static, in-browser search index (Orama) for /docs — no external
// service, no third-party search account.
export const { GET } = createFromSource(source, {
  language: "english",
});
