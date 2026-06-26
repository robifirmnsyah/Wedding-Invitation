import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { parseCsv } from "@/lib/csv";
import { generateFreshGuestCode, normalizeSide } from "@/lib/guests";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { side?: string; csv?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const side = normalizeSide(body.side);
  const csv = body.csv || "";
  if (!csv.trim()) {
    return NextResponse.json({ error: "CSV kosong." }, { status: 400 });
  }

  // Parse CSV
  let rows = parseCsv(csv);
  if (rows.length < 2) {
    return NextResponse.json({ error: "CSV tidak valid atau kosong." }, { status: 400 });
  }

  // Find header indices
  const headers = rows[0].map((h) => h.toLowerCase().trim());
  const idxCode = headers.indexOf("unique_code");
  const idxName = headers.indexOf("name");
  const idxCategory = headers.indexOf("category");
  const idxPax = headers.indexOf("pax");
  const idxContactType = headers.indexOf("contact_type");
  const idxContact = headers.indexOf("contact");

  if (idxName === -1 || idxCategory === -1) {
    return NextResponse.json({ error: "Header CSV harus mengandung 'name' dan 'category'." }, { status: 400 });
  }

  const dataRows = rows.slice(1);

  // Pre-fetch categories
  const { data: existingCatsData } = await supabaseAdmin
    .from("guest_categories")
    .select("id, name, side")
    .eq("side", side);

  const categories = new Map(existingCatsData?.map((c) => [c.name.toLowerCase(), c.id]) || []);

  // Pre-fetch existing guests for this side
  const { data: existingGuestsData } = await supabaseAdmin
    .from("guests")
    .select("id, unique_code")
    .eq("side", side);
    
  const guestIdsByCode = new Map(existingGuestsData?.map((g) => [g.unique_code, g.id]) || []);
  const claimedCodes = new Set(existingGuestsData?.map((g) => g.unique_code) || []);

  let created = 0;
  let updated = 0;
  let categoriesCreated = 0;
  let errors: { line: number; message: string }[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const lineNum = i + 2; // 1-indexed, header is line 1

    const unique_code = idxCode !== -1 ? (row[idxCode] || "").trim() : "";
    const name = (row[idxName] || "").trim().slice(0, 100);
    const categoryName = (row[idxCategory] || "").trim();
    const paxStr = idxPax !== -1 ? row[idxPax] : "";
    const contact_type = idxContactType !== -1 ? (row[idxContactType] || "WhatsApp").trim().slice(0, 50) : "WhatsApp";
    const contact = idxContact !== -1 ? (row[idxContact] || "").trim().slice(0, 100) : "";

    if (!name || !categoryName) {
      errors.push({ line: lineNum, message: "Nama dan Kategori wajib diisi." });
      continue;
    }

    let pax = 1;
    if (paxStr) {
      const p = parseInt(paxStr, 10);
      if (!isNaN(p)) {
        pax = Math.max(1, Math.min(p, 20));
      }
    }

    // Auto-create category if needed
    let category_id = categories.get(categoryName.toLowerCase());
    if (!category_id) {
      const { data: newCat, error: catErr } = await supabaseAdmin
        .from("guest_categories")
        .insert({ name: categoryName, side })
        .select("id")
        .single();
      
      if (catErr || !newCat) {
        errors.push({ line: lineNum, message: `Gagal membuat kategori '${categoryName}'.` });
        continue;
      }
      category_id = newCat.id;
      categories.set(categoryName.toLowerCase(), category_id);
      categoriesCreated++;
    }

    // Insert or update guest
    const existingId = unique_code ? guestIdsByCode.get(unique_code) : undefined;
    
    if (existingId) {
      // Update
      const { error: updErr } = await supabaseAdmin
        .from("guests")
        .update({
          name,
          category_id,
          side,
          pax,
          contact_type,
          contact,
        })
        .eq("id", existingId);

      if (updErr) {
        errors.push({ line: lineNum, message: "Gagal memperbarui tamu." });
      } else {
        updated++;
      }
    } else {
      // Create new
      const newCode = await generateFreshGuestCode(supabaseAdmin, claimedCodes);
      if (!newCode) {
        errors.push({ line: lineNum, message: "Gagal membuat kode unik untuk tamu baru." });
        continue;
      }

      const { data: newGuest, error: insErr } = await supabaseAdmin
        .from("guests")
        .insert({
          unique_code: newCode,
          name,
          category_id,
          side,
          pax,
          contact_type,
          contact,
        })
        .select("id, unique_code")
        .single();

      if (insErr || !newGuest) {
        errors.push({ line: lineNum, message: "Gagal menambahkan tamu." });
      } else {
        guestIdsByCode.set(newGuest.unique_code, newGuest.id);
        created++;
      }
    }
  }

  return NextResponse.json({
    summary: { created, updated, categoriesCreated, errors },
  });
}
