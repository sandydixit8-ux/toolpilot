import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CALC_CAT = "cmucgwrw70003uf70m8rulsu7";
const BIZ_CAT = "cmv3leoxf0000uf38e23pn25b";

const U = "unit-converter-metric-imperial-guide";
const B = "markup-vs-margin-selling-price";

const uContent = `Half the world uses metric (metres, kilograms, Celsius) and the other half uses imperial (feet, pounds, Fahrenheit). Recipes, workouts, travel, schoolwork, and shipping all mix the two, and a wrong conversion can ruin a recipe or a measurement. This guide lists the conversions people actually need and shows how to get any of them instantly with the free [Unit Converter](/tools/unit-converter).

## Length Conversions

| Metric | Imperial |
| --- | --- |
| 1 cm | 0.39 inch |
| 1 m | 3.28 feet |
| 1 km | 0.62 mile |
| 1 foot | 30.48 cm |
| 1 mile | 1.61 km |

Quick mental math: km x 0.6 gives an approximate mile value, and feet x 30 gives an approximate centimetre value. For anything precise, use the converter rather than a rounding trick.

## Weight Conversions

| Metric | Imperial |
| --- | --- |
| 1 kg | 2.20 pounds |
| 1 g | 0.035 ounce |
| 1 pound | 0.45 kg |
| 1 ounce | 28.35 g |

A rough shortcut is kg x 2.2 for an approximate pound figure. Note that a UK/imperial gallon and a US gallon are also different - always check which one a recipe or product uses.

## Temperature Conversions

Temperature is not a simple multiply, so use a formula:

- Celsius to Fahrenheit: F = (C x 9/5) + 32
- Fahrenheit to Celsius: C = (F - 32) x 5/9
- Celsius to Kelvin: K = C + 273.15

So 30C is 86F, and 100F is about 38C - a fever check people often need.

## Quick Temperature Reference

| C | F | Description |
| --- | --- | --- |
| 0 | 32 | Freezing point |
| 20 | 68 | Room temperature |
| 37 | 98.6 | Body temperature |
| 100 | 212 | Boiling point |

## Volume, Area, Speed and Data

| Type | Example |
| --- | --- |
| Volume | 1 litre = 0.26 US gallon, 1 cup = 236.6 ml |
| Area | 1 acre = 4047 sq m, 1 sq ft = 0.093 sq m |
| Speed | 1 km/h = 0.62 mph |
| Data | 1 GB = 1024 MB, 1 MB = 1024 KB |

For data sizes there is a subtlety: 1 GB is 1024 MB in the binary convention, but storage is often marketed using 1000 MB = 1 GB. The [Unit Converter](/tools/unit-converter) shows both so you are never caught out. When a task mixes units and dates or math, pair it with the [Time Calculator](/tools/time-calculator) and [Percentage Calculator](/tools/percentage-calculator).

## How to Convert Instantly

1. Open the [Unit Converter](/tools/unit-converter).
2. Pick the category (length, weight, temperature, volume, area, speed, data, and more).
3. Enter the value and choose the "from" and "to" units.
4. Read the converted result and copy it with one click.

Conversions run both ways, and you can control the decimal precision, so you can go straight from a recipe in cups to grams or from a road sign in miles to kilometres.

## Practical Tips

- **Check which system a source uses.** US and UK gallons differ; a pound of feathers and a pound of lead are still 0.45 kg.
- **Round sensibly.** Two decimal places is enough for cooking; keep more for engineering or medicine.
- **Bookmark the tool** if you convert often - travel, cooking, and fitness all need it regularly.
- **Do not trust a rough shortcut for anything important.** The "double and add 30" Celsius trick is fine for a forecast, not for a fever.

## Frequently Asked Questions

- **Why does the US use imperial units?** Historical reasons - the US adopted the imperial system early and kept it, while most of the world standardised on metric.
- **Is 1 GB equal to 1000 MB or 1024 MB?** Technically 1024 MB is 1 gibibyte (GiB), but storage is often marketed using 1000. The converter shows both conventions.
- **How do I convert Celsius to Fahrenheit quickly?** Double the Celsius value and add 30 for a rough estimate: 20C becomes about 50 (the exact value is 68F). Use the formula for anything important.
- **Are US and UK gallons the same?** No. A US gallon is about 3.785 litres; an imperial (UK) gallon is about 4.546 litres.
- **Can it handle cooking units?** Yes - cups, millilitres, grams, ounces, and tablespoons are all covered.
- **Is the Unit Converter free?** Yes. It is free, needs no signup, and runs in your browser.

Stop guessing the math - use the free [Unit Converter](/tools/unit-converter) for accurate length, weight, temperature, and data conversions.`;

