import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "sandydixit8@gmail.com";
  const newPassword = "Maa@011169";

  const hashedPassword = await hash(newPassword, 12);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log(`Password updated for ${email}`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
