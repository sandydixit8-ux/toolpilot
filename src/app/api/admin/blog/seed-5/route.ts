import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SEED_SECRET = "seed-blog-5-secret-2025";
const AFFILIATE = "[Check out this recommended product on Amazon](https://amzn.in/d/05zZVJ9D)";

const posts = [
  {
    title: "How to Extract Specific Pages from a PDF",
    slug: "how-to-extract-pages-from-pdf",
    content: "# How to Extract Specific Pages from a PDF\n\nNeed just page 3 from a 50-page report? Extracting specific pages from a PDF saves you from sharing entire documents when only a few pages matter.\n\n## Why Extract Pages from a PDF?\n\n- Share only relevant sections\n- Reduce file size\n- Create focused documents\n- Remove sensitive pages\n\n## How to Use ToolPilot's PDF Page Extractor\n\n1. Go to [PDF Page Extractor](/tools/pdf-page-extractor)\n2. Upload your PDF file\n3. Enter the page numbers you want (e.g., 1, 3, 5-8)\n4. Click Extract Pages\n5. Download your new PDF\n\n### Features\n- Extract single pages or page ranges\n- Support for large PDFs up to 50MB\n- 100% browser-based — no upload to servers\n- Preserves original page quality\n\n## Common Use Cases\n\n- Legal documents — extract specific clauses\n- Academic papers — pull relevant sections\n- Business reports — share just the summary pages\n\n## Conclusion\n\nToolPilot's free [PDF Page Extractor](/tools/pdf-page-extractor) does it instantly in your browser.\n\n" + AFFILIATE,
    excerpt: "Learn how to extract specific pages from a PDF document for free using ToolPilot's browser-based PDF Page Extractor tool.",
    author: "ToolPilot Team",
    seoTitle: "Extract Pages from PDF: Free Online Tool | ToolPilot",
    seoDescription: "Extract specific pages from any PDF for free. No upload needed — process files in your browser with ToolPilot's PDF Page Extractor.",
    status: "PUBLISHED",
  },
  {
    title: "How to Rotate PDF Pages Online for Free",
    slug: "how-to-rotate-pdf-pages-online",
    content: "# How to Rotate PDF Pages Online for Free\n\nEver opened a PDF only to find the pages are sideways? Here is how to fix it.\n\n## Why Do PDF Pages Need Rotation?\n\n- Scanned documents with wrong orientation\n- Mixed portrait and landscape pages\n- Mobile scans with wrong orientation\n\n## How to Use ToolPilot's PDF Rotator\n\n1. Open [PDF Rotator](/tools/pdf-rotator)\n2. Upload your PDF file\n3. Select the pages to rotate\n4. Choose rotation angle: 90, 180, or 270 degrees\n5. Click Rotate Pages and download\n\n### Features\n- Rotate individual or all pages\n- Preview rotation before applying\n- Works with encrypted PDFs\n- 100% browser-based processing\n\n## Conclusion\n\nToolPilot's free [PDF Rotator](/tools/pdf-rotator) fixes page orientation in seconds.\n\n" + AFFILIATE,
    excerpt: "Fix sideways PDF pages for free. Rotate individual or all pages in any PDF using ToolPilot's browser-based PDF Rotator.",
    author: "ToolPilot Team",
    seoTitle: "Rotate PDF Pages Online Free | ToolPilot",
    seoDescription: "Rotate PDF pages online for free. Fix sideways pages instantly with ToolPilot's browser-based PDF Rotator.",
    status: "PUBLISHED",
  },
  {
    title: "SIP Calculator: Plan Your Mutual Fund Investments",
    slug: "sip-calculator-guide-india",
    content: "# SIP Calculator: Plan Your Mutual Fund Investments\n\nSIPs are the most popular way to invest in mutual funds in India. A SIP calculator helps you estimate returns.\n\n## What is a SIP?\n\nA SIP lets you invest a fixed amount monthly in a mutual fund scheme.\n\n## Why Use a SIP Calculator?\n\n- Set realistic expectations\n- Compare schemes\n- Plan for goals\n- Stay motivated\n\n## How to Use ToolPilot's SIP Calculator\n\n1. Open [SIP Calculator](/tools/sip-calculator)\n2. Enter your monthly investment amount\n3. Set the expected annual return rate\n4. Enter the investment duration in years\n5. View your projected maturity value\n\n## Tips for Better SIP Returns\n\n- Start early\n- Increase SIP annually with salary hikes\n- Stay invested during market dips\n\n## Conclusion\n\nUse ToolPilot's free [SIP Calculator](/tools/sip-calculator) to model your investment scenarios.\n\n" + AFFILIATE,
    excerpt: "Calculate SIP returns and plan mutual fund investments. Use ToolPilot's free SIP calculator for Indian investors.",
    author: "ToolPilot Team",
    seoTitle: "SIP Calculator: Calculate Mutual Fund Returns | ToolPilot",
    seoDescription: "Calculate SIP returns for free. Estimate mutual fund maturity value with ToolPilot's SIP Calculator.",
    status: "PUBLISHED",
  },
  {
    title: "Age Calculator: Find Your Exact Age",
    slug: "age-calculator-find-exact-age",
    content: "# Age Calculator: Find Your Exact Age\n\nHow old are you exactly? Not just in years — but in years, months, and days?\n\n## Why Calculate Your Exact Age?\n\n- Official documents\n- Fun facts — know your age in days or hours\n- Milestone tracking\n\n## How to Use ToolPilot's Age Calculator\n\n1. Go to [Age Calculator](/tools/age-calculator)\n2. Select your date of birth\n3. View your exact age instantly\n\n### What You Get\n- Age in years, months, and days\n- Total days lived\n- Days until next birthday\n\n## Conclusion\n\nFind your exact age with ToolPilot's free [Age Calculator](/tools/age-calculator).\n\n" + AFFILIATE,
    excerpt: "Calculate your exact age in years, months, and days. Use ToolPilot's free Age Calculator for instant results.",
    author: "ToolPilot Team",
    seoTitle: "Age Calculator: Exact Age in Years, Months, Days | ToolPilot",
    seoDescription: "Calculate your exact age in years, months, and days instantly. Free online Age Calculator by ToolPilot.",
    status: "PUBLISHED",
  },
  {
    title: "How to Compress Images for Web Without Losing Quality",
    slug: "compress-images-web-no-quality-loss",
    content: "# How to Compress Images for Web Without Losing Quality\n\nSlow websites lose visitors. Nothing slows a website more than oversized images.\n\n## Why Image Compression Matters\n\n- Page speed affects Google rankings\n- 53% of mobile users leave slow sites\n- Smaller images mean lower hosting costs\n\n## How to Use ToolPilot's Image Compressor\n\n1. Open [Image Compressor](/tools/image-compressor)\n2. Upload your image(s)\n3. Choose compression level\n4. Preview the result\n5. Download the optimized image\n\n### Features\n- Batch compression\n- Side-by-side quality preview\n- 100% browser processing\n\n## Conclusion\n\nToolPilot's free [Image Compressor](/tools/image-compressor) reduces file sizes without visible quality loss.\n\n" + AFFILIATE,
    excerpt: "Compress images for web without losing quality. Optimize JPG, PNG, and WebP images using ToolPilot.",
    author: "ToolPilot Team",
    seoTitle: "Compress Images for Web: No Quality Loss | ToolPilot",
    seoDescription: "Compress images for web without losing quality. Free online Image Compressor by ToolPilot.",
    status: "PUBLISHED",
  },
  {
    title: "Discount Calculator: Never Overpay Again",
    slug: "discount-calculator-never-overpay",
    content: "# Discount Calculator: Never Overpay Again\n\nThat 40% off sign looks tempting — but what is the actual price?\n\n## Why Use a Discount Calculator?\n\n- Sale season — calculate final prices during sales\n- Bulk purchases — figure out per-unit cost\n- Budget planning\n\n## How to Use ToolPilot's Discount Calculator\n\n1. Open [Discount Calculator](/tools/discount-calculator)\n2. Enter the original price\n3. Enter the discount percentage\n4. See the final price and total savings\n\n## Common Discount Mistakes\n\n- 20% + 10% off is not 30% — it is 28%\n- Some sellers inflate MRP before showing discounts\n\n## Conclusion\n\nUse ToolPilot's free [Discount Calculator](/tools/discount-calculator) to know exactly what you are paying.\n\n" + AFFILIATE,
    excerpt: "Calculate discounts instantly. Find the final price after any percentage discount with ToolPilot's free Discount Calculator.",
    author: "ToolPilot Team",
    seoTitle: "Discount Calculator: Calculate Percentage Off | ToolPilot",
    seoDescription: "Calculate discount prices instantly with ToolPilot's free Discount Calculator.",
    status: "PUBLISHED",
  },
  {
    title: "Compound Interest Calculator: Grow Your Wealth Faster",
    slug: "compound-interest-calculator-grow-wealth",
    content: "# Compound Interest Calculator: Grow Your Wealth Faster\n\nCompound interest is the most powerful force in personal finance.\n\n## Simple Interest vs Compound Interest\n\nExample: 1,00,000 at 10% for 5 years: Simple interest gives 1,50,000. Compound interest gives 1,61,051.\n\n## How to Use ToolPilot's Compound Interest Calculator\n\n1. Open [Compound Interest Calculator](/tools/compound-interest-calculator)\n2. Enter the principal amount\n3. Enter the annual interest rate\n4. Set the time period\n5. Choose compounding frequency\n\n## The Rule of 72\n\nDivide 72 by your interest rate to find how long it takes to double your money.\n\n## Conclusion\n\nUse ToolPilot's free [Compound Interest Calculator](/tools/compound-interest-calculator) to plan your investments.\n\n" + AFFILIATE,
    excerpt: "Calculate compound interest and see how your money grows. Free Compound Interest Calculator by ToolPilot.",
    author: "ToolPilot Team",
    seoTitle: "Compound Interest Calculator Free Online | ToolPilot",
    seoDescription: "Calculate compound interest online for free with ToolPilot's Compound Interest Calculator.",
    status: "PUBLISHED",
  },
  {
    title: "ROI Calculator: Measure Your Investment Returns",
    slug: "roi-calculator-measure-investment-returns",
    content: "# ROI Calculator: Measure Your Investment Returns\n\nIs your investment making money? An ROI calculator tells you exactly.\n\n## ROI Formula\n\nROI = (Net Profit / Cost of Investment) x 100\n\n## How to Use ToolPilot's ROI Calculator\n\n1. Open [ROI Calculator](/tools/roi-calculator)\n2. Enter the amount you invested\n3. Enter the current or final value\n4. See your ROI percentage\n\n## When to Calculate ROI\n\n- Stock investments\n- Business decisions\n- Real estate\n\n## Conclusion\n\nUse ToolPilot's free [ROI Calculator](/tools/roi-calculator) to track your returns.\n\n" + AFFILIATE,
    excerpt: "Calculate ROI on any investment. Measure returns with ToolPilot's free ROI Calculator.",
    author: "ToolPilot Team",
    seoTitle: "ROI Calculator: Calculate Return on Investment | ToolPilot",
    seoDescription: "Calculate ROI for any investment instantly with ToolPilot's free ROI Calculator.",
    status: "PUBLISHED",
  },
  {
    title: "How to Convert JPG to PNG Online Without Quality Loss",
    slug: "convert-jpg-to-png-online-free",
    content: "# How to Convert JPG to PNG Online Without Quality Loss\n\nSometimes you need PNG for transparency, lossless quality, or design work.\n\n## When Do You Need PNG Instead of JPG?\n\n- Transparency — PNG supports transparent backgrounds\n- Graphics and logos — sharp edges look better in PNG\n- Editing — PNG is lossless\n\n## How to Use ToolPilot's JPG to PNG Converter\n\n1. Open [JPG to PNG](/tools/jpg-to-png)\n2. Upload your JPG image\n3. Click Convert\n4. Download the PNG file\n\n### Features\n- Instant conversion\n- Preserves original quality\n- 100% browser-based\n- Batch conversion supported\n\n## Conclusion\n\nConvert JPG to PNG instantly with ToolPilot's free [JPG to PNG Converter](/tools/jpg-to-png).\n\n" + AFFILIATE,
    excerpt: "Convert JPG to PNG online without losing quality. Free JPG to PNG converter by ToolPilot.",
    author: "ToolPilot Team",
    seoTitle: "JPG to PNG Converter: Free Online Tool | ToolPilot",
    seoDescription: "Convert JPG to PNG online for free without quality loss. ToolPilot's JPG to PNG Converter.",
    status: "PUBLISHED",
  },
  {
    title: "Date Calculator: Calculate Days Between Any Two Dates",
    slug: "date-calculator-days-between-dates",
    content: "# Date Calculator: Calculate Days Between Any Two Dates\n\nHow many days until your vacation? How long has it been since a specific date?\n\n## Common Uses\n\n- Project planning\n- Leave planning\n- Contract terms\n- Event planning\n\n## How to Use ToolPilot's Date Calculator\n\n1. Open [Date Calculator](/tools/date-calculator)\n2. Select the start date\n3. Select the end date\n4. View the difference\n\n## Conclusion\n\nCalculate days between any two dates with ToolPilot's free [Date Calculator](/tools/date-calculator).\n\n" + AFFILIATE,
    excerpt: "Calculate days between any two dates instantly. Free Date Calculator by ToolPilot.",
    author: "ToolPilot Team",
    seoTitle: "Date Calculator: Days Between Dates Online | ToolPilot",
    seoDescription: "Calculate days between any two dates instantly. Free online Date Calculator by ToolPilot.",
    status: "PUBLISHED",
  },
];

export async function POST(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (token !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = [];
  for (const post of posts) {
    try {
      const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
      if (existing) {
        results.push({ slug: post.slug, status: "skipped" });
        continue;
      }
      await prisma.blogPost.create({
        data: {
          ...post,
          publishedAt: new Date(),
        },
      });
      results.push({ slug: post.slug, status: "created" });
    } catch (e) {
      results.push({ slug: post.slug, status: "error", error: String(e) });
    }
  }

  if (results.some((r) => r.status === "created")) revalidatePath("/blog");

  return NextResponse.json({ results });
}
