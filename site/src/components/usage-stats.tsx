"use client";

import { useEffect, useRef, useState } from "react";
import type { StatsPayload } from "@/app/api/stats/route";

// Live SDK usage, rendered from /api/stats.
//
// THEMING. Every colour here is a fumadocs CSS variable (--color-fd-*), not a
// literal. The docs site ships the `black` preset with light and dark modes, and
// a card with hardcoded hex would be congruent in exactly one of them. Using the
// variables means this inherits whatever the surrounding page is doing, now and
// after any future retheme.
//
// HONESTY. npm publishes DAILY buckets on a 24-48h lag; there is no live feed.
// So this refreshes continuously and says so, but labels the window ("last 30
// days") and the freshness ("npm data through <date>") instead of implying a
// ticker. The dot pulses because the page is polling — not because a download
// just happened.
//
// NEVER SUM THE PACKAGES. @customdomain/react depends on customdomain-js, so a
// React install downloads both; adding them double counts. This card headlines
// customdomain-js alone — the superset every install passes through. An earlier
// revision summed them and showed 1,053 where the truth was 586. The per-package
// row below is a breakdown, and says in words that it is not additive.
//
// They are DOWNLOADS, not users. Mirrors, scanners and CI pull packages too.

const POLL_MS = 60_000;

function useCountUp(target: number, ms = 700) {
  const [n, setN] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    const b = target;
    if (a === b) return;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      // ease-out-cubic: fast to settle, no bounce — this is a data readout.
      setN(Math.round(a + (b - a) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = b;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return n;
}

function Stat({ label, value, sub }: { label: string; value: number; sub?: string }) {
  const shown = useCountUp(value);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-2xl font-semibold tabular-nums tracking-tight text-fd-foreground">
        {shown.toLocaleString()}
      </span>
      <span className="text-xs font-medium text-fd-muted-foreground">{label}</span>
      {sub ? <span className="text-[11px] text-fd-muted-foreground/70">{sub}</span> : null}
    </div>
  );
}

export function UsageStats() {
  const [data, setData] = useState<StatsPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as StatsPayload;
        if (alive) {
          setData(json);
          setFailed(false);
        }
      } catch {
        // Keep the last good numbers on screen; only show the failure state if
        // we never got any. A stats card that empties itself on one flaky poll
        // looks broken when the product is fine.
        if (alive && !data) setFailed(true);
      }
    };
    void load();
    const id = setInterval(load, POLL_MS);
    // Re-sync the moment someone comes back to the tab, so a long-idle page is
    // never showing a stale figure the instant it is looked at again.
    const onVis = () => document.visibilityState === "visible" && void load();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed) return null; // degrade to nothing rather than to an error box

  const skeleton = !data || !data.core;

  return (
    <div
      data-usage-stats
      className="not-prose my-6 rounded-xl border border-fd-border bg-fd-card p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fd-primary opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-fd-primary" />
        </span>
        <span className="text-xs font-medium text-fd-muted-foreground">
          Live from npm
        </span>
      </div>

      {skeleton ? (
        <div className="flex gap-10">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-7 w-20 animate-pulse rounded bg-fd-muted" />
              <div className="h-3 w-28 animate-pulse rounded bg-fd-muted" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-x-10 gap-y-5">
            <Stat
              label="customdomain-js · last 30 days"
              value={data.core?.lastMonth ?? 0}
            />
            <Stat
              label="customdomain-js · last 7 days"
              value={data.core?.lastWeek ?? 0}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-fd-border pt-4">
            {data.packages.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-baseline gap-2 text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                <code className="font-mono text-[11px] group-hover:underline">{p.name}</code>
                <span className="tabular-nums">{p.lastMonth.toLocaleString()}/mo</span>
              </a>
            ))}
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-fd-muted-foreground/70">
            Registry downloads, not unique users. The React package depends on{" "}
            <code className="font-mono">customdomain-js</code>, so the two rows
            above are not additive. npm publishes daily totals on a short lag
            {data.through ? <> · data through {data.through}</> : null}
            {data.partial ? <> · one source unavailable</> : null}
          </p>
        </>
      )}
    </div>
  );
}

export default UsageStats;
