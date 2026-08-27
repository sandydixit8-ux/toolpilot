import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { renderBlogContent } from "@/lib/blog-renderer";
import { InArticleAd } from "@/components/ads/ad-banner";
import { NewsletterCTA } from "@/components/revenue/newsletter-cta";
import { UpiPayment } from "@/components/revenue/upi-payment";
import { getSiteUrl } from "@/lib/utils";
import { BreadcrumbListSchema } from "@/components/seo/structured-data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "PUBLISHED") return {};
  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: `${getSiteUrl()}/blog/${post.slug}` },
    openGraph: { title: post.seoTitle, description: post.seoDescription, type: "article" },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post || post.status !== "PUBLISHED") notFound();

  const renderedContent = renderBlogContent(post.content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.seoDescription,
            author: { "@type": "Person", name: post.author },
            publisher: { "@type": "Organization", name: "ToolPilot", url: getSiteUrl() },
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.updatedAt?.toISOString(),
            url: `${getSiteUrl()}/blog/${post.slug}`,
            mainEntityOfPage: { "@type": "WebPage", "@id": `${getSiteUrl()}/blog/${post.slug}` },
          }).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <BreadcrumbListSchema items={[
        { name: "Home", url: getSiteUrl() },
        { name: "Blog", url: `${getSiteUrl()}/blog` },
        { name: post.title, url: `${getSiteUrl()}/blog/${post.slug}` },
      ]} />
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
      <div
        className="prose dark:prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
      <InArticleAd slotId="0000000007" />
      <InArticleAd slotId="0000000004" />
      <NewsletterCTA />
      <div className="mt-8">
        <UpiPayment />
      </div>
      <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
        <Link href="/blog" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
          ← Back to Blog
        </Link>
      </div>
    </article>
    </>
  );
}
