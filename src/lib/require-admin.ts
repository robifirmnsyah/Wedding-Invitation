import { cookies } from "next/headers";
import { getSessionCookieNames, validAdminSession } from "./admin-session";

export async function isAdmin() {
  const c = await cookies();
  for (const name of getSessionCookieNames()) {
    const val = c.get(name)?.value;
    if (val && (await validAdminSession(val))) return true;
  }
  return false;
}
