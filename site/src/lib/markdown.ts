/**
 * The Markdown form of a docs page, served at /docs/<slug>.md (and /docs.md for the docs home), to a request whose
 * Accept prefers text/markdown (proxy.ts), at /agents/brief/<name>.md for the agent briefs, and copied by the page's
 * "Copy Markdown" button. Written pages come from fumadocs-mdx's processed Markdown, with the "For AI agents" section
 * filled in (lib/agent-surface.ts) and every link made absolute. The generated API reference pages hold no prose of
 * their own, so their Markdown is written from the same openapi-v1.yaml entry they render.
 */

import { source } from "@/lib/source";
import { openapi } from "@/lib/openapi";
import { FOR_AGENTS_PLACEHOLDER, forAgentsMarkdown } from "@/lib/agent-surface";
import { SITE, absoluteLinks, markdownPath } from "@/lib/negotiate";

export { SITE, markdownPath };

type Page = NonNullable<ReturnType<typeof source.getPage>>;

export async function pageMarkdown(page: Page, description: string | undefined): Promise<string> {
  const head = [`# ${page.data.title}`, ""];
  if (description) head.push(`> ${description}`, "");
  head.push(`Source: ${SITE}${page.url}`, "");

  const operations = await apiOperations(page);
  const body = operations ? await operationsMarkdown(operations) : await page.data.getText("processed");
  const text = body
    // MDX comments ({/* ... */}) are notes for editors, not content.
    .replace(/^\{\/\*[\s\S]*?\*\/\}[ \t]*\n?/gm, "")
    // <ForAgents /> (mdx-markdown.ts) becomes the section's text, as the setting serves it.
    .replace(FOR_AGENTS_PLACEHOLDER, () => forAgentsMarkdown({ heading: false }))
    .trim();
  return `${head.join("\n")}\n${absoluteLinks(text)}\n`;
}

// ---- generated API reference pages ----

type Operation = { path: string; method: string };

/** The operations a generated API reference page renders, read from its MDX; undefined for a written page. */
async function apiOperations(page: Page): Promise<Operation[] | undefined> {
  if (!("_openapi" in page.data) || !page.data._openapi) return undefined;
  const raw = await page.data.getText("raw");
  const match = raw.match(/operations=\{(\[[\s\S]*?\])\}/);
  if (!match) return undefined;
  try {
    const parsed = JSON.parse(match[1]) as Operation[];
    return parsed.length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}

type Json = Record<string, unknown>;

const isObject = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);

async function spec(): Promise<Json> {
  const schemas = await openapi.getSchemas();
  const first = Object.values(schemas)[0];
  return (first?.bundled ?? {}) as unknown as Json;
}

/** Follows a local "#/components/..." reference; anything else is returned as it is. */
function deref(doc: Json, node: unknown, depth = 0): unknown {
  if (!isObject(node) || typeof node.$ref !== "string" || depth > 20) return node;
  const ref = node.$ref;
  if (!ref.startsWith("#/")) return node;
  let cur: unknown = doc;
  for (const part of ref.slice(2).split("/")) {
    if (!isObject(cur)) return node;
    cur = cur[part.replace(/~1/g, "/").replace(/~0/g, "~")];
  }
  return deref(doc, cur, depth + 1);
}

/** A cell for a Markdown table: one line, backslashes then pipes escaped. */
function cell(text: unknown): string {
  if (typeof text !== "string") return "";
  return text.replace(/\s+/g, " ").replace(/\\/g, "\\\\").replace(/\|/g, "\\|").trim();
}

function typeOf(doc: Json, schema: unknown): string {
  const s = deref(doc, schema);
  if (!isObject(s)) return "";
  if (Array.isArray(s.enum)) return s.enum.map((v) => (v === "" ? '`""`' : `\`${String(v)}\``)).join(", ");
  if (s.type === "array") {
    const inner = typeOf(doc, s.items);
    return inner ? `array of ${inner}` : "array";
  }
  if (Array.isArray(s.type)) return s.type.join(" or ");
  if (typeof s.type === "string") return s.type;
  if (typeof (schema as Json)?.$ref === "string") return String((schema as Json).$ref).split("/").pop() ?? "";
  if (Array.isArray(s.allOf) || Array.isArray(s.oneOf) || Array.isArray(s.anyOf)) return "object";
  return "";
}

