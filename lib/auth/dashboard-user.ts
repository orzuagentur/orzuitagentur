import { isAdminEmail } from "@/lib/auth/roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export class DashboardAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DashboardAuthError";
  }
}

/** Gleiche Logik wie in `middleware.ts` — Server Actions & Layout. */
export async function requireDashboardUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new DashboardAuthError("Unauthorized");
  }

  if (!isAdminEmail(user.email)) {
    throw new DashboardAuthError("Forbidden");
  }

  return user;
}