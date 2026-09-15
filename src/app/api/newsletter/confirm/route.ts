import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return new NextResponse(emailPage(false, "Invalid or missing confirmation link"), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  try {
    const sub = await prisma.newsletterSubscriber.findFirst({ where: { token } });

    if (!sub) {
      return new NextResponse(emailPage(false, "This confirmation link is invalid or has already been used."), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    await prisma.newsletterSubscriber.update({
      where: { id: sub.id },
      data: { confirmed: true, confirmedAt: new Date(), token: null },
    });

    return new NextResponse(emailPage(true, ""), {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("[Newsletter Confirm]", error);
    return new NextResponse(emailPage(false, "Something went wrong. Please try again."), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

function emailPage(ok: boolean, error: string): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.toolpilotpro.in";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${ok ? "Subscribed" : "Confirmation"} — ToolPilot Pro</title></head>
<body style="margin:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;padding:24px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto">
    <tr><td style="padding:16px 0">
      <a href="${site}" style="font-size:20px;font-weight:bold;color:#2563eb;text-decoration:none">Tool<span style="color:#f59e0b">Pilot</span> Pro</a>
    </td></tr>
    <tr><td style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb;text-align:center">
      ${ok
        ? `<div style="width:48px;height:48px;border-radius:50%;background:#dcfce7;color:#16a34a;font-size:24px;line-height:48px;margin:0 auto 16px">&#10003;</div>
           <h1 style="font-size:18px;color:#111827;margin:0 0 12px">You're confirmed!</h1>
           <p style="font-size:14px;color:#4b5563;line-height:1.6;margin:0 0 24px">Your email is verified. You'll now receive weekly tips on free tools, shortcuts &amp; productivity hacks.</p>`
        : `<div style="width:48px;height:48px;border-radius:50%;background:#fee2e2;color:#dc2626;font-size:24px;line-height:48px;margin:0 auto 16px">&#10007;</div>
           <h1 style="font-size:18px;color:#111827;margin:0 0 12px">Confirmation failed</h1>
           <p style="font-size:14px;color:#4b5563;line-height:1.6;margin:0 0 24px">${error}</p>`}
      <a href="${site}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Visit ToolPilot Pro</a>
    </td></tr>
  </table>
</body>
</html>`;
}