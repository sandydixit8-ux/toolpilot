import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog – Tips, Guides & Tutorials | ToolPilot",
  description: "Read tips, guides, and tutorials for using ToolPilot's free online tools. Learn how to boost your productivity with PDF, image, and career tools.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Blog</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Tips, guides, and tutorials for using our tools.</p>

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
    </div>
  );
}
