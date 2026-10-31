import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { requireAdmin } from "@/lib/admin-auth";
import { sendEmailDetailed, isConfigured } from "@/lib/email";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({ to: z.string().email() });

/**
 * SMTP diagnostics for the admin panel.
 *
 * Password resets and newsletter confirmations fail silently in production:
 * the API has to answer the same way whether or not an address exists, so the
 * only place a broken SMTP setup can surface is an authenticated check like
 * this one. GET verifies the connection and credentials without sending
 * anything; POST sends a real message and returns the transport error verbatim.
 */
export async function GET() {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  if (!isConfigured()) {
    return NextResponse.json({
      ok: false,
      configured: false,
      error: "SMTP_HOST is not set. Add SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in Vercel.",
    });
  }

  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  const user = process.env.SMTP_USER || "";

  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      requireTLS: !secure,
      auth: { user, pass: process.env.SMTP_PASS || "" },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
    await transport.verify();
    return NextResponse.json({
      ok: true,
      configured: true,
      host: process.env.SMTP_HOST,
      port,
      secure,
      user: user.replace(/^(.)(.*)(@.*)$/, (_m, a, b, c) => `${a}${"*".repeat(b.length)}${c}`),
      passwordLooksLikeAppPassword: (process.env.SMTP_PASS || "").replace(/\s/g, "").length === 16,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      configured: true,
      host: process.env.SMTP_HOST,
      port,
      secure,
      passwordLooksLikeAppPassword: (process.env.SMTP_PASS || "").replace(/\s/g, "").length === 16,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid recipient address is required." }, { status: 400 });
  }

  const result = await sendEmailDetailed({
    to: parsed.data.to,
    subject: "ToolPilot SMTP test",
    html: `<p>If you can read this, password resets and newsletter confirmations can be delivered.</p><p style="color:#6b7280;font-size:12px">Sent ${new Date().toISOString()}</p>`,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
