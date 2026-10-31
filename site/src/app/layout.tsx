/**
 * Root layout of the docs site: the html and body shell, the Fumadocs RootProvider and the site-wide metadata
 * (docs.customdomain.ai origin, title template). Pages override the metadata per route. The inline head script
 * marks <html> for a browser signed in to the console, before first paint, so the sidebar shows "Console"
 * instead of "Sign in" with no flash (src/lib/auth-hint.ts). The font classes on <html> define the three
 * self-hosted brand faces (src/lib/fonts.ts); they never change, so React leaves the classes the head script
 * and the theme toggle add in place. When the build names one (src/lib/consent-bridge.ts), the console's consent bridge
 * loads after the page is interactive: the shared cookie bar and the first-party beacons, as on customdomain.ai.
 */

import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { RootProvider } from "fumadocs-ui/provider/next";
import { AUTH_HINT_SCRIPT } from "@/lib/auth-hint";
import { consentBridgeSrc } from "@/lib/consent-bridge";
import { fontVariables } from "@/lib/fonts";
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

const BRIDGE_SRC = consentBridgeSrc();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script id="cd-auth-hint" dangerouslySetInnerHTML={{ __html: AUTH_HINT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider>{children}</RootProvider>
        {BRIDGE_SRC ? <Script id="cd-consent-bridge" src={BRIDGE_SRC} strategy="afterInteractive" /> : null}
      </body>
    </html>
  );
}
