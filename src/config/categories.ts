import { ToolCategory } from "@/types/tool";

export const categories: ToolCategory[] = [
  { name: "PDF Tools", slug: "pdf", icon: "FileText", description: "Convert, merge, split, compress, and rotate PDF files online for free" },
  { name: "Image Tools", slug: "image", icon: "Image", description: "Compress, resize, crop, and convert images in your browser" },
  { name: "Calculators", slug: "calculators", icon: "Calculator", description: "Free Indian tax, EMI, GST, SIP, and health calculators" },
  { name: "Career Tools", slug: "career", icon: "Briefcase", description: "Build resumes, check ATS scores, and prepare for job interviews" },
  { name: "Business Tools", slug: "business", icon: "Building2", description: "Create invoices, quotations, and estimate project costs online" },
  { name: "Developer Tools", slug: "developer", icon: "Code2", description: "Format JSON, encode Base64 and URLs, and generate UUIDs" },
  { name: "AI Tools", slug: "ai", icon: "Sparkles", description: "AI tools to humanize, summarize, and rewrite text fast" },
];
