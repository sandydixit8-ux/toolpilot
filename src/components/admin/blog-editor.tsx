"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface BlogCategory {
  id: string;
  name: string;
}

interface BlogPostData {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  categoryId: string;
  seoTitle: string;
  seoDescription: string;
  status: string;
}

export function BlogEditor({ existing }: { existing?: BlogPostData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [form, setForm] = useState<BlogPostData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    author: "ToolPilot Team",
    categoryId: "",
    seoTitle: "",
    seoDescription: "",
    status: "DRAFT",
    ...existing,
  });

  useEffect(() => {
    fetch("/api/admin/blog/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const set = (field: keyof BlogPostData, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = existing?.id ? `/api/admin/blog/${existing.id}` : "/api/admin/blog";
    const method = existing?.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.slug || autoSlug(form.title),
          seoTitle: form.seoTitle || form.title,
          seoDescription: form.seoDescription || form.excerpt || form.title,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      router.push("/admin/blog");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Content</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Blog post title" className="mt-1" />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated-from-title" className="mt-1" />
            </div>
            <div>
              <Label>Author</Label>
              <Input value={form.author} onChange={(e) => set("author", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} placeholder="Short summary for cards and SEO" className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label>Content (Markdown-like: ## for headings, - for lists, 1. for numbered, **bold**)</Label>
              <Textarea value={form.content} onChange={(e) => set("content", e.target.value)} rows={16} required placeholder="Write your blog post content here..." className="mt-1 font-mono text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">SEO</h2>
          <div>
            <Label>SEO Title</Label>
            <Input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder="Defaults to post title" className="mt-1" />
          </div>
          <div>
            <Label>SEO Description</Label>
            <Textarea value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} rows={2} placeholder="Defaults to excerpt" className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : existing?.id ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
