/**
 * US + UK tax pillar posts.
 *
 * The site has US/UK tax calculators and hub pages but no supporting blog
 * content, so these high-intent keywords have nothing to rank. This seeds
 * three pillar posts that:
 *   - target the exact US/UK tax queries people search,
 *   - link to the calculators and hubs (internal linking for crawl + UX),
 *   - carry FAQ schema for answer-engine / featured-snippet capture,
 *   - use 2025 (US) and 2025/26 (UK) official figures.
 *
 * Content rules: markdown subset rendered by src/lib/blog-renderer.ts; avoid
 * the rupee symbol, em-dashes and degree signs (use ASCII); FAQs live in the
 * FAQ table, not the body.
 *
 * Idempotent: updates the post and replaces its FAQs if it already exists.
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const AUTHOR = "Sandy Dixit";
const GUIDES_CATEGORY = "cmt2ndqx70040uffsia1zwfkd";

interface Pillar {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
  faqs: { question: string; answer: string }[];
}

const pillars: Pillar[] = [
  {
    title: "US Income Tax Calculator 2025: Brackets, Rates and How to Estimate Your Tax",
    slug: "us-income-tax-calculator-guide-2025",
    excerpt:
      "Estimate your 2025 US federal income tax in seconds. Learn the 2025 brackets, the standard deduction, and the difference between your effective and marginal rate.",
    seoTitle: "US Income Tax Calculator 2025: Brackets, Rates & Free Estimator",
    seoDescription:
      "Free US income tax calculator for 2025. See the federal tax brackets, standard deduction, and how to estimate your tax, effective rate and marginal rate.",
    content: `US federal income tax is progressive: your income is divided into brackets and each bracket is taxed at its own rate. That means you never pay your top rate on all of your income, only on the portion that falls into the highest band you reach.

## The 2025 Federal Tax Brackets

For the 2025 tax year the seven federal brackets are 10%, 12%, 22%, 24%, 32%, 35% and 37%. The exact income range for each bracket depends on your filing status.

| Rate | Single (taxable income) | Married filing jointly |
|------|-------------------------|------------------------|
| 10% | Up to $11,925 | Up to $23,850 |
| 12% | $11,926 - $48,475 | $23,851 - $96,950 |
| 22% | $48,476 - $103,350 | $96,951 - $206,700 |
| 24% | $103,351 - $197,300 | $206,701 - $394,600 |
| 32% | $197,301 - $250,525 | $394,601 - $501,050 |
| 35% | $250,526 - $626,350 | $501,051 - $751,600 |
| 37% | Over $626,350 | Over $751,600 |

These ranges apply to taxable income, which is your gross income minus deductions.

## The Standard Deduction Comes First

Before the brackets apply, you subtract your deduction. Most people take the standard deduction, which for 2025 is $15,000 for single filers and $30,000 for married filing jointly.

Example: earn $70,000 as a single filer. Subtract the $15,000 standard deduction and your taxable income is $55,000. Only that $55,000 is taxed by the brackets.

## Marginal vs Effective Rate

Your marginal rate is the rate on your last dollar of income, which is your top bracket. Your effective rate is your total federal tax divided by your gross income.

Because only income above each threshold is taxed at the higher rate, your effective rate is always lower than your marginal rate. A single filer earning $70,000 has a 22% marginal rate but an effective rate closer to 12%.

## Estimate Your Own Tax

Doing this by hand is slow, so use the free [US Income Tax Calculator](/tools/us-income-tax-calculator). Enter your gross income, pick your filing status, and it applies the 2025 brackets and standard deduction instantly. It shows:

- Taxable income after the standard deduction
- Total federal income tax
- Your effective rate and marginal rate
- A band-by-band breakdown of how much tax each slice of income attracts

Every bracket and threshold is editable, so you can model a raise, a bonus, or a different deduction and see the tax change in real time.

## What This Calculator Does Not Include

This tool estimates federal income tax only. It does not include:

- State income tax, which varies by state
- FICA payroll taxes (Social Security and Medicare)
- Credits such as the Child Tax Credit or Earned Income Tax Credit

If you are self-employed, your Social Security and Medicare tax is higher. Use the [Self-Employment Tax Calculator](/tools/us-self-employment-tax-calculator) for that. To see your actual take-home pay after all deductions, use the [US Paycheck Calculator](/tools/us-paycheck-calculator).

## See All US Tax Tools

The [US Tax Calculators hub](/tools/us-tax-calculators) groups all three together: income tax, self-employment tax, and take-home pay. Start there if you are not sure which one you need.`,
    faqs: [
      {
        question: "What tax year does the US income tax calculator use?",
        answer:
          "It uses the 2025 federal tax brackets and the 2025 standard deduction of $15,000 for single filers and $30,000 for married filing jointly. Every figure is editable so you can model another year.",
      },
      {
        question: "What is the difference between marginal and effective tax rate?",
        answer:
          "Your marginal rate is the tax on your last dollar of income, which is your top bracket. Your effective rate is your total federal tax divided by your gross income, and it is always lower because only income above each threshold is taxed at the higher rate.",
      },
      {
        question: "Does this include state tax or FICA?",
        answer:
          "No. It estimates federal income tax only. State income tax and payroll taxes like Social Security and Medicare are separate. Use the paycheck calculator for a take-home figure.",
      },
      {
        question: "Are the 2025 tax brackets the same for everyone?",
        answer:
          "The rates are the same, but the income ranges depend on your filing status. Single and married filing jointly have different thresholds, so always choose the correct status.",
      },
    ],
  },
  {
    title: "Self-Employment Tax 2025: How Much Freelancers Owe and How to Calculate It",
    slug: "self-employment-tax-calculator-guide-2025",
    excerpt:
      "Freelancers and 1099 contractors pay both halves of Social Security and Medicare. Learn why self-employment tax is 15.3% and how to estimate yours.",
    seoTitle: "Self-Employment Tax 2025: Rate, Calculation & Free Calculator",
    seoDescription:
      "Learn how self-employment tax works in 2025. Understand the 15.3% rate, the 92.35% rule, and the deductible half, then estimate your tax free online.",
    content: `If you are self-employed, a freelancer, or an independent contractor, you pay Social Security and Medicare tax yourself, and it is higher than what a regular employee pays. This is called self-employment tax.

## Why Self-Employment Tax Is 15.3%

Employees split payroll tax with their employer: the employee pays 6.2% for Social Security and 1.45% for Medicare, and the employer matches it. When you are self-employed you are both the employee and the employer, so you pay both halves:

- Social Security: 12.4%
- Medicare: 2.9%
- Combined: 15.3%

An extra 0.9% Medicare tax applies to income above $200,000 for single filers.

## The 92.35% Rule

You do not pay self-employment tax on all of your profit. The IRS treats 7.65% of your net earnings as the employer's share and excludes it, so only 92.35% of your net profit is taxed.

Example: net profit of $80,000. The taxable amount is 80,000 x 0.9235 = $73,880. Multiply by 15.3% and your self-employment tax is about $11,304.

## Social Security Has a Wage Base

The 12.4% Social Security portion only applies up to an annual wage base (for 2025 it is $176,100). Earnings above that are not subject to the Social Security part, but the 2.9% Medicare part continues with no limit.

## You Can Deduct Half

You can deduct half of your self-employment tax as an adjustment to income on your return. This lowers your taxable income, and therefore your income tax, which softens the total bill.

## Estimate It in Seconds

Use the free [Self-Employment Tax Calculator](/tools/us-self-employment-tax-calculator). Enter your net self-employment profit and it shows:

- The taxable share of your profit (92.35%)
- The Social Security and Medicare portions separately
- The 0.9% extra Medicare tax above $200,000 if applicable
- The deductible half you can claim

## Self-Employment Tax vs Income Tax

These are two different taxes and you generally owe both. Self-employment tax funds Social Security and Medicare, while income tax is calculated separately on your taxable income. Estimate your income tax with the [US Income Tax Calculator](/tools/us-income-tax-calculator), and see your total take-home with the [US Paycheck Calculator](/tools/us-paycheck-calculator).

## All US Tax Tools in One Place

The [US Tax Calculators hub](/tools/us-tax-calculators) collects the income tax, self-employment tax and paycheck calculators so you can plan your full tax picture.`,
    faqs: [
      {
        question: "Why is self-employment tax 15.3%?",
        answer:
          "Employees split Social Security (12.4%) and Medicare (2.9%) with their employer. Self-employed people pay both halves, so the combined rate is 15.3% on the taxable portion of their profit.",
      },
      {
        question: "Why is only 92.35% of my profit taxed?",
        answer:
          "The IRS treats 7.65% of your net earnings as equivalent to the employer's share, so it is not subject to self-employment tax. Only the remaining 92.35% is taxed.",
      },
      {
        question: "Is self-employment tax the same as income tax?",
        answer:
          "No. Self-employment tax funds Social Security and Medicare, while income tax is calculated separately on your taxable income. You generally owe both.",
      },
      {
        question: "Can I deduct part of my self-employment tax?",
        answer:
          "Yes. You can deduct half of your self-employment tax as an adjustment to income on your return, which reduces your taxable income.",
      },
    ],
  },
  {
    title: "UK Income Tax 2025/26: Personal Allowance, Bands and Take-Home Pay Explained",
    slug: "uk-income-tax-calculator-guide-2025-26",
    excerpt:
      "How UK income tax works in 2025/26: the personal allowance, the 20/40/45% bands, the £100,000 taper, and how to estimate your net pay.",
    seoTitle: "UK Income Tax 2025/26: Personal Allowance, Bands & Free Calculator",
    seoDescription:
      "Understand UK income tax for 2025/26. Learn the personal allowance, the 20%, 40% and 45% bands, the £100,000 taper, and estimate your tax free.",
    content: `UK income tax is progressive, with a tax-free personal allowance followed by three main rates. Here is how it works for the 2025/26 tax year for England, Wales and Northern Ireland.

## The Personal Allowance

Everyone gets a personal allowance of £12,570, which is tax-free. You only pay income tax on earnings above this amount.

However, if you earn over £100,000 the allowance tapers away. It drops by £1 for every £2 you earn above £100,000, and it disappears completely at £125,140. This creates a high effective tax rate between those two figures.

## The 2025/26 Tax Bands

| Band | Taxable income | Rate |
|------|----------------|------|
| Basic rate | Up to £37,700 | 20% |
| Higher rate | £37,701 to £125,140 | 40% |
| Additional rate | Over £125,140 | 45% |

These thresholds are based on taxable income, which is your gross income minus the personal allowance.

Example: earn £55,000. Subtract the £12,570 allowance and your taxable income is £42,430. The first £37,700 is taxed at 20% and the remaining £4,730 at 40%.

## Scotland Is Different

Scotland has its own income tax bands and rates, including a starter rate and an intermediate rate. This guide and the calculator use the rates for England, Wales and Northern Ireland.

## What About National Insurance?

Income tax and National Insurance are separate. As an employee you pay 8% National Insurance on earnings between £12,570 and £50,270, and 2% on everything above that. Estimate it with the [UK National Insurance Calculator](/tools/uk-national-insurance-calculator).

## Estimate Your UK Income Tax

Use the free [UK Income Tax Calculator](/tools/uk-income-tax-calculator). Enter your annual salary and it applies the personal allowance, the taper and the bands to show:

- Your taxable income
- Total income tax
- Your effective and marginal rate
- A band-by-band breakdown of tax per slice of income

## All UK Tax Tools in One Place

The [UK Tax Calculators hub](/tools/uk-tax-calculators) collects the income tax, National Insurance and VAT calculators together so you can work out your full position. If you are invoicing, use the [UK VAT Calculator](/tools/uk-vat-calculator) to add or remove VAT at 20%.`,
    faqs: [
      {
        question: "What is the personal allowance for 2025/26?",
        answer:
          "The standard UK personal allowance is £12,570, so you pay no income tax on income up to that amount. It reduces by £1 for every £2 earned above £100,000 and disappears at £125,140.",
      },
      {
        question: "What are the UK income tax bands for 2025/26?",
        answer:
          "For England, Wales and Northern Ireland the basic rate is 20% on taxable income up to £37,700, the higher rate is 40% up to £125,140, and the additional rate is 45% above that.",
      },
      {
        question: "Does this include National Insurance?",
        answer:
          "No. Income tax and National Insurance are separate. Use the National Insurance calculator to add your employee Class 1 contribution.",
      },
      {
        question: "Does UK income tax work the same in Scotland?",
        answer:
          "No. Scotland has different income tax bands and rates. This guide uses the rates for England, Wales and Northern Ireland.",
      },
    ],
  },
];

async function run() {
  for (const p of pillars) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
    const data = {
      title: p.title,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      excerpt: p.excerpt,
      content: p.content,
      author: AUTHOR,
      status: "PUBLISHED" as const,
      categoryId: GUIDES_CATEGORY,
    };
    let id: string;
    if (existing) {
      const updated = await prisma.blogPost.update({ where: { slug: p.slug }, data });
      id = updated.id;
    } else {
      const created = await prisma.blogPost.create({
        data: { ...data, slug: p.slug, publishedAt: new Date() },
      });
      id = created.id;
    }
    await prisma.fAQ.deleteMany({ where: { blogPostId: id } });
    await prisma.fAQ.createMany({
      data: p.faqs.map((f, i) => ({ question: f.question, answer: f.answer, blogPostId: id, order: i })),
    });
    console.log(
      `${existing ? "UPDATED" : "CREATED"}: ${p.slug} | words: ${p.content.split(/\s+/).length} | faqs: ${p.faqs.length}`
    );
  }
  const total = await prisma.blogPost.count({ where: { status: "PUBLISHED" } });
  console.log(`\nPUBLISHED total: ${total}`);
}

async function main() {
  for (let i = 0; i < 4; i++) {
    try {
      await run();
      break;
    } catch (e) {
      console.log("retry", i, (e as Error)?.message?.slice(0, 90));
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
