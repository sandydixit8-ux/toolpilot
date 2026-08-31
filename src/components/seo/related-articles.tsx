import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { getRelatedArticles } from "@/lib/blog-links";

export function RelatedArticles({ slug }: { slug: string }) {
  const articles = getRelatedArticles(slug);
  if (!articles.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Related Articles</h2>
      <div className="space-y-3">
        {articles.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{article.title}</p>
                  <ArrowRight className="h-4 w-4 text-blue-600 shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}