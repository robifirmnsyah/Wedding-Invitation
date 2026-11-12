import { NextResponse } from "next/server";
import { addWish, getWishes } from "@/lib/wishesStore";
import type { Wish } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID: Wish["attendance"][] = ["hadir", "tidak_hadir", "ragu"];

export async function GET() {
  try {
    return NextResponse.json({ wishes: await getWishes() });
  } catch {
    return NextResponse.json(
      { error: "Buku tamu sementara belum tersedia." },
      { status: 503 },
    );
  }
}

export async function POST(req: Request) {
  let body: {
    name?: string;
    message?: string;
    attendance?: string;
    verified?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (typeof body.name === "string" ? body.name : "").trim();
  const message = (typeof body.message === "string" ? body.message : "").trim();
  const attendance = (body.attendance ?? "") as Wish["attendance"];

  if (!name || !message) {
    return NextResponse.json(
      { error: "Nama dan ucapan wajib diisi." },
      { status: 400 },
    );
  }
  if (!VALID.includes(attendance)) {
    return NextResponse.json(
      { error: "Status kehadiran tidak valid." },
      { status: 400 },
    );
  }

  try {
    const wish = await addWish({ name, message, attendance, verified: false });
    return NextResponse.json({ wish }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Ucapan belum tersimpan. Silakan coba lagi nanti." },
      { status: 503 },
    );
  }
}
