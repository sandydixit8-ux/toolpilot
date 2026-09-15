import { prisma } from "@/lib/prisma";

const STOPWORDS = new Set([
  "how", "to", "the", "and", "for", "with", "your", "you", "a", "of", "in", "on", "free",
  "without", "using", "from", "what", "why", "is", "are", "guide", "guides", "tools",
  "tool", "online", "best", "that", "does", "do", "this", "an", "or", "under", "pdf",
  "tax", "gst", "resume", "calculator", "india", "2026", "2025",
]);

export async function getRelatedPosts(currentSlug: string, title: string) {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED", slug: { not: currentSlug } },
    select: { slug: true, title: true, excerpt: true },
  });

  const tokens = title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));

  const scored = posts
    .map((post) => {
      const hay = post.title.toLowerCase();
      const postTokens = new Set(
        hay
          .replace(/[^a-z0-9 ]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length > 3)
      );
      let score = 0;
      for (const token of tokens) {
        if (postTokens.has(token)) score += 2;
        if (hay.includes(token)) score += 1;
      }
      return { post, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.post);

  return scored.length ? scored : [];
}