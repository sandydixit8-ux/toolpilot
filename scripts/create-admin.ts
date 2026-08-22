import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("admin123", 12);
  const user = await prisma.user.upsert({
    where: { email: "admin@toolpilotpro.in" },
    update: { role: "SUPER_ADMIN", password: hashedPassword },
    create: {
      email: "admin@toolpilotpro.in",
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
