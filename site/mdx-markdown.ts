// How MDX components read in a page's Markdown (the /docs/<slug>.md route and
// "Copy Markdown"). Fumadocs keeps a component as JSX unless told otherwise;
// these turn the ones the content uses into plain Markdown, so an agent reading
// the page sees the steps, the code, the questions and the options, not markup.

type Attribute = { type: string; name?: string; value?: unknown };
type JsxNode = { type: string; name?: string | null; attributes?: Attribute[]; children?: JsxNode[] };
// Method syntax on purpose: it lets mdast-util-to-markdown's State, whose
// methods take narrower node types, be passed in.
type State = {
  containerFlow(parent: unknown, info: unknown): string;
  containerPhrasing(parent: unknown, info: unknown): string;
};
type Estree = { type: string; [key: string]: unknown };

const isJsx = (node: JsxNode) => node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";

function attribute(node: JsxNode, name: string): Attribute | undefined {
  return node.attributes?.find((a) => a.type === "mdxJsxAttribute" && a.name === name);
}

function stringAttribute(node: JsxNode, name: string): string | undefined {
  const value = attribute(node, name)?.value;
  return typeof value === "string" ? value : undefined;
}

/** The value of a literal JavaScript expression (objects, arrays, strings, numbers, booleans). */
function literal(node: Estree | undefined): unknown {
  if (!node) return undefined;
  switch (node.type) {
    case "Literal":
      return node.value;
    case "TemplateLiteral": {
      const quasis = node.quasis as { value: { cooked: string } }[];
      return quasis.length === 1 ? quasis[0].value.cooked : undefined;
    }
    case "ArrayExpression":
      return (node.elements as Estree[]).map(literal);
    case "ObjectExpression": {
      const out: Record<string, unknown> = {};
      for (const prop of node.properties as Estree[]) {
        if (prop.type !== "Property") continue;
        const key = prop.key as Estree;
        const name = key.type === "Identifier" ? (key.name as string) : String(key.value);
        out[name] = literal(prop.value as Estree);
      }
      return out;
    }
  }
  return undefined;
}

function expressionAttribute(node: JsxNode, name: string): unknown {
  const value = attribute(node, name)?.value as { data?: { estree?: { body?: { expression?: Estree }[] } } } | undefined;
  return literal(value?.data?.estree?.body?.[0]?.expression);
}

const cell = (v: unknown) => (typeof v === "string" ? v.replace(/\s+/g, " ").replace(/\|/g, "\\|") : "");

function typeTable(node: JsxNode): string | undefined {
  const type = expressionAttribute(node, "type");
  if (!type || typeof type !== "object") return undefined;
  const rows = ["| Name | Type | Default | Description |", "| --- | --- | --- | --- |"];
  for (const [name, raw] of Object.entries(type as Record<string, Record<string, unknown>>)) {
    const required = raw?.required ? " (required)" : "";
    rows.push(`| \`${name}\`${required} | \`${cell(raw?.type)}\` | ${raw?.default ? `\`${cell(raw.default)}\`` : ""} | ${cell(raw?.description)} |`);
  }
  return rows.join("\n");
}

export function stringifyComponent(rawNode: unknown, _parent: unknown, state: State, info: unknown): string | undefined {
  const node = rawNode as JsxNode;
  if (!isJsx(node)) return undefined;
  const children = () => (node.type === "mdxJsxTextElement" ? state.containerPhrasing(node, info) : state.containerFlow(node, info));

  switch (node.name) {
    case "Steps":
    case "Step":
    case "Cards":
    case "Accordions":
    case "Tabs":
    case "Tab":
      return children();
    case "CodeBlockTabs":
      // The tab labels are only labels: keep each tab's code block, in order.
      return (node.children ?? [])
        .filter((c) => isJsx(c) && c.name === "CodeBlockTab")
        .map((tab) => state.containerFlow(tab, info))
        .join("\n\n");
    case "Accordion":
      return `### ${stringAttribute(node, "title") ?? ""}\n\n${children()}`;
    case "Card": {
      const title = stringAttribute(node, "title") ?? "";
      const href = stringAttribute(node, "href");
      const description = stringAttribute(node, "description");
      return `- ${href ? `[${title}](${href})` : title}${description ? `: ${description}` : ""}`;
    }
    case "Callout": {
      const title = stringAttribute(node, "title");
      const body = children();
      const text = title ? `**${title}**\n\n${body}` : body;
      return text
        .split("\n")
        .map((line) => (line ? `> ${line}` : ">"))
        .join("\n");
    }
    case "TypeTable":
      return typeTable(node);
  }
  return undefined;
}
