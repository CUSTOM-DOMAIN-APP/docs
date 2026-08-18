import { blog } from "collections/server";
import { loader } from "fumadocs-core/source";

// The blog's content source. Same loader as the docs tree, different baseUrl —
// posts live at /blog/<slug> and are deliberately absent from the docs page
// tree, so an announcement never lands in the API-reference sidebar.
export const blogSource = loader({
  baseUrl: "/blog",
  source: blog.toFumadocsSource(),
});

export type BlogPost = ReturnType<typeof blogSource.getPages>[number];

/** Posts newest-first. The only ordering a blog index needs. */
export function postsNewestFirst() {
  return [...blogSource.getPages()].sort((a, b) =>
    a.data.date < b.data.date ? 1 : a.data.date > b.data.date ? -1 : 0,
  );
}

/** "18 August 2026" — spelled out, and explicitly UTC so the rendered date
 *  cannot shift by a day depending on where the build machine is. */
export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
