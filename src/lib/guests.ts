import crypto from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Side = "bride" | "groom";

/** Normalize an arbitrary value into a valid side, defaulting to "groom". */
export function normalizeSide(value: unknown): Side {
  return value === "bride" ? "bride" : "groom";
}

/** Generate a unique 5-character alphanumeric code (no 0/O/1/I to avoid confusion). */
export function generateUniqueCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const bytes = crypto.randomBytes(5);
  for (let i = 0; i < 5; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

/**
 * Generate a code that does not collide with an existing guest.
 * `taken` is an optional in-memory set of codes already claimed in the same batch.
 * Returns null if a free code could not be found after `maxAttempts`.
 */
export async function generateFreshGuestCode(
  supabaseAdmin: SupabaseClient,
  taken?: Set<string>,
  maxAttempts = 10
): Promise<string | null> {
  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const code = generateUniqueCode();
    if (taken?.has(code)) continue;

    const { data: existing } = await supabaseAdmin
      .from("guests")
      .select("id")
      .eq("unique_code", code)
      .maybeSingle();

    if (!existing) {
      taken?.add(code);
      return code;
    }
  }
  return null;
}

/** Look up the side that a category belongs to, or null if not found. */
export async function getCategorySide(
  supabaseAdmin: SupabaseClient,
  categoryId: string
): Promise<Side | null> {
  const { data } = await supabaseAdmin
    .from("guest_categories")
    .select("side")
    .eq("id", categoryId)
    .maybeSingle();
  return data ? normalizeSide(data.side) : null;
}
