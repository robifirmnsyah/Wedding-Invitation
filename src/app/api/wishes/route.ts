import { NextResponse } from "next/server";
import { addWish, getWishes } from "@/lib/wishesStore";
import type { Wish } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID: Wish["attendance"][] = ["hadir", "tidak_hadir", "ragu"];

export async function GET() {
  const wishes = await getWishes();
  return NextResponse.json({ wishes });
}

export async function POST(req: Request) {
  let body: Partial<Record<"name" | "message" | "attendance", string>>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const message = (body.message ?? "").trim();
  const attendance = (body.attendance ?? "") as Wish["attendance"];

  if (!name || !message) {
    return NextResponse.json(
      { error: "Nama dan ucapan wajib diisi." },
      { status: 400 }
    );
  }
  if (!VALID.includes(attendance)) {
    return NextResponse.json(
      { error: "Status kehadiran tidak valid." },
      { status: 400 }
    );
  }

  const wish = await addWish({ name, message, attendance });
  return NextResponse.json({ wish }, { status: 201 });
}
