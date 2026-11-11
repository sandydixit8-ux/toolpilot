import { allTools } from "@/config/tools";

/**
 * Which pages we ask Google (and by extension AdSense) to evaluate.
 *
 * The site grew to 214 indexable URLs: 99 tools, 29 auto-generated "X vs Y"
 * comparison pages and 65 blog posts averaging 600 words. AdSense reviewed
 * that surface on 7 Nov 2026 and returned "Low value content" — the contract
 * is that every page we submit has to earn its place, not that every page
 * exists.
 *
 * So indexing is now opt-in:
 *
 * - Tools are indexable only when they are flagged popular/featured in the
 *   catalogue (the ones with real demand) or are listed as extras below.
 *   The long tail still works for anyone with the link; it just is not part
 *   of the site we present for review.
 * - Blog posts are indexable once they clear BLOG_MIN_WORDS. Anything
 *   shorter is treated as a note, not an article.
 * - Comparison pages ("a-vs-b") are generated from a template and are never
 *   indexable.
 *
 * Flipping a page back on is one flag in the config; nothing is deleted.
 */

export const BLOG_MIN_WORDS = 600;

/** Reversible exceptions: tools with real usage that the catalogue does not flag. */
export const EXTRA_INDEXABLE_TOOL_SLUGS = new Set<string>([
  "video-to-gif",
  "epf-interest-calculator",
  "experience-calculator",
]);

const indexableTools = new Set(
  allTools.filter((t) => t.popular || t.featured).map((t) => t.slug)
);
for (const slug of EXTRA_INDEXABLE_TOOL_SLUGS) indexableTools.add(slug);

export function isToolIndexable(slug: string): boolean {
  return indexableTools.has(slug);
}

export function isComparisonIndexable(): boolean {
  // Template-generated; kept out of the index until each one is rewritten by hand.
  return false;
}

/** Strip markdown so word counts match what a reader actually sees. */
export function countContentWords(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*_>`|~]/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain ? plain.split(" ").length : 0;
}

export function isBlogIndexable(markdown: string | null | undefined): boolean {
  if (!markdown) return false;
  return countContentWords(markdown) >= BLOG_MIN_WORDS;
}
