import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFeaturedTools, getPopularTools } from "@/config/tools";
import { CATEGORIES } from "@/lib/constants";
import { ArrowRight, Zap, Shield, Smartphone, Star, TrendingUp, Sparkles, FileText, Image as ImageIcon, Calculator, Briefcase, Building2, Code2 } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="h-6 w-6" />,
  image: <ImageIcon className="h-6 w-6" />,
  calculators: <Calculator className="h-6 w-6" />,
  career: <Briefcase className="h-6 w-6" />,
  business: <Building2 className="h-6 w-6" />,
  developer: <Code2 className="h-6 w-6" />,
  ai: <Sparkles className="h-6 w-6" />,
};

export default function HomePage() {
  const featured = getFeaturedTools();
  const popular = getPopularTools();

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
              Free Online Tools for{" "}
              <span className="text-blue-600 dark:text-blue-400">Work, Money, Career & Everyday Life</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Fast, simple and privacy-friendly tools — no complicated software required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="xl" asChild>
                <Link href="/tools">Explore All Tools</Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="#popular">Popular Tools</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: <Zap className="h-5 w-5" />, label: "Lightning Fast", desc: "Instant results" },
            { icon: <Shield className="h-5 w-5" />, label: "Privacy First", desc: "Data stays local" },
            { icon: <Smartphone className="h-5 w-5" />, label: "Works Everywhere", desc: "Mobile & desktop" },
            { icon: <Star className="h-5 w-5" />, label: "Always Free", desc: "No hidden costs" },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Browse by Category</h2>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Find the right tool for your task</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tools">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/tools/${cat.slug}`}>
              <Card className="h-full hover:shadow-md transition-all hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors dark:bg-blue-900/30 dark:text-blue-400">
                      {categoryIcons[cat.slug]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{cat.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{cat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section id="popular" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Popular Tools
            </h2>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Most used tools by our users</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {popular.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">{tool.category}</p>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{tool.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{tool.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          Featured Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800">
                <CardContent className="p-6">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">{tool.category}</p>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{tool.name}</h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{tool.longDescription}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    Try it now <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 dark:text-gray-100">
                  {faq.q}
                  <span className="ml-4 shrink-0 transition-transform group-open:rotate-180">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M4.427 5.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 5H4.604a.25.25 0 00-.177.427z" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Ready to get started?</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Explore 68+ free online tools</p>
        <Button size="xl" className="mt-6" asChild>
          <Link href="/tools">Explore All Tools</Link>
        </Button>
      </section>
    </>
  );
}
