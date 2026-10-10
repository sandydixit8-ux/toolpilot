import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolBySlug, allTools, getToolsByCategory } from "@/config/tools";
import { getComparisonBySlug, comparisons } from "@/config/comparisons";
import { categories } from "@/config/categories";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSection } from "@/components/tools/faq-section";
import { RelatedTools } from "@/components/tools/related-tools";
import { RelatedCategories } from "@/components/tools/related-categories";
import { WebAppSchema, ItemListSchema } from "@/components/seo/structured-data";
import { ToolRenderer } from "@/components/tools/tool-renderer";
import { TrustBadges } from "@/components/tools/trust-badges";
import { RelatedArticles } from "@/components/seo/related-articles";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarAd, InArticleAd, BannerAd } from "@/components/ads/ad-banner";
import { ADS } from "@/config/ads";
import { AffiliatePromo } from "@/components/revenue/affiliate-promo";
import { NewsletterCTA } from "@/components/revenue/newsletter-cta";
import { getAffiliatesForCategory } from "@/lib/affiliates";
import { CATEGORY_SEO } from "@/config/category-seo";
import { getProsCons } from "@/config/pros-cons";
import { getSiteUrl } from "@/lib/utils";
import { SITE_LAST_REVIEWED } from "@/lib/constants";
import { CheckCircle, Lock, ArrowRight, XCircle } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const categoryParams = categories.map((c) => ({ slug: c.slug }));
  const toolParams = allTools.map((t) => ({ slug: t.slug }));
  const comparisonParams = comparisons.map((c) => ({ slug: `${c.a}-vs-${c.b}` }));
  return [...categoryParams, ...toolParams, ...comparisonParams];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cmp = getComparisonBySlug(slug);
  if (cmp) {
    const url = `${getSiteUrl()}/tools/${slug}`;
    return {
      title: `${cmp.a.name} vs ${cmp.b.name}: Which is Better? | ToolPilot`,
      description: `Compare ${cmp.a.name} and ${cmp.b.name} — two free online tools. See how they differ on features, ease of use and privacy, then pick the right one.`,
      alternates: { canonical: url },
      openGraph: { title: `${cmp.a.name} vs ${cmp.b.name}`, description: `Compare ${cmp.a.name} vs ${cmp.b.name} free online tools.`, url, type: "website" },
      twitter: { card: "summary_large_image", title: `${cmp.a.name} vs ${cmp.b.name}`, description: `Compare ${cmp.a.name} vs ${cmp.b.name} free online tools.` },
    };
  }
  const cat = categories.find((c) => c.slug === slug);
  if (cat) {
    return {
      title: cat.name,
      description: cat.description,
      alternates: { canonical: `${getSiteUrl()}/tools/${cat.slug}` },
    };
  }
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  const url = `${getSiteUrl()}/tools/${tool.slug}`;
  return {
    title: (tool.seoTitle || tool.name).replace(/ \| ToolPilot$/, ""),
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
    const seo = CATEGORY_SEO[slug];
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: cat.name }]} />
        <ItemListSchema items={tools.map((t) => ({ name: t.name, url: `${getSiteUrl()}/tools/${t.slug}` }))} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{cat.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{cat.description}</p>
        <BannerAd slotId={ADS.toolCategory.banner} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
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
        <InArticleAd slotId={ADS.toolCategory.inArticle} />
        {seo && (
          <>
            <section className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{seo.introTitle}</h2>
              {seo.intro.map((p, i) => (
                <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{p}</p>
              ))}
            </section>
            <section className="mt-10">
              <FAQSection faqs={seo.faqs} title={`${cat.name} — Frequently Asked Questions`} />
            </section>
          </>
        )}
        <AffiliatePromo
          title="Recommended for this category"
          items={getAffiliatesForCategory(slug).map((a) => ({
            name: a.name,
            description: a.description,
            url: a.url,
            ctaText: a.ctaText,
            rating: a.rating,
            badge: a.badge,
          }))}
          tracking={{ source: `/tools/${slug}`, path: `/tools/${slug}` }}
        />
        <RelatedCategories current={slug} />
      </div>
    );
  }

  const tool = getToolBySlug(slug);
  if (!tool) {
    const cmp = getComparisonBySlug(slug);
    if (!cmp) notFound();
    const { a, b } = cmp;
    const catA = categories.find((c) => c.slug === a.categorySlug);
    const catB = categories.find((c) => c.slug === b.categorySlug);
    const prosA = getProsCons(a.slug);
    const prosB = getProsCons(b.slug);
    const privacyOf = (t: typeof a) =>
      t.processingType === "browser"
        ? "Processed locally in your browser — your files never leave your device"
        : "Processed securely on our servers and deleted automatically after use";
    const related = [...new Set([...a.relatedTools, ...b.relatedTools].filter((s) => s !== a.slug && s !== b.slug))].slice(0, 6);
    const faqs = [
      {
        question: `Which is better: ${a.name} or ${b.name}?`,
        answer: `Both are free online tools from ToolPilot, but they solve different problems. Use ${a.name} when you want to ${a.description.charAt(0).toLowerCase() + a.description.slice(1)}. Use ${b.name} when you need to ${b.description.charAt(0).toLowerCase() + b.description.slice(1)}. The right choice depends on your task — both take seconds.`,
      },
      {
        question: `Are ${a.name} and ${b.name} free to use?`,
        answer: `Yes. Both ${a.name} and ${b.name} are 100% free on ToolPilot with no registration, no sign-up and no file limits. You can use them as many times as you need.`,
      },
      {
        question: `Is it safe to use ${a.name} and ${b.name}?`,
        answer: `Yes. ${privacyOf(a)}. ${privacyOf(b)}. ToolPilot does not store or share your files.`,
      },
    ];

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[
          { label: "Tools", href: "/tools" },
          { label: catA?.name || a.category, href: `/tools/${a.categorySlug}` },
          { label: `${a.name} vs ${b.name}` },
        ]} />
        <BannerAd slotId={ADS.toolCategory.banner} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{a.name} vs {b.name} — Which is Better?</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{a.name} and {b.name} are both free online tools on ToolPilot. This quick, side-by-side comparison helps you pick the right one.</p>
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href={`/tools/${a.slug}`} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Open {a.name} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={`/tools/${b.slug}`} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors">
            Open {b.name} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Comparison</h2>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="p-4 text-left font-semibold text-gray-500 dark:text-gray-400 w-1/4">Feature</th>
                    <th className="p-4 text-left font-semibold text-gray-900 dark:text-gray-100">{a.name}</th>
                    <th className="p-4 text-left font-semibold text-gray-900 dark:text-gray-100">{b.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr>
                    <td className="p-4 text-gray-500 dark:text-gray-400">What it does</td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">{a.description}</td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">{b.description}</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-500 dark:text-gray-400">Category</td>
                    <td className="p-4"><Link className="text-blue-600 dark:text-blue-400 hover:underline" href={`/tools/${a.categorySlug}`}>{catA?.name || a.category}</Link></td>
                    <td className="p-4"><Link className="text-blue-600 dark:text-blue-400 hover:underline" href={`/tools/${b.categorySlug}`}>{catB?.name || b.category}</Link></td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-500 dark:text-gray-400">How it processes</td>
                    <td className="p-4 capitalize text-gray-700 dark:text-gray-300">{a.processingType}</td>
                    <td className="p-4 capitalize text-gray-700 dark:text-gray-300">{b.processingType}</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-500 dark:text-gray-400">Privacy</td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">{privacyOf(a)}</td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">{privacyOf(b)}</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-500 dark:text-gray-400">Cost</td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">Free</td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">Free</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How to choose</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Use {a.name} if you want to…</h3>
                <p className="text-gray-600 dark:text-gray-400">{a.description}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Use {b.name} if you want to…</h3>
                <p className="text-gray-600 dark:text-gray-400">{b.description}</p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Pros &amp; Cons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{a.name}</h3>
                {prosA ? (
                  <ul className="space-y-2">
                    {prosA.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> {p}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{a.description}</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{b.name}</h3>
                {prosB ? (
                  <ul className="space-y-2">
                    {prosB.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> {p}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{b.description}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
        <InArticleAd slotId={ADS.toolDetail.inArticle} />
        <FAQSection faqs={faqs} title={`${a.name} vs ${b.name} — FAQs`} />
        {related.length > 0 && (
          <div className="mt-10">
            <RelatedTools tools={related} />
          </div>
        )}
        <RelatedCategories current={a.categorySlug} />
      </div>
    );
  }

  const toolCat = categories.find((c) => c.slug === tool.categorySlug);
  const prosCons = getProsCons(tool.slug);

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
            <TrustBadges />
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
            {prosCons && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Pros &amp; Cons</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Pros</h3>
                    <ul className="space-y-2">
                      {prosCons.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Cons</h3>
                    <ul className="space-y-2">
                      {prosCons.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}
            <InArticleAd slotId={ADS.toolDetail.inArticle} />
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
            <NewsletterCTA />
            <AffiliatePromo
              title="Recommended for you"
              items={getAffiliatesForCategory(tool.categorySlug).map((a) => ({
                name: a.name,
                description: a.description,
                url: a.url,
                ctaText: a.ctaText,
                rating: a.rating,
                badge: a.badge,
              }))}
              tracking={{ source: `/tools/${tool.slug}`, path: `/tools/${tool.slug}` }}
            />
            <RelatedArticles slug={tool.slug} />
          </div>
          <aside className="space-y-6">
            <SidebarAd slotId={ADS.toolDetail.sidebar} />
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
                  <div className="flex justify-between">
                    <dt className="text-gray-500 dark:text-gray-400">Reviewed</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">{SITE_LAST_REVIEWED}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </aside>
        </div>
        {tool.relatedTools.length > 0 && (
          <div className="mt-10">
            <RelatedTools tools={tool.relatedTools} />
          </div>
        )}
      </div>
    </>
  );
}
