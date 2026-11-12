import crypto from "crypto";
import { google, sheets_v4 } from "googleapis";

export type Side = "bride" | "groom";

const GUESTS_SHEET = "Web Invitation Active";
const CATEGORIES_SHEET = "Web Categories Active";
const WISHES_SHEET = "Web Wishes Active";
const GUEST_HEADERS = [
  "Kode Undangan", "Nama", "Jumlah", "Kategori", "Pihak", "Tipe Kontak", "Kontak", "Status RSVP", "Ucapan", "Dibuat Pada", "Diperbarui Pada",
];
const CATEGORY_HEADERS = ["ID", "Nama", "Pihak", "Warna"];
const VALID_RSVP = new Set(["pending", "hadir", "tidak_hadir", "ragu"]);
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export interface SheetCategory {
  id: string;
  name: string;
  side: Side;
  color: string;
  row: number;
}

export interface SheetGuest {
  id: string;
  unique_code: string;
  name: string;
  category_id: string | null;
  pax: number;
  contact_type: string;
  contact: string;
  rsvp_status: string;
  wish_message: string;
  created_at: string;
  updated_at: string;
  side: Side;
  guest_categories: { name: string } | null;
  row: number;
}

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Environment variable ${name} belum diatur.`);
  return value;
}

function getSheets(): sheets_v4.Sheets {
  const rawPrivateKey = requiredEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  const private_key = rawPrivateKey
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .replace(/\\n/g, "\n");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
      private_key,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

function getSpreadsheetId() {
  return requiredEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
}

function stringAt(row: string[], index: number) {
  return String(row[index] ?? "").trim();
}

function normalizeSide(value: string): Side {
  return value === "bride" ? "bride" : "groom";
}

function normalizePax(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(parsed, 20)) : 1;
}

function rowToCategory(row: string[], rowIndex: number): SheetCategory | null {
  const id = stringAt(row, 0);
  const name = stringAt(row, 1);
  if (!id || !name) return null;
  return { id, name, side: normalizeSide(stringAt(row, 2)), color: stringAt(row, 3) || "slate", row: rowIndex };
}

function rowToGuest(row: string[], rowIndex: number, categories: SheetCategory[]): SheetGuest | null {
  const unique_code = stringAt(row, 0).toUpperCase();
  const name = stringAt(row, 1);
  if (!unique_code || !name) return null;
  const side = normalizeSide(stringAt(row, 4));
  const categoryName = stringAt(row, 3);
  const category = categories.find((item) => item.side === side && item.name.toLowerCase() === categoryName.toLowerCase());
  return {
    id: unique_code,
    unique_code,
    name,
    category_id: category?.id ?? null,
    pax: normalizePax(stringAt(row, 2)),
    contact_type: stringAt(row, 5) || "WhatsApp",
    contact: stringAt(row, 6),
    rsvp_status: VALID_RSVP.has(stringAt(row, 7)) ? stringAt(row, 7) : "pending",
    wish_message: stringAt(row, 8),
    created_at: stringAt(row, 9),
    updated_at: stringAt(row, 10),
    side,
    guest_categories: categoryName ? { name: categoryName } : null,
    row: rowIndex,
  };
}

async function getValues(sheetName: string, range: string) {
  const response = await getSheets().spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `'${sheetName}'!${range}`,
  });
  return (response.data.values ?? []).map((row) => row.map((cell) => String(cell ?? "")));
}

async function updateValues(sheetName: string, range: string, values: (string | number)[][]) {
  await getSheets().spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `'${sheetName}'!${range}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
}

export async function listCategories(side?: Side): Promise<SheetCategory[]> {
  const rows = await getValues(CATEGORIES_SHEET, "A2:D");
  return rows
    .map((row, index) => rowToCategory(row, index + 2))
    .filter((category): category is SheetCategory => category !== null)
    .filter((category) => !side || category.side === side)
    .sort((a, b) => a.name.localeCompare(b.name, "id"));
}

