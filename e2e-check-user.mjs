import { readFileSync } from "fs";
const env = readFileSync(".env", "utf8");
function getEnv(key) {
  const m = env.match(new RegExp(`^${key}="?(.*?)"?$`, "m"));
  return m ? m[1] : "";
}
process.env.DATABASE_URL = getEnv("DATABASE_URL");
process.env.AUTH_SECRET = getEnv("AUTH_SECRET") || "test";

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

const users = await prisma.user.findMany({
  select: { id: true, email: true, name: true, role: true, password: true, emailVerified: true },
});
console.log(`Total users: ${users.length}`);
for (const u of users) {
  console.log(
    `email=${u.email} role=${u.role} hasPassword=${!!u.password} hasVerified=${u.emailVerified ? "yes" : "no"}`
  );
}
const admin = users.find((u) => u.email === "admin@toolpilotpro.in");
if (admin && admin.password) {
  const { compare } = await import("bcryptjs");
  const ok = await compare(getEnv("ADMIN_PASSWORD"), admin.password);
  console.log(`Stored admin password matches .env ADMIN_PASSWORD: ${ok}`);
} else {
  console.log("admin@toolpilotpro.in: no password hash present -> credentials login will fail");
}

const { compare } = await import("bcryptjs");
for (const u of users) {
  if (u.password) {
    const ok = await compare(getEnv("ADMIN_PASSWORD"), u.password);
    console.log(`.env password matches ${u.email}: ${ok}`);
  }
}
await prisma.$disconnect();