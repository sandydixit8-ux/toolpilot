import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-page-auth";
import { NewsletterComposer } from "@/components/admin/newsletter-composer";

export const metadata: Metadata = {
  title: "Send Newsletter | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminNewsletterPage() {
  await requireAdminPage();

  const [total, confirmed, campaigns] = await Promise.all([
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { confirmed: true } }),
    prisma.newsletterCampaign.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Send Newsletter</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {total} total subscribers · {confirmed} confirmed{total - confirmed ? ` · ${total - confirmed} pending` : ""}
      </p>

      <NewsletterComposer
        initial={{
          subscribers: { total, confirmed, pending: total - confirmed },
          campaigns: campaigns.map((c) => ({
            id: c.id,
            subject: c.subject,
            sentCount: c.sentCount,
            failedCount: c.failedCount,
            createdAt: c.createdAt.toISOString(),
          })),
        }}
      />
    </div>
  );
}