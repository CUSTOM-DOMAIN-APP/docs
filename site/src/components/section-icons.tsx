/**
 * The small icons beside each sidebar group, drawn for these docs (24 px grid, 1.75 stroke, currentColor). A group
 * names its icon in content/meta.json as `---[Name]Group---`; src/lib/source.ts turns the name into one of these.
 * An unknown name renders nothing, so a typo in meta.json drops the icon, never the group.
 */

import { createElement, type ReactElement, type SVGProps } from "react";

const paths: Record<string, ReactElement[]> = {
  Start: [<circle key="c" cx="12" cy="12" r="9" />, <path key="p" d="M10 8.5v7l6-3.5z" />],
  Book: [<path key="a" d="M3 5.5c3-1 6-1 9 1v13c-3-2-6-2-9-1z" />, <path key="b" d="M21 5.5c-3-1-6-1-9 1v13c3-2 6-2 9-1z" />],
  Grid: [
    <rect key="a" x="4" y="4" width="7" height="7" rx="1.5" />,
    <rect key="b" x="13" y="4" width="7" height="7" rx="1.5" />,
    <rect key="c" x="4" y="13" width="7" height="7" rx="1.5" />,
    <rect key="d" x="13" y="13" width="7" height="7" rx="1.5" />,
  ],
  Flow: [<circle key="a" cx="6" cy="6" r="2.5" />, <circle key="b" cx="18" cy="18" r="2.5" />, <path key="p" d="M8.5 6H14a3 3 0 0 1 3 3v6.5" />],
  Globe: [<circle key="c" cx="12" cy="12" r="9" />, <ellipse key="e" cx="12" cy="12" rx="4" ry="9" />, <path key="l" d="M3 12h18" />],
  Widget: [<rect key="a" x="3.5" y="3.5" width="17" height="17" rx="3" />, <rect key="b" x="8" y="8" width="8" height="8" rx="1.5" />],
  Hook: [<path key="a" d="M7 20a4 4 0 1 1 3.5-6L14 7" />, <circle key="b" cx="15.5" cy="5" r="2.5" />, <path key="c" d="M11 15h9" />],
  Agent: [
    <rect key="a" x="4.5" y="7.5" width="15" height="11" rx="3" />,
    <path key="b" d="M12 7.5V4.5" />,
    <circle key="c" cx="9.5" cy="13" r="1" />,
    <circle key="d" cx="14.5" cy="13" r="1" />,
  ],
  Shield: [<path key="a" d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z" />],
  Help: [<circle key="c" cx="12" cy="12" r="9" />, <path key="p" d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7" />, <path key="d" d="M12 17h.01" />],
};

export function sectionIcon(name: string | undefined): ReactElement | undefined {
  if (!name || !(name in paths)) return undefined;
  const props: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: "false",
    className: "cd-section-icon",
  };
  return createElement("svg", props, ...paths[name]);
}
