import { saveSecret } from "@/actions/cms/secrets";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getAuditLogs } from "@/lib/dashboard/audit";
import { getSecretRows } from "@/lib/dashboard/secrets";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

export default async function DashboardSecretsPage() {
  const [rows, auditLogs] = await Promise.all([
    getSecretRows(),
    getAuditLogs(12),
  ]);

  return (
    <>
      <DashboardPageHeader
        title="Secrets"
        description="API-Keys maskiert verwalten. Klartext wird nach dem Speichern nie wieder angezeigt."
      />
      <div className="grid gap-4 px-4 pb-16 pt-2 sm:px-8 lg:grid-cols-2 lg:px-10">
        {rows.map((row) => (
          <section
            key={row.provider}
            className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-[var(--foreground)]">
                  {row.label}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Status: {row.status} · {row.masked_value ?? "nicht gesetzt"}
                </p>
              </div>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
                {row.provider}
              </span>
            </div>
            <form action={saveSecret} className="mt-4 space-y-3">
              <input type="hidden" name="provider" value={row.provider} />
              <input type="hidden" name="label" value={row.label} />
              <div>
                <label className={labelClass}>Neuer Key</label>
                <input
                  className={inputClass}
                  name="secret_value"
                  type="password"
                  autoComplete="off"
                  placeholder="Wird verschlüsselt gespeichert"
                />
              </div>
              <DashboardSubmitButton size="sm" pendingLabel="Gespeichert">
                Secret speichern
              </DashboardSubmitButton>
            </form>
          </section>
        ))}
      </div>
      <div className="px-4 pb-16 sm:px-8 lg:px-10">
        <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-5">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Audit & Rotation
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Rotation: neuen Key eintragen und speichern. Env-Sync: produktive
            Provider zusätzlich in Vercel/Supabase Env prüfen.
          </p>
          <div className="mt-4 space-y-2">
            {auditLogs.map((log) => (
              <p key={log.id} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]">
                {new Date(log.created_at).toLocaleString("de-DE")} ·{" "}
                {log.actor_email ?? "system"} · {log.action} · {log.target_id}
              </p>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
