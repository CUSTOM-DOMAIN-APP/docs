import { NextResponse } from "next/server";

// Live package-usage stats for the docs site, fetched server-side.
//
// WHY SERVER-SIDE. api.npmjs.org sends no CORS headers, so a browser cannot read
// it directly. Proxying here also means one upstream fetch per revalidation
// window shared by every visitor, instead of one per page view.
//
// ON "REAL TIME". npm has no live download feed and no vendor does: the registry
// aggregates into DAILY buckets and publishes them on a lag (a given day's
// figure typically settles 24-48h later). So the honest contract is "the newest
// number npm has, refreshed continuously" — which is what this serves. The UI
// labels the window rather than implying a ticker. Anything presented as a
// live-incrementing download counter is decoration, not data.
export const revalidate = 300; // 5 min — well inside npm's own update cadence

const PACKAGES = ["customdomain-js", "@customdomain/react"] as const;

type PackageStat = {
  name: string;
  lastMonth: number;
  lastWeek: number;
  url: string;
};

export type StatsPayload = {
  packages: PackageStat[];
  totals: { lastMonth: number; lastWeek: number };
  /** Newest day npm has published a figure for (YYYY-MM-DD), if known. */
  through: string | null;
  fetchedAt: string;
  /** True when at least one upstream call failed — the UI degrades rather than lying. */
  partial: boolean;
};

async function point(pkg: string, period: "last-month" | "last-week") {
  // The scope separator must be encoded or npm 404s on @scope/name.
  const res = await fetch(
    `https://api.npmjs.org/downloads/point/${period}/${encodeURIComponent(pkg)}`,
    { next: { revalidate }, headers: { accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`${pkg} ${period}: ${res.status}`);
  return (await res.json()) as { downloads: number; end?: string };
}

export async function GET() {
  const results = await Promise.allSettled(
    PACKAGES.map(async (name) => {
      const [month, week] = await Promise.all([
        point(name, "last-month"),
        point(name, "last-week"),
      ]);
      return {
        name,
        lastMonth: month.downloads,
        lastWeek: week.downloads,
        through: month.end ?? null,
        url: `https://www.npmjs.com/package/${name}`,
      };
    }),
  );

  const ok = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  const partial = ok.length !== PACKAGES.length;

  const payload: StatsPayload = {
    packages: ok.map(({ name, lastMonth, lastWeek, url }) => ({
      name,
      lastMonth,
      lastWeek,
      url,
    })),
    totals: {
      lastMonth: ok.reduce((n, p) => n + p.lastMonth, 0),
      lastWeek: ok.reduce((n, p) => n + p.lastWeek, 0),
    },
    through: ok.find((p) => p.through)?.through ?? null,
    fetchedAt: new Date().toISOString(),
    partial,
  };

  return NextResponse.json(payload, {
    // Let a CDN serve it too, and keep serving the last good value while a
    // refresh is in flight — a stats card must never be the reason a page
    // stalls or flashes empty.
    headers: {
      "cache-control": `public, s-maxage=${revalidate}, stale-while-revalidate=3600`,
    },
  });
}
