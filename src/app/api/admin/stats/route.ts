import { isAdmin } from "@/lib/require-admin";
import { NextResponse } from "next/server";
import { getGuestStats, getSpreadsheetInfo } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const stats = await getGuestStats();
    return NextResponse.json({
      ...stats,
      spreadsheet: getSpreadsheetInfo(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal mengambil statistik.",
        spreadsheet: getSpreadsheetInfo(),
      },
      { status: 500 },
    );
  }
}
