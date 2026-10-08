import { NextResponse } from "next/server";
import { runHealthChecks } from "@/lib/health";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function authorize(request: Request): Promise<boolean> {
  const secret = process.env.HEALTH_CRON_SECRET;
  const header = request.headers.get("authorization") || "";
  if (secret && header === `Bearer ${secret}`) return true;
  const admin = await requireAdmin();
  return !admin.error;
}

export async function POST(request: Request) {
  if (!(await authorize(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const summary = await runHealthChecks();
    return NextResponse.json(summary);
  } catch (e) {
    console.error("health run failed:", e);
    return NextResponse.json({ error: "health run failed" }, { status: 500 });
  }
}
