import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-page-auth";

export const metadata: Metadata = {
  title: "Contact Submissions | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminContactsPage() {
  await requireAdminPage();
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Contact Submissions</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">{submissions.length} total submissions</p>

      {submissions.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{sub.name}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{sub.email}</p>
                </div>
                <time className="text-xs text-gray-400" dateTime={sub.createdAt.toISOString()}>
                  {sub.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </time>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">{sub.subject}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{sub.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
