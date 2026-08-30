import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.toolpilotpro.in";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const categoryPages = ["pdf", "image", "calculators", "career", "business", "developer", "ai"].map((cat) => ({
    url: `${baseUrl}/tools/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const toolSlugs = [
    "pdf-to-word","word-to-pdf","jpg-to-pdf","pdf-to-jpg","pdf-compressor","pdf-merger","pdf-splitter","pdf-page-extractor","pdf-rotator",
    "image-compressor","image-resizer","jpg-to-png","png-to-jpg","webp-converter","image-cropper","image-rotator","image-quality-optimizer",
    "gst-calculator","emi-calculator","salary-calculator","income-tax-calculator","sip-calculator","percentage-calculator","age-calculator",
    "discount-calculator","compound-interest-calculator","simple-interest-calculator","bmi-calculator","unit-converter","time-calculator","date-calculator",
    "resume-builder","resume-ats-checker","resume-jd-matcher","cover-letter-generator","salary-negotiation","notice-period-calculator",
    "experience-calculator","interview-question-generator","job-description-analyzer",
    "invoice-generator","quotation-generator","gst-invoice-generator","profit-margin-calculator","markup-calculator",
    "break-even-calculator","project-cost-calculator","construction-cost-calculator","boq-calculator","roi-calculator",
    "json-formatter","json-validator","json-minifier","base64-encoder","base64-decoder","url-encoder","url-decoder",
    "uuid-generator","timestamp-converter","regex-tester","word-counter","lorem-ipsum-generator",
    "ai-text-humanizer","ai-text-summarizer","ai-paraphraser","ai-cover-letter-generator","ai-resume-summary-generator","ai-email-generator",
  ];

  const toolPages = toolSlugs.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB not available at build time — skip blog posts
  }

  return [...staticPages, ...categoryPages, ...toolPages, ...blogPages];
}
