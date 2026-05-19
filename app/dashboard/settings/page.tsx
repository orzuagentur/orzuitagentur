import Link from "next/link";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getIntegrationFlags } from "@/lib/dashboard/integrations";
import { SETTINGS_SECTIONS } from "@/lib/dashboard/settings-sections";

type ChecklistItem = {
  label: string;
  description: string;
  ok: boolean;
  href: string;
};

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
        ok
          ? "bg-emerald-500/15 text-emerald-200"
          : "bg-amber-500/15 text-amber-100"
      }`}
    >
      {ok ? "Bereit" : "Offen"}
    </span>
  );
}

function completionPercent(items: ChecklistItem[]) {
  if (items.length === 0) return 0;
  return Math.round((items.filter((item) => item.ok).length / items.length) * 100);
}

export default function DashboardSettingsIndexPage() {
  const flags = getIntegrationFlags();
  const checklist: ChecklistItem[] = [
    {
      label: "Supabase Basis",
      description: "URL, Anon-Key und Service-Role für CMS-Daten.",
      ok: flags.supabaseUrl && flags.supabaseAnon && flags.supabaseService,
      href: "/dashboard/settings/integrations",
    },
    {
      label: "Admin-Zugriff",
      description: "ADMIN_EMAILS begrenzt, wer in das Control Center darf.",
      ok: flags.adminEmails,
      href: "/dashboard/settings/system",
    },
    {
      label: "Leads & E-Mail",
      description: "Resend, Empfänger-Adresse und Site-URL für Bestätigungen.",
      ok: flags.resend && flags.resendTo && flags.siteUrl,
      href: "/dashboard/settings/integrations",
    },
    {
      label: "Telegram Benachrichtigung",
      description: "Bot Token + Chat ID für schnelle Lead-Alerts.",
      ok: flags.telegram,
      href: "/dashboard/settings/integrations",
    },
    {
      label: "Vercel API",
      description: "Token und Projekt-ID für Domains, Env und Deployments.",
      ok: flags.vercelApi,
      href: "/dashboard/settings/deploy",
    },
    {
      label: "Deploy Hook",
      description: "Optionaler Hook für schnellen Production-Redeploy.",
      ok: flags.vercelHook,
      href: "/dashboard/settings/deploy",
    },
  ];
  const percent = completionPercent(checklist);

  return (
    <>
      <DashboardPageHeader
        title="Einstellungen-Hub"
        description="Kontrollzentrum für System, SEO, Domains, Integrationen und Deploy. Hier sehen Sie sofort, was produktionsbereit ist."
      />

      <div className="space-y-10 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <section className="max-w-5xl rounded-2xl border border-[color-mix(in_oklab,var(--accent)_22%,var(--border))] bg-[color-mix(in_oklab,var(--surface-elevated)_86%,transparent)] p-6 shadow-[0_24px_70px_-52px_rgba(0,0,0,0.85)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                Production Readiness
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                {percent}% konfiguriert
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
                Sensible Werte werden nicht angezeigt. Die Prüfung zeigt nur, ob
                notwendige Environment-Variablen gesetzt sind.
              </p>
            </div>
            <Link
              href="/dashboard/settings/integrations"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--foreground)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--border-strong))]"
            >
              Integrationen prüfen
            </Link>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Setup-Checkliste
          </h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {checklist.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_82%,transparent)] p-5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent)_28%,var(--border))]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                      {item.description}
                    </p>
                  </div>
                  <StatusBadge ok={item.ok} />
                </div>
                <p className="mt-4 text-xs font-semibold text-[var(--accent)] group-hover:underline">
                  Öffnen →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Einstellungen-Bereiche
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {SETTINGS_SECTIONS.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="block h-full rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_82%,transparent)] p-4 transition-[border-color,background-color] hover:border-[color-mix(in_oklab,var(--accent)_30%,var(--border))] hover:bg-white/[0.04]"
                >
                  <span className="block font-semibold text-[var(--foreground)]">
                    {section.label}
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed text-[var(--muted)]">
                    {section.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
