import { isAdmin } from "@/lib/require-admin";
import { NextResponse } from "next/server";
import {
  getGuestStats,
  getSpreadsheetDetails,
  getSpreadsheetInfo,
} from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [stats, details] = await Promise.all([
      getGuestStats(),
      getSpreadsheetDetails().catch(() => null),
    ]);
    return NextResponse.json({
      ...stats,
      spreadsheet: getSpreadsheetInfo(),
      spreadsheetDetails: details,
    });
  } catch (error) {
    const details = await getSpreadsheetDetails().catch(() => null);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal mengambil statistik.",
        spreadsheet: getSpreadsheetInfo(),
        spreadsheetDetails: details,
      },
      { status: 500 },
    );
  }
}
