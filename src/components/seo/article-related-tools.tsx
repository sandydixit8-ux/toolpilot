import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { getToolsForArticle } from "@/lib/tool-links";

export function ArticleRelatedTools({ title }: { title: string }) {
  const tools = getToolsForArticle(title);
  if (!tools.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Related Free Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{tool.name}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{tool.description}</p>
                  </div>
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