import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://docs.customdomain.ai"),
  title: {
    default: "CustomDomain docs",
    template: "%s — CustomDomain docs",
  },
  description:
    "Guides, concepts, and API reference for connecting customer-owned domains to a SaaS platform with automatic DNS, ownership verification, and TLS.",
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
