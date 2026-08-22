import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAdminPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/auth/login");
  }
  if ((session.user as { role?: string }).role !== "SUPER_ADMIN") {
    redirect("/auth/login");
  }
  return session;
}