/** The top level properties of a JSON schema, with allOf parts merged. */
function properties(doc: Json, schema: unknown): { props: Json; required: Set<string> } {
  const s = deref(doc, schema);
  const props: Json = {};
  const required = new Set<string>();
  if (!isObject(s)) return { props, required };
  for (const part of Array.isArray(s.allOf) ? s.allOf : []) {
    const merged = properties(doc, part);
    Object.assign(props, merged.props);
    merged.required.forEach((r) => required.add(r));
  }
  if (isObject(s.properties)) Object.assign(props, s.properties);
  if (Array.isArray(s.required)) s.required.forEach((r) => required.add(String(r)));
  return { props, required };
}

function fieldTable(doc: Json, schema: unknown): string[] {
  const { props, required } = properties(doc, schema);
  const names = Object.keys(props);
  if (names.length === 0) return [];
  const lines = ["| Field | Type | Required | Description |", "| --- | --- | --- | --- |"];
  for (const name of names) {
    const prop = deref(doc, props[name]);
    const description = isObject(prop) ? prop.description : undefined;
    lines.push(`| \`${name}\` | ${cell(typeOf(doc, props[name]))} | ${required.has(name) ? "yes" : "no"} | ${cell(description)} |`);
  }
  return lines;
}

async function operationsMarkdown(operations: Operation[]): Promise<string> {
  const doc = await spec();
  const servers = Array.isArray(doc.servers) ? doc.servers : [];
  const base = isObject(servers[0]) && typeof servers[0].url === "string" ? servers[0].url : "";
  const paths = isObject(doc.paths) ? doc.paths : {};
  const out: string[] = [];

  for (const { path, method } of operations) {
    const item = deref(doc, paths[path]);
    const op = isObject(item) ? deref(doc, item[method.toLowerCase()]) : undefined;
    out.push(`## \`${method.toUpperCase()} ${base}${path}\``, "");
    if (!isObject(op)) {
      out.push("This operation is not in the published spec.", "");
      continue;
    }
    if (typeof op.description === "string") out.push(op.description.trim(), "");

    const security = Array.isArray(op.security) ? op.security : Array.isArray(doc.security) ? doc.security : [];
    const schemes = security.flatMap((s) => (isObject(s) ? Object.keys(s) : []));
    out.push("### Authentication", "", schemes.length > 0 ? schemes.map((s) => `\`${s}\``).join(", ") : "None.", "");

    const params = [
      ...(isObject(item) && Array.isArray(item.parameters) ? item.parameters : []),
      ...(Array.isArray(op.parameters) ? op.parameters : []),
    ]
      .map((p) => deref(doc, p))
      .filter(isObject);
    if (params.length > 0) {
      out.push("### Parameters", "", "| Name | In | Type | Required | Description |", "| --- | --- | --- | --- | --- |");
      for (const p of params) {
        out.push(
          `| \`${cell(p.name)}\` | ${cell(p.in)} | ${cell(typeOf(doc, p.schema))} | ${p.required ? "yes" : "no"} | ${cell(p.description)} |`,
        );
      }
      out.push("");
    }

    const body = deref(doc, op.requestBody);
    if (isObject(body) && isObject(body.content)) {
      const json = deref(doc, (body.content as Json)["application/json"]);
      const schema = isObject(json) ? json.schema : undefined;
      const table = fieldTable(doc, schema);
      if (table.length > 0) out.push("### Request body (JSON)", "", ...table, "");
    }

    const responses = isObject(op.responses) ? op.responses : {};
    const codes = Object.keys(responses);
    if (codes.length > 0) {
      out.push("### Responses", "", "| Status | Description |", "| --- | --- |");
      for (const code of codes) {
        const r = deref(doc, responses[code]);
        out.push(`| \`${code}\` | ${cell(isObject(r) ? r.description : "")} |`);
      }
      out.push("");
      const ok = codes.find((c) => c.startsWith("2"));
      const okResponse = ok ? deref(doc, responses[ok]) : undefined;
      const okJson = isObject(okResponse) && isObject(okResponse.content) ? deref(doc, okResponse.content["application/json"]) : undefined;
      const okTable = isObject(okJson) ? fieldTable(doc, okJson.schema) : [];
      if (okTable.length > 0) out.push(`### \`${ok}\` response body`, "", ...okTable, "");
    }
  }

  out.push(`The full specification is served at \`GET ${base}/openapi.json\`.`);
  return out.join("\n");
}
