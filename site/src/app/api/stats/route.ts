import { NextResponse } from "next/server";

// Live package-usage stats for the docs site, fetched server-side.
//
// WHY SERVER-SIDE. api.npmjs.org sends no CORS headers, so a browser cannot read
// it directly. Proxying here also means one upstream fetch per revalidation
// window shared by every visitor, instead of one per page view.
//
// DO NOT SUM THE PACKAGES. @customdomain/react declares customdomain-js as a
// hard dependency, so every React install downloads BOTH. Adding the two counts
// the same install twice — this file used to do exactly that and served an
// inflated headline (1,053 when the real figure was 586). customdomain-js is
// the SUPERSET: every react install is inside it. It is the only figure here
// that is not double counted, so it is the only one presented as a total.
//
// ON "REAL TIME". npm has no live download feed and no vendor does: the registry
// aggregates into DAILY buckets and publishes them on a lag (a given day's
// figure typically settles 24-48h later). So the honest contract is "the newest
// number npm has, refreshed continuously" — which is what this serves. The UI
// labels the window rather than implying a ticker.
//
// AND THEY ARE DOWNLOADS, NOT USERS. Registry mirrors, security scanners and CI
// all pull packages; publish days spike hard for that reason. Never relabel this
// as "installs", "users", or "customers".
export const revalidate = 300; // 5 min — well inside npm's own update cadence

/** The core package. Every @customdomain/react install also downloads this. */
const CORE = "customdomain-js";
const PACKAGES = [CORE, "@customdomain/react"] as const;

type PackageStat = {
  name: string;
  lastMonth: number;
  lastWeek: number;
  url: string;
};

export type StatsPayload = {
  packages: PackageStat[];
  /**
   * Downloads of the core package — the superset, and the headline figure.
   * Deliberately NOT a sum across packages; see the note at the top of this file.
   */
  core: { name: string; lastMonth: number; lastWeek: number } | null;
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
  const core = ok.find((p) => p.name === CORE) ?? null;

  const payload: StatsPayload = {
    packages: ok.map(({ name, lastMonth, lastWeek, url }) => ({
      name,
      lastMonth,
      lastWeek,
      url,
    })),
    core: core
      ? { name: core.name, lastMonth: core.lastMonth, lastWeek: core.lastWeek }
      : null,
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
