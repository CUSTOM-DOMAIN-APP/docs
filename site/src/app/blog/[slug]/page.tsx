import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { blogSource, formatDate } from "@/lib/blog";
import { getMDXComponents } from "@/components/mdx";

type Params = { slug: string };

export default async function BlogPost({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);
  if (!page) notFound();

  const MDX = page.data.body;
  const url = `https://docs.customdomain.ai${page.url}`;

  // BlogPosting rather than the docs tree's TechArticle: this is dated,
  // authored, announcement-shaped content, and typing it as reference material
  // would misdescribe it to anything reading the structured data.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: page.data.title,
    description: page.data.description ?? undefined,
    datePublished: page.data.date,
    dateModified: page.data.date,
    url,
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: page.data.author,
      url: "https://customdomain.ai",
    },
    publisher: {
      "@type": "Organization",
      name: "Custom Domain",
      url: "https://customdomain.ai",
      logo: {
        "@type": "ImageObject",
        url: "https://customdomain.ai/web/image/website/1/logo",
      },
    },
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="text-xs font-medium text-fd-muted-foreground no-underline hover:text-fd-foreground"
      >
        ← Blog
      </Link>

      <header className="mt-6">
        <time
          dateTime={page.data.date}
          className="text-xs font-medium text-fd-muted-foreground"
        >
          {formatDate(page.data.date)}
        </time>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fd-foreground">
          {page.data.title}
        </h1>
      </header>

      <div className="prose mt-10">
        <MDX components={getMDXComponents()} />
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return blogSource.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
    openGraph: {
      type: "article",
      title: page.data.title,
      description: page.data.description,
      publishedTime: page.data.date,
      url: `https://docs.customdomain.ai${page.url}`,
    },
  };
}
