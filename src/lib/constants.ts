export const SITE_NAME = "ToolPilot";
export const SITE_TAGLINE = "Free Online Tools for Work, Money, Career & Everyday Life";
export const SITE_DESCRIPTION =
  "Fast, simple and privacy-friendly tools — no complicated software required.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://toolpilotpro.in";

export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
export const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "";

export const CATEGORIES = [
  { name: "PDF Tools", slug: "pdf", icon: "FileText", description: "Convert, merge, split, and compress PDF files" },
  { name: "Image Tools", slug: "image", icon: "Image", description: "Compress, resize, and convert images" },
  { name: "Calculators", slug: "calculators", icon: "Calculator", description: "Financial, health, and math calculators" },
  { name: "Career Tools", slug: "career", icon: "Briefcase", description: "Resume builder, ATS checker, and career utilities" },
  { name: "Business Tools", slug: "business", icon: "Building2", description: "Invoice, quotation, and business calculators" },
  { name: "Developer Tools", slug: "developer", icon: "Code2", description: "JSON, Base64, URL encoding, and more" },
  { name: "AI Tools", slug: "ai", icon: "Sparkles", description: "AI-powered text humanizer, summarizer, and more" },
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_PDF_TYPES = ["application/pdf"];
export const ALLOWED_DOCX_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const RATE_LIMITS = {
  anonymous: { heavy: 10, api: 100 },
  authenticated: { heavy: 50, api: 500 },
  premium: { heavy: 200, api: 2000 },
} as const;
