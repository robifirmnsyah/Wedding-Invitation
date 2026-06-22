import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!supabaseUrl || !serviceRoleKey) {
  // TODO(security): In production, this should throw an error to fail-safe.
  console.warn(
    "Supabase URL or Service Role Key is missing. Admin features will not work."
  );
}

/**
 * Admin Supabase client (uses service_role key — bypasses RLS).
 * Only use this in server-side code (API routes, server actions).
 * NEVER expose this client or the service_role key to the frontend.
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
