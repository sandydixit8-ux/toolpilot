import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { newsletterCampaignSchema } from "@/lib/validations";
import { sendEmail, isConfigured } from "@/lib/email";

export const dynamic = "force-dynamic";

function broadcastHtml(subject: string, content: string): string {
  const body = content
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px;line-height:1.7;">${p.replace(/\n/g, "<br>").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
    .join("");
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.toolpilotpro.in";
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;padding:24px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto">
    <tr><td style="padding:16px 0">
      <a href="${site}" style="font-size:20px;font-weight:bold;color:#2563eb;text-decoration:none">Tool<span style="color:#f59e0b">Pilot</span> Pro</a>
    </td></tr>
    <tr><td style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
      <h1 style="font-size:18px;color:#111827;margin:0 0 16px">${subject.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</h1>
      ${body}
    </td></tr>
    <tr><td style="padding:16px 0;font-size:12px;color:#9ca3af">
      <a href="${site}" style="color:#2563eb;text-decoration:none">ToolPilot Pro</a> — free online tools for work, money, career &amp; everyday life.
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendSequential(emails: string[], subject: string, html: string): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < emails.length; i += 10) {
    const batch = emails.slice(i, i + 10);
    const results = await Promise.all(batch.map((to) => sendEmail({ to, subject, html })));
    for (const ok of results) {
      if (ok) sent += 1;
      else failed += 1;
    }
  }
  return { sent, failed };
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  try {
    const body = await request.json();
    const parsed = newsletterCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { subject, content, testEmail } = parsed.data;

    if (!isConfigured()) {
      return NextResponse.json(
        { error: "SMTP is not configured yet. Add SMTP_HOST / SMTP_USER / SMTP_PASS env vars in Vercel to send emails." },
        { status: 400 }
      );
    }

    const html = broadcastHtml(subject, content);

    if (testEmail) {
      const ok = await sendEmail({ to: testEmail, subject: `[Test] ${subject}`, html });
      return NextResponse.json({ mode: "test", sent: ok ? 1 : 0, error: ok ? null : "Test email could not be sent." });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { confirmed: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No confirmed subscribers yet." }, { status: 409 });
    }

    const { sent, failed } = await sendSequential(subscribers.map((s) => s.email), subject, html);

    const campaign = await prisma.newsletterCampaign.create({
      data: { subject, content, sentCount: sent, failedCount: failed },
    });

    return NextResponse.json({ mode: "broadcast", campaignId: campaign.id, sent, failed, total: subscribers.length });
  } catch (error) {
    console.error("[Admin Newsletter Send]", error);
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 });
  }
}