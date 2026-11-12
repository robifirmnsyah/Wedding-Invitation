import { cookies } from "next/headers";
import { sessionCookie, validAdminSession } from "./admin-session";
export async function isAdmin() {
  return validAdminSession((await cookies()).get(sessionCookie)?.value);
}
