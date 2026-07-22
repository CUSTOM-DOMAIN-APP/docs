import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

/** Shared nav/header options for the /docs route group. Deliberately plain
 * (default Fumadocs chrome, no brand restyle) — see site/README.md. */
export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: "https://github.com/CUSTOM-DOMAIN-APP/docs",
    nav: {
      title: "Custom Domain docs",
      url: "/docs",
    },
    links: [
      {
        text: "customdomain.ai",
        url: "https://customdomain.ai",
        active: "none",
      },
    ],
  };
}
