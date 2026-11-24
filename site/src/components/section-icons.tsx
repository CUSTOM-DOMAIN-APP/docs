/**
 * The icons beside sidebar groups, folders and key pages, and the set MDX pages may use in cards: Lucide icons
 * (lucide-react, ISC license), one consistent stroke family as Better Auth's docs use. A group names its icon in
 * content/meta.json as `---[Name]Group---`, a folder in its meta.json `icon`, a page in its frontmatter `icon`;
 * src/lib/source.ts turns the name into one of these. An unknown name renders nothing, so a typo drops the icon,
 * never the page.
 */

import { createElement, type ReactElement } from "react";
import {
  Activity,
  ArrowRightLeft,
  Bell,
  Blocks,
  BookOpen,
  Bot,
  Braces,
  Code,
  Compass,
  CreditCard,
  FileText,
  Fingerprint,
  Globe,
  KeyRound,
  LayoutTemplate,
  Library,
  LifeBuoy,
  ListChecks,
  Lock,
  Mail,
  Network,
  Package,
  Plug,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Webhook,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const docsIcons: Record<string, LucideIcon> = {
  Activity,
  ArrowRightLeft,
  Bell,
  Blocks,
  BookOpen,
  Bot,
  Braces,
  Code,
  Compass,
  CreditCard,
  FileText,
  Fingerprint,
  Globe,
  KeyRound,
  LayoutTemplate,
  Library,
  LifeBuoy,
  ListChecks,
  Lock,
  Mail,
  Network,
  Package,
  Plug,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Webhook,
  Workflow,
  Zap,
};

export function sectionIcon(name: string | undefined): ReactElement | undefined {
  if (!name || !(name in docsIcons)) return undefined;
  return createElement(docsIcons[name], {
    "aria-hidden": true,
    focusable: "false",
    strokeWidth: 1.75,
    className: "cd-section-icon",
  });
}
