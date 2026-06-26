import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateFreshGuestCode, getCategorySide, normalizeSide } from "@/lib/guests";

export const dynamic = "force-dynamic";

/** GET /api/admin/guests — list all guests with category info */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const side = searchParams.get("side");

  let query = supabaseAdmin
    .from("guests")
    .select("*, guest_categories(name)")
    .order("created_at", { ascending: false });

  if (side) {
    query = query.eq("side", normalizeSide(side));
  }

  const { data, error } = await query;

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
    side?: string;
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
  
  if (!body.category_id) {
    return NextResponse.json(
      { error: "Kategori wajib diisi." },
      { status: 400 }
    );
  }

  // Derive side from category, fallback to provided side or default 'groom'
  let side = body.side ? normalizeSide(body.side) : "groom";
  const catSide = await getCategorySide(supabaseAdmin, body.category_id);
  if (catSide) {
    side = catSide;
  }

  const uniqueCode = await generateFreshGuestCode(supabaseAdmin);
  if (!uniqueCode) {
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
      category_id: body.category_id,
      side,
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
  
  if (body.category_id !== undefined) {
    updates.category_id = body.category_id || null;
    if (body.category_id) {
      const catSide = await getCategorySide(supabaseAdmin, body.category_id);
      if (catSide) {
        updates.side = catSide;
      }
    }
  }

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
