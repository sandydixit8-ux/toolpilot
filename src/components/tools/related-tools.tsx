import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { ToolConfig } from "@/types/tool";
import { allTools } from "@/config/tools";
import { ArrowRight } from "lucide-react";

export function RelatedTools({ tools }: { tools: string[] }) {
  const allRelated = tools
    .map((slug) => allTools.find((t: ToolConfig) => t.slug === slug))
    .filter(Boolean) as ToolConfig[];

  if (!allRelated.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allRelated.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{tool.name}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{tool.description}</p>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  Use tool <ArrowRight className="ml-1 h-3 w-3" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
