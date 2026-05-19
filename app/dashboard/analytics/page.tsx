import { saveAnalyticsSettings } from "@/actions/cms/analytics";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getAnalyticsOverview, getAnalyticsSettings } from "@/lib/dashboard/analytics";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("de-DE", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function DashboardAnalyticsPage() {
  const [overview, settings] = await Promise.all([
    getAnalyticsOverview(),
    getAnalyticsSettings(),
  ]);

  return (
    <>
      <DashboardPageHeader
        title="Analytics"
        description="Übersicht über gespeicherte Ereignisse (analytics_events). Idealerweise schreibt Ihre App oder ein Edge-Job hier strukturierte Events für Auswertungen."
      />

      <div className="space-y-10 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        {!overview.configured ? (
          <p className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
            Service-Role nicht gesetzt — keine Datenbankabfrage möglich.
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Ereignisse gesamt", overview.total ?? "—"],
            ["Page Views", overview.pageViews],
            ["CTA-Klicks", overview.ctaClicks],
            ["Leads", overview.leadsCount],
            [
              "Conversion",
              overview.conversionRate === null
                ? "—"
                : `${overview.conversionRate.toFixed(1)}%`,
            ],
          ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              {label}
            </p>
            <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-[var(--foreground)]">
              {value}
            </p>
          </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <MetricTable
            title="Top CTAs"
            rows={overview.topCtas.map((row) => [row.label, row.count])}
          />
          <MetricTable
            title="Scroll-Tiefe"
            rows={overview.scrollDepth.map((row) => [row.depth, row.count])}
          />
          <MetricTable
            title="Core Web Vitals"
            rows={overview.webVitals.map((row) => [
              `${row.metric} · ${row.rating}`,
              row.value,
            ])}
          />
        </div>

        <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Heatmap & Tracking
          </h2>
          <form action={saveAnalyticsSettings} className="mt-4 grid gap-4 lg:grid-cols-2">
            <input
              className={inputClass}
              name="heatmapProvider"
              defaultValue={settings.heatmapProvider}
              placeholder="Hotjar, Microsoft Clarity, Plausible..."
            />
            <input
              className={inputClass}
              name="heatmapProjectId"
              defaultValue={settings.heatmapProjectId}
              placeholder="Project / Site ID"
            />
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input type="checkbox" name="heatmapEnabled" defaultChecked={settings.heatmapEnabled} />
              Heatmap Integration aktiv
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input type="checkbox" name="trackCtaClicks" defaultChecked={settings.trackCtaClicks} />
              CTA-Klicks tracken
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input type="checkbox" name="trackScrollDepth" defaultChecked={settings.trackScrollDepth} />
              Scroll-Tiefe tracken
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <input type="checkbox" name="trackWebVitals" defaultChecked={settings.trackWebVitals} />
              Core Web Vitals tracken
            </label>
            <DashboardSubmitButton size="sm" pendingLabel="Gespeichert">
              Analytics speichern
            </DashboardSubmitButton>
          </form>
        </section>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Nach Ereignisname (Stichprobe)
          </h2>
          {overview.byEvent.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Noch keine Ereignisse oder keine Stichprobe.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-white/[0.02] text-xs uppercase tracking-wider text-[var(--muted)]">
                    <th className="px-4 py-3 font-medium">Ereignis</th>
                    <th className="px-4 py-3 font-medium tabular-nums">Anzahl (Sample)</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.byEvent.map((row) => (
                    <tr
                      key={row.name}
                      className="border-b border-[var(--border)] last:border-0"
                    >
                      <td className="px-4 py-3 font-mono text-[var(--foreground)]">
                        {row.name}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-[var(--muted)]">
                        {row.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Letzte Ereignisse
          </h2>
          {overview.recent.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">Keine Einträge.</p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[400px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-white/[0.02] text-xs uppercase tracking-wider text-[var(--muted)]">
                    <th className="px-4 py-3 font-medium">Zeit</th>
                    <th className="px-4 py-3 font-medium">Ereignis</th>
                    <th className="px-4 py-3 font-medium tabular-nums">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recent.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-[var(--border)] last:border-0"
                    >
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-4 py-3 font-mono text-[var(--foreground)]">
                        {r.event_name}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-[var(--muted)]">
                        {r.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MetricTable({
  title,
  rows,
}: {
  title: string;
  rows: [string, number | string][];
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
        {title}
      </h2>
      <div className="mt-3 space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Noch keine Daten.</p>
        ) : (
          rows.map(([label, value]) => (
            <p key={label} className="flex justify-between gap-3 rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              <span className="truncate text-[var(--foreground)]">{label}</span>
              <span className="font-mono text-[var(--muted)]">{value}</span>
            </p>
          ))
        )}
      </div>
    </section>
  );
}
