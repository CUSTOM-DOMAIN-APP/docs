import { createOpenAPI } from "fumadocs-openapi/server";

// The ~47 generated content/api-reference/**/*.mdx pages each embed a
// <Comp document="./openapi-v1.yaml" .../> component and expect an
// `_openapi.preload` frontmatter entry to resolve against this spec.
//
// This file is a vendored copy of apps/app/openapi-v1.yaml (the product API
// spec), not a new canonical location for it. The product repo remains the
// source of truth for the API surface itself; this copy only exists so the
// standalone docs site can render the reference pages without depending on
// the product repo at build time. See DEPLOYMENT.md for the reconciliation
// note (keeping the two copies in sync is a follow-up decision, not solved
// here).
const SPEC_PATH = "./openapi-v1.yaml";

export const openapi = createOpenAPI({
  input: [SPEC_PATH],
});
