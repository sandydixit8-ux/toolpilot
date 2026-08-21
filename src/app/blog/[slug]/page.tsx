import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "PUBLISHED") return {};
  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.seoTitle, description: post.seoDescription, type: "article" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[
        { label: "Blog", href: "/blog" },
        { label: post.title },
      ]} />
      {post.category && (
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{post.category.name}</span>
      )}
      <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{post.title}</h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>{post.author}</span>
        {post.publishedAt && (
          <>
            <span>·</span>
            <time dateTime={post.publishedAt.toISOString()}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </time>
          </>
        )}
      </div>
      <div className="prose dark:prose-invert mt-8 max-w-none">
        {post.content.split("\n\n").map((paragraph, i) => {
          if (paragraph.startsWith("## ")) {
            return <h2 key={i}>{paragraph.replace("## ", "")}</h2>;
          }
          if (paragraph.startsWith("- ")) {
            const items = paragraph.split("\n").filter(l => l.startsWith("- "));
            return (
              <ul key={i}>
                {items.map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/^- /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                ))}
              </ul>
            );
          }
          if (paragraph.match(/^\d\./)) {
            const items = paragraph.split("\n").filter(l => l.match(/^\d/));
            return (
              <ol key={i}>
                {items.map((item, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                ))}
              </ol>
            );
          }
          return <p key={i} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }} />;
        })}
      </div>
      <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
        <Link href="/blog" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
          ← Back to Blog
        </Link>
      </div>
    </article>
  );
}
