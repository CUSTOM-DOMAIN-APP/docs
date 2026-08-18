import defaultMdxComponents from "fumadocs-ui/mdx";
import { UsageStats } from "@/components/usage-stats";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Live npm usage card — drop <UsageStats /> into any .mdx page.
    UsageStats,
    ...components,
  } satisfies MDXComponents;
}
