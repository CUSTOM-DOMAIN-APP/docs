/**
 * The three brand faces, self-hosted from src/fonts (no request to Google Fonts): Inter for everything
 * functional, Geist Mono for code, and Instrument Serif for the page title only (D-10). next/font serves each
 * file from /_next/static/media with an immutable cache, preloads Inter and the serif, and builds a fallback
 * face with matched metrics so the swap does not shift the page. src/app/brand.css reads the three variables.
 * next/font names each face after its export (inter, geistMono, instrumentSerif), so keep the names distinct
 * from generic family keywords such as serif or mono.
 */

import localFont from "next/font/local";

export const inter = localFont({
  src: "../fonts/inter-latin-var.woff2",
  weight: "400 600",
  style: "normal",
  display: "swap",
  variable: "--cd-face-sans",
  adjustFontFallback: "Arial",
});

export const geistMono = localFont({
  src: "../fonts/geist-mono-latin-var.woff2",
  weight: "400 500",
  style: "normal",
  display: "swap",
  variable: "--cd-face-mono",
  // Code sits below the fold on most pages, so the file is not preloaded. A sans fallback with adjusted
  // metrics would be wrong for a monospace face; the stack in brand.css falls back to the system mono.
  preload: false,
  adjustFontFallback: false,
});

export const instrumentSerif = localFont({
  src: "../fonts/instrument-serif-latin-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--cd-face-serif",
  adjustFontFallback: "Times New Roman",
});

/** The class names that define the three variables, for the <html> element. */
export const fontVariables = `${inter.variable} ${geistMono.variable} ${instrumentSerif.variable}`;
