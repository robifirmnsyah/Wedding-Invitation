import { isAdmin } from "@/lib/require-admin";
import { NextResponse } from "next/server";
import { cleanupSpreadsheet } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const result = await cleanupSpreadsheet();
    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
