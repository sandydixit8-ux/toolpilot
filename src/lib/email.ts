import nodemailer from "nodemailer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.toolpilotpro.in";

function getHost(): string {
  return process.env.SMTP_HOST || process.env.EMAIL_HOST || "";
}

function getPort(): number {
  return Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 465);
}

function getAuth() {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  if (!user) return undefined;
  return { user, pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || "" };
}

/**
 * Build a transport for one of the two TLS modes.
 *
 * `secure: true` means implicit TLS from the first byte (port 465). Ports 587
 * and 25 instead start in plaintext and upgrade with STARTTLS, so `secure`
 * must be false there. Getting this pairing wrong is the classic
 * "wrong version number" TLS error, which is exactly what production was
 * hitting while every newsletter confirmation silently failed.
 */
function buildTransport(secure: boolean) {
  return nodemailer.createTransport({
    host: getHost(),
    port: getPort(),
    secure,
    requireTLS: !secure,
    auth: getAuth(),
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

/** Port and error message that indicate the TLS mode is the problem, not the credentials. */
function isTlsModeError(message: string): boolean {
  return /wrong version number|record layer|SSL routines|unable to verify|ECONNRESET|ETIMEDOUT/i.test(message);
}

/** Which TLS modes to try, in order, for the configured port. */
function tlsModes(): boolean[] {
  const explicit = process.env.SMTP_SECURE;
  if (explicit !== undefined && explicit !== "") return [explicit === "true"];
  return getPort() === 465 ? [true, false] : [false, true];
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

export async function sendEmailDetailed({ to, subject, html }: SendEmailOptions): Promise<{ ok: boolean; error?: string }> {
  if (!isConfigured()) {
    const reason = "SMTP is not configured. Add SMTP_HOST, SMTP_USER and SMTP_PASS as Vercel env vars.";
    console.log(`[EMAIL SKIPPED - no SMTP config] To: ${to} | Subject: ${subject}`);
    return { ok: false, error: reason };
  }

  let lastError = "unknown error";
  const modes = tlsModes();

  for (let i = 0; i < modes.length; i++) {
    const secure = modes[i];
    try {
      await buildTransport(secure).sendMail({
        from: process.env.SMTP_FROM || process.env.EMAIL_FROM || `"ToolPilot" <${getAuth()?.user ?? ""}>`,
        to,
        subject,
        html,
      });
      return { ok: true };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      const retryable = i < modes.length - 1 && isTlsModeError(lastError);
      console.error(
        `[EMAIL ERROR] port=${getPort()} secure=${secure}: ${lastError}${retryable ? " (retrying with the other TLS mode)" : ""}`
      );
      if (!retryable) break;
    }
  }

  return { ok: false, error: lastError };
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  return (await sendEmailDetailed(options)).ok;
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