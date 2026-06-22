import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["hadir", "tidak_hadir", "ragu"];

/** GET /api/rsvp?code=XXXXX — look up a guest by unique_code */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") ?? "").trim().toUpperCase();

  if (!code || code.length !== 5) {
    return NextResponse.json(
      { error: "Kode undangan tidak valid." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("guests")
    .select("id, unique_code, name, pax, rsvp_status, wish_message")
    .eq("unique_code", code)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Tamu tidak ditemukan." },
      { status: 404 }
    );
  }

  return NextResponse.json({ guest: data });
}

/** POST /api/rsvp — submit RSVP for a registered guest */
export async function POST(req: Request) {
  let body: {
    code?: string;
    rsvp_status?: string;
    wish_message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = (body.code ?? "").trim().toUpperCase();
  if (!code || code.length !== 5) {
    return NextResponse.json(
      { error: "Kode undangan tidak valid." },
      { status: 400 }
    );
  }

  const rsvpStatus = (body.rsvp_status ?? "").trim();
  if (!VALID_STATUSES.includes(rsvpStatus)) {
    return NextResponse.json(
      { error: "Status kehadiran tidak valid." },
      { status: 400 }
    );
  }

  const wishMessage = (body.wish_message ?? "").trim().slice(0, 500);

  // Look up the guest first
  const { data: guest, error: lookupErr } = await supabase
    .from("guests")
    .select("id")
    .eq("unique_code", code)
    .single();

  if (lookupErr || !guest) {
    return NextResponse.json(
      { error: "Tamu tidak ditemukan." },
      { status: 404 }
    );
  }

  // Update RSVP
  const { data, error } = await supabase
    .from("guests")
    .update({
      rsvp_status: rsvpStatus,
      wish_message: wishMessage,
    })
    .eq("id", guest.id)
    .select("id, unique_code, name, rsvp_status, wish_message")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Gagal menyimpan RSVP." },
      { status: 500 }
    );
  }

  return NextResponse.json({ guest: data });
}