const bContent = `Markup, margin, break-even, and discounts all describe money, but from different angles - and mixing them up quietly costs businesses real profit. This guide explains each with a plain formula and a worked example, and shows how to price a product correctly with the free [Markup Calculator](/tools/markup-calculator), [Profit Margin Calculator](/tools/profit-margin-calculator), [Break-Even Calculator](/tools/break-even-calculator), and [Discount Calculator](/tools/discount-calculator).

## Markup vs Margin: The Confusion That Costs Money

**Markup** and **margin** both describe profit, but against different bases:

- **Markup** is profit as a percentage of **cost**.
- **Margin** is profit as a percentage of **price**.

**Markup % = (Price - Cost) / Cost x 100**

**Margin % = (Price - Cost) / Price x 100**

**Selling price from a target margin = Cost / (1 - Margin %)**

A 50 percent markup is only a 33 percent margin. Price a product thinking the two are equal and you will quietly earn less than you planned.

### A Worked Example

Cost is Rs 600. You want a 40 percent margin.

- Selling price = Rs 600 / (1 - 0.40) = Rs 600 / 0.60 = **Rs 1,000**
- Profit = Rs 400
- Markup = Rs 400 / Rs 600 = **66.7 percent**
- Margin = Rs 400 / Rs 1,000 = **40 percent**

The same Rs 400 profit is a 66.7 percent markup but only a 40 percent margin.

### Markup vs Margin Cheat Sheet

| Markup | Equivalent margin |
| --- | --- |
| 25% | 20% |
| 50% | 33.3% |
| 100% | 50% |
| 200% | 66.7% |

## Profit Margin: What You Actually Keep

Profit margin is the percentage of revenue that is profit. A 25 percent margin means that for every Rs 100 in sales, Rs 25 is profit after costs. Revenue alone tells you nothing about health - a business can sell a lot and still lose money.

There are two common measures:

- **Gross margin = (Revenue - Cost of Goods Sold) / Revenue x 100** - ignores overheads.
- **Net margin = (Revenue - All Expenses) / Revenue x 100** - includes everything.

Example: you sell a product for Rs 1,000 and materials and fees cost Rs 400, so gross profit is Rs 600 and gross margin is **60 percent**. If overheads add Rs 200 per unit, net profit is Rs 400 and net margin is **40 percent**.

### Why Margin Beats Revenue

| Business | Revenue | Margin | Profit |
| --- | --- | --- | --- |
| High-volume, thin | Rs 10,00,000 | 5% | Rs 50,000 |
| Low-volume, healthy | Rs 2,00,000 | 40% | Rs 80,000 |

The smaller business earns more. Margin is the number to defend.

## Break-Even Analysis: How Many You Must Sell

Break-even is the point at which revenue exactly covers costs - no profit, no loss. Below it you lose money; above it every extra sale adds profit.

**Break-even units = Fixed Costs / (Price - Variable Cost per Unit)**

- **Fixed costs** stay the same no matter how much you sell (rent, salaries, software).
- **Variable costs** rise with each unit (materials, packaging, payment fees).
- **Price - Variable Cost** is your contribution margin per unit.

Example: fixed costs are Rs 50,000 a month, you sell at Rs 500, and each unit costs Rs 300. Contribution margin is Rs 200, so break-even is Rs 50,000 / Rs 200 = **250 units** a month. Unit 251 starts earning profit. To lower your break-even, cut fixed costs, raise the price, or reduce variable costs.

## Discounts Cut Margin Faster Than You Think

A discount comes straight off profit. A 20 percent discount on a product with a 40 percent margin does not drop the margin to 20 percent - it drops it to about 25 percent, because the price falls but the cost does not.

For shoppers, the retail math is simple:

> Final price = MRP - (MRP x Discount%) / 100

A Rs 2,000 shirt at 25 percent off costs Rs 1,500, saving Rs 500. Compare offers by final price, not headline percent, because a bigger percentage on a higher MRP can still be dearer: Rs 4,000 at 30 percent off is Rs 2,800, while Rs 5,000 at 45 percent off is Rs 2,750.

## How to Run the Numbers

1. To set a price from a target margin, open the [Markup Calculator](/tools/markup-calculator) and enter cost plus either markup or target margin.
2. Double-check what you keep with the [Profit Margin Calculator](/tools/profit-margin-calculator).
3. Find how many units you must sell with the [Break-Even Calculator](/tools/break-even-calculator).
4. Model offers and stacked discounts with the [Discount Calculator](/tools/discount-calculator), and weigh any price change against your return with the [ROI Calculator](/tools/roi-calculator). Add tax cleanly with the [GST Calculator](/tools/gst-calculator).

## Frequently Asked Questions

- **What is the difference between markup and margin?** Markup is profit as a percentage of cost; margin is profit as a percentage of price. Margin is always lower than markup.
- **How do I price for a target margin?** Price = Cost / (1 - target margin). For a 40 percent margin on a Rs 600 cost, that is Rs 1,000.
- **What is a good profit margin?** It depends on the industry. Retail often runs thin (5 to 15 percent), services higher. The trend matters more than the exact number.
- **What is the difference between gross and net margin?** Gross margin counts only direct product costs; net margin also subtracts overheads, taxes, and other expenses.
- **What is a break-even point?** The sales level where total revenue equals total costs, so profit is exactly zero.
- **Can I calculate break-even for a service business?** Yes. Treat each billable hour or project as a "unit" with its own price and variable cost.
- **Are these calculators free?** Yes. The markup, profit margin, break-even, and discount calculators are all free, need no signup, and run in your browser.

Price with confidence and protect your profit using the free [Markup Calculator](/tools/markup-calculator) and [Profit Margin Calculator](/tools/profit-margin-calculator).`;

