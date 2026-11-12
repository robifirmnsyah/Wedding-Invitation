import { NextResponse } from "next/server";
import { clearCategory, createCategory, listCategories, updateCategory } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const side = new URL(req.url).searchParams.get("side");
    return NextResponse.json({ categories: await listCategories(side === "bride" || side === "groom" ? side : undefined) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal mengambil data kategori." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const category = await createCategory({ name: String(body.name ?? ""), side: body.side === "bride" ? "bride" : "groom", color: String(body.color ?? "slate") });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal menambahkan kategori." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
    return NextResponse.json({ category: await updateCategory(String(body.id), { ...(body.name !== undefined ? { name: String(body.name) } : {}), ...(body.color !== undefined ? { color: String(body.color) } : {}) }) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memperbarui kategori." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID wajib diisi." }, { status: 400 });
  try {
    await clearCategory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal menghapus kategori." }, { status: 500 });
  }
}
