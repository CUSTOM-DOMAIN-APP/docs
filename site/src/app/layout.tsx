/**
 * Root layout of the docs site: the html and body shell, the Fumadocs RootProvider and the site-wide metadata
 * (docs.customdomain.ai origin, title template). Pages override the metadata per route. The inline head script
 * marks <html> for a browser signed in to the console, before first paint, so the sidebar shows "Console"
 * instead of "Sign in" with no flash (src/lib/auth-hint.ts). The font classes on <html> define Geist and Geist Mono
 * (the geist package, self-hosted through next/font); src/app/brand.css reads --font-geist-sans and --font-geist-mono.
 * The classes never change, so React leaves the classes the head script and the theme toggle add in place. The site
 * footer (src/app/site-footer.tsx) sits under every page.
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";
import { AUTH_HINT_SCRIPT } from "@/lib/auth-hint";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteFooter } from "./site-footer";
import "./globals.css";

const fontVariables = `${GeistSans.variable} ${GeistMono.variable}`;

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
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script id="cd-auth-hint" dangerouslySetInnerHTML={{ __html: AUTH_HINT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider>
          {children}
          <SiteFooter />
        </RootProvider>
      </body>
    </html>
  );
}
