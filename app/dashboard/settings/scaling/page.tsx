import { SettingsSubPage } from "../_shared";
import {
  ARCHITECTURE_ITEMS,
  getScalingItems,
} from "@/lib/dashboard/architecture";

export default async function DashboardScalingPage() {
  const scaling = await getScalingItems();

  return (
    <SettingsSubPage pathname="/dashboard/settings/scaling">
      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <section className="rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Phase 13
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
            Datenbank-Architektur
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {ARCHITECTURE_ITEMS.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-[var(--border)] bg-white/[0.02] p-4"
              >
                <p className="font-semibold text-[var(--foreground)]">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.note}</p>
                <p className="mt-3 font-mono text-xs text-[var(--accent)]">
                  {item.tables.join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Phase 14
          </p>
          <h2 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
            Skalierung & SaaS-Fundament
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {scaling.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[var(--border)] bg-white/[0.02] p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  {item.id}
                </p>
                <p className="mt-2 font-semibold text-[var(--foreground)]">{item.label}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Tabelle: <span className="font-mono">{item.table}</span>
                </p>
                <p className="mt-3 rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--accent)]">
                  {item.status} · {item.count ?? "n/a"} Einträge
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </SettingsSubPage>
  );
}
