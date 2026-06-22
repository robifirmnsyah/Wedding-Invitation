import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/** GET /api/admin/categories — list all categories */
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("guest_categories")
    .select("*")
    .order("name");

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
  let body: { name?: string };
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

  const { data, error } = await supabaseAdmin
    .from("guest_categories")
    .insert({ name })
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
