import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/** Generate a unique 5-character alphanumeric code */
function generateUniqueCode(): string {
  // Use crypto for randomness, then take 5 chars
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No 0/O/1/I to avoid confusion
  let code = "";
  const bytes = crypto.randomBytes(5);
  for (let i = 0; i < 5; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

/** GET /api/admin/guests — list all guests with category info */
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("guests")
    .select("*, guest_categories(name)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data tamu." },
      { status: 500 }
    );
  }

  return NextResponse.json({ guests: data });
}

/** POST /api/admin/guests — create a new guest */
export async function POST(req: Request) {
  let body: {
    name?: string;
    category_id?: string;
    pax?: number;
    contact_type?: string;
    contact?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 100);
  if (!name) {
    return NextResponse.json(
      { error: "Nama tamu wajib diisi." },
      { status: 400 }
    );
  }

  // Generate unique code with collision retry
  let uniqueCode = generateUniqueCode();
  let attempts = 0;
  const maxAttempts = 10;
  while (attempts < maxAttempts) {
    const { data: existing } = await supabaseAdmin
      .from("guests")
      .select("id")
      .eq("unique_code", uniqueCode)
      .single();

    if (!existing) break;
    uniqueCode = generateUniqueCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    return NextResponse.json(
      { error: "Gagal membuat kode unik. Coba lagi." },
      { status: 500 }
    );
  }

  const contactType = (body.contact_type ?? "WhatsApp").trim().slice(0, 50);
  const contact = (body.contact ?? "").trim().slice(0, 100);
  const pax = Math.max(1, Math.min(body.pax ?? 1, 20));

  const { data, error } = await supabaseAdmin
    .from("guests")
    .insert({
      unique_code: uniqueCode,
      name,
      category_id: body.category_id || null,
      pax,
      contact_type: contactType,
      contact,
    })
    .select("*, guest_categories(name)")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Gagal menambahkan tamu." },
      { status: 500 }
    );
  }

  return NextResponse.json({ guest: data }, { status: 201 });
}

/** PUT /api/admin/guests — update a guest */
export async function PUT(req: Request) {
  let body: {
    id?: string;
    name?: string;
    category_id?: string;
    pax?: number;
    contact_type?: string;
    contact?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined)
    updates.name = (body.name ?? "").trim().slice(0, 100);
  if (body.category_id !== undefined)
    updates.category_id = body.category_id || null;
  if (body.pax !== undefined) updates.pax = Math.max(1, Math.min(body.pax, 20));
  if (body.contact_type !== undefined)
    updates.contact_type = (body.contact_type ?? "").trim().slice(0, 50);
  if (body.contact !== undefined)
    updates.contact = (body.contact ?? "").trim().slice(0, 100);

  const { data, error } = await supabaseAdmin
    .from("guests")
    .update(updates)
    .eq("id", body.id)
    .select("*, guest_categories(name)")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui data tamu." },
      { status: 500 }
    );
  }

  return NextResponse.json({ guest: data });
}

/** DELETE /api/admin/guests — delete a guest */
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("guests")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Gagal menghapus tamu." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
