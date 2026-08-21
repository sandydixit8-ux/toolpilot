import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

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

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: result.data.email },
    });

    if (existing) {
      return NextResponse.json({ success: true, data: { message: "You are already subscribed!" } });
    }

    await prisma.newsletterSubscriber.create({
      data: { email: result.data.email },
    });

    return NextResponse.json({ success: true, data: { message: "Thank you for subscribing!" } });
  } catch (error) {
    console.error("[Newsletter]", error);
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to subscribe" } }, { status: 500 });
  }
}