export async function listGuests(side?: Side): Promise<SheetGuest[]> {
  const [categories, rows] = await Promise.all([listCategories(), getValues(GUESTS_SHEET, "A2:K")]);
  return rows
    .map((row, index) => rowToGuest(row, index + 2, categories))
    .filter((guest): guest is SheetGuest => guest !== null)
    .filter((guest) => !side || guest.side === side)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function findGuestByCode(code: string) {
  const guests = await listGuests();
  return guests.find((guest) => guest.unique_code === code.toUpperCase()) ?? null;
}

function makeCode() {
  const bytes = crypto.randomBytes(5);
  return Array.from(bytes, (byte) => CODE_CHARS[byte % CODE_CHARS.length]).join("");
}

async function freshCode() {
  const usedCodes = new Set((await listGuests()).map((guest) => guest.unique_code));
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = makeCode();
    if (!usedCodes.has(code)) return code;
  }
  throw new Error("Tidak dapat membuat kode undangan unik.");
}

function toGuestRow(guest: SheetGuest) {
  return [[
    guest.unique_code, guest.name, guest.pax, guest.guest_categories?.name ?? "", guest.side, guest.contact_type,
    guest.contact, guest.rsvp_status, guest.wish_message, guest.created_at, guest.updated_at,
  ]];
}

export async function createGuest(input: {
  name: string; category_id: string; pax: number; contact_type: string; contact: string; side?: Side;
}) {
  const categories = await listCategories();
  const category = categories.find((item) => item.id === input.category_id);
  if (!category) throw new Error("Kategori tidak ditemukan.");
  const now = new Date().toISOString();
  const guest: SheetGuest = {
    id: await freshCode(), unique_code: "", name: input.name.trim().slice(0, 100), category_id: category.id,
    pax: Math.max(1, Math.min(input.pax || 1, 20)), contact_type: input.contact_type.trim().slice(0, 50) || "WhatsApp",
    contact: input.contact.trim().slice(0, 100), rsvp_status: "pending", wish_message: "", created_at: now, updated_at: now,
    side: category.side, guest_categories: { name: category.name }, row: 0,
  };
  guest.unique_code = guest.id;
  await getSheets().spreadsheets.values.append({
    spreadsheetId: getSpreadsheetId(), range: `'${GUESTS_SHEET}'!A:K`, valueInputOption: "USER_ENTERED", insertDataOption: "INSERT_ROWS",
    requestBody: { values: toGuestRow(guest) },
  });
  return guest;
}

export async function updateGuest(id: string, changes: Partial<Pick<SheetGuest, "name" | "pax" | "contact_type" | "contact">> & { category_id?: string | null }) {
  const guest = await findGuestByCode(id);
  if (!guest) throw new Error("Tamu tidak ditemukan.");
  let categoryName = guest.guest_categories?.name ?? "";
  let side = guest.side;
  if (changes.category_id !== undefined) {
    const category = (await listCategories()).find((item) => item.id === changes.category_id);
    if (!category) throw new Error("Kategori tidak ditemukan.");
    categoryName = category.name;
    side = category.side;
  }
  const updated: SheetGuest = {
    ...guest,
    name: changes.name === undefined ? guest.name : changes.name.trim().slice(0, 100),
    pax: changes.pax === undefined ? guest.pax : Math.max(1, Math.min(changes.pax, 20)),
    contact_type: changes.contact_type === undefined ? guest.contact_type : changes.contact_type.trim().slice(0, 50),
    contact: changes.contact === undefined ? guest.contact : changes.contact.trim().slice(0, 100),
    side,
    guest_categories: categoryName ? { name: categoryName } : null,
    updated_at: new Date().toISOString(),
  };
  await updateValues(GUESTS_SHEET, `A${guest.row}:K${guest.row}`, toGuestRow(updated));
  return updated;
}

