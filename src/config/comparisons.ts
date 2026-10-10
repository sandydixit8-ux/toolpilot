import type { ToolConfig } from "@/types/tool";
import { getToolBySlug } from "./tools";

export interface ToolComparison {
  a: string;
  b: string;
}

export const comparisons: ToolComparison[] = [
  { a: "pdf-to-word", b: "word-to-pdf" },
  { a: "pdf-to-word", b: "pdf-to-excel" },
  { a: "pdf-to-word", b: "pdf-to-jpg" },
  { a: "pdf-merger", b: "pdf-splitter" },
  { a: "pdf-to-jpg", b: "jpg-to-pdf" },
  { a: "png-to-jpg", b: "jpg-to-png" },
  { a: "image-compressor", b: "image-resizer" },
  { a: "image-compressor", b: "image-quality-optimizer" },
  { a: "image-cropper", b: "image-rotator" },
  { a: "json-formatter", b: "json-minifier" },
  { a: "json-formatter", b: "json-validator" },
  { a: "base64-encoder", b: "base64-decoder" },
  { a: "url-encoder", b: "url-decoder" },
  { a: "word-counter", b: "character-counter" },
  { a: "markdown-preview", b: "html-preview" },
  { a: "salary-calculator", b: "income-tax-calculator" },
  { a: "emi-calculator", b: "sip-calculator" },
  { a: "compound-interest-calculator", b: "simple-interest-calculator" },
  { a: "cgpa-to-percentage", b: "gpa-to-percentage" },
  { a: "gst-calculator", b: "income-tax-calculator" },
  { a: "resume-builder", b: "resume-analyzer" },
  { a: "resume-ats-checker", b: "resume-analyzer" },
  { a: "resume-builder", b: "cover-letter-generator" },
  { a: "ai-text-humanizer", b: "ai-paraphraser" },
  { a: "ai-text-summarizer", b: "ai-paraphraser" },
  { a: "ai-cover-letter-generator", b: "cover-letter-generator" },
  { a: "invoice-generator", b: "gst-invoice-generator" },
  { a: "profit-margin-calculator", b: "markup-calculator" },
  { a: "text-translator", b: "transliteration" },
];

export function getComparisonBySlug(
  slug: string
): { a: ToolConfig; b: ToolConfig } | null {
  for (const c of comparisons) {
    if (slug !== `${c.a}-vs-${c.b}` && slug !== `${c.b}-vs-${c.a}`) continue;
    const ta = getToolBySlug(c.a);
    const tb = getToolBySlug(c.b);
    if (ta && tb) return { a: ta, b: tb };
    return null;
  }
  return null;
}