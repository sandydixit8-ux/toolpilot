import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CALC_CAT = "cmucgwrw70003uf70m8rulsu7";
const BIZ_CAT = "cmv3leoxf0000uf38e23pn25b";

const G1 = "gst-calculator-guide-india-2026";
const G2 = "how-to-create-gst-invoice-for-small-business";

const g1Content = `Goods and Services Tax (GST) is India's single indirect tax on the supply of goods and services. Knowing how to calculate it correctly matters whether you run a business, handle accounts, or simply want to check a bill you were handed. This guide explains the GST rate slabs, the forward and reverse formulas with worked examples, and how the tax splits into CGST, SGST, and IGST. You can run any amount instantly with the free [GST Calculator](/tools/gst-calculator).

## What Is GST and How Is It Calculated?

GST is a destination-based tax on every value addition in the supply chain. It replaced a web of earlier taxes such as VAT, service tax, and excise duty. You calculate it as a percentage of the base price, using one of five rates: 0%, 5%, 12%, 18%, or 28%.

The formula is simple, but there are two directions in which you use it: adding GST to a base amount, and extracting the GST already inside a bill total. Getting this direction right is where most mistakes happen.

## GST Rate Slabs in India (2026)

| Rate | Typical goods and services |
| --- | --- |
| 0% | Fresh fruits and vegetables, milk, bread, books, newspapers |
| 5% | Packaged food, footwear under Rs 1,000, transport services |
| 12% | Computers, processed food, business class air tickets, gym memberships |
| 18% | Most goods and services: electronics, restaurants, financial services, clothing |
| 28% | Luxury items: cars, tobacco, aerated drinks, hotels above Rs 7,500 |

Most everyday services and products fall in the 5% to 18% band. Always confirm the exact rate for your product before billing, because applying the wrong slab creates reconciliation problems in your returns.

## How to Calculate GST: Forward and Reverse

**Forward calculation (add GST to a base amount)**

GST amount = Base price x GST rate

Example: a product costs Rs 500 and attracts 18% GST.
- GST = 500 x 18% = Rs 90
- Total price = Rs 590

**Reverse calculation (remove GST from an inclusive total)**

Base price = Inclusive total / (1 + GST rate)

Example: a bill total is Rs 590 including 18% GST.
- Base = 590 / 1.18 = Rs 500
- GST inside the bill = Rs 90

The reverse mode matters for input tax credit (ITC) claims and for pricing decisions on marketplaces, where the listed price already includes tax. Run both directions on the [GST Calculator](/tools/gst-calculator) to avoid errors.

## CGST vs SGST vs IGST: How the Split Works

Where the tax goes depends on where the supply happens.

| Transaction | Tax applied | Example at 18% on Rs 10,000 |
| --- | --- | --- |
| Within the same state (intra-state) | Half to centre, half to state | CGST Rs 900 + SGST Rs 900 |
| Between different states (inter-state) | Full amount as integrated tax | IGST Rs 1,800 |
| Imports and exports | IGST applies | IGST on imported goods |

The total tax is always the same; only the split changes. On an intra-state invoice at 18%, you print two lines, 9% CGST and 9% SGST, not a single 18% line. The [GST Invoice Generator](/tools/gst-invoice-generator) applies the correct split automatically.

## How to Use the Free GST Calculator

Two quick modes:

**Add GST (from a base price)**
1. Enter the base price.
2. Pick the GST rate.
3. Read the GST amount and the total to charge.

**Remove GST (from an inclusive price)**
1. Enter the price that already includes GST.
2. Pick the rate.
3. Read the base price and the GST inside it.

The calculator also shows the CGST and SGST split or the IGST amount for the transaction.

## GST, Invoices, and Returns

Correct GST math flows straight into your invoices and your monthly returns (GSTR-1 and GSTR-3B). A missed or wrong calculation multiplies into corrections, late-filing penalties, and notices. Pair the calculator with the [GST Invoice Generator](/tools/gst-invoice-generator) so the numbers on your bills and your returns agree, and use the [Profit Margin Calculator](/tools/profit-margin-calculator) to set prices before tax.

## Common GST Mistakes to Avoid

- **Adding 18% to an amount that already includes GST.** You must divide, not multiply, to recover the base.
- **Using the wrong rate.** Hotels, cabs, and air-conditioned restaurants each have different effective rates.
- **Forgetting the CGST/SGST split** on same-state invoices, where it is mandatory.
- **Rounding each tax line separately.** Round the final amount, keep the GST as a single sum, then split.
- **Mixing up intra-state and inter-state.** This is the most common reason returns get flagged.

## Do You Need GST Registration?

Registration is required once turnover crosses the threshold, currently Rs 40 lakh for goods and Rs 20 lakh for services in most states. Small businesses below Rs 1.5 crore may use the composition scheme, which simplifies compliance. Even if you are not registered, understanding GST helps you check whether you are being billed correctly.

## Summary

GST is a percentage of the base price, calculated forward to add it and backward to extract it. The rate is one of five slabs, and the split is CGST plus SGST within a state or IGST across states. Get the direction, the rate, and the split right, and your invoices and returns stay consistent. Start with the free [GST Calculator](/tools/gst-calculator).`;

