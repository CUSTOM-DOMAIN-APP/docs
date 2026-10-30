/**
 * Root layout of the docs site: the html and body shell, the Fumadocs RootProvider and the site-wide metadata
 * (docs.customdomain.ai origin, title template). Pages override the metadata per route.
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.customdomain.ai"),
  // Machine fields name the product without the ™ (D-2, see lib/machine-text.ts).
  title: {
    default: "CustomDomain docs",
    template: "%s | CustomDomain docs",
  },
  description:
    "Guides, concepts and API reference for connecting customer-owned domains to a SaaS platform, with automatic DNS setup, record checks and TLS.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
