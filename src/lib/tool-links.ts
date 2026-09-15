import { allTools, getPopularTools } from "@/config/tools";
import type { ToolConfig } from "@/types/tool";

const STOPWORDS = new Set([
  "how", "to", "the", "and", "for", "with", "your", "you", "a", "of", "in", "on",
  "free", "without", "using", "from", "what", "why", "is", "are", "guide", "tools",
  "tool", "online", "best", "that", "does", "do", "this", "an", "or", "my",
]);

export function getToolsForArticle(title: string): ToolConfig[] {
  const titleLower = title.toLowerCase();
  const tokens = titleLower
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  const scored = allTools
    .map((tool) => {
      let score = 0;
      for (const kw of tool.keywords) {
        const k = kw.toLowerCase();
        if (k.length > 3 && titleLower.includes(k)) score += 3;
      }
      for (const token of tokens) {
        if (tool.name.toLowerCase().includes(token)) score += 2;
        if (tool.keywords.some((k) => k.toLowerCase().includes(token))) score += 1;
      }
      return { tool, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.tool);

  return scored.length > 0 ? scored : getPopularTools().slice(0, 4);
}