export interface FAQ {
  question: string;
  answer: string;
}

export interface ToolConfig {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  longDescription: string;
  instructions: string[];
  processingType: "browser" | "server" | "ai" | "heavy";
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  icon: string;
  featured?: boolean;
  popular?: boolean;
  faqs: { question: string; answer: string }[];
  relatedTools: string[];
}

export interface ToolCategory {
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface ToolUsageEvent {
  event: string;
  page: string;
  metadata?: Record<string, unknown>;
}
