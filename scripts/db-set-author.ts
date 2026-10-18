import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const AUTHOR_NAME = "Sandy Dixit";

async function run() {
  const r = await prisma.blogPost.updateMany({
    where: { status: "PUBLISHED", NOT: { author: AUTHOR_NAME } },
    data: { author: AUTHOR_NAME },
  });
  console.log("AUTHOR set on", r.count, "published posts");

  const total = await prisma.blogPost.count({ where: { status: "PUBLISHED" } });
  const withAuthor = await prisma.blogPost.count({ where: { status: "PUBLISHED", author: AUTHOR_NAME } });
  console.log("PUBLISHED:", total, "| with author", AUTHOR_NAME + ":", withAuthor);
}

async function main() {
  for (let i = 0; i < 4; i++) {
    try {
      await run();
      break;
    } catch (e: any) {
      console.log("retry", i, e?.message?.slice(0, 90));
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main().finally(() => prisma.$disconnect());
