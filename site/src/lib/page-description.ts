import { metaDescription } from "@/lib/docs-description";

// The generated API reference pages carry no authored description. They get a fitted one, used for the
// meta tag, the structured data, the social card and the visible line alike. Other pages keep their own text.
export function pageDescription(
  slug: string[] | undefined,
  page: { data: { title: string; description?: string } },
): string | undefined {
  if (slug?.[0] !== "api-reference") return page.data.description;
  return metaDescription(page.data.description, { title: page.data.title, slug });
}
