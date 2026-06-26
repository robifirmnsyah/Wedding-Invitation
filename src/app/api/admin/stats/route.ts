import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/** GET /api/admin/stats — dashboard statistics */
export async function GET() {
  // Get all guests with side + category info
  const { data: guests, error } = await supabaseAdmin
    .from("guests")
    .select("rsvp_status, pax, side, category_id, guest_categories(name, side, color)");

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
    // Per-side totals (groom = pria, bride = wanita)
    groom: 0,
    groom_pax: 0,
    bride: 0,
    bride_pax: 0,
  };

  for (const g of guests) {
    const pax = g.pax ?? 1;
    stats.total_pax += pax;

    if (g.side === "bride") {
      stats.bride++;
      stats.bride_pax += pax;
    } else {
      stats.groom++;
      stats.groom_pax += pax;
    }

    switch (g.rsvp_status) {
      case "hadir":
        stats.hadir++;
        stats.hadir_pax += pax;
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

  // Category breakdown — keyed by category id so identically named
  // categories on different sides stay separate.
  const catMap: Record<
    string,
    { name: string; side: string; color: string; count: number; pax: number }
  > = {};

  for (const g of guests) {
    const cat = g.guest_categories as unknown as
      | { name: string; side: string; color: string }
      | null;
    const key = g.category_id ?? "none";
    if (!catMap[key]) {
      catMap[key] = {
        name: cat?.name ?? "Tanpa Kategori",
        side: cat?.side ?? g.side ?? "groom",
        color: cat?.color ?? "slate",
        count: 0,
        pax: 0,
      };
    }
    catMap[key].count++;
    catMap[key].pax += g.pax ?? 1;
  }

  const categoryBreakdown = Object.values(catMap).sort(
    (a, b) => b.count - a.count
  );

  return NextResponse.json({
    stats,
    categoryBreakdown,
  });
}
