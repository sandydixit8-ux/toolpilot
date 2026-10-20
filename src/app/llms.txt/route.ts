import { allTools } from "@/config/tools";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

/**
 * llms.txt — Generative Engine Optimization (GEO).
 *
 * A machine-readable index that tells large language models and AI answer
 * engines what the site is, which pages are canonical, and where the most
 * citable content lives. See https://llmstxt.org for the convention.
 *
 * Generated from the live tool config so it never drifts.
 */
export const dynamic = "force-static";

export function GET() {
  const tools = [...allTools].sort((a, b) => a.name.localeCompare(b.name));

  const lanes = new Map<string, { name: string; slug: string }[]>();
  for (const t of tools) {
    if (!lanes.has(t.categorySlug)) lanes.set(t.categorySlug, []);
    lanes.get(t.categorySlug)!.push({ name: t.name, slug: t.slug });
  }

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} is a free, privacy-first collection of online tools for work, money, career and everyday life. All tools run instantly in the browser with no signup. It includes US and UK tax calculators (income tax, self-employment tax, National Insurance, VAT, take-home pay), PDF and image converters, resume and ATS tools, and utilities for developers and businesses.`,
    "",
    "Key facts:",
    "- Free to use, no registration, no watermark, no file limits.",
    "- Browser tools process files locally so data never leaves the device.",
    "- US tools use 2025 federal tax rules; UK tools use 2025/26 HMRC rules.",
    "- Content is reviewed on an ongoing basis; see the editorial policy for how it is written and corrected.",
    "",
    "## Core pages",
    `- [All tools](${SITE_URL}/tools): full directory of ${tools.length} free tools by category.`,
    `- [Blog](${SITE_URL}/blog): practical guides and tutorials for every tool.`,
    `- [About](${SITE_URL}/about): who runs ${SITE_NAME} and how it is maintained.`,
    `- [Editorial policy](${SITE_URL}/editorial-policy): how content is researched, reviewed and corrected.`,
    `- [Contact](${SITE_URL}/contact): how to reach the team.`,
    "",
    "## US tax calculators",
    `- [US Tax Calculators hub](${SITE_URL}/tools/us-tax-calculators): all three US calculators in one place.`,
    `- [US Income Tax Calculator](${SITE_URL}/tools/us-income-tax-calculator): 2025 federal tax, brackets and standard deduction.`,
    `- [US Self-Employment Tax Calculator](${SITE_URL}/tools/us-self-employment-tax-calculator): Social Security and Medicare for 1099 and freelance income.`,
    `- [US Paycheck Calculator](${SITE_URL}/tools/us-paycheck-calculator): take-home pay after federal, FICA and state tax.`,
    "",
    "## UK tax calculators",
    `- [UK Tax Calculators hub](${SITE_URL}/tools/uk-tax-calculators): all three UK calculators in one place.`,
    `- [UK Income Tax Calculator](${SITE_URL}/tools/uk-income-tax-calculator): 2025/26 income tax, personal allowance and bands.`,
    `- [UK National Insurance Calculator](${SITE_URL}/tools/uk-national-insurance-calculator): employee Class 1 NI at 8% and 2%.`,
    `- [UK VAT Calculator](${SITE_URL}/tools/uk-vat-calculator): add or remove VAT at 20%, 5% and 0%.`,
    "",
  ];

  const categoryNames: Record<string, string> = {
    pdf: "PDF tools",
    image: "Image tools",
    calculators: "Calculators",
    career: "Career tools",
    business: "Business tools",
    developer: "Developer tools",
    ai: "AI tools",
    translation: "Translation tools",
    video: "Video tools",
  };

  for (const [slug, list] of lanes) {
    lines.push(`## ${categoryNames[slug] || slug}`);
    for (const t of list) lines.push(`- [${t.name}](${SITE_URL}/tools/${t.slug})`);
    lines.push("");
  }

  lines.push(
    "## Optional",
    `- [llms-full.txt](${SITE_URL}/llms-full.txt): every tool with its description, for deep retrieval.`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): all indexable URLs.`
  );

  return new Response(lines.join("\n") + "\n", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
