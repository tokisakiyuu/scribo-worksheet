import sendToSlack from "@/actions/sendToSlack";
import { NextResponse } from "next/server";

export async function GET() {
  await sendToSlack();
  return NextResponse.json({ ok: true });
}

export const dynamic = "force-dynamic";
