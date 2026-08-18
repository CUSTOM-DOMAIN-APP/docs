import { NextResponse } from "next/server";

// A STYLESHEET that carries a number, served to the Gatus status page.
//
// WHY THIS EXISTS IN THIS SHAPE. status.customdomain.ai runs Gatus v5.36.0,
// whose entire injectable surface is `ui.custom-css` (config/ui/ui.go: title,
// description, dashboard-heading, dashboard-subheading, header, logo, link,
// favicon, buttons, custom-css, dark-mode, default-sort-by, default-filter-by,
// login-subtitle — and nothing else). There is no custom-js, no HTML slot and
// no announcement banner, and the edge runs stock caddy:2-alpine, which has no
// response-rewriting module. So CSS is not a stylistic choice here; it is the
// only channel into that page that does not involve freezing Gatus's
// server-rendered index.html, which would silently break the config→page link
// the moment someone edits a button in gatus/config.yaml.
//
// infra/gatus/brand.css @imports this path; Caddy maps it here. A failed
// @import does not invalidate the importing sheet, so if this route or the
// whole docs container is down the status page simply keeps its stock text and
// stays fully themed. That is the intended failure mode and it is why the rule
// is delivered as a separate import rather than inlined into brand.css.
export const revalidate = 300;

const PKG = "customdomain-js";

/** Downloads of the core package only. @customdomain/react depends on it, so
 *  summing the two double counts every React install — see the note in
 *  /api/stats. This page gets one number and it has to be the honest one. */
async function coreDownloads(): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-month/${PKG}`,
      { next: { revalidate }, headers: { accept: "application/json" } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { downloads?: unknown };
    const n = json.downloads;
    return typeof n === "number" && Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
  } catch {
    return null;
  }
}

function css(body: string) {
  return new NextResponse(body, {
    headers: {
      "content-type": "text/css; charset=utf-8",
      "cache-control": `public, max-age=${revalidate}, stale-while-revalidate=3600`,
    },
  });
}

export async function GET() {
  const n = await coreDownloads();

  // No number, no rule. Returning an empty sheet leaves Gatus's own
  // "System Monitoring Dashboard" in place, which is a fine thing to fall back
  // to; rendering "0" or "NaN" on a status page would not be.
  if (n === null) return css("/* npm unavailable — no rule emitted */\n");

  // The value is re-derived from an integer we validated above and then
  // formatted, so the only characters that can reach the content string are
  // digits and separators. It can never carry a quote or a backslash out of
  // the upstream response and into the stylesheet.
  const shown = n.toLocaleString("en-US");

  return css(`/* generated — customdomain-js downloads, last 30 days */

/* Gatus hardcodes <p>System Monitoring Dashboard</p> directly under the header
   <h1> whenever any ui.buttons are configured (App.vue). It is filler that
   says nothing, and it is the most stable anchor on the page: semantic
   <header>/<h1>/<p>, no generated class name to churn on an upgrade. Swap its
   text for something true. */
header h1 + p {
  font-size: 0 !important;
  line-height: 1.25rem !important;
}
header h1 + p::after {
  content: "${shown} SDK downloads in the last 30 days";
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.006em;
  color: var(--cd-muted, #78716c);
}
`);
}
