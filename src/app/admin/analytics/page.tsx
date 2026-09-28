import { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin-page-auth";
import { AdminAnalyticsClient } from "@/components/admin/admin-analytics-client";

export const metadata: Metadata = {
  title: "Analytics | Admin | ToolPilot",
  robots: { index: false, follow: false },
};

export default async function AdminAnalytics() {
  await requireAdminPage();
  return <AdminAnalyticsClient />;
}