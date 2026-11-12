import { NextResponse } from "next/server";
import { addReply } from "@/lib/wishesStore";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { wishId?: string; name?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const wishId = (body.wishId ?? "").trim();
  const name = (body.name ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!wishId || !name || !message) {
    return NextResponse.json(
      { error: "Nama dan balasan wajib diisi." },
      { status: 400 },
    );
  }

  let reply;
  try {
    reply = await addReply({ wishId, name, message });
  } catch {
    return NextResponse.json(
      { error: "Balasan belum tersimpan." },
      { status: 503 },
    );
  }
  if (!reply) {
    return NextResponse.json(
      { error: "Ucapan tidak ditemukan." },
      { status: 404 },
    );
  }

  return NextResponse.json({ reply }, { status: 201 });
}
