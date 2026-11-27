"use client";

/**
 * The "Open in console" button (<OpenInConsole to="/app/keys" label="Open Keys in console" /> in MDX): one quiet
 * link on the line below a step that tells the reader to act in the console, opening that exact screen in a new tab.
 * `to` must be one of CONSOLE_PATHS (a typo fails the build, so a button can never point off the console); the product's
 * tests/unit/docs-console-return.test.ts holds the same list for the sign in return. Place at most one per step and three
 * per page, never in a code block or on a reference page. On click it announces docs.console_opened {page, to} as a
 * window event (the page's docs path and the console path, nothing about the reader); it never delays the navigation.
 */

const CONSOLE_ORIGIN = "https://app.customdomain.ai";

export const CONSOLE_PATHS = [
  "/app",
  "/app/keys",
  "/app/apps",
  "/app/domains",
  "/app/embed",
  "/app/embed?tab=preview",
  "/app/analytics/traffic",
  "/app/mcp",
  "/app/build/sandbox",
  "/app/settings/api-access",
  "/app/keys/webhooks",
  "/app/routing",
  "/app/accounts/new",
  "/app/monitor",
  "/app/activity",
  "/app/analytics/secure-sign-in",
  "/app/settings/notifications",
  "/app/settings/security",
  "/app/settings/agents",
  "/app/billing/plans",
  "/app/usage",
  "/app/billing",
  "/app/team/roles",
  "/app/team",
  "/app/analytics",
  "/app/settings",
  "/app/settings/sso",
  "/app/settings/audit",
] as const;

export type ConsolePath = (typeof CONSOLE_PATHS)[number];

/** The docs path of the page the reader is on, with no origin, query or anchor ("getting-started/quickstart"). */
function docsPage(): string {
  return window.location.pathname.replace(/^\/docs\/?/, "").replace(/\/$/, "");
}

export function OpenInConsole({ to, label = "Open in console" }: { to: ConsolePath; label?: string }) {
  if (!(CONSOLE_PATHS as readonly string[]).includes(to)) {
    throw new Error(`OpenInConsole: "${to}" is not a console path in CONSOLE_PATHS`);
  }
  return (
    <p className="not-prose my-3">
      <a
        href={`${CONSOLE_ORIGIN}${to}`}
        target="_blank"
        rel="noopener"
        onClick={() => {
          try {
            window.dispatchEvent(new CustomEvent("docs.console_opened", { detail: { page: docsPage(), to } }));
          } catch {
            // Reporting never blocks the link.
          }
        }}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-fd-border px-3 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-2 focus-visible:outline-fd-ring sm:min-h-9"
      >
        {label}
        <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 11 11 5M6 5h5v5" />
        </svg>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </p>
  );
}
