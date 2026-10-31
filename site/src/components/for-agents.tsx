/**
 * <ForAgents />: the "For AI agents" section on the docs page content/for-ai-agents/index.mdx, rendered from the same
 * text and lists as the llms.txt section and the page's Markdown (lib/agent-surface.ts), so the page people read is
 * the text agents read. Every address is a visible link. The long addresses may wrap anywhere, so a phone never
 * scrolls sideways. It follows DOCS_AGENT_SURFACE as the page is built.
 */

import {
  BRIEFS,
  CONTEXT_PARTS,
  CONTEXT_TEMPLATE,
  FOR_AGENTS_TEXT,
  agentSurface,
  briefUrl,
  listOr,
} from "@/lib/agent-surface";

const wrap = { overflowWrap: "anywhere" } as const;

export function ForAgents() {
  const { context } = agentSurface();
  return (
    <>
      <p>{FOR_AGENTS_TEXT.intro}</p>
      <ul>
        {BRIEFS.map((brief) => (
          <li key={brief.slug}>
            {brief.label}:{" "}
            <a href={briefUrl(brief.slug)} style={wrap}>
              {briefUrl(brief.slug)}
            </a>
          </li>
        ))}
      </ul>
      {context ? (
        <>
          <p>{FOR_AGENTS_TEXT.contextIntro}</p>
          <p>
            <code style={wrap}>{CONTEXT_TEMPLATE}</code>
          </p>
          <ul>
            {CONTEXT_PARTS.map((part) => (
              <li key={part.name}>
                {part.describe}: {listOr(part.values)}
              </li>
            ))}
          </ul>
          <p>{FOR_AGENTS_TEXT.contextRules.join(" ")}</p>
        </>
      ) : null}
      <p>{FOR_AGENTS_TEXT.keep(context).join(" ")}</p>
    </>
  );
}
