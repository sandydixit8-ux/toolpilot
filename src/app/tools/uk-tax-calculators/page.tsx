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
  "uk-income-tax-calculator",
  "uk-national-insurance-calculator",
  "uk-vat-calculator",
];

export const metadata: Metadata = {
  title: "Free UK Tax Calculators 2025/26 - Income Tax, NI & VAT",
  description:
    "Free UK tax calculators for 2025/26. Estimate income tax, employee National Insurance and VAT with the latest UK rates and the personal allowance. No signup.",
  keywords: [
    "uk tax calculator",
    "income tax calculator 2025/26",
    "national insurance calculator",
    "uk vat calculator",
    "take home pay calculator uk",
    "hmrc tax calculator",
  ],
  alternates: { canonical: `${SITE_URL}/tools/uk-tax-calculators` },
  openGraph: {
    title: "Free UK Tax Calculators 2025/26",
    description: "Estimate 2025/26 UK income tax, National Insurance and VAT instantly.",
    url: `${SITE_URL}/tools/uk-tax-calculators`,
    type: "website",
    locale: "en_GB",
  },
};

const FAQS = [
  {
    question: "What is the personal allowance for 2025/26?",
    answer:
      "The standard UK personal allowance for 2025/26 is £12,570, so you pay no income tax on income up to that amount. It is reduced by £1 for every £2 of income above £100,000 and disappears entirely at £125,140.",
  },
  {
    question: "What are the 2025/26 UK income tax bands?",
    answer:
      "For England, Wales and Northern Ireland you pay 20% basic rate on taxable income up to £37,700, 40% higher rate from £37,701 to £125,140, and 45% additional rate above £125,140. Scotland uses different bands and rates.",
  },
  {
    question: "How much National Insurance do employees pay in 2025/26?",
    answer:
      "Employees pay 8% Class 1 National Insurance on earnings between the primary threshold of £12,570 and the upper earnings limit of £50,270, then 2% on everything above £50,270. Employer NI is separate.",
  },
  {
    question: "What is the UK standard VAT rate?",
    answer:
      "The UK standard VAT rate is 20%. A reduced rate of 5% applies to some goods and services, and a zero rate of 0% applies to others such as most food and children's clothing. These rates apply across the United Kingdom.",
  },
  {
    question: "Are these UK tax calculators free and private?",
    answer:
      "Yes. All UK tax calculators on ToolPilot are free, need no signup, and run entirely in your browser. Your salary and financial figures never leave your device. Results are planning estimates, not tax advice.",
  },
];

export default function UkTaxHubPage() {
  const tools = SLUGS.map((s) => getToolBySlug(s)).filter(Boolean);

  return (
    <>
      <ItemListSchema
        items={tools.map((t) => ({ name: t!.name, url: `${SITE_URL}/tools/${t!.slug}` }))}
      />
      <HowToSchema
        name="UK tax calculators"
        description="Estimate your 2025/26 UK income tax, employee National Insurance and VAT."
        steps={[
          "Pick the calculator you need: income tax, National Insurance, or VAT.",
          "Enter your annual gross income, or the net or gross amount for VAT.",
          "Review your taxable income, tax, NI, net pay or VAT breakdown.",
          "Adjust the allowance, thresholds or rates to model other scenarios.",
        ]}
        url={`${SITE_URL}/tools/uk-tax-calculators`}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "UK Tax Calculators" }]} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Free UK Tax Calculators (2025/26)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Estimate your income tax, employee National Insurance and VAT for the 2025/26 tax year.
          Each calculator applies the current HMRC thresholds and rates, runs instantly in your
          browser, and requires no signup.
        </p>

        <QuickAnswer
          question="What are the best free UK tax calculators?"
          answer="ToolPilot offers three free UK tax calculators for 2025/26: the UK Income Tax Calculator applies the £12,570 personal allowance and 20/40/45% bands, the National Insurance Calculator charges 8% and 2% Class 1 NI, and the VAT Calculator adds or removes 20%, 5% or 0% VAT. All run in your browser with no signup."
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
            How UK income tax and National Insurance work in 2025/26
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
            The UK taxes income progressively. Everyone gets a personal allowance of £12,570, which
            is tax-free, and above that the basic rate is 20%, the higher rate 40% and the additional
            rate 45% (England, Wales and Northern Ireland). Earn over £100,000 and the allowance
            tapers away, so your effective rate rises faster across that range.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            National Insurance is separate from income tax. As an employee you pay 8% on earnings
            between £12,570 and £50,270 and 2% above that. VAT is a consumption tax charged at 20%
            standard, 5% reduced or 0% on many goods and services.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Which calculator should you use?
          </h2>
          <ul className="space-y-2">
            {[
              "Working out your tax bill: use the UK Income Tax Calculator for income tax by band.",
              "Checking your payslip deduction: use the National Insurance Calculator for Class 1 NI.",
              "Invoicing or quoting: use the VAT Calculator to add or remove VAT at 20%, 5% or 0%.",
            ].map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> {line}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <FAQSection faqs={FAQS} title="UK Tax Calculators - FAQs" />
        </div>
      </div>
    </>
  );
}
