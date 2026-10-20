import defaultMdxComponents from "fumadocs-ui/mdx";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { UsageStats } from "@/components/usage-stats";
import type { MDXComponents } from "mdx/types";

// Every component an MDX page may use without importing it. Fumadocs registers
// only Cards and Callout (and the code block tabs) by default; the rest are
// added here so content can use <Steps>, <Tabs>, <Accordions> and <TypeTable>
// directly. Images open zoomed on click.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
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
