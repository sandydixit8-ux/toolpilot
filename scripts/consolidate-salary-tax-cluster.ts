import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CALC_CAT = "cmucgwrw70003uf70m8rulsu7";

const T1 = "how-to-calculate-take-home-salary-from-ctc-india";
const T2 = "income-tax-calculator-guide";

const t1Content = `When you get a job offer, the CTC (Cost to Company) number looks impressive. But what actually hits your bank account every month is much lower, often 20% to 25% less. This guide explains every component of your salary, shows a worked example, and walks through the exact steps to find your real take-home with the free [Salary Calculator](/tools/salary-calculator).

## CTC vs In-Hand Salary

Your CTC includes everything the company spends on you, not just the cash you receive.

| Component | What it is |
| --- | --- |
| Basic salary | Usually 40-50% of CTC |
| HRA | House Rent Allowance, often 50% of basic in metros |
| Special allowance | The catch-all balancing amount |
| PF (employee) | 12% of basic, deducted from you |
| PF (employer) | 12% of basic, paid by the company and counted in CTC |
| Gratuity | About 4.81% of basic, paid after five years |
| Medical insurance | Company-paid health cover |

The key line: **take-home = Basic + HRA + Special Allowance - PF (employee) - Professional Tax - Income Tax**. Employer PF, gratuity, and insurance are part of CTC but never reach your account as cash.

## What Comes Out of Your Pay

| Deduction | What it is | Who pays |
| --- | --- | --- |
| Employee PF | 12% of basic | You |
| Employer PF | 12% of basic | Company, counted in CTC |
| Professional tax | About Rs 200/month in most states | You |
| Income tax (TDS) | Based on the old or new regime | You |
| Gratuity | About 4.81% of basic each month | Company, counted in CTC |
| ESI | Applies if gross is under Rs 21,000/month | You and company |

## Worked Example: Rs 10,00,000 CTC

| Component | Monthly | Annual |
| --- | --- | --- |
| Basic (40%) | Rs 33,333 | Rs 4,00,000 |
| HRA (20%) | Rs 16,667 | Rs 2,00,000 |
| Special allowance | Rs 20,000 | Rs 2,40,000 |
| PF (employee) | Rs 4,000 | Rs 48,000 |
| Professional tax | Rs 200 | Rs 2,400 |
| Gross salary | Rs 70,000 | Rs 8,40,000 |
| Income tax (new regime) | approx Rs 4,100 | approx Rs 49,200 |
| In-hand | approx Rs 65,900 | approx Rs 7,90,800 |

The exact tax depends on your regime choice, other income, and deductions.

## The CTC vs In-Hand Gap

| CTC | Typical in-hand (new regime) | Gap |
| --- | --- | --- |
| Rs 5,00,000 | Rs 3,80,000 | 24% |
| Rs 8,00,000 | Rs 6,10,000 | 24% |
| Rs 10,00,000 | Rs 7,90,000 | 21% |
| Rs 15,00,000 | Rs 11,50,000 | 23% |
| Rs 20,00,000 | Rs 15,20,000 | 24% |

The gap is typically 20% to 25% for new-regime taxpayers. Factor this in when comparing offers.

## How to Calculate Your In-Hand Salary

1. Take the CTC and subtract employer PF and gratuity to get your **gross salary**.
2. Subtract employee PF and professional tax to get your **monthly taxable income**.
3. Apply the correct tax regime to find the tax.
4. Subtract the tax to get your **in-hand salary**.

Instead of working through slabs by hand, enter your CTC, city type, and regime into the [Salary Calculator](/tools/salary-calculator) to see the monthly in-hand, annual take-home, and every deduction.

## Which Tax Regime Helps Your Take-Home

| Annual salary | Best choice |
| --- | --- |
| Up to Rs 12,00,000 taxable | New regime, often zero tax under the rebate |
| Rs 12-25 lakh with HRA and 80C | Old regime usually wins |
| Over Rs 25 lakh with large deductions | Compare both in the [Income Tax Calculator](/tools/income-tax-calculator) |

## Budget From Your Real In-Hand

Once you know the number that actually arrives, budget from it, not from your CTC. A practical split for Indian salaries is the 50/30/20 rule:

- **50%** for needs: rent, food, bills, EMIs.
- **30%** for wants: shopping, dining, travel.
- **20%** for savings and investments: SIPs, mutual funds, an emergency fund.

If rent eats more than 50% in a metro, trim the savings for now and build it back as your income grows. Pay yourself first by moving the savings out the moment your salary lands.

## Tips to Increase Take-Home

- **Choose the right regime.** Compare old vs new before your employer locks in your TDS.
- **Maximise HRA.** If you pay rent, claim the HRA exemption (old regime).
- **Use Section 80C.** Up to Rs 1.5 lakh in PPF, ELSS, or EPF cuts old-regime tax.
- **Health insurance.** Section 80D gives a deduction of Rs 25,000 to Rs 50,000.
- **NPS.** An extra Rs 50,000 deduction is available under 80CCD(1B).
- **Check the structure.** A higher basic means more PF, but also a bigger HRA base.

## Summary

CTC is not your salary. Subtract employer PF and gratuity to get gross, then employee PF, professional tax, and income tax to get your real in-hand. Know that number before you accept an offer or negotiate, and budget from it. Work it out free with the [Salary Calculator](/tools/salary-calculator).`;

