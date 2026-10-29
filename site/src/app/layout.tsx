/**
 * Root layout of the docs site: the html and body shell, the Fumadocs RootProvider and the site-wide metadata
 * (docs.customdomain.ai origin, title template). Pages override the metadata per route. The inline head script
 * marks <html> for a browser signed in to the console, before first paint, so the sidebar shows "Console"
 * instead of "Sign in" with no flash (src/lib/auth-hint.ts).
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";
import { AUTH_HINT_SCRIPT } from "@/lib/auth-hint";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.customdomain.ai"),
  title: {
    default: "CustomDomain™ docs",
    template: "%s | CustomDomain™ docs",
  },
  description:
    "Guides, concepts, and API reference for connecting customer-owned domains to a SaaS platform with automatic DNS, ownership verification, and TLS.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script id="cd-auth-hint" dangerouslySetInnerHTML={{ __html: AUTH_HINT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
