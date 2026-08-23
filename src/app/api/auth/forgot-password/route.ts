import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, passwordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with that email, a reset link has been sent.",
      });
    }

    // Invalidate old tokens
    await prisma.passwordResetToken.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true },
    });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { token, email: normalizedEmail, expiresAt },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://toolpilotpro.in"}/auth/reset-password?token=${token}`;

    const emailContent = passwordResetEmail(resetUrl);
    const emailSent = await sendEmail({
      to: normalizedEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (emailSent) {
      console.log(`[PASSWORD RESET] Email sent to ${normalizedEmail}`);
    } else {
      console.log(`\n========== PASSWORD RESET (no SMTP) ==========\nEmail: ${normalizedEmail}\nReset URL: ${resetUrl}\nExpires: ${expiresAt.toISOString()}\n==============================================\n`);
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with that email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
