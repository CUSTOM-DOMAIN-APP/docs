import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  MarkdownCopyButton,
  PageLastUpdate,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { source } from "@/lib/source";
import { pageDescription } from "@/lib/page-description";
import { markdownPath } from "@/lib/markdown";
import { getMDXComponents } from "@/components/mdx";
import { openapi } from "@/lib/openapi";
import { OpenAPIPage } from "@/lib/openapi-page";
import type { GeneratedPageProps } from "fumadocs-openapi";

type Params = { slug?: string[] };

// Where each page's source lives, for "Edit on GitHub" and the view options menu.
const CONTENT_ON_GITHUB = "https://github.com/CUSTOM-DOMAIN-APP/docs/blob/main/content";

/** The page's social card, rendered by app/og/docs/[...slug]/route.tsx. */
function ogImagePath(slugs: string[]): string {
  return `/og/docs/${[...slugs, "image.png"].join("/")}`;
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const description = pageDescription(slug, page);
  const markdownUrl = markdownPath(page.url);
  const githubUrl = `${CONTENT_ON_GITHUB}/${page.path}`;
  // From git (source.config.ts); absent when the date is unknown.
  const lastModified = (page.data as { lastModified?: Date | string | number }).lastModified;

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
      description: description ?? undefined,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      author: { "@type": "Organization", name: "CustomDomain™", url: "https://customdomain.ai" },
      publisher: {
        "@type": "Organization",
        name: "CustomDomain™",
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
      <DocsDescription className="mb-0">{description}</DocsDescription>
      <div className="flex flex-row flex-wrap items-center gap-2 border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
      </div>
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
      <div className="flex flex-row flex-wrap items-center justify-between gap-4">
        <EditOnGitHub href={githubUrl} />
        {lastModified ? <PageLastUpdate date={new Date(lastModified)} /> : null}
      </div>
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

  const description = pageDescription(slug, page);
  const canonical = `/docs/${(slug ?? []).join("/")}`;
  const image = {
    url: ogImagePath(page.slugs),
    width: 1200,
    height: 630,
    alt: page.data.title,
  };

  return {
    title: page.data.title,
    description,
    alternates: {
      canonical,
      // The same page as Markdown, for agents and tools (app/docs-md).
      types: { "text/markdown": markdownPath(page.url) },
    },
    openGraph: {
      type: "article",
      siteName: "CustomDomain™ docs",
      title: page.data.title,
      description,
      url: canonical,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description,
      images: [image.url],
    },
  };
}
