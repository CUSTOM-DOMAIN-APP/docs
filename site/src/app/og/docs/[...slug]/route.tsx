/**
 * The social card for each docs page (/og/docs/<slug>/image.png), rendered once per page at build time: the page
 * title and description on the brand kit's paper and ink (D-1), with the muted label and host. The renderer cannot
 * read woff2, so the card uses its built-in sans face rather than the docs fonts.
 */

import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { source } from "@/lib/source";
import { pageDescription } from "@/lib/page-description";

// The social card for each docs page: /og/docs/<slug>/image.png, and
// /og/docs/image.png for the docs home. Rendered once per page at build time.
//
// The layout is Fumadocs' card (fumadocs-ui/og) with the type scaled to the
// title: its fixed 82px title runs into the description on the longer titles.
export const revalidate = false;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  if (slug[slug.length - 1] !== "image.png") notFound();
  const pageSlug = slug.slice(0, -1);
  const page = source.getPage(pageSlug);
  if (!page) notFound();

  const title = page.data.title;
  const description = pageDescription(pageSlug, page);
  const titleSize = title.length > 48 ? 58 : title.length > 26 ? 68 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          backgroundColor: "#faf8f5",
          color: "#1c1917",
          borderBottom: "18px solid #e7e5e4",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#6f6862", marginBottom: 28 }}>CustomDomain™ docs</div>
        <div style={{ display: "block", fontSize: titleSize, fontWeight: 700, lineHeight: 1.12, lineClamp: 3 }}>{title}</div>
        {description ? (
          <div
            style={{
              display: "block",
              fontSize: 32,
              lineHeight: 1.4,
              color: "#44403c",
              marginTop: 28,
              lineClamp: 3,
            }}
          >
            {description}
          </div>
        ) : null}
        <div style={{ display: "flex", marginTop: "auto", fontSize: 28, color: "#6f6862" }}>
          docs.customdomain.ai
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({ slug: [...page.slugs, "image.png"] }));
}
