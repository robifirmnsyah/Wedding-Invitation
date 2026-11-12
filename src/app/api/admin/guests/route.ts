import { NextResponse } from "next/server";
import { clearGuest, createGuest, listGuests, updateGuest } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const side = new URL(req.url).searchParams.get("side");
    const guests = await listGuests(side === "bride" || side === "groom" ? side : undefined);
    return NextResponse.json({ guests });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal mengambil data tamu." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!String(body.name ?? "").trim() || !body.category_id) return NextResponse.json({ error: "Nama dan kategori wajib diisi." }, { status: 400 });
    const guest = await createGuest({ name: String(body.name), category_id: String(body.category_id), pax: Number(body.pax ?? 1), contact_type: String(body.contact_type ?? "WhatsApp"), contact: String(body.contact ?? ""), side: body.side === "bride" ? "bride" : "groom" });
    return NextResponse.json({ guest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal menambahkan tamu." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
    const guest = await updateGuest(String(body.id), {
      ...(body.name !== undefined ? { name: String(body.name) } : {}),
      ...(body.category_id !== undefined ? { category_id: body.category_id ? String(body.category_id) : null } : {}),
      ...(body.pax !== undefined ? { pax: Number(body.pax) } : {}),
      ...(body.contact_type !== undefined ? { contact_type: String(body.contact_type) } : {}),
      ...(body.contact !== undefined ? { contact: String(body.contact) } : {}),
    });
    return NextResponse.json({ guest });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memperbarui tamu." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
  try {
    await clearGuest(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal menghapus tamu." }, { status: 500 });
  }
}
