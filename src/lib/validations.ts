import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export const leadSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  city: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
  toolSlug: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must consent to our privacy policy" }),
  }),
});

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const adminToolSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().optional(),
  instructions: z.array(z.string()),
  categoryId: z.string(),
  processingType: z.enum(["BROWSER", "SERVER", "AI", "HEAVY"]),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "DISABLED", "ARCHIVED"]),
  featured: z.boolean(),
  popular: z.boolean(),
  order: z.number(),
  icon: z.string().optional(),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  keywords: z.array(z.string()),
});

export const blogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  author: z.string().default("ToolPilot Team"),
  categoryId: z.string().optional(),
  tags: z.array(z.string()),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "UPDATED", "ARCHIVED"]),
});

export const analyticsEventSchema = z.object({
  event: z.string().min(1),
  page: z.string().min(1),
  metadata: z.record(z.unknown()).optional(),
});
