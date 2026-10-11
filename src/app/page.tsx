import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { BannerAd, InArticleAd } from "@/components/ads/ad-banner";
import { AffiliatePromo } from "@/components/revenue/affiliate-promo";
import { getGeneralAffiliates } from "@/lib/affiliates";
import { ADS } from "@/config/ads";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { CategoryGrid } from "@/components/home/category-grid";
import { PopularGrid } from "@/components/home/popular-grid";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { FinalCta } from "@/components/home/final-cta";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
  title: `${SITE_NAME} – Free Online Tools for Work, Money, Career & Everyday Life`,
  description:
    "91+ free online tools — PDF converters and compressors, image resizers, income tax and EMI calculators, resume and ATS checkers, and more. Free, no signup, no install.",
};

export const revalidate = 900;

export default async function HomePage() {
  let latestPosts: { slug: string; title: string; excerpt: string | null; category: { name: string } | null }[] = [];
  try {
    latestPosts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED", publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      take: 4,
      select: { slug: true, title: true, excerpt: true, category: { select: { name: true } } },
    });
  } catch {
    latestPosts = [];
  }

  const faqs = [
    { q: "Are all tools really free?", a: "Yes, all our tools are completely free to use. No hidden charges or premium plans required." },
    { q: "Do I need to create an account?", a: "No, most tools work without registration. You can use them instantly." },
    { q: "Is my data safe?", a: "Yes, we prioritize privacy. Browser-based tools process data locally — it never leaves your device." },
    { q: "Can I use these tools on mobile?", a: "Absolutely. All tools are fully responsive and work great on phones, tablets, and desktops." },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <Hero />
      <TrustBar />

      <BannerAd slotId={ADS.home.topBanner} />

      <CategoryGrid />

      <PopularGrid />

      <InArticleAd slotId={ADS.home.midArticle} />

      <FeaturedGrid />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">Frequently Asked Questions</h2>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-border bg-card p-5 transition-colors open:border-blue-500/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground">
                {faq.q}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-180">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                    <path d="M4.427 5.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 5H4.604a.25.25 0 00-.177.427z" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Latest from the Blog</h2>
            <p className="mt-1 text-muted-foreground">Guides and tips for getting more done with free tools</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog" className="gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latestPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="card-morph h-full cursor-pointer">
                  <CardContent className="p-5">
                    {post.category?.name && (
                      <p className="mb-2 text-xs font-medium text-blue-400">{post.category.name}</p>
                    )}
                    <h3 className="line-clamp-2 font-semibold text-foreground">{post.title}</h3>
                    {post.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">New guides are on the way.</p>
        )}
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AffiliatePromo
          title="Free tools we use every day"
          items={getGeneralAffiliates().map((a) => ({
            name: a.name,
            description: a.description,
            url: a.url,
            ctaText: a.ctaText,
            rating: a.rating,
            badge: a.badge,
          }))}
        />
      </div>

      <BannerAd slotId={ADS.home.bottomBanner} />

      <FinalCta />
    </>
  );
}