export async function updateRsvp(code: string, rsvpStatus: string, wishMessage: string) {
  if (!VALID_RSVP.has(rsvpStatus)) throw new Error("Status kehadiran tidak valid.");
  const guest = await findGuestByCode(code);
  if (!guest) throw new Error("Tamu tidak ditemukan.");
  const updated = { ...guest, rsvp_status: rsvpStatus, wish_message: wishMessage.trim().slice(0, 500), updated_at: new Date().toISOString() };
  await updateValues(GUESTS_SHEET, `A${guest.row}:K${guest.row}`, toGuestRow(updated));
  return updated;
}

export async function clearGuest(id: string) {
  const guest = await findGuestByCode(id);
  if (!guest) throw new Error("Tamu tidak ditemukan.");
  await getSheets().spreadsheets.values.clear({ spreadsheetId: getSpreadsheetId(), range: `'${GUESTS_SHEET}'!A${guest.row}:K${guest.row}` });
}

export async function createCategory(input: { name: string; side: Side; color: string }) {
  const name = input.name.trim().slice(0, 100);
  if (!name) throw new Error("Nama kategori wajib diisi.");
  const categories = await listCategories(input.side);
  if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) throw new Error("Kategori dengan nama ini sudah ada.");
  const id = crypto.randomUUID();
  const category: SheetCategory = { id, name, side: input.side, color: input.color || "slate", row: 0 };
  await getSheets().spreadsheets.values.append({
    spreadsheetId: getSpreadsheetId(), range: `'${CATEGORIES_SHEET}'!A:D`, valueInputOption: "USER_ENTERED", insertDataOption: "INSERT_ROWS",
    requestBody: { values: [[category.id, category.name, category.side, category.color]] },
  });
  return category;
}

export async function updateCategory(id: string, changes: { name?: string; color?: string }) {
  const category = (await listCategories()).find((item) => item.id === id);
  if (!category) throw new Error("Kategori tidak ditemukan.");
  const updated = { ...category, name: changes.name === undefined ? category.name : changes.name.trim().slice(0, 100), color: changes.color === undefined ? category.color : changes.color || "slate" };
  if (!updated.name) throw new Error("Nama kategori wajib diisi.");
  if (updated.name !== category.name) {
    const guests = (await listGuests()).filter((guest) => guest.side === category.side && guest.guest_categories?.name === category.name);
    await Promise.all(guests.map((guest) => updateValues(GUESTS_SHEET, `D${guest.row}:D${guest.row}`, [[updated.name]])));
  }
  await updateValues(CATEGORIES_SHEET, `A${category.row}:D${category.row}`, [[updated.id, updated.name, updated.side, updated.color]]);
  return updated;
}

export async function clearCategory(id: string) {
  const category = (await listCategories()).find((item) => item.id === id);
  if (!category) throw new Error("Kategori tidak ditemukan.");
  const guests = (await listGuests()).filter((guest) => guest.side === category.side && guest.guest_categories?.name === category.name);
  await Promise.all(guests.map((guest) => updateValues(GUESTS_SHEET, `D${guest.row}:D${guest.row}`, [[""]])));
  await getSheets().spreadsheets.values.clear({ spreadsheetId: getSpreadsheetId(), range: `'${CATEGORIES_SHEET}'!A${category.row}:D${category.row}` });
}

export async function importGuests(rows: { unique_code?: string; name: string; category: string; pax?: number; contact_type?: string; contact?: string; side: Side }[]) {
  const categories = await listCategories();
  const existingGuests = await listGuests();
  const byCode = new Map(existingGuests.map((guest) => [guest.unique_code, guest]));
  let created = 0;
  let updated = 0;
  let categoriesCreated = 0;
  const errors: { line: number; message: string }[] = [];

  for (let index = 0; index < rows.length; index += 1) {
    const item = rows[index];
    try {
      let category = categories.find((value) => value.side === item.side && value.name.toLowerCase() === item.category.toLowerCase());
      if (!category) {
        category = await createCategory({ name: item.category, side: item.side, color: "slate" });
        categories.push(category);
        categoriesCreated += 1;
      }
      const existing = item.unique_code ? byCode.get(item.unique_code.toUpperCase()) : undefined;
      if (existing) {
        await updateGuest(existing.id, { name: item.name, category_id: category.id, pax: item.pax ?? 1, contact_type: item.contact_type ?? "WhatsApp", contact: item.contact ?? "" });
        updated += 1;
      } else {
        const guest = await createGuest({ name: item.name, category_id: category.id, pax: item.pax ?? 1, contact_type: item.contact_type ?? "WhatsApp", contact: item.contact ?? "", side: item.side });
        byCode.set(guest.unique_code, guest);
        created += 1;
      }
    } catch (error) {
      errors.push({ line: index + 2, message: error instanceof Error ? error.message : "Gagal menyimpan tamu." });
    }
  }
  return { created, updated, categoriesCreated, errors };
}

