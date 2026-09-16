import nodemailer from "nodemailer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.toolpilotpro.in";

function getTransport() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 465),
    secure: (process.env.SMTP_SECURE ?? "true") === "true" || !process.env.SMTP_PORT,
    auth:
      process.env.SMTP_USER || process.env.EMAIL_USER
        ? { user: process.env.SMTP_USER || process.env.EMAIL_USER, pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || "" }
        : undefined,
  });
}

function isConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST || process.env.EMAIL_HOST);
}

export { isConfigured };

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  const transport = getTransport();
  if (!transport || !isConfigured()) {
    console.log(`[EMAIL SKIPPED - no SMTP config] To: ${to} | Subject: ${subject}`);
    return false;
  }

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.EMAIL_FROM || `"ToolPilot" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("[EMAIL ERROR]", error);
    return false;
  }
}

export function passwordResetEmail(resetUrl: string): { subject: string; html: string } {
  return {
    subject: "Reset your ToolPilot password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a1a1a; margin-bottom: 8px;">Reset your password</h2>
        <p style="color: #666; margin-bottom: 24px;">You requested a password reset for your ToolPilot account. Click the button below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Reset Password</a>
        <p style="color: #999; font-size: 12px; margin-top: 32px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">ToolPilot — Free online tools for work, money, and everyday life.</p>
      </div>
    `,
  };
}

export async function confirmationEmailHtml(link: string): Promise<string> {
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;padding:24px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto">
    <tr><td style="padding:16px 0">
      <a href="${SITE_URL}" style="font-size:20px;font-weight:bold;color:#2563eb;text-decoration:none">Tool<span style="color:#f59e0b">Pilot</span> Pro</a>
    </td></tr>
    <tr><td style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e5e7eb">
      <h1 style="font-size:18px;color:#111827;margin:0 0 12px">Please confirm your subscription</h1>
      <p style="font-size:14px;color:#4b5563;line-height:1.6;margin:0 0 24px">
        Thanks for subscribing to ToolPilot Pro. Click the button below to confirm your email address and start receiving weekly tips on free tools, shortcuts &amp; productivity hacks.
      </p>
      <a href="${link}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">Confirm Subscription</a>
      <p style="font-size:12px;color:#9ca3af;line-height:1.6;margin:24px 0 0">
        If you did not sign up for ToolPilot Pro, you can safely ignore this email.
      </p>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendConfirmationEmail(to: string, token: string): Promise<boolean> {
  const resetUrl = `${SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
  const html = await confirmationEmailHtml(resetUrl);
  return sendEmail({ to, subject: "Confirm your subscription to ToolPilot Pro", html });
}