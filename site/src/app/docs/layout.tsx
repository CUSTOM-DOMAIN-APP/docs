/**
 * The /docs layout: Fumadocs' DocsLayout with one sidebar tree, as Better Auth's docs have, in place of the four tabs
 * the docs used to show. Each meta.json group becomes a collapsible folder with its icon (groupedBySeparators below);
 * Providers and the API reference are folders inside the Integrations and Reference groups. The account buttons and
 * site links sit at the sidebar's foot (src/components/sidebar-account.tsx).
 */

import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type * as PageTree from "fumadocs-core/page-tree";
import { source } from "@/lib/source";
import { baseOptions } from "@/lib/layout.shared";
import { SidebarAccount } from "@/components/sidebar-account";

type Node = PageTree.Node;

/**
 * Turns each `---[Icon]Group---` run of the sidebar into a collapsible folder with its icon and a chevron, as
 * Better Auth's docs show their groups (layout mechanics after better-auth/better-auth, MIT, Copyright (c) 2024
 * Bereket Engida). Only the sidebar changes: pages, URLs and the llms.txt order still come from content/meta.json.
 * Get started opens by default; Fumadocs also opens the group that holds the current page.
 */
function groupedBySeparators(nodes: Node[]): Node[] {
  const out: Node[] = [];
  let group: PageTree.Folder | null = null;
  for (const node of nodes) {
    if (node.type === "separator") {
      group = {
        type: "folder",
        $id: `group:${String(node.name)}`,
        name: node.name,
        icon: node.icon,
        defaultOpen: out.length === 0,
        children: [],
      };
      out.push(group);
    } else if (group) {
      group.children.push(node);
    } else {
      out.push(node);
    }
  }
  return out;
}

function docsTree(): PageTree.Root {
  const full = source.getPageTree();
  return { ...full, children: groupedBySeparators(full.children) };
}

export default function DocsRouteLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={docsTree()} tabs={false} sidebar={{ footer: <SidebarAccount /> }} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
