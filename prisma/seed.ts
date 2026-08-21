import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { allTools } from "../src/config/tools";
import { categories } from "../src/config/categories";

const prisma = new PrismaClient();

const processingTypeMap: Record<string, string> = {
  browser: "BROWSER",
  server: "SERVER",
  ai: "AI",
  heavy: "HEAVY",
};

async function main() {
  console.log("Seeding database...");

  for (const cat of categories) {
    await prisma.toolCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug, description: cat.description, icon: cat.slug, order: 0 },
    });
  }
  console.log(`Seeded ${categories.length} categories`);

  for (const tool of allTools) {
    const category = await prisma.toolCategory.findUnique({ where: { slug: tool.categorySlug } });
    if (!category) continue;

    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {},
      create: {
        name: tool.name,
        slug: tool.slug,
        description: tool.description,
        longDescription: tool.longDescription,
        instructions: JSON.stringify(tool.instructions),
        categoryId: category.id,
        processingType: processingTypeMap[tool.processingType] || "BROWSER",
        status: "PUBLISHED",
        featured: tool.featured || false,
        popular: tool.popular || false,
        seoTitle: tool.seoTitle,
        seoDescription: tool.seoDescription,
        keywords: JSON.stringify(tool.keywords),
        publishedAt: new Date(),
      },
    });
  }
  console.log(`Seeded ${allTools.length} tools`);

  await prisma.blogCategory.upsert({ where: { slug: "tips" }, update: {}, create: { name: "Tips & Tricks", slug: "tips" } });
  await prisma.blogCategory.upsert({ where: { slug: "guides" }, update: {}, create: { name: "Guides", slug: "guides" } });

  const tipsCat = await prisma.blogCategory.findUnique({ where: { slug: "tips" } });
  const guidesCat = await prisma.blogCategory.findUnique({ where: { slug: "guides" } });

  const blogPosts = [
    {
      slug: "how-to-compress-images-for-web",
      title: "How to Compress Images for the Web Without Losing Quality",
      excerpt: "Learn the best practices for compressing images to speed up your website while maintaining visual quality.",
      content: "Large images are one of the biggest causes of slow website loading times. In this guide, we'll show you how to compress images effectively using ToolPilot's free Image Compressor.\n\n## Why Image Compression Matters\n\nStudies show that 53% of mobile users abandon sites that take longer than 3 seconds to load. Images typically account for 50-75% of a webpage's total weight.\n\n## How to Compress Images with ToolPilot\n\n1. Go to the Image Compressor tool\n2. Drag and drop your images or click to upload\n3. Choose your compression level\n4. Download your compressed images\n\n## Tips for Optimal Compression\n\n- Use WebP format for best compression-to-quality ratio\n- Compress images to 80% quality for a good balance\n- Resize images to the maximum display size needed\n- Use lazy loading for below-the-fold images",
      author: "ToolPilot Team",
      categoryId: tipsCat?.id,
      seoTitle: "How to Compress Images for Web | ToolPilot Blog",
      seoDescription: "Learn how to compress images for the web without losing quality. Step-by-step guide using free online tools.",
      status: "PUBLISHED",
      publishedAt: new Date("2025-01-15"),
    },
    {
      slug: "gst-calculator-guide-india",
      title: "Understanding GST: How to Calculate CGST, SGST & IGST",
      excerpt: "A complete guide to understanding and calculating GST in India with our free GST Calculator.",
      content: "GST (Goods and Services Tax) replaced multiple indirect taxes in India. Understanding how to calculate CGST, SGST, and IGST is essential for businesses and consumers alike.\n\n## What is GST?\n\nGST is a comprehensive tax levied on the supply of goods and services in India. It replaced many indirect taxes like VAT, service tax, and excise duty.\n\n## Types of GST\n\n- **CGST (Central GST)**: Collected by the central government\n- **SGST (State GST)**: Collected by the state government\n- **IGST (Integrated GST)**: For inter-state transactions\n\n## How to Calculate GST\n\nFor intra-state transactions:\n- CGST = Rate / 2\n- SGST = Rate / 2\n\nFor inter-state transactions:\n- IGST = Full Rate\n\nUse our free GST Calculator to compute exact amounts instantly.",
      author: "ToolPilot Team",
      categoryId: guidesCat?.id,
      seoTitle: "GST Calculation Guide India | ToolPilot Blog",
      seoDescription: "Complete guide to calculating CGST, SGST, and IGST in India with free online GST calculator.",
      status: "PUBLISHED",
      publishedAt: new Date("2025-01-22"),
    },
    {
      slug: "build-ats-friendly-resume",
      title: "How to Build an ATS-Friendly Resume That Gets Interviews",
      excerpt: "Discover what Applicant Tracking Systems look for and how to optimize your resume to pass ATS screening.",
      content: "Over 75% of resumes are rejected by ATS before a human ever sees them. Here's how to build a resume that passes both automated and human screening.\n\n## What is an ATS?\n\nAn Applicant Tracking System (ATS) is software used by employers to manage job applications. It scans, sorts, and ranks resumes based on keywords and formatting.\n\n## Tips for ATS-Friendly Resumes\n\n1. Use standard section headings (Experience, Education, Skills)\n2. Avoid tables, graphics, and columns\n3. Include relevant keywords from the job description\n4. Use a clean, simple format\n5. Save as PDF or DOCX\n\n## Check Your Resume with ToolPilot\n\nOur free Resume ATS Checker analyzes your resume against any job description and provides a compatibility score with actionable improvement suggestions.",
      author: "ToolPilot Team",
      categoryId: guidesCat?.id,
      seoTitle: "Build ATS-Friendly Resume Guide | ToolPilot Blog",
      seoDescription: "Learn how to build an ATS-friendly resume that passes automated screening. Free tools and tips included.",
      status: "PUBLISHED",
      publishedAt: new Date("2025-02-01"),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log(`Seeded ${blogPosts.length} blog posts`);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  if (adminEmail) {
    const hashedPassword = await hash(adminPassword, 12);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "SUPER_ADMIN" },
      create: { email: adminEmail, role: "SUPER_ADMIN", name: "Admin", password: hashedPassword },
    });
    console.log(`Created admin user: ${adminEmail}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
