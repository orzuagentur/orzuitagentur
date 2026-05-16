import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getAnalyticsOverview } from "@/lib/dashboard/analytics";

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
  const overview = await getAnalyticsOverview();

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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              Ereignisse gesamt
            </p>
            <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-[var(--foreground)]">
              {overview.total ?? "—"}
            </p>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Exakter Count aus der Datenbank, sofern Service-Role aktiv ist.
            </p>
          </div>
        </div>

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