const t2Content = `Every year salaried employees in India face the same question: should you stay on the old tax regime or move to the new one? The answer depends on your income, your deductions, and your lifestyle. This guide explains how salary tax is actually calculated, compares both regimes, and shows how to settle the question in 30 seconds with the free [Income Tax Calculator](/tools/income-tax-calculator).

## How Income Tax on Salary Is Calculated

Income tax is not simply your salary multiplied by a rate. There are four steps:

1. **Start with gross salary.** Basic, allowances, bonuses, and taxable perks, everything on your Form 16 as earnings.
2. **Subtract the standard deduction.** Rs 75,000 for salaried individuals under the new regime.
3. **Apply the slab rates** to the income left after the deduction.
4. **Add the 4% health and education cess,** then apply the Section 87A rebate if you are eligible.

Your "taxable income" is never your gross salary. It is gross income minus the standard deduction and any other exemptions and deductions you claim.

## New Regime Slabs

The new regime is now the default. If you do not actively choose the old regime, your employer deducts tax under the new regime.

| Annual taxable income | Tax rate |
| --- | --- |
| Up to Rs 4,00,000 | Nil |
| Rs 4,00,001 - Rs 8,00,000 | 5% |
| Rs 8,00,001 - Rs 12,00,000 | 10% |
| Rs 12,00,001 - Rs 16,00,000 | 15% |
| Rs 16,00,001 - Rs 20,00,000 | 20% |
| Rs 20,00,001 - Rs 24,00,000 | 25% |
| Above Rs 24,00,000 | 30% |

Each slab tax applies only to the income inside that slab, not to your whole salary. Always cross-check slab rates against the current Income Tax Department rules, since budgets can revise them.

## Old Regime Slabs and Deductions

The old regime has higher rates but allows deductions that can cut your taxable income sharply.

| Annual taxable income | Tax rate |
| --- | --- |
| Up to Rs 2,50,000 | Nil |
| Rs 2,50,001 - Rs 5,00,000 | 5% |
| Rs 5,00,001 - Rs 10,00,000 | 20% |
| Above Rs 10,00,000 | 30% |

Common old-regime deductions: Section 80C up to Rs 1.5 lakh, Section 80D for health insurance, HRA exemption, home loan interest under 24(b) up to Rs 2 lakh, and NPS under 80CCD(1B) up to Rs 50,000.

## The Section 87A Rebate and the Zero-Tax Limit

Under Section 87A in the new regime, if your **taxable income is Rs 12,00,000 or less**, the rebate can make your tax liability nil. Since the standard deduction is Rs 75,000, a salaried person with a gross salary up to **Rs 12,75,000** can pay **zero income tax**.

Above Rs 12,00,000 taxable, the rebate stops applying entirely and you pay tax from Rs 4,00,000 upward. That creates a "cliff": earning only a little more can cost you a lot more.

## Worked Example: Rs 14,00,000 Salary (New Regime)

- Taxable income after standard deduction: Rs 14,00,000 - Rs 75,000 = Rs 13,25,000
- Tax: Nil on Rs 4L + 5% of Rs 4L (Rs 20,000) + 10% of Rs 4L (Rs 40,000) + 15% of Rs 1,25,000 (Rs 18,750) = Rs 78,750
- Plus 4% cess: Rs 3,150
- **Total tax: Rs 81,900**

His tax is Rs 81,900, not the Rs 3.9 lakh a naive 28% guess would suggest.

## The Rebate Cliff at Rs 12 Lakh

| Gross salary | Taxable after Rs 75,000 | Final tax |
| --- | --- | --- |
| Rs 12,75,000 | Rs 12,00,000 | Rs 0 |
| Rs 13,00,000 | Rs 12,25,000 | Rs 63,750 |

Earning Rs 25,000 more can mean paying about Rs 63,750 in tax. Check your numbers every year before you finalise your regime.

## Old vs New Regime: Side by Side

| Feature | Old regime | New regime |
| --- | --- | --- |
| Standard deduction | Rs 50,000 | Rs 75,000 |
| 80C | Allowed (Rs 1.5L) | Not allowed |
| 80D health insurance | Allowed | Not allowed |
| HRA exemption | Allowed | Not allowed |
| Home loan interest 24(b) | Allowed (Rs 2L) | Not allowed |
| NPS extra (80CCD(1B)) | Allowed (Rs 50K) | Not allowed |
| Rebate limit (87A) | Rs 5,00,000 | Rs 12,00,000 |
| Tax rates | Higher | Lower |

## Who Should Choose Which Regime

You save more under the old regime if your total deductions exceed roughly **Rs 3,75,000** per year (HRA, 80C, 80D, home loan interest, NPS combined). Otherwise the new regime's lower rates and higher standard deduction usually win.

| Your situation | Better regime |
| --- | --- |
| High HRA + 80C + home loan | Old |
| No deductions, simple salary | New |
| Salaried, under Rs 12L, no deductions | New (often zero tax) |
| Salaried, Rs 15L+ with Rs 4L+ deductions | Old |
| Freelancer with business expenses | Old (more deductions available) |

You can switch regimes every year at filing time, unless you have business income, in which case you generally get one switch. So review it annually; your income and deductions change.

## How to Use the Income Tax Calculator

1. Enter your gross annual income.
2. Add your deductions (80C, 80D, HRA) for the old regime.
3. Choose the old or new regime.
4. See your tax liability, effective rate, and yearly tax.
5. Switch regimes to compare both side by side and pick the cheaper option.

For your exact take-home after tax, PF, and professional tax, pair it with the [Salary Calculator](/tools/salary-calculator).

## Summary

Tax on salary is decided by your taxable income after the standard deduction, the slab you land in, and the Section 87A rebate. Few deductions favour the new regime, and many deductions favour the old one. Stop guessing and check both in the free [Income Tax Calculator](/tools/income-tax-calculator).`;

