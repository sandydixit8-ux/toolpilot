import { ToolConfig } from "@/types/tool";
import { pdfTools } from "./tools-pdf";
import { imageTools } from "./tools-image";
import { calculatorTools } from "./tools-calculators";
import { developerTools } from "./tools-developer";
import { careerTools } from "./tools-career";
import { businessTools } from "./tools-business";
import { aiTools } from "./tools-ai";

export const allTools: ToolConfig[] = [
  ...pdfTools,
  ...imageTools,
  ...calculatorTools,
  ...developerTools,
  ...careerTools,
  ...businessTools,
  ...aiTools,
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return allTools.find((t) => t.slug === slug);
}

export function getToolsByCategory(categorySlug: string): ToolConfig[] {
  return allTools.filter((t) => t.categorySlug === categorySlug);
}

export function getPopularTools(): ToolConfig[] {
  return allTools.filter((t) => t.popular);
}

export function getFeaturedTools(): ToolConfig[] {
  return allTools.filter((t) => t.featured);
}

export function searchTools(query: string): ToolConfig[] {
  const q = query.toLowerCase();
  return allTools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

export { pdfTools, imageTools, calculatorTools, developerTools, careerTools, businessTools, aiTools };
