import { isAdmin } from "@/lib/require-admin";
import { NextResponse } from "next/server";
import { getGuestStats } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await getGuestStats());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Gagal mengambil statistik.",
      },
      { status: 500 },
    );
  }
}
