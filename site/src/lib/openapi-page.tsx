"use client";

/**
 * The interactive "operation" renderer (parameters, schema, try it) used by every generated api-reference page,
 * with its request and response samples highlighted in the brand code themes (lib/code-themes.ts), the same as
 * the code blocks in the MDX pages. Kept in its own client-only module: importing it from a server-only module
 * (lib/source.ts, the search route) breaks the build with "Attempted to call createOpenAPIPage() from the server".
 * Fumadocs draws an icon-only "link to this field" button with no name; the wrapper names it for screen readers.
 */

import { useEffect, useRef, type ComponentProps } from "react";
import { createOpenAPIPage } from "fumadocs-openapi/ui";
import { codeThemes } from "@/lib/code-themes";

const BaseOpenAPIPage = createOpenAPIPage({
  shikiOptions: { themes: codeThemes },
});

function nameIconButtons(root: HTMLElement) {
  for (const button of root.querySelectorAll<HTMLButtonElement>("button:not([aria-label])")) {
    if (button.textContent?.trim()) continue;
    if (button.querySelector("svg.lucide-link")) button.setAttribute("aria-label", "Copy a link to this field");
  }
}

export function OpenAPIPage(props: ComponentProps<typeof BaseOpenAPIPage>) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    nameIconButtons(root);
    const observer = new MutationObserver(() => nameIconButtons(root));
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="contents">
      <BaseOpenAPIPage {...props} />
    </div>
  );
}