const g2Content = `A GST invoice is what lets you and your buyer claim input tax credit, so for a registered business it is not optional. Get one wrong and you risk delayed ITC, reconciliation mismatches, and notices months later. This guide lists every field a GST invoice must contain, explains the CGST, SGST and IGST split, covers invoice numbering rules, and shows how to produce a compliant invoice in about two minutes with the free [GST Invoice Generator](/tools/gst-invoice-generator).

## What a GST Invoice Must Include

For any taxable supply you make as a registered business, the invoice must be complete and accurate. At a glance it needs your details and GSTIN, the buyer's details, a unique invoice number and date, the HSN or SAC code, the correct tax split, and the total value.

| Essential field | Example |
| --- | --- |
| Supplier name, GSTIN and address | Your registered details |
| Buyer name, GSTIN and address | Their details, GSTIN for registered buyers |
| Invoice number and date | INV-001, date of supply |
| HSN or SAC code | 9987 for a service, HSN for goods |
| Taxable value, rate and tax | CGST + SGST intra-state, IGST inter-state |
| Total value in figures and words | The amount payable |

The [GST Invoice Generator](/tools/gst-invoice-generator) fills all of these fields for you, so you enter your business details once and then just add line items.

## The Mandatory Fields of a GST Invoice

Under the CGST Rules, make sure every invoice carries:

1. Your business name, address, and GSTIN.
2. A unique invoice number and the date of issue.
3. The buyer's name, address, and GSTIN for business purchases above the prescribed value.
4. The HSN code for goods or the SAC for services.
5. Description, quantity, and unit price of each item.
6. The total taxable value.
7. CGST and SGST rates for intra-state sales, or the IGST rate for inter-state sales.
8. The tax amount in figures and in words.
9. The place of supply.
10. Signature or a digital representation on the original and duplicate copies.

## CGST vs SGST vs IGST on the Invoice

The tax you show depends on whether the sale is within your state or across states.

| Situation | Tax columns shown |
| --- | --- |
| Within the same state | CGST and SGST, each at half the rate |
| Different states | IGST, a single column at the full rate |

At 18% within your own state, the invoice shows 9% CGST and 9% SGST, not a single 18% line. Charging IGST on a same-state sale, or the reverse, is the most common reason a return gets flagged. Use the [GST Calculator](/tools/gst-calculator) to verify the tax math if you are checking an old bill or doing a reverse calculation.

## Invoice Numbers: Get the Sequence Right

A valid GST invoice number is unique and consecutive for each financial year. Start with something like INV-001 and never reuse a number, even for a cancelled invoice. If you cancel one, keep the record with a cancellation note, because GST law expects you to maintain a complete invoice register.

## How to Create a GST Invoice

1. Open the [GST Invoice Generator](/tools/gst-invoice-generator).
2. Add your business name, GSTIN, and address.
3. Add the buyer's details.
4. Add line items with description, quantity, rate, and HSN or SAC.
5. Choose the GST rate, and the tool calculates the CGST and SGST split or the IGST amount.
6. Check the total, then download the invoice as a PDF.

Your data stays in your browser, the generator is free, and there is no signup and no watermark.

## Invoicing for Small Business: Terms That Get You Paid

A compliant invoice is only half the job; clear payment terms get it paid. Put a due date on every invoice and state your terms plainly.

| Term | Meaning |
| --- | --- |
| Due on receipt | Payment expected immediately |
| Net 15 | Payment due in 15 days, common for freelancers |
| Net 30 | Payment due in 30 days, standard for businesses |
| 50% upfront | Half before work, half on delivery, for larger projects |

Send the invoice as soon as the work is done, nudge a few days before the due date, follow up the day after it lapses, and keep every copy on file.

## Common GST Invoice Mistakes

- **Missing HSN or SAC code.** Every line item needs one.
- **Wrong tax type.** Charged IGST on a sale that happened within your state, or the reverse.
- **No invoice number series.** The sequence must be unique and consecutive per financial year.
- **Missing buyer GSTIN** on business-to-business sales, which blocks their input tax credit.
- **Round-off errors.** Round only the final amount, never each individual line.
- **Splitting CGST and SGST unevenly** when the rate cannot be halved cleanly.

## GST Invoice vs Quotation vs Standard Invoice

Not every document is a GST invoice. Choose the right one:

| Document | When to use it | Tool |
| --- | --- | --- |
| Quotation | Before the sale, to propose a price | [Quotation Generator](/tools/quotation-generator) |
| Standard invoice | A simple bill with no GST | [Invoice Generator](/tools/invoice-generator) |
| GST invoice | A registered, taxable sale in India | [GST Invoice Generator](/tools/gst-invoice-generator) |

## Summary

A compliant GST invoice carries your GSTIN, the buyer's details, a sequential number, the HSN or SAC code, and the correct CGST and SGST or IGST split, with the total in figures and words. Get those fields right and your input tax credit and returns stay clean. Build yours free with the [GST Invoice Generator](/tools/gst-invoice-generator).`;

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
    slug: G1,
    title: "GST Calculator Guide: How to Calculate GST in India (2026)",
    seoTitle: "GST Calculator Guide: How to Calculate GST in India (2026) | ToolPilot",
    seoDescription:
      "How to calculate GST in India in 2026: the forward and reverse formulas with worked examples, the GST rate slabs, and the CGST, SGST and IGST split, plus a free GST calculator.",
    excerpt:
      "How to calculate GST in India: the forward and reverse formulas with examples, the 2026 rate slabs, the CGST, SGST and IGST split, and common mistakes to avoid, with a free GST calculator.",
    content: g1Content,
    categoryId: CALC_CAT,
    faqs: [
      {
        question: "Is GST always 18%?",
        answer:
          "No. GST has five slabs: 0%, 5%, 12%, 18%, and 28%, depending on the product or service. Most everyday goods and services fall between 5% and 18%.",
      },
      {
        question: "How do I remove GST from a total?",
        answer:
          "Divide the total by (1 + rate). For 18%, divide by 1.18 to get the base amount, then subtract the base from the total to find the GST inside it.",
      },
      {
        question: "What is the difference between CGST, SGST, and IGST?",
        answer:
          "For a sale within one state, the tax splits equally into CGST (central) and SGST (state). For a sale between different states, the full amount is charged as IGST. The total tax is the same; only the split changes.",
      },
      {
        question: "Do I need GST registration?",
        answer:
          "Registration is required once turnover crosses the threshold, currently Rs 40 lakh for goods and Rs 20 lakh for services in most states. Small businesses below Rs 1.5 crore may opt for the composition scheme.",
      },
      {
        question: "Can I calculate GST without an online calculator?",
        answer:
          "Yes. Multiply the base by the rate to add GST, or divide the total by (1 + rate) to remove it. An online calculator is faster and avoids rounding errors.",
      },
      {
        question: "Is the GST Calculator free?",
        answer:
          "Yes. The GST Calculator is free to use as often as you like, needs no signup, and runs entirely in your browser so your figures stay private.",
      },
    ],
  },
  {
    slug: G2,
    title: "How to Create a GST Invoice in India: Format, Rules & Free Generator",
    seoTitle: "How to Create a GST Invoice in India: Format & Free Generator",
    seoDescription:
      "What a GST invoice must include, the mandatory fields, the CGST, SGST and IGST split, invoice numbering rules, and a free GST invoice generator that makes a compliant invoice in 2 minutes.",
    excerpt:
      "What a GST invoice must include, the mandatory fields, the CGST/SGST and IGST split, invoice numbering rules, and a free generator that creates a compliant invoice in about two minutes.",
    content: g2Content,
    categoryId: BIZ_CAT,
    faqs: [
      {
        question: "Is a GST invoice required for every sale?",
        answer:
          "If you are GST-registered, yes, for taxable supplies. Unregistered sellers follow simpler billing rules, and certain cases such as exports have additional requirements.",
      },
      {
        question: "What percentage of GST should I put on an invoice?",
        answer:
          "Use the rate for your product or service: 0%, 5%, 12%, 18%, or 28%. The generator applies the rate mapped to your item's HSN or SAC code.",
      },
      {
        question: "How do I show CGST and SGST versus IGST?",
        answer:
          "For a sale within your state, show CGST and SGST, each at half the total rate. For a sale to another state, show a single IGST column at the full rate.",
      },
      {
        question: "How should I number my GST invoices?",
        answer:
          "Use a unique, consecutive series for each financial year, such as INV-001, INV-002, and so on. Never reuse a number, even for a cancelled invoice.",
      },
      {
        question: "Can I create a GST invoice for free?",
        answer:
          "Yes. The GST Invoice Generator is free, needs no signup, and adds no watermark. It calculates the CGST and SGST or IGST split automatically.",
      },
      {
        question: "Is my invoice data saved on a server?",
        answer:
          "No. Everything you enter is processed in your browser and the invoice is generated locally, so your business and buyer details are never uploaded.",
      },
    ],
  },
];

const ARCHIVE: { slug: string; to: string }[] = [
  { slug: "gst-calculator-guide-india", to: G1 },
  { slug: "how-gst-works-india-guide", to: G1 },
  { slug: "how-to-calculate-gst-2026", to: G1 },
  { slug: "create-gst-invoice-legally-compliant-india", to: G2 },
  { slug: "how-to-create-invoices-online", to: G2 },
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
