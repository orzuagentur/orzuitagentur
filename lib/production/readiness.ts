export type ProductionCheck = {
  label: string;
  ok: boolean;
  hint: string;
};

function has(name: string) {
  return Boolean(process.env[name]?.trim());
}

export function getProductionReadinessChecks(): ProductionCheck[] {
  return [
    {
      label: "Public Site URL",
      ok: has("NEXT_PUBLIC_SITE_URL"),
      hint: "Wichtig fuer Canonical URLs, Sitemap, Robots und E-Mail Links.",
    },
    {
      label: "Supabase Public Config",
      ok: has("NEXT_PUBLIC_SUPABASE_URL") && has("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      hint: "Wichtig fuer Auth, public reads und dynamische Inhalte.",
    },
    {
      label: "Supabase Service Role",
      ok: has("SUPABASE_SERVICE_ROLE_KEY"),
      hint: "Wichtig fuer Admin Actions, Uploads, Leads, Secrets und Analytics.",
    },
    {
      label: "Admin Emails",
      ok: has("ADMIN_EMAILS"),
      hint: "In Produktion nie leer lassen, sonst reicht jede eingeloggte Session.",
    },
    {
      label: "Secrets Encryption Key",
      ok: has("SECRETS_ENCRYPTION_KEY"),
      hint: "Eigener Key ist besser als Fallback auf Supabase Service Role.",
    },
    {
      label: "Vercel Integration",
      ok: has("VERCEL_TOKEN") && has("VERCEL_PROJECT_ID"),
      hint: "Wichtig fuer Deploy-, Domain- und Env-Verwaltung im Admin.",
    },
    {
      label: "Notification Providers",
      ok: has("RESEND_API_KEY") || has("TELEGRAM_BOT_TOKEN"),
      hint: "Mindestens ein Kanal fuer Lead-Benachrichtigungen aktivieren.",
    },
  ];
}

export function productionReadinessScore(checks = getProductionReadinessChecks()) {
  if (checks.length === 0) return 0;
  return Math.round((checks.filter((check) => check.ok).length / checks.length) * 100);
}
