import type { Metadata } from "next";
import Link from "next/link";
import { postsNewestFirst, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from the team building customdomain.ai — custom domains for SaaS, DNS provider behaviour, apex records, and what real integrations teach us.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = postsNewestFirst();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-fd-foreground">
        Blog
      </h1>
      <p className="mt-3 text-fd-muted-foreground">
        Notes from the team building customdomain.ai.
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 text-sm text-fd-muted-foreground">
          Nothing published yet.
        </p>
      ) : (
        <ul className="mt-12 flex flex-col gap-10">
          {posts.map((post) => (
            <li key={post.url}>
              <article>
                <time
                  dateTime={post.data.date}
                  className="text-xs font-medium text-fd-muted-foreground"
                >
                  {formatDate(post.data.date)}
                </time>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  <Link
                    href={post.url}
                    className="text-fd-foreground no-underline hover:underline"
                  >
                    {post.data.title}
                  </Link>
                </h2>
                {post.data.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
                    {post.data.description}
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
