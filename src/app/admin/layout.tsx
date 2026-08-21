import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const role = (session.user as Record<string, string> | undefined)?.role;
  if (role !== "SUPER_ADMIN") {
    redirect("/");
  }
  return <>{children}</>;
}
