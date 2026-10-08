import { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin-page-auth";
import { AdminHealthClient } from "@/components/admin/admin-health-client";

export const metadata: Metadata = {
  title: "Health | Admin | ToolPilot",
  robots: { index: false, follow: false },
};

export default async function AdminHealthPage() {
  await requireAdminPage();
  return <AdminHealthClient />;
}
