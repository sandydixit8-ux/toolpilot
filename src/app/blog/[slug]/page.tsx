import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma, withDbRetry } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { BreadcrumbListSchema } from "@/components/seo/structured-data";
import { QuickAnswer } from "@/components/seo/quick-answer";
import { renderBlogContent, getBlogToc } from "@/lib/blog-renderer";
import { getRelatedPosts } from "@/lib/related-posts";
import { Card, CardContent } from "@/components/ui/card";
import { InArticleAd } from "@/components/ads/ad-banner";
import { ADS } from "@/config/ads";
import { NewsletterCTA } from "@/components/revenue/newsletter-cta";
import { AffiliatePromo } from "@/components/revenue/affiliate-promo";
import { getGeneralAffiliates } from "@/lib/affiliates";
import { getSiteUrl } from "@/lib/utils";
import { FAQSection } from "@/components/tools/faq-section";
import { ArticleRelatedTools } from "@/components/seo/article-related-tools";
import { AuthorBio } from "@/components/seo/author-bio";
import { AUTHOR } from "@/config/author";

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const posts = await withDbRetry(() =>
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true },
      })
    );
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await withDbRetry(() =>
    prisma.blogPost.findUnique({ where: { slug } })
  ).catch(() => null);
  if (!post || post.status !== "PUBLISHED") notFound();
  return {
    title: post.seoTitle.replace(/ \| ToolPilot$/, ""),
    description: post.seoDescription,
    alternates: { canonical: `${getSiteUrl()}/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [post.author],
      images: ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await withDbRetry(() =>
    prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true, faqs: { orderBy: { order: "asc" } } },
    })
  );

  if (!post || post.status !== "PUBLISHED") notFound();

  const renderedContent = renderBlogContent(post.content);
  const toc = getBlogToc(post.content);
  // Related posts are a progressive enhancement: never let a transient DB
  // error here fail the prerender of an otherwise-fine article.
  const relatedPosts = await withDbRetry(() =>
    getRelatedPosts(post.slug, post.title, post.categoryId)
  ).catch(() => []);

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
            author: {
              "@type": "Person",
              name: AUTHOR.name,
              url: AUTHOR.url,
              jobTitle: AUTHOR.role,
            },
            publisher: {
              "@type": "Organization",
              name: "ToolPilot",
              url: getSiteUrl(),
              logo: { "@type": "ImageObject", url: `${getSiteUrl()}/og.png` },
            },
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
        <span>
          <Link href={AUTHOR.path} className="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
            {AUTHOR.name}
          </Link>
        </span>
        {post.publishedAt && (
          <>
            <span>·</span>
            <time dateTime={post.publishedAt.toISOString()}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </time>
          </>
        )}
      </div>
      <div className="mt-6">
        <QuickAnswer
          question={post.title}
            answer={post.excerpt ?? ""}
          />
      </div>
      {toc.length >= 2 && (
        <details className="mt-6 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <summary className="cursor-pointer font-semibold text-gray-900 dark:text-gray-100 text-sm">Table of Contents</summary>
          <ol className="mt-3 space-y-1.5 text-sm">
            {toc.map((h) => (
              <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
                <a href={`#${h.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">{h.text}</a>
              </li>
            ))}
          </ol>
        </details>
      )}
      <div
        className="prose dark:prose-invert mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      <ArticleRelatedTools title={post.title} />
      {post.faqs.length > 0 && (
        <div className="mt-10">
          <FAQSection
            faqs={post.faqs.map((f) => ({ question: f.question, answer: f.answer }))}
            title="Frequently Asked Questions"
            />
        </div>
      )}
      <InArticleAd slotId={ADS.blogPost.afterContent} />
      <AffiliatePromo
        title="Tools We Recommend"
        items={getGeneralAffiliates().map((a) => ({
          name: a.name,
          description: a.description,
          url: a.url,
          ctaText: a.ctaText,
          rating: a.rating,
          badge: a.badge,
        }))}
        tracking={{ source: `/blog/${post.slug}`, path: `/blog/${post.slug}` }}
        />
      <InArticleAd slotId={ADS.blogPost.beforeCta} />
      <NewsletterCTA />
      <AuthorBio reviewedAt={post.updatedAt} />
      {relatedPosts.length > 0 && (
        <div className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Related Articles</h2>
          <div className="space-y-3">
            {relatedPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{p.title}</p>
                    {p.excerpt && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{p.excerpt}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
        <Link href="/blog" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
          ← Back to Blog
        </Link>
      </div>
    </article>
    </>
  );
}