export async function getGuestStats() {
  const guests = await listGuests();
  const categories = await listCategories();
  const stats = { total: guests.length, hadir: 0, tidak_hadir: 0, ragu: 0, pending: 0, total_pax: 0, hadir_pax: 0, groom: 0, groom_pax: 0, bride: 0, bride_pax: 0 };
  for (const guest of guests) {
    stats.total_pax += guest.pax;
    if (guest.side === "bride") { stats.bride += 1; stats.bride_pax += guest.pax; } else { stats.groom += 1; stats.groom_pax += guest.pax; }
    if (guest.rsvp_status === "hadir") { stats.hadir += 1; stats.hadir_pax += guest.pax; }
    else if (guest.rsvp_status === "tidak_hadir") stats.tidak_hadir += 1;
    else if (guest.rsvp_status === "ragu") stats.ragu += 1;
    else stats.pending += 1;
  }
  const categoryBreakdown = categories.map((category) => {
    const categoryGuests = guests.filter((guest) => guest.category_id === category.id);
    return { name: category.name, side: category.side, color: category.color, count: categoryGuests.length, pax: categoryGuests.reduce((total, guest) => total + guest.pax, 0) };
  }).filter((category) => category.count > 0).sort((a, b) => b.count - a.count);
  return { stats, categoryBreakdown };
}

export async function listPublicWishes() {
  const rows = await getValues(WISHES_SHEET, "A2:G");
  const wishes = rows.map((row, index) => {
    let replies = [];
    try {
      replies = row[6] ? JSON.parse(row[6]) : [];
    } catch {
      replies = [];
    }
    return {
      id: stringAt(row, 0),
      name: stringAt(row, 1),
      message: stringAt(row, 2),
      attendance: stringAt(row, 3) as "hadir" | "tidak_hadir" | "ragu",
      verified: stringAt(row, 4) === "TRUE",
      createdAt: stringAt(row, 5),
      replies,
      row: index + 2,
    };
  }).filter(wish => wish.id);

  // Urutkan dari yang terbaru ke yang terlama
  return wishes.sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (timeA !== timeB && !isNaN(timeA) && !isNaN(timeB)) {
      return timeB - timeA;
    }
    return b.row - a.row; // Fallback ke urutan baris sheet (baris bawah = lebih baru)
  });
}

export async function appendPublicWish(wish: any) {
  const rowData = [
    wish.id,
    wish.name,
    wish.message,
    wish.attendance,
    wish.verified ? "TRUE" : "FALSE",
    wish.createdAt,
    JSON.stringify(wish.replies || [])
  ];
  await getSheets().spreadsheets.values.append({
    spreadsheetId: getSpreadsheetId(),
    range: `'${WISHES_SHEET}'!A:G`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [rowData] },
  });
}

export async function updatePublicWishReplies(wishId: string, replies: any[]) {
  const wishes = await listPublicWishes();
  const wish = wishes.find(w => w.id === wishId);
  if (!wish) throw new Error("Wish not found");
  
  await updateValues(WISHES_SHEET, `G${wish.row}:G${wish.row}`, [[JSON.stringify(replies)]]);
}

export const SHEET_CONFIG = { GUESTS_SHEET, CATEGORIES_SHEET, WISHES_SHEET, GUEST_HEADERS, CATEGORY_HEADERS };
