import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
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

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

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
    include: { category: true, faqs: { orderBy: { order: "asc" } } },
  });

  if (!post || post.status !== "PUBLISHED") notFound();

  const renderedContent = renderBlogContent(post.content);
  const toc = getBlogToc(post.content);
  const relatedPosts = await getRelatedPosts(post.slug, post.title);

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
      />
      <InArticleAd slotId={ADS.blogPost.beforeCta} />
      <NewsletterCTA />
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
