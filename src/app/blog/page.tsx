import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { BannerAd } from "@/components/ads/ad-banner";
import { ADS } from "@/config/ads";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog – Free Tool Guides, Tutorials & Tips | ToolPilot",
  description: "Free guides on income tax calculators, PDF compression, resume ATS scoring, salary calculation, and more. Practical tutorials for every ToolPilot tool.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Blog – Free Tool Guides, Tutorials & Tips | ToolPilot",
    description: "Free guides on income tax, PDF tools, resume building, and more.",
    url: `${SITE_URL}/blog`,
    siteName: "ToolPilot",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ToolPilot Blog",
    description: "Free guides on income tax, PDF tools, resume building, and more.",
    url: `${SITE_URL}/blog`,
    hasPart: posts.slice(0, 20).map((post) => ({
      "@type": "Article",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.publishedAt?.toISOString(),
      author: { "@type": "Organization", name: "ToolPilot" },
    })),
  };

  const categories = Array.from(new Set(posts.map((p) => p.category?.name).filter(Boolean)));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ToolPilot Blog – Free Guides & Tutorials
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
            Practical guides on income tax, PDF tools, resume building, image optimization, and more. 
            Learn how to get the most out of every free tool.
          </p>
        </div>

        <BannerAd slotId={ADS.blogList} className="mb-8" />

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-500">Blog posts coming soon. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6">
                    {post.category && (
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{post.category.name}</span>
                    )}
                    <h2 className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">{post.title}</h2>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                      <span>{post.author}</span>
                      {post.publishedAt && (
                        <>
                          <span>·</span>
                          <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Looking for a specific tool?
          </p>
          <Link
            href="/tools"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Browse All Tools →
          </Link>
        </div>
      </div>
    </>
  );
}
