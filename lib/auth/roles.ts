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
