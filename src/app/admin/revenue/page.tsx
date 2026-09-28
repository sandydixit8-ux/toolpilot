import { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin-page-auth";
import { AdminRevenueClient } from "@/components/admin/admin-revenue-client";

export const metadata: Metadata = {
  title: "Revenue | Admin | ToolPilot",
  robots: { index: false, follow: false },
};

export default async function AdminRevenue() {
  await requireAdminPage();
  return <AdminRevenueClient />;
}