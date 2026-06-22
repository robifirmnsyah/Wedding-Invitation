import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/** GET /api/admin/stats — dashboard statistics */
export async function GET() {
  // Get all guests
  const { data: guests, error } = await supabaseAdmin
    .from("guests")
    .select("rsvp_status, pax");

  if (error) {
    return NextResponse.json(
      { error: "Gagal mengambil statistik." },
      { status: 500 }
    );
  }

  const stats = {
    total: guests.length,
    hadir: 0,
    tidak_hadir: 0,
    ragu: 0,
    pending: 0,
    total_pax: 0,
    hadir_pax: 0,
  };

  for (const g of guests) {
    stats.total_pax += g.pax ?? 1;
    switch (g.rsvp_status) {
      case "hadir":
        stats.hadir++;
        stats.hadir_pax += g.pax ?? 1;
        break;
      case "tidak_hadir":
        stats.tidak_hadir++;
        break;
      case "ragu":
        stats.ragu++;
        break;
      default:
        stats.pending++;
    }
  }

  // Get category breakdown
  const { data: categories } = await supabaseAdmin
    .from("guest_categories")
    .select("id, name");

  const categoryBreakdown = [];
  if (categories) {
    for (const cat of categories) {
      const catGuests = guests.filter(
        // We need to fetch with category_id for this
        () => false
      );
      categoryBreakdown.push({
        name: cat.name,
        count: catGuests.length,
      });
    }
  }

  // Better approach: get guest counts per category
  const { data: guestsWithCat } = await supabaseAdmin
    .from("guests")
    .select("category_id, guest_categories(name)");

  const catMap: Record<string, { name: string; count: number }> = {};
  if (guestsWithCat) {
    for (const g of guestsWithCat) {
      const catName =
        (g.guest_categories as unknown as { name: string })?.name ??
        "Tanpa Kategori";
      if (!catMap[catName]) catMap[catName] = { name: catName, count: 0 };
      catMap[catName].count++;
    }
  }

  return NextResponse.json({
    stats,
    categoryBreakdown: Object.values(catMap),
  });
}
