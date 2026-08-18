import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";

// HomeLayout, not DocsLayout: a post has no sidebar tree and no reason to
// render the docs navigation beside it. The shared nav still applies, so the
// header is identical to /docs and the two never look like different sites.
export default function BlogRouteLayout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
