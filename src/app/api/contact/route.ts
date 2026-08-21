import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

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

    await prisma.contactSubmission.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        subject: result.data.subject,
        message: result.data.message,
      },
    });

    return NextResponse.json({ success: true, data: { message: "Thank you for your message. We will get back to you soon." } });
  } catch {
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR", message: "Failed to submit" } }, { status: 500 });
  }
}
