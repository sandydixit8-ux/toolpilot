import { Metadata } from "next";
import { requireAdminPage } from "@/lib/admin-page-auth";
import { AdminBlogClient } from "@/components/admin/admin-blog-client";

export const metadata: Metadata = {
  title: "Blog Posts | Admin | ToolPilot",
  robots: { index: false, follow: false },
};

export default async function AdminBlog() {
  await requireAdminPage();
  return <AdminBlogClient />;
}