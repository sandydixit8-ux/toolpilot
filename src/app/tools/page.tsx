import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { getToolsByCategory } from "@/config/tools";
import { categories } from "@/config/categories";
import { allTools } from "@/config/tools";
import { FileText, Image as ImageIcon, Calculator, Briefcase, Building2, Code2, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "All Tools – Free Online Tools | ToolPilot",
  description: "Browse all free online tools for work, money, career, and everyday life. PDF tools, image tools, calculators, and more.",
  alternates: { canonical: "/tools" },
};

const categoryIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-8 w-8" />,
  image: <ImageIcon className="h-8 w-8" />,
  calculators: <Calculator className="h-8 w-8" />,
  career: <Briefcase className="h-8 w-8" />,
  business: <Building2 className="h-8 w-8" />,
  developer: <Code2 className="h-8 w-8" />,
  ai: <Sparkles className="h-8 w-8" />,
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Tools" }]} />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">All Tools</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Browse {allTools.length}+ free online tools organized by category
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const tools = getToolsByCategory(cat.slug);
          return (
            <Link key={cat.slug} href={`/tools/${cat.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors dark:bg-blue-900/30 dark:text-blue-400 mb-4">
                    {categoryIcons[cat.slug]}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{cat.name}</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{cat.description}</p>
                  <p className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">{tools.length} tools</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tools.slice(0, 4).map((t) => (
                      <span key={t.slug} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-gray-600 dark:text-gray-400">
                        {t.name}
                      </span>
                    ))}
                    {tools.length > 4 && (
                      <span className="text-xs text-gray-400">+{tools.length - 4} more</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
