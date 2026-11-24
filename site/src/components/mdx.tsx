/**
 * Every component an MDX page may use without importing it: Fumadocs' defaults (Cards, Callout, code block tabs)
 * plus Steps, Tabs, Accordions and TypeTable, keyboard-scrollable tables, zoomable images, the npm usage card,
 * <ForAgents />, the "For AI agents" section (components/for-agents.tsx), and the docs icon set
 * (src/components/section-icons.tsx) so a card can take an icon, as on Better Auth's introduction page:
 * `<Card icon={<Rocket />} title="Quickstart" href="/docs/getting-started/quickstart" />`.
 * A component added here that holds text also needs a case in mdx-markdown.ts, or its text is missing from the
 * page's Markdown.
 */

import defaultMdxComponents from "fumadocs-ui/mdx";
import { docsIcons } from "@/components/section-icons";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { UsageStats } from "@/components/usage-stats";
import { ForAgents } from "@/components/for-agents";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...docsIcons,
    // A wide table scrolls sideways inside its wrapper; tabIndex and a named region let a keyboard user scroll it
    // (axe scrollable-region-focusable). Classes as Fumadocs' own wrapper.
    table: (props) => (
      <div className="relative overflow-auto prose-no-margin my-6" tabIndex={0} role="region" aria-label="Table">
        <table {...(props as React.ComponentProps<"table">)} />
      </div>
    ),
    img: (props) => <ImageZoom {...(props as React.ComponentProps<typeof ImageZoom>)} />,
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
