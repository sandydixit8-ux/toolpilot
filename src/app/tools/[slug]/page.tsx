import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolBySlug, allTools, getToolsByCategory } from "@/config/tools";
import { categories } from "@/config/categories";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSection } from "@/components/tools/faq-section";
import { RelatedTools } from "@/components/tools/related-tools";
import { WebAppSchema } from "@/components/seo/structured-data";
import { ToolRenderer } from "@/components/tools/tool-renderer";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarAd, InArticleAd } from "@/components/ads/ad-banner";
import { getSiteUrl } from "@/lib/utils";
import { CheckCircle, Lock, ArrowRight } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categoryParams = categories.map((c) => ({ slug: c.slug }));
  const toolParams = allTools.map((t) => ({ slug: t.slug }));
  return [...categoryParams, ...toolParams];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (cat) {
    return {
      title: cat.name,
      description: cat.description,
    };
  }
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  const url = `${getSiteUrl()}/tools/${tool.slug}`;
  return {
    title: tool.name,
    description: tool.seoDescription,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: { title: tool.name, description: tool.seoDescription, url, type: "website" },
    twitter: { card: "summary_large_image", title: tool.name, description: tool.seoDescription },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  const cat = categories.find((c) => c.slug === slug);
  if (cat) {
    const tools = getToolsByCategory(slug);
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: cat.name }]} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{cat.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{cat.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{tool.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{tool.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    {tool.popular && (
                      <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">Popular</span>
                    )}
                    {tool.featured && (
                      <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded-full">Featured</span>
                    )}
                  </div>
                  <span className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    Use tool <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const toolCat = categories.find((c) => c.slug === tool.categorySlug);

  return (
    <>
      <WebAppSchema name={tool.name} description={tool.description} url={`${getSiteUrl()}/tools/${tool.slug}`} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[
          { label: "Tools", href: "/tools" },
          { label: toolCat?.name || tool.category, href: `/tools/${tool.categorySlug}` },
          { label: tool.name },
        ]} />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tool.name}</h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">{tool.description}</p>
            </div>
            <ToolRenderer slug={tool.slug} />
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">About this tool</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{tool.longDescription}</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How to use</h2>
              <ol className="space-y-3">
                {tool.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold dark:bg-blue-900/30 dark:text-blue-400">{i + 1}</span>
                    <span className="text-gray-600 dark:text-gray-400 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
            <InArticleAd slotId="0000000002" />
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Features</h2>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" /> 100% free to use
                </li>
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" /> No registration required
                </li>
                {tool.processingType === "browser" && (
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Lock className="h-4 w-4 text-blue-500 shrink-0" /> Processes locally in your browser
                  </li>
                )}
                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" /> Works on all devices
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Privacy</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {tool.processingType === "browser"
                  ? "Your data is processed entirely in your browser and never sent to our servers. We have no access to your files or data."
                  : "Files are processed securely and automatically deleted after processing. We do not store or share your data."}
              </p>
            </section>
            {tool.faqs.length > 0 && <FAQSection faqs={tool.faqs} />}
          </div>
          <aside className="space-y-6">
            <SidebarAd slotId="0000000003" />
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Info</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Category</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{tool.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Processing</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100 capitalize">{tool.processingType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Price</dt>
                    <dd className="font-medium text-green-600">Free</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            {tool.relatedTools.length > 0 && (
              <div className="hidden lg:block">
                <RelatedTools tools={tool.relatedTools} />
              </div>
            )}
          </aside>
        </div>
        {tool.relatedTools.length > 0 && (
          <div className="mt-8 lg:hidden">
            <RelatedTools tools={tool.relatedTools} />
          </div>
        )}
      </div>
    </>
  );
}
