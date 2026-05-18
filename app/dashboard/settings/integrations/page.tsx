import Link from "next/link";
import { getIntegrationFlags } from "@/lib/dashboard/integrations";
import { SETTINGS_DEPLOY_PATH } from "@/lib/dashboard/settings-sections";
import { SettingsSubPage } from "../_shared";

function Flag({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-white/[0.02] px-4 py-3">
      <span className="text-sm text-[var(--foreground)]">{label}</span>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
          ok
            ? "bg-emerald-500/15 text-emerald-200"
            : "bg-white/5 text-[var(--muted)]"
        }`}
      >
        {ok ? "Gesetzt" : "Offen"}
      </span>
    </div>
  );
}

export default function DashboardSettingsIntegrationsPage() {
  const flags = getIntegrationFlags();

  return (
    <SettingsSubPage pathname="/dashboard/settings/integrations">
      <div className="max-w-2xl space-y-6 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Supabase
          </h2>
          <Flag ok={flags.supabaseUrl} label="NEXT_PUBLIC_SUPABASE_URL" />
          <Flag ok={flags.supabaseAnon} label="NEXT_PUBLIC_SUPABASE_ANON_KEY" />
          <Flag ok={flags.supabaseService} label="SUPABASE_SERVICE_ROLE_KEY (Server)" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Leads &amp; E-Mail
          </h2>
          <Flag ok={flags.resend} label="RESEND_API_KEY" />
          <Flag ok={flags.resendTo} label="LEAD_NOTIFY_EMAIL" />
          <Flag ok={flags.siteUrl} label="NEXT_PUBLIC_SITE_URL" />
          <Flag ok={flags.adminEmails} label="ADMIN_EMAILS" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Telegram
          </h2>
          <Flag ok={flags.telegram} label="TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Vercel
          </h2>
          <Flag ok={flags.vercelApi} label="VERCEL_ACCESS_TOKEN + VERCEL_PROJECT_ID" />
          <Flag ok={flags.vercelHook} label="VERCEL_DEPLOY_HOOK_URL" />
          <Link
            href={SETTINGS_DEPLOY_PATH}
            className="inline-block text-sm font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            Deploy &amp; Vercel Control Center →
          </Link>
        </div>

        <p className="text-xs leading-relaxed text-[var(--muted)]">
          Werte werden nicht geloggt oder angezeigt — nur ob Non-Empty konfiguriert
          ist. Für produktive Dashboard-Daten ist die Service-Role zwingend.
        </p>
      </div>
    </SettingsSubPage>
  );
}
