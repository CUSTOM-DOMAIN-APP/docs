"use client";
/**
 * The docs section switch at the top of the sidebar and the phone drawer: the four sections (Documentation,
 * Providers, API reference, Changelog) as four visible links in a two by two grid, in place of Fumadocs' dropdown.
 * The current section is filled with ink and carries aria-current="true". Which section is current comes from the
 * same tab list and url sets src/app/docs/layout.tsx builds, through Fumadocs' own isLayoutTabActive, so a page
 * belongs to exactly the section the old dropdown showed. Styles are in src/app/brand.css (.cd-sections).
 */

import Link from "fumadocs-core/link";
import { usePathname } from "fumadocs-core/framework";
import { isLayoutTabActive, type LayoutTab } from "fumadocs-ui/layouts/shared";

export function SectionSwitch({ tabs }: { tabs: LayoutTab[] }) {
  const pathname = usePathname();
  const current = tabs.findLast((tab) => isLayoutTabActive(tab, pathname));
  return (
    <nav aria-label="Docs sections" className="cd-sections">
      <ul>
        {tabs.map((tab) => (
          <li key={tab.url}>
            <Link
              href={tab.url}
              className="cd-sections__link"
              aria-current={current?.url === tab.url ? "true" : undefined}
              title={typeof tab.description === "string" ? tab.description : undefined}
            >
              {tab.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
