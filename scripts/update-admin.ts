import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const oldEmail = "admin@toolpilotpro.in";
  const newEmail = "sandydixit8@gmail.com";
  const password = "admin123";

  const existing = await prisma.user.findUnique({ where: { email: newEmail } });
  if (existing) {
    console.log(`User ${newEmail} already exists — updating role to SUPER_ADMIN`);
    await prisma.user.update({ where: { email: newEmail }, data: { role: "SUPER_ADMIN" } });
  } else {
    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.upsert({
      where: { email: oldEmail },
      update: { email: newEmail, role: "SUPER_ADMIN" },
      create: { email: newEmail, role: "SUPER_ADMIN", name: "Admin", password: hashedPassword },
    });
    console.log(`Admin user updated: ${user.email} (${user.role})`);
  }

  await prisma.$disconnect();
}

main()
  .catch((e) => { console.error(e); process.exit(1); });
