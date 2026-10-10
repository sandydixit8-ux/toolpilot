import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/config/categories";
import { getToolsByCategory } from "@/config/tools";
import { ArrowRight } from "lucide-react";

export function RelatedCategories({ current }: { current: string }) {
  const others = categories.filter((c) => c.slug !== current);

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Explore More Tool Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {others.map((cat) => {
          const count = getToolsByCategory(cat.slug).length;
          return (
            <Link key={cat.slug} href={`/tools/${cat.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{cat.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2 py-0.5 rounded-full">
                      {count} tools
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{cat.description}</p>
                  <span className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    Explore <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}