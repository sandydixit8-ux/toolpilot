import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const posts = [
  {
    title: "How to Resize and Compress Images for Email Attachments",
    slug: "resize-compress-images-email-attachments",
    excerpt: "Email providers limit attachments to 25MB. Here is how to resize and compress images to send fast, shareable attachments.",
    content: "Email providers limit attachments to 25MB, and large images slow down delivery. Here is how to shrink images for email.\n\n## Why Compress Images for Email\n\n- Gmail, Outlook, Yahoo cap attachments at 25MB\n- Large images slow down sending and receiving\n- Recipients struggle to open huge files on mobile\n\n## How to Compress Images for Email\n\n1. Go to [Image Compressor](/tools/image-compressor)\n2. Upload your images\n3. Choose Balanced compression (quality 70-80%)\n4. Download compressed versions\n5. Attach to email\n\n## When to Resize Instead\n\n| Situation | Action |\n|-----------|--------|\n| Photo 5 MB+ | Resize first, then compress |\n| Screenshot | Compress directly |\n| Logo | Use PNG, compresses well |\n| Signature image | Resize to 300px width |\n\nResize with [Image Resizer](/tools/image-resizer) before compressing for best results.\n\n## Email Size Guidelines\n\n| Purpose | Target Size |\n|---------|------------|\n| Personal email | Under 5 MB |\n| Professional documents | Under 2-3 MB |\n| Portfolio | Under 10 MB total |\n\n## Quick Steps to a Small Image\n\n- Compress with [Image Compressor](/tools/image-compressor)\n- Resize to 1280px width with [Image Resizer](/tools/image-resizer)\n- Convert to WebP with [WebP Converter](/tools/webp-converter) for even smaller files\n\nUse these free tools to keep email attachments small and fast.",
    author: "ToolPilot Team",
    seoTitle: "Resize & Compress Images for Email Attachments | Free Tool",
    seoDescription: "Compress and resize images for email attachments. Free online tools keep files small and fast — no signup required.",
    status: "PUBLISHED" as const,
  },
  {
    title: "Simple Interest vs Compound Interest: Which Calculator Should You Use?",
    slug: "simple-interest-vs-compound-interest-calculator",
    excerpt: "Simple and compound interest give very different results. Learn when to use each and how to calculate both for savings and loans.",
    content: "Simple and compound interest are the two ways interest is calculated. They give very different results over time.\n\n## The Difference\n\n| | Simple Interest | Compound Interest |\n|--|----------------|------------------|\n| Calculated on | Principal only | Principal + accumulated interest |\n| Growth | Linear | Exponential |\n| Best for | Short-term loans | Long-term investments |\n\n## Simple Interest Formula\n\nInterest = Principal x Rate x Time\n\nExample: 1,00,000 at 10% for 5 years = 50,000 interest, total 1,50,000\n\n## Compound Interest Formula\n\nA = P x (1 + r/n)^(n x t)\n\nExample: 1,00,000 at 10% for 5 years compounding annually = 1,61,051\n\nThat is 11,051 more than simple interest over 5 years.\n\n## When to Use Each\n\n| Scenario | Type |\n|----------|------|\n| Fixed deposit | Compound (quarterly) |\n| Simple savings | Compound |\n| Personal loan (simple) | Simple |\n| PPF | Compound (annual) |\n| Short-term loan | Simple |\n\n## Use the Right Calculator\n\n- Use [Simple Interest Calculator](/tools/simple-interest-calculator) for short-term loans and quick math\n- Use [Compound Interest Calculator](/tools/compound-interest-calculator) for investments and long-term savings\n\n## Why Compound Wins Over Time\n\nAt 10% for 20 years:\n- Simple: 1,00,000 becomes 3,00,000\n- Compound: 1,00,000 becomes 6,72,750\n\nThe difference grows with time. That is the power of compounding.\n\nCalculate both with the free [Simple Interest Calculator](/tools/simple-interest-calculator) and [Compound Interest Calculator](/tools/compound-interest-calculator).",
    author: "ToolPilot Team",
    seoTitle: "Simple vs Compound Interest Calculator: Which to Use | Free",
    seoDescription: "Learn the difference between simple and compound interest and when to use each calculator. Free online calculators for savings and loans.",
    status: "PUBLISHED" as const,
  },
];

async function main() {
  console.log("Seeding blog posts (batch 7b)...\n");

  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) {
      console.log(`Skip (exists): ${post.slug}`);
      continue;
    }
    await prisma.blogPost.create({ data: { ...post, publishedAt: new Date() } });
    console.log(`Created: ${post.title}`);
  }

  const total = await prisma.blogPost.count();
  console.log(`\nTotal blog posts: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
