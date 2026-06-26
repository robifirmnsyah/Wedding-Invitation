import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type Side = "bride" | "groom";

/** Normalize an arbitrary value into a valid side, defaulting to "groom". */
function normalizeSide(value: unknown): Side {
  return value === "bride" ? "bride" : "groom";
}

/** GET /api/admin/categories — list categories, optionally filtered by side */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const side = searchParams.get("side");

  let query = supabaseAdmin.from("guest_categories").select("*").order("name");
  if (side === "bride" || side === "groom") {
    query = query.eq("side", side);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data kategori." },
      { status: 500 }
    );
  }

  return NextResponse.json({ categories: data });
}

/** POST /api/admin/categories — create a new category */
export async function POST(req: Request) {
  let body: { name?: string; side?: string; color?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 100);
  if (!name) {
    return NextResponse.json(
      { error: "Nama kategori wajib diisi." },
      { status: 400 }
    );
  }

  const side = normalizeSide(body.side);
  const color = (body.color ?? "slate").trim().slice(0, 50);

  const { data, error } = await supabaseAdmin
    .from("guest_categories")
    .insert({ name, side, color })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Kategori dengan nama ini sudah ada." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Gagal menambahkan kategori." },
      { status: 500 }
    );
  }

  return NextResponse.json({ category: data }, { status: 201 });
}

/** PATCH /api/admin/categories — update a category's name and/or color */
export async function PATCH(req: Request) {
  let body: { id?: string; name?: string; color?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = (body.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
  }

  const updates: { name?: string; color?: string } = {};

  if (body.name !== undefined) {
    const name = body.name.trim().slice(0, 100);
    if (!name) {
      return NextResponse.json(
        { error: "Nama kategori wajib diisi." },
        { status: 400 }
      );
    }
    updates.name = name;
  }

  if (body.color !== undefined) {
    updates.color = body.color.trim().slice(0, 50) || "slate";
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Tidak ada perubahan." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("guest_categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Kategori dengan nama ini sudah ada." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Gagal memperbarui kategori." },
      { status: 500 }
    );
  }

  return NextResponse.json({ category: data });
}

/** DELETE /api/admin/categories — delete a category by id */
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("guest_categories")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Gagal menghapus kategori." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
