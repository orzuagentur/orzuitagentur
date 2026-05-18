import Link from "next/link";
import { DASHBOARD_NAV } from "@/components/dashboard/nav-config";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardStats } from "@/lib/dashboard/stats";

export default async function DashboardHomePage() {
  const stats = await getDashboardStats();

  const valueOrDash = (n: number | null) =>
    stats.configured && n !== null ? n : "—";

  return (
    <>
      <DashboardPageHeader
        title="Übersicht"
        description="Schnellzugriff auf Kennzahlen und Bereiche des OrzuIT Control Centers. Daten werden per Service-Role aus Supabase geladen, sobald die Umgebung vollständig konfiguriert ist."
      />

      <div className="px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        {!stats.configured ? (
          <p className="mb-8 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
            Service-Role oder Supabase-URL fehlt: Zählungen sind deaktiviert.
            Hinterlegen Sie <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
            und die Supabase-URL, um Live-KPIs zu sehen.
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Leads"
            value={valueOrDash(stats.leads)}
            hint="Kontaktanfragen (Tabelle leads)."
          />
          <StatCard
            label="Leistungen"
            value={valueOrDash(stats.services)}
            hint="Einträge in services (CMS)."
          />
          <StatCard
            label="Portfolio"
            value={valueOrDash(stats.portfolio)}
            hint="Projekte in portfolio_entries."
          />
          <StatCard
            label="Warum OrzuIT"
            value={valueOrDash(stats.testimonials)}
            hint="Karten auf der Startseite."
          />
          <StatCard
            label="Analytics-Ereignisse"
            value={valueOrDash(stats.analyticsEvents)}
            hint="Append-only Events (analytics_events)."
          />
        </div>

        <section className="mt-14">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Bereiche
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DASHBOARD_NAV.filter((item) => item.href !== "/dashboard").map(
              (item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_82%,transparent)] p-4 transition-[border-color,background-color] hover:border-[color-mix(in_oklab,var(--accent)_30%,var(--border))] hover:bg-white/[0.04]"
                  >
                    <span className="block font-semibold text-[var(--foreground)]">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs text-[var(--muted)]">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ),
            )}
          </ul>
        </section>
      </div>
    </>
  );
}
