import { prisma, withDbRetry } from "@/lib/prisma";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

/**
 * RSS 2.0 feed for /feed.xml.
 *
 * A feed gives aggregators, newsletters and some crawlers a clean way to pick
 * up new posts without re-crawling the whole sitemap. Generated at build time
 * and degrades to an empty feed if the database is briefly unreachable, so a
 * DB blip can never fail the deployment.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let posts: {
    slug: string;
    title: string;
    excerpt: string | null;
    publishedAt: Date | null;
    updatedAt: Date;
  }[] = [];

  try {
    posts = await withDbRetry(() =>
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ publishedAt: "desc" }],
        take: 50,
        select: {
          slug: true,
          title: true,
          excerpt: true,
          publishedAt: true,
          updatedAt: true,
        },
      })
    );
  } catch {
    posts = [];
  }

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const date = p.publishedAt ?? p.updatedAt;
      return [
        "    <item>",
        `      <title>${escapeXml(p.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(date).toUTCString()}</pubDate>`,
        p.excerpt ? `      <description>${escapeXml(p.excerpt)}</description>` : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const lastBuild = posts.length
    ? new Date(Math.max(...posts.map((p) => new Date(p.updatedAt).getTime()))).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE_NAME} Blog`)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(SITE_TAGLINE)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
