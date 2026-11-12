import { NextResponse } from "next/server";
import { findGuestByCode, updateRsvp } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["hadir", "tidak_hadir", "ragu"];

export async function GET(req: Request) {
  const code = (new URL(req.url).searchParams.get("code") ?? "").trim().toUpperCase();
  if (!code || code.length !== 5) return NextResponse.json({ error: "Kode undangan tidak valid." }, { status: 400 });
  try {
    const guest = await findGuestByCode(code);
    if (!guest) return NextResponse.json({ error: "Tamu tidak ditemukan." }, { status: 404 });
    return NextResponse.json({ guest });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal mengambil data tamu." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = String(body.code ?? "").trim().toUpperCase();
    const status = String(body.rsvp_status ?? "").trim();
    if (!code || code.length !== 5 || !VALID_STATUSES.includes(status)) return NextResponse.json({ error: "Data RSVP tidak valid." }, { status: 400 });
    return NextResponse.json({ guest: await updateRsvp(code, status, String(body.wish_message ?? "")) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan RSVP.";
    return NextResponse.json({ error: message }, { status: message === "Tamu tidak ditemukan." ? 404 : 500 });
  }
}
