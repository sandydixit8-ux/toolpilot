import { Metadata } from "next";
import { BlogEditor } from "@/components/admin/blog-editor";
import { requireAdminPage } from "@/lib/admin-page-auth";

export const metadata: Metadata = {
  title: "New Blog Post | Admin",
  robots: { index: false, follow: false },
};

export default async function NewBlogPostPage() {
  await requireAdminPage();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">New Blog Post</h1>
      <BlogEditor />
    </div>
  );
}
