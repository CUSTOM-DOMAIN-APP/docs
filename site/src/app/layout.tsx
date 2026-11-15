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
import localFont from "next/font/local";
import { SiteFooter } from "./site-footer";
import { HoverPrefetchLink } from "@/components/hover-prefetch-link";
import "./globals.css";

// Geist and Geist Mono (SIL Open Font License, src/fonts/LICENSE-Geist.txt), cut by fonttools to the characters
// the docs use (Latin, Latin Extended A, Cyrillic, punctuation, arrows, check marks): about 48 KB each instead of 70.
// To rebuild them, run pyftsubset on the geist package's variable files with the unicode list in src/fonts/README.md.
const GeistSans = localFont({
  src: "../fonts/Geist-Variable-docs.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const GeistMono = localFont({
  src: "../fonts/GeistMono-Variable-docs.woff2",
  variable: "--font-geist-mono",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Roboto Mono", "Menlo", "Monaco", "Liberation Mono", "DejaVu Sans Mono", "Courier New", "monospace"],
  weight: "100 900",
});

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
        {/* The search dialog (and its index client) loads when a reader opens search, not on every page view. */}
        <RootProvider search={{ preload: false }} components={{ Link: HoverPrefetchLink }}>
          {children}
          <SiteFooter />
        </RootProvider>
      </body>
    </html>
  );
}
