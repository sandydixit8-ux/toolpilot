import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogEditor } from "@/components/admin/blog-editor";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Edit Blog Post | Admin",
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const data = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt || "",
    author: post.author,
    categoryId: post.categoryId || "",
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    status: post.status,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Edit Blog Post</h1>
      <BlogEditor existing={data} />
    </div>
  );
}
