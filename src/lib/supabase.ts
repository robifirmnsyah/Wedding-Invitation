import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  // TODO(security): In production, this should throw an error to fail-safe.
  console.warn(
    "Supabase URL or Anon Key is missing. Database features will not work."
  );
}

/** Public Supabase client (uses anon key — respects RLS). */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
