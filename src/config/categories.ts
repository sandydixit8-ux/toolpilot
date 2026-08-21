import { ToolCategory } from "@/types/tool";

export const categories: ToolCategory[] = [
  { name: "PDF Tools", slug: "pdf", icon: "FileText", description: "Convert, merge, split, and compress PDF files" },
  { name: "Image Tools", slug: "image", icon: "Image", description: "Compress, resize, and convert images" },
  { name: "Calculators", slug: "calculators", icon: "Calculator", description: "Financial, health, and math calculators" },
  { name: "Career Tools", slug: "career", icon: "Briefcase", description: "Resume builder, ATS checker, and career utilities" },
  { name: "Business Tools", slug: "business", icon: "Building2", description: "Invoice, quotation, and business calculators" },
  { name: "Developer Tools", slug: "developer", icon: "Code2", description: "JSON, Base64, URL encoding, and more" },
  { name: "AI Tools", slug: "ai", icon: "Sparkles", description: "AI-powered text humanizer, summarizer, and more" },
];
