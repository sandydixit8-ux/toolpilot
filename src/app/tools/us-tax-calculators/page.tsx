import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSection } from "@/components/tools/faq-section";
import { QuickAnswer } from "@/components/seo/quick-answer";
import { HowToSchema, ItemListSchema } from "@/components/seo/structured-data";
import { Card, CardContent } from "@/components/ui/card";
import { getToolBySlug } from "@/config/tools";
import { SITE_URL, SITE_LAST_REVIEWED } from "@/lib/constants";
import { ArrowRight, CheckCircle } from "lucide-react";

const SLUGS = [
  "us-income-tax-calculator",
  "us-self-employment-tax-calculator",
  "us-paycheck-calculator",
];

export const metadata: Metadata = {
  title: "Free US Tax Calculators 2025 - Income, Paycheck & Self-Employment Tax",
  description:
    "Free US tax calculators for 2025. Estimate federal income tax, self-employment tax and take-home pay with the latest brackets and FICA rules. No signup.",
  keywords: [
    "us tax calculator",
    "2025 tax calculator",
    "federal income tax calculator",
    "paycheck calculator 2025",
    "self employment tax calculator",
    "take home pay calculator usa",
  ],
  alternates: { canonical: `${SITE_URL}/tools/us-tax-calculators` },
  openGraph: {
    title: "Free US Tax Calculators 2025",
    description: "Estimate 2025 federal income tax, self-employment tax and take-home pay.",
    url: `${SITE_URL}/tools/us-tax-calculators`,
    type: "website",
    locale: "en_US",
  },
};

const FAQS = [
  {
    question: "What tax year do these US tax calculators use?",
    answer:
      "They use the 2025 federal tax brackets and the 2025 standard deduction ($15,000 for single filers, $30,000 for married filing jointly). Every rate, bracket and threshold is editable, so you can model a different year or a custom scenario.",
  },
  {
    question: "Do these calculators include state tax?",
    answer:
      "The income tax and self-employment tax calculators cover federal tax only. The paycheck calculator lets you enter a flat state income tax rate, so it works for any state as an estimate. For an exact state figure, use your state's own progressive brackets.",
  },
  {
    question: "Are the US tax calculators free?",
    answer:
      "Yes. Every US tax calculator on ToolPilot is completely free with no signup, no watermark and no limits. All calculations run in your browser, so your income figures never leave your device.",
  },
  {
    question: "How much is self-employment tax in 2025?",
    answer:
      "Self-employment tax is 15.3% on 92.35% of your net profit, made up of 12.4% Social Security up to the annual wage base and 2.9% Medicare, plus an extra 0.9% Medicare tax on income above $200,000. Half of the tax is deductible on your return.",
  },
  {
    question: "What is the difference between effective and marginal tax rate?",
    answer:
      "Your marginal rate is the tax rate on your last dollar of income, which is your top bracket. Your effective rate is your total federal tax divided by your gross income, and it is always lower because only income above each threshold is taxed at the higher rate.",
  },
];

export default function UsTaxHubPage() {
  const tools = SLUGS.map((s) => getToolBySlug(s)).filter(Boolean);

  return (
    <>
      <ItemListSchema
        items={tools.map((t) => ({ name: t!.name, url: `${SITE_URL}/tools/${t!.slug}` }))}
      />
      <HowToSchema
        name="US tax calculators"
        description="Estimate your 2025 US federal income tax, self-employment tax and take-home pay."
        steps={[
          "Pick the calculator for your situation: income tax, self-employment tax, or paycheck.",
          "Enter your gross income, filing status and any state tax.",
          "Review your taxable income, total tax, effective rate and net pay.",
          "Edit brackets and deductions to model a raise, bonus or different year.",
        ]}
        url={`${SITE_URL}/tools/us-tax-calculators`}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "US Tax Calculators" }]} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Free US Tax Calculators (2025)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Estimate your federal income tax, self-employment tax and take-home pay for the 2025 tax
          year. Every calculator applies the official 2025 brackets and FICA rules, runs instantly
          in your browser, and needs no signup.
        </p>

        <QuickAnswer
          question="What are the best free US tax calculators?"
          answer="ToolPilot offers three free US tax calculators for 2025: the US Income Tax Calculator estimates federal tax from your income and filing status, the Self-Employment Tax Calculator works out Social Security and Medicare on freelance profit, and the Paycheck Calculator shows take-home pay after federal, FICA and state tax. All run in your browser with no signup."
          lastReviewed={SITE_LAST_REVIEWED}
        />

        <section className="mt-8 grid gap-4 sm:grid-cols-1">
          {tools.map((t) => (
            <Card key={t!.slug}>
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  <Link href={`/tools/${t!.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                    {t!.name}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t!.description}</p>
                <Link
                  href={`/tools/${t!.slug}`}
                  className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400"
                >
                  Use the calculator <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            How US federal income tax works in 2025
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            The United States uses a progressive tax system: your income is split into bands, and
            each band is taxed at its own rate. You do not pay your top rate on all your income. For
            2025 the seven federal brackets run from 10% up to 37%, and the standard deduction
            ($15,000 single, $30,000 married filing jointly) is subtracted before the brackets are
            applied. Your <strong>marginal rate</strong> is the rate on your last dollar; your{" "}
            <strong>effective rate</strong> is your total tax divided by gross income, which is
            always lower.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Payroll taxes (FICA) are separate. Employees pay 6.2% Social Security up to the annual
            wage base and 1.45% Medicare, plus an extra 0.9% Medicare above $200,000. If you are
            self-employed, you pay both halves, which is why the self-employment tax rate is 15.3%.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Which calculator should you use?
          </h2>
          <ul className="space-y-2">
            {[
              "Salaried employee filing a return: use the US Income Tax Calculator for your federal tax.",
              "Freelancer or 1099 contractor: use the US Self-Employment Tax Calculator for Social Security and Medicare.",
              "Budgeting or comparing offers: use the US Paycheck Calculator for take-home pay per period.",
            ].map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> {line}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <FAQSection faqs={FAQS} title="US Tax Calculators - FAQs" />
        </div>
      </div>
    </>
  );
}
