import { PrismaClient } from "@prisma/client";
import { getRelatedArticles } from "../src/lib/blog-links";
import { allTools } from "../src/config/tools";

/**
 * Validates that every slug in src/lib/blog-links.ts points to a PUBLISHED
 * blog post. Run before committing:
 *
 *   npx tsx scripts/validate-blog-links.ts
 *
 * Exits non-zero if any link is stale (archived/missing post).
 */
const prisma = new PrismaClient();

async function main() {
  const referenced = new Map<string, string[]>();
  for (const t of allTools) {
    for (const a of getRelatedArticles(t.slug)) {
      const list = referenced.get(a.slug) || [];
      list.push(t.slug);
      referenced.set(a.slug, list);
    }
  }

  const posts = await prisma.blogPost.findMany({ select: { slug: true, status: true } });
  const status = new Map(posts.map((p) => [p.slug, p.status]));

  const errors: string[] = [];
  for (const [slug, tools] of referenced) {
    const st = status.get(slug);
    if (!st) errors.push(`MISSING    /blog/${slug}  (from ${tools.join(", ")})`);
    else if (st !== "PUBLISHED") errors.push(`NOT LIVE (${st})  /blog/${slug}  (from ${tools.join(", ")})`);
  }

  console.log(`tools mapped: ${[...referenced.values()].filter((v) => v.length).length}/${allTools.length}`);
  console.log(`distinct guides referenced: ${referenced.size}`);
  console.log(`total links: ${[...referenced.values()].reduce((n, v) => n + v.length, 0)}`);

  if (errors.length) {
    console.error(`\nERRORS (${errors.length}):`);
    for (const e of errors) console.error("  " + e);
    process.exitCode = 1;
  } else {
    console.log("\nOK: every related-article link points to a PUBLISHED post.");
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
