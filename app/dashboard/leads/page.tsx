import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getRecentLeads } from "@/lib/dashboard/leads";

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

export default async function DashboardLeadsPage() {
  const leads = await getRecentLeads();

  return (
    <>
      <DashboardPageHeader
        title="Leads"
        description="Alle Kontaktanfragen aus der Tabelle leads (Einfügen nur serverseitig über das Lead-Formular / Service-Role)."
      />

      <div className="px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        {leads.length === 0 ? (
          <p className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] px-4 py-8 text-sm text-[var(--muted)]">
            Keine Leads geladen. Entweder ist die Service-Role nicht gesetzt, die
            Tabelle ist leer, oder die Abfrage ist fehlgeschlagen — siehe
            Server-Logs.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-white/[0.02] text-xs uppercase tracking-wider text-[var(--muted)]">
                  <th className="px-4 py-3 font-medium">Zeit</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">E-Mail</th>
                  <th className="px-4 py-3 font-medium">Telefon</th>
                  <th className="px-4 py-3 font-medium">Leistung</th>
                  <th className="px-4 py-3 font-medium">Firma</th>
                  <th className="px-4 py-3 font-medium">Quelle</th>
                  <th className="px-4 py-3 font-medium">DSGVO</th>
                  <th className="px-4 py-3 font-medium">Nachricht</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-[var(--border)] align-top last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                      {lead.name}
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-[var(--accent)]">
                      <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">
                      {lead.phone ?? "—"}
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3 text-[var(--foreground)]">
                      {lead.service_interest ?? "—"}
                    </td>
                    <td className="max-w-[140px] truncate px-4 py-3 text-[var(--muted)]">
                      {lead.company ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[var(--muted)]">
                      {lead.source}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      {lead.privacy_accepted ? "Ja" : "Nein"}
                    </td>
                    <td className="max-w-md px-4 py-3 text-[var(--muted)]">
                      <span className="line-clamp-4 whitespace-pre-wrap">
                        {lead.message}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
