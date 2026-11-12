import { NextResponse } from "next/server";
import { parseCsv } from "@/lib/csv";
import { importGuests } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { side?: string; csv?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const side = body.side === "bride" ? "bride" : "groom";
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

  const guests: { unique_code?: string; name: string; category: string; pax: number; contact_type: string; contact: string; side: "bride" | "groom" }[] = [];
  const errors: { line: number; message: string }[] = [];

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

    guests.push({ unique_code, name, category: categoryName, pax, contact_type, contact, side });
  }

  const result = await importGuests(guests);

  return NextResponse.json({
    summary: { ...result, errors: [...errors, ...result.errors] },
  });
}
