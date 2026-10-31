/**
 * The MDX components every docs page may use without importing them: Fumadocs' defaults (Cards, Callout, code block
 * tabs) plus Steps, Tabs, Accordions, TypeTable, zoomable images, keyboard scrollable tables, the npm usage card and
 * <ForAgents />, the "For AI agents" section (components/for-agents.tsx). A component added here that holds text also
 * needs a case in mdx-markdown.ts, or its text is missing from the page's Markdown.
 */

import defaultMdxComponents from "fumadocs-ui/mdx";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { UsageStats } from "@/components/usage-stats";
import { ForAgents } from "@/components/for-agents";
import type { MDXComponents } from "mdx/types";

// Every component an MDX page may use without importing it. Fumadocs registers
// only Cards and Callout (and the code block tabs) by default; the rest are
// added here so content can use <Steps>, <Tabs>, <Accordions> and <TypeTable>
// directly. Images open zoomed on click.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: (props) => <ImageZoom {...(props as React.ComponentProps<typeof ImageZoom>)} />,
    // Fumadocs' table wrapper scrolls sideways on a phone but cannot take keyboard focus, so a keyboard user could not
    // scroll a wide table (axe: scrollable-region-focusable, on every page with a table at 390px). The same wrapper,
    // focusable and named; a group rather than a region, so several tables on a page are not duplicate landmarks.
    table: (props) => (
      <div className="relative overflow-auto prose-no-margin my-6" tabIndex={0} role="group" aria-label="Table">
        <table {...props} />
      </div>
    ),
    Accordion,
    Accordions,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    // Live npm usage card: drop <UsageStats /> into any .mdx page.
    UsageStats,
    // The "For AI agents" section, on content/for-ai-agents/index.mdx.
    ForAgents,
    ...components,
  } satisfies MDXComponents;
}
