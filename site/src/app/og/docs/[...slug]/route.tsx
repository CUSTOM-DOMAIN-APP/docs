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
          backgroundColor: "#0c0a09",
          color: "#fafaf9",
          borderBottom: "18px solid rgba(168,162,158,0.35)",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#a8a29e", marginBottom: 28 }}>CustomDomain™ docs</div>
        <div style={{ display: "block", fontSize: titleSize, fontWeight: 700, lineHeight: 1.12, lineClamp: 3 }}>{title}</div>
        {description ? (
          <div
            style={{
              display: "block",
              fontSize: 32,
              lineHeight: 1.4,
              color: "#d6d3d1",
              marginTop: 28,
              lineClamp: 3,
            }}
          >
            {description}
          </div>
        ) : null}
        <div style={{ display: "flex", marginTop: "auto", fontSize: 28, color: "#a8a29e" }}>
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
