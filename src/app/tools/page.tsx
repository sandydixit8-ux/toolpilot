import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { BannerAd } from "@/components/ads/ad-banner";
import { ADS } from "@/config/ads";
import { getToolsByCategory, searchTools } from "@/config/tools";
import { categories } from "@/config/categories";
import { allTools } from "@/config/tools";
import { SITE_URL } from "@/lib/constants";
import { FileText, Image as ImageIcon, Calculator, Briefcase, Building2, Code2, Sparkles, Languages, Video, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "All Tools – Free Online Tools",
  description: "Browse all free online tools for work, money, career, and everyday life. PDF tools, image tools, calculators, and more.",
  alternates: { canonical: `${SITE_URL}/tools` },
};

const categoryIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-8 w-8" />,
  image: <ImageIcon className="h-8 w-8" />,
  calculators: <Calculator className="h-8 w-8" />,
  career: <Briefcase className="h-8 w-8" />,
  business: <Building2 className="h-8 w-8" />,
  developer: <Code2 className="h-8 w-8" />,
  ai: <Sparkles className="h-8 w-8" />,
  translation: <Languages className="h-8 w-8" />,
  video: <Video className="h-8 w-8" />,
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function ToolsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? searchTools(query) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Tools" }]} />
      {query ? (
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Search results for &quot;{query}&quot;
        </h1>
      ) : (
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">All Tools</h1>
      )}
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {query
          ? `${results.length} tool${results.length === 1 ? "" : "s"} found`
          : `Browse ${allTools.length}+ free online tools organized by category`}
      </p>

      <BannerAd slotId={ADS.toolsList} className="mb-8" />

      {query ? (
        results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5">
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">{tool.name}</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{tool.description}</p>
                    <span className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                      Use tool <ArrowRight className="ml-1 h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No tools found for &quot;{query}&quot;. Try a different search term.
            </p>
            <Link href="/tools" className="mt-3 inline-block text-sm font-medium text-blue-600 dark:text-blue-400">
              Clear search & browse all categories
            </Link>
          </div>
        )
      ) : (
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
      )}
    </div>
  );
}