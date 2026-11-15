/**
 * The /docs layout: Fumadocs' DocsLayout with the page tree split into four sections (Documentation, Providers,
 * API reference, Changelog). The sections are shown as four links at the top of the sidebar and the phone drawer
 * (src/components/section-switch.tsx, the sidebar banner) instead of Fumadocs' dropdown, so `tabs` is off for the
 * layout itself. The account buttons and site links sit at the sidebar's foot (src/components/sidebar-account.tsx).
 * In the sidebar each meta.json group becomes a collapsible folder with its icon (groupedBySeparators below).
 */

import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { LayoutTab } from "fumadocs-ui/layouts/shared";
import type * as PageTree from "fumadocs-core/page-tree";
import { source } from "@/lib/source";
import { baseOptions } from "@/lib/layout.shared";
import { SectionSwitch } from "@/components/section-switch";
import { SidebarAccount } from "@/components/sidebar-account";

// The sidebar has four tabs: Documentation, Providers, API reference and
// Changelog. Providers and API reference are folders marked "root": true in
// their meta.json, so each shows only its own pages. They stay listed in
// content/meta.json (llms.txt reads that order), and are moved here from the
// Documentation sidebar to the tree's fallback, where the layout still finds
// their pages. Changelog is one page, so its tab is a plain link to it.

type Node = PageTree.Node;

const isTabFolder = (node: Node): node is PageTree.Folder => node.type === "folder" && node.root === true;

function urlsOf(nodes: Node[], out = new Set<string>()): Set<string> {
  for (const node of nodes) {
    if (node.type === "page" && !node.external) out.add(node.url);
    if (node.type === "folder") {
      if (node.index) out.add(node.index.url);
      urlsOf(node.children, out);
    }
  }
  return out;
}

/** Drops separators left with nothing under them once the tab folders are taken out. */
function withoutEmptySeparators(nodes: Node[]): Node[] {
  return nodes.filter((node, i) => node.type !== "separator" || (i + 1 < nodes.length && nodes[i + 1].type !== "separator"));
}

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

function docsTree(): { tree: PageTree.Root; tabs: LayoutTab[] } {
  const full = source.getPageTree();
  const tabFolders = full.children.filter(isTabFolder);
  const docs = withoutEmptySeparators(full.children.filter((node) => !isTabFolder(node)));

  const tree: PageTree.Root = {
    ...full,
    children: groupedBySeparators(docs),
    fallback: {
      ...(full.fallback ?? { $id: `${full.$id ?? "root"}:tabs`, name: full.name }),
      type: "root",
      children: [...tabFolders, ...(full.fallback?.children ?? [])],
    },
  };

  const descriptions: Record<string, string> = {
    "/docs/providers": "Connecting a domain at each DNS provider",
    "/docs/api-reference": "Every /v1 endpoint",
  };
  const tabs: LayoutTab[] = [
    { title: "Documentation", description: "Guides, concepts and the connect flow", url: "/docs", urls: urlsOf(docs) },
    ...tabFolders.map((folder) => {
      const urls = urlsOf([folder]);
      const url = urls.values().next().value ?? "/docs";
      return { title: folder.name, description: descriptions[url], url, urls };
    }),
    { title: "Changelog", description: "Versioning policy and notable changes", url: "/docs/changelog", urls: new Set(["/docs/changelog"]) },
  ];
  return { tree, tabs };
}

export default function DocsRouteLayout({ children }: { children: ReactNode }) {
  const { tree, tabs } = docsTree();
  return (
    <DocsLayout
      tree={tree}
      tabs={false}
      sidebar={{ banner: <SectionSwitch tabs={tabs} />, footer: <SidebarAccount /> }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
