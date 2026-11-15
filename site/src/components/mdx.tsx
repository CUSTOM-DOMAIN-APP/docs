/**
 * Every component an MDX page may use without importing it: Fumadocs' defaults (Cards, Callout, code block tabs)
 * plus Steps, Tabs, Accordions and TypeTable, zoomable images, the npm usage card, and the docs icon set
 * (src/components/section-icons.tsx) so a card can take an icon, as on Better Auth's introduction page:
 * `<Card icon={<Rocket />} title="Quickstart" href="/docs/getting-started/quickstart" />`.
 */

import defaultMdxComponents from "fumadocs-ui/mdx";
import { docsIcons } from "@/components/section-icons";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { UsageStats } from "@/components/usage-stats";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...docsIcons,
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
    ...components,
  } satisfies MDXComponents;
}
