/**
 * Admin-Zugriff: `ADMIN_EMAILS` (kommagetrennt).
 * Wenn leer, gilt jede eingeloggte Session als Admin (nur für lokale Entwicklung).
 */
export function getAdminEmails(): string[] {
  return (
    process.env.ADMIN_EMAILS?.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? []
  );
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = getAdminEmails();
  if (admins.length === 0) return true;
  return admins.includes(email.trim().toLowerCase());
}

export async function isDashboardAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email || !isAdminEmail(email)) return false;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return true;
  }

  try {
    const { createServiceRoleClient } = await import("@/lib/supabase/service");
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("admin_roles")
      .select("active")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();
    if (error || !data) return true;
    return data.active === true;
  } catch {
    return true;
  }
}
