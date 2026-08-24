import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: result.error.errors[0].message } },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    await prisma.contactSubmission.create({
      data: { name, email, subject, message },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://toolpilotpro.in";

    // Auto-reply to user
    await sendEmail({
      to: email,
      subject: `We received your message — ToolPilot`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="color:#1a1a1a;margin-bottom:8px;">Thanks for reaching out, ${name}!</h2>
          <p style="color:#666;margin-bottom:16px;">We've received your message about "<strong>${subject}</strong>" and will get back to you within 24 hours.</p>
          <p style="color:#666;margin-bottom:24px;">In the meantime, feel free to explore our <a href="${siteUrl}/tools" style="color:#2563eb;">free tools</a>.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="color:#999;font-size:12px;">ToolPilot — Free online tools for work, money, and everyday life.</p>
        </div>
      `,
    });

    // Notify admin
    const adminEmail = process.env.ADMIN_EMAIL || "sandydixit8@gmail.com";
    await sendEmail({
      to: adminEmail,
      subject: `[ToolPilot] New contact: ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="color:#1a1a1a;margin-bottom:8px;">New Contact Submission</h2>
          <table style="width:100%;font-size:14px;color:#333;">
            <tr><td style="padding:4px 0;color:#999;">From:</td><td>${name} (${email})</td></tr>
            <tr><td style="padding:4px 0;color:#999;">Subject:</td><td>${subject}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px;font-size:14px;color:#333;">${message}</div>
          <p style="margin-top:16px;"><a href="${siteUrl}/admin/contacts" style="color:#2563eb;">View in Admin Dashboard</a></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data: { message: "Thank you for your message. We will get back to you soon." } });
  } catch (error) {
    console.error("[Contact]", error);
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to submit" } }, { status: 500 });
  }
}
