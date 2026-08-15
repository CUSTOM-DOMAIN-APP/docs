import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/components/mdx";
import { openapi } from "@/lib/openapi";
import { OpenAPIPage } from "@/lib/openapi-page";
import type { GeneratedPageProps } from "fumadocs-openapi";

type Params = { slug?: string[] };

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  // schema.org structured data for every docs page: TechArticle (this is
  // technical reference/guide content) plus a BreadcrumbList mirroring the
  // slug path. Emitted as JSON-LD so search engines and answer engines get
  // machine-readable type, headline, and description without any change to
  // the MDX content itself.
  const pageUrl = `https://docs.customdomain.ai${page.url}`;
  const crumbs = (slug ?? []).map((part, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: part.replace(/-/g, " "),
    item: `https://docs.customdomain.ai/docs/${(slug ?? []).slice(0, i + 1).join("/")}`,
  }));
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: page.data.title,
      description: page.data.description ?? undefined,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      author: { "@type": "Organization", name: "Custom Domain", url: "https://customdomain.ai" },
      publisher: {
        "@type": "Organization",
        name: "Custom Domain",
        url: "https://customdomain.ai",
        logo: { "@type": "ImageObject", url: "https://customdomain.ai/web/image/website/1/logo" },
      },
    },
    ...(crumbs.length > 0
      ? [{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs }]
      : []),
  ];

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
            OpenAPIPage: async (props: GeneratedPageProps) => (
              <OpenAPIPage {...(await openapi.preloadOpenAPIPage(page))} {...props} />
            ),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: `/docs/${(slug ?? []).join("/")}` },
  };
}