type Pillar = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  content: string;
  faqs: { question: string; answer: string }[];
};

const pillars: Pillar[] = [
  {
    slug: T1,
    title: "How to Calculate Take-Home Salary from CTC in India (2026)",
    seoTitle: "How to Calculate Take-Home Salary from CTC in India | Free Calculator",
    seoDescription:
      "Your CTC is not your salary. Learn how to calculate in-hand pay after PF, professional tax, and income tax, with worked examples, the CTC-to-in-hand gap, and a free salary calculator.",
    excerpt:
      "Calculate your real take-home salary from CTC: every deduction explained, a worked Rs 10L example, the CTC-to-in-hand gap, regime choice, and budgeting from your true in-hand pay.",
    content: t1Content,
    faqs: [
      {
        question: "Why is my in-hand salary lower than my CTC?",
        answer:
          "CTC includes employer PF, gratuity, insurance, and other benefits that you never receive as cash. Only the basic, HRA, and allowances minus your deductions reach your bank account.",
      },
      {
        question: "Which tax regime gives a higher take-home?",
        answer:
          "Up to Rs 12 lakh taxable income the new regime is usually best, often zero tax. With heavy HRA, 80C, and home loan deductions the old regime often wins. Compare both in the Income Tax Calculator.",
      },
      {
        question: "Is PF deducted from both sides?",
        answer:
          "Yes. You pay 12% of basic and the employer pays 12% of basic. The employer's share is part of your CTC, not your take-home cash.",
      },
      {
        question: "What is professional tax?",
        answer:
          "A small state-level tax, usually about Rs 200 per month, deducted from your salary in states such as Karnataka, Maharashtra, Tamil Nadu, West Bengal, and Telangana.",
      },
      {
        question: "How much of my CTC is usually in-hand?",
        answer:
          "Typically 75% to 80% of CTC for new-regime taxpayers. The gap is usually 20% to 25%, driven by employer PF, gratuity, and income tax.",
      },
      {
        question: "Is the Salary Calculator free?",
        answer:
          "Yes. It is free, needs no signup, and runs in your browser. Enter your CTC, city, and regime to see your in-hand pay and full deduction breakdown.",
      },
    ],
  },
  {
    slug: T2,
    title: "Income Tax Calculator India: New vs Old Regime (FY 2026-27)",
    seoTitle: "Income Tax Calculator India: New vs Old Regime | Free Calculator",
    seoDescription:
      "Compare the new and old tax regime and find which saves you more. Free income tax calculator with 80C, 80D, and HRA deductions, plus slabs, the 87A rebate, and worked examples.",
    excerpt:
      "How salary income tax is calculated, the new and old regime slabs, the Section 87A rebate and zero-tax limit, worked examples, and a free calculator to compare both regimes.",
    content: t2Content,
    faqs: [
      {
        question: "Which regime is better for a Rs 10 lakh salary?",
        answer:
          "If your deductions (HRA, 80C, 80D) exceed about Rs 2.5 to 3 lakh, the old regime may be better. Otherwise the new regime usually offers lower tax for this bracket.",
      },
      {
        question: "Can I switch between regimes every year?",
        answer:
          "Salaried employees can choose between the old and new regime every year at filing time. Those with business income typically get only one switch in their lifetime.",
      },
      {
        question: "Is the Income Tax Calculator free?",
        answer:
          "Yes. It is 100% free, needs no signup, and processes your data locally in your browser for privacy.",
      },
      {
        question: "What is the standard deduction?",
        answer:
          "For salaried employees it is Rs 75,000 under the new regime. It applies to both regimes for salaried individuals and reduces your taxable salary before slabs.",
      },
      {
        question: "Do I pay zero tax on a Rs 12 lakh salary?",
        answer:
          "Under the new regime, taxable income up to Rs 12,00,000 gets the Section 87A rebate, making tax nil. With the Rs 75,000 standard deduction, a gross salary up to about Rs 12,75,000 can mean zero tax.",
      },
      {
        question: "Should I verify the slab rates?",
        answer:
          "Yes. Slab rates and limits can change with each budget. Cross-check the figures against the current Income Tax Department rules before you file.",
      },
    ],
  },
];

