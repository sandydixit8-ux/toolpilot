import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const posts = await p.blogPost.findMany({ select: { id: true, title: true, slug: true } });
  posts.forEach((x, i) => console.log(`${i + 1}. ${x.title} [${x.slug}]`));
  console.log(`Total: ${posts.length}`);
  await p.$disconnect();
}
main();
