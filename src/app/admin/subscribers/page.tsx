import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-page-auth";

export const metadata: Metadata = {
  title: "Newsletter Subscribers | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminSubscribersPage() {
  await requireAdminPage();
  const [subscribers, confirmed] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.newsletterSubscriber.count({ where: { confirmed: true } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Newsletter Subscribers</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {subscribers.length} total · {confirmed} confirmed
          </p>
        </div>
        <Link
          href="/admin/newsletter"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Compose &amp; send newsletter
        </Link>
      </div>

      {subscribers.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500">No subscribers yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{sub.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${sub.confirmed ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                      {sub.confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {sub.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