const ARCHIVE: { slug: string; to: string }[] = [
  { slug: "salary-calculator-take-home-pay-india", to: T1 },
  { slug: "salary-to-take-home-hra-tax-saving", to: T1 },
  { slug: "check-monthly-budget-salary-calculator", to: T1 },
  { slug: "how-to-calculate-income-tax-on-salary", to: T2 },
  { slug: "income-tax-on-12-lakh-salary-zero-tax-new-regime", to: T2 },
  { slug: "old-vs-new-tax-regime-2025-26-which-saves-more", to: T2 },
];

async function run() {
  for (const p of pillars) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      console.log("MISSING pillar, skipping:", p.slug);
      continue;
    }
    await prisma.blogPost.update({
      where: { slug: p.slug },
      data: {
        title: p.title,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        excerpt: p.excerpt,
        content: p.content,
        status: "PUBLISHED",
        categoryId: CALC_CAT,
        publishedAt: existing.publishedAt ?? new Date("2026-09-21T09:53:54.585Z"),
      },
    });
    await prisma.fAQ.deleteMany({ where: { blogPostId: existing.id } });
    await prisma.fAQ.createMany({
      data: p.faqs.map((f, i) => ({ question: f.question, answer: f.answer, blogPostId: existing.id, order: i })),
    });
    console.log("UPDATED pillar:", p.slug, "| words:", p.content.split(/\s+/).length, "| faqs:", p.faqs.length);
  }

  for (const a of ARCHIVE) {
    const r = await prisma.blogPost.updateMany({ where: { slug: a.slug }, data: { status: "ARCHIVED" } });
    console.log("ARCHIVED:", a.slug, "->", a.to, "| rows:", r.count);
  }

  const published = await prisma.blogPost.count({ where: { status: "PUBLISHED" } });
  const archived = await prisma.blogPost.count({ where: { status: "ARCHIVED" } });
  console.log("PUBLISHED now:", published, "| ARCHIVED now:", archived);
}

async function main() {
  for (let i = 0; i < 4; i++) {
    try {
      await run();
      break;
    } catch (e: any) {
      console.log("retry", i, e?.message?.slice(0, 90));
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main().finally(() => prisma.$disconnect());