type Pillar = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  content: string;
  categoryId: string;
  faqs: { question: string; answer: string }[];
};

const pillars: Pillar[] = [
  {
    slug: U,
    title: "Unit Converter: Metric to Imperial Conversions Made Simple",
    seoTitle: "Unit Converter: Metric to Imperial Conversions (Length, Weight, Temp)",
    seoDescription:
      "Convert length, weight, temperature, volume, speed and data between metric and imperial. See the common conversion tables and a free instant unit converter.",
    excerpt:
      "The metric to imperial conversions people actually need - length, weight, temperature, volume and data - with quick tables, formulas and a free instant unit converter.",
    content: uContent,
    categoryId: CALC_CAT,
    faqs: [
      {
        question: "How do I convert Celsius to Fahrenheit?",
        answer:
          "Use F = (C x 9/5) + 32. For example, 30C is 86F. A rough mental shortcut is to double the Celsius value and add 30.",
      },
      {
        question: "Is 1 GB equal to 1000 MB or 1024 MB?",
        answer:
          "Technically 1024 MB is 1 gibibyte (GiB), but storage is often marketed using 1000 MB = 1 GB. The converter shows both conventions.",
      },
      {
        question: "Are US and UK gallons the same?",
        answer:
          "No. A US gallon is about 3.785 litres; an imperial (UK) gallon is about 4.546 litres. Always check which one a recipe uses.",
      },
      {
        question: "How many pounds is a kilogram?",
        answer:
          "One kilogram is about 2.20 pounds. A rough shortcut is kg x 2.2 for an approximate figure.",
      },
      {
        question: "Can the unit converter handle cooking units?",
        answer:
          "Yes - cups, millilitres, grams, ounces, and tablespoons are all supported, along with length, weight, temperature, area, speed, and data.",
      },
      {
        question: "Is the Unit Converter free?",
        answer:
          "Yes. It is free, needs no signup, converts both ways, and runs in your browser.",
      },
    ],
  },
  {
    slug: B,
    title: "Markup, Margin, Break-Even and Discounts: Pricing Calculations Explained",
    seoTitle: "Markup vs Margin, Break-Even & Discounts: Pricing Explained (Free Tools)",
    seoDescription:
      "Understand markup vs margin, profit margin, break-even analysis and discount math with formulas and worked examples, and price products with free calculators.",
    excerpt:
      "Markup vs margin, profit margin, break-even units and discount math explained with formulas and worked examples, plus free calculators to price any product correctly.",
    content: bContent,
    categoryId: BIZ_CAT,
    faqs: [
      {
        question: "What is the difference between markup and margin?",
        answer:
          "Markup is profit as a percentage of cost; margin is profit as a percentage of price. A 50 percent markup is only a 33 percent margin.",
      },
      {
        question: "How do I price for a target margin?",
        answer:
          "Price = Cost / (1 - target margin). For a 40 percent margin on a Rs 600 cost, the selling price is Rs 1,000.",
      },
      {
        question: "What is a good profit margin?",
        answer:
          "It depends on the industry. Retail often runs thin, around 5 to 15 percent, while services are usually higher. The trend matters more than any single number.",
      },
      {
        question: "What is break-even and why does it matter?",
        answer:
          "Break-even is the sales level where revenue exactly covers costs. Selling above it adds profit; selling below it means a loss. It is the fastest sanity check on a price or product idea.",
      },
      {
        question: "How do I reduce my break-even point?",
        answer:
          "Lower fixed costs, raise the price, or cut variable costs per unit. Any of these reduces the number of units you must sell to cover costs.",
      },
      {
        question: "Why does a discount hurt margin so much?",
        answer:
          "A discount cuts the price but not the cost, so it comes straight off profit. On a 40 percent margin, a 20 percent discount can cut margin by nearly half.",
      },
    ],
  },
];

const ARCHIVE: { slug: string; to: string }[] = [
  { slug: "unit-converter-quick-guide", to: U },
  { slug: "how-to-calculate-profit-margin", to: B },
  { slug: "break-even-analysis-calculate-guide", to: B },
  { slug: "discount-calculator-never-overpay", to: B },
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
        categoryId: p.categoryId,
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
