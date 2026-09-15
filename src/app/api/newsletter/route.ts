import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/email";

const IS_PROD = process.env.NODE_ENV === "production";

function makeToken(email: string): string {
  const raw = `${email}|${randomBytes(24).toString("hex")}`;
  return createHash("sha256").update(raw).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: result.error.errors[0].message } },
        { status: 400 }
      );
    }

    const email = result.data.email.toLowerCase();

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

    if (existing && existing.confirmed) {
      return NextResponse.json({ success: true, data: { message: "You are already subscribed!" } });
    }

    const token = makeToken(email);

    if (existing) {
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { token, tokenSentAt: new Date(), confirmed: false },
      });
    } else {
      await prisma.newsletterSubscriber.create({
        data: { email, token, tokenSentAt: new Date(), confirmed: false },
      });
    }

    const sent = await sendConfirmationEmail(email, token);

    return NextResponse.json({
      success: true,
      data: {
        pending: true,
        message: sent
          ? "Almost done — check your inbox to confirm your subscription."
          : "Please confirm your email address to complete your subscription.",
        confirmUrl: IS_PROD ? undefined : `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/newsletter/confirm?token=${token}`,
      },
    });
  } catch (error) {
    console.error("[Newsletter]", error);
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to subscribe" } }, { status: 500 });
  }
}