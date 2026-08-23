import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "sandydixit8@gmail.com";
  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.length < 8) {
    console.error("Error: ADMIN_PASSWORD env var is required (min 8 chars).");
    console.error("Usage: ADMIN_PASSWORD=yourpassword npx tsx scripts/create-admin.ts");
    process.exit(1);
  }

  const hashedPassword = await hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "SUPER_ADMIN", password: hashedPassword },
    create: {
      email,
      role: "SUPER_ADMIN",
      name: "Admin",
      password: hashedPassword,
    },
  });
  console.log("Admin user:", user.email, user.role);
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
