/**
 * Shared nav and header options for the /docs route group: the title, the GitHub link and the links that
 * Fumadocs' DocsLayout lists at the top of the sidebar (and the phone drawer). Deliberately plain (default
 * Fumadocs chrome, no brand restyle); see site/README.md. The first link is "Sign in", or "Console" for a
 * signed-in browser (src/components/auth-link.tsx, picked before first paint by src/lib/auth-hint.ts).
 */

import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { AuthLink } from "@/components/auth-link";

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: "https://github.com/CUSTOM-DOMAIN-APP/docs",
    nav: {
      title: "CustomDomain™ docs",
      url: "/docs",
    },
    links: [
      { type: "custom", on: "menu", children: <AuthLink /> },
      { text: "Get an API key", url: "https://app.customdomain.ai/signup", external: true, active: "none" },
      { text: "Status", url: "https://status.customdomain.ai", external: true, active: "none" },
      {
        type: "icon",
        label: "npm",
        text: "npm",
        icon: (
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
          </svg>
        ),
        url: "https://www.npmjs.com/package/customdomain-js",
      },
      {
        text: "customdomain.ai",
        url: "https://customdomain.ai",
        active: "none",
      },
    ],
  };
}
