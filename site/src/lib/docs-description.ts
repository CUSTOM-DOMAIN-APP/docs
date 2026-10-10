/**
 * Render-time description for docs pages whose authored text is missing or outside the window, in
 * practice the generated API reference pages (their frontmatter carries only `title`, `full` and
 * `_openapi`).
 *
 * Search consoles flag descriptions outside roughly 150 to 160 characters, so the fallback is fitted
 * into that window by choosing among a few fixed phrasings, never by cutting text or adding an
 * ellipsis. Dependency free and deterministic: the same input always gives the same string.
 */

export const DESCRIPTION_MIN = 150;
export const DESCRIPTION_MAX = 160;

/** Titles longer than this are replaced by the humanized operation id so the sentence stays short. */
const TITLE_LIMIT = 64;

export type FallbackInput = {
  title: string;
  slug: readonly string[];
  method?: string;
};

/** "listWebhookDeliveries" to "list webhook deliveries". */
function humanizeId(id: string): string {
  return id
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** The folder just above the operation page, for example "managed-dns" in api-reference/managed-dns/x. */
function groupOf(slug: readonly string[]): string | undefined {
  if (slug.length < 3) return undefined;
  const folder = slug[slug.length - 2];
  return folder ? humanizeId(folder) : undefined;
}

function cleanTitle(title: string): string {
  return title.replace(/\s+/g, " ").trim().replace(/[.:;,]+$/, "");
}

const METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]);

/** Every wording that fits the grammar, in order of preference; the first one inside the window wins. */
function candidates(name: string, group: string | undefined, method: string | undefined): string[] {
  const leads = [
    `${name}: CustomDomain™ API reference`,
    `${name}: reference page for this CustomDomain™ API operation`,
  ];
  const where: string[] = [];
  if (group && method) where.push(` (${method}) in the ${group} group`);
  if (group) where.push(` in the ${group} group`);
  if (method) where.push(` (${method})`);
  where.push("");
  const contents = [
    ". Covers request parameters, the request body, responses and error codes.",
    ". Lists request parameters, the request body, responses and error codes.",
    ". Covers parameters, request body, responses and error codes.",
    ". Covers parameters, the request body, responses and errors.",
    ". Covers parameters, request body and responses.",
  ];
  const extras = [
    "",
    " Part of the CustomDomain™ API v1.",
    " Authentication is described on the API reference index.",
    " Part of the v1 API.",
  ];
  const out: string[] = [];
  for (const extra of extras) {
    for (const lead of leads) {
      for (const w of where) {
        for (const c of contents) out.push(`${lead}${w}${c}${extra}`);
      }
    }
  }
  return out;
}

export function fallbackDescription(input: FallbackInput): string {
  const { slug } = input;
  const title = cleanTitle(input.title);
  const id = slug.length > 0 ? humanizeId(slug[slug.length - 1]) : "";
  const name = title.length > 0 && (title.length <= TITLE_LIMIT || !id) ? title : id || "API operation";
  const upper = input.method?.trim().toUpperCase();
  const method = upper && METHODS.has(upper) ? upper : undefined;

  const all = candidates(name, groupOf(slug), method);
  const fit = all.find((c) => c.length >= DESCRIPTION_MIN && c.length <= DESCRIPTION_MAX);
  if (fit) return fit;
  // Nothing lands in the window (an unusually short or long name): take the nearest wording.
  const target = (DESCRIPTION_MIN + DESCRIPTION_MAX) / 2;
  return all.reduce((best, c) => (Math.abs(c.length - target) < Math.abs(best.length - target) ? c : best));
}

/**
 * The description to use for a page. An authored description of 150 to 160 characters is kept as
 * written; a missing, shorter or longer one gets the fallback.
 */
export function metaDescription(existing: string | undefined, input: FallbackInput): string {
  if (existing && existing.length >= DESCRIPTION_MIN && existing.length <= DESCRIPTION_MAX) return existing;
  return fallbackDescription(input);
}
