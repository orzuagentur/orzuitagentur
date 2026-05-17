import Link from "next/link";
import { redeployProduction } from "@/actions/vercel/deploy";
import { addVercelDomain } from "@/actions/vercel/domains";
import { upsertVercelEnv } from "@/actions/vercel/env";
import { VercelEnvRowMenu } from "@/components/dashboard/vercel-env-row-menu";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getDeployPanelData } from "@/lib/vercel/panel-data";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";
const btnClass =
  "inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-4 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]";
const cardClass =
  "rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6";

function Flag({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-white/[0.02] px-4 py-3">
      <span className="font-mono text-xs text-[var(--foreground)]">{label}</span>
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
          ok
            ? "bg-emerald-500/15 text-emerald-200"
            : "bg-white/5 text-[var(--muted)]"
        }`}
      >
        {ok ? "OK" : "—"}
      </span>
    </div>
  );
}

export default async function DashboardDeployPage() {
  const data = await getDeployPanelData();

  return (
    <>
      <DashboardPageHeader
        title="Deploy & Vercel"
        description="Production-Redeploy, Domains und Umgebungsvariablen in Vercel verwalten. Geheimnisse werden nie im Klartext angezeigt — nur gesetzt oder aktualisiert."
      />

      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <section className={`${cardClass} max-w-3xl`}>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Verbindung
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Einmalig in Vercel unter Project → Settings → Environment Variables
            (nur auf dem Server, nicht im Browser):
          </p>
          <ul className="mt-3 space-y-1 font-mono text-xs text-[var(--accent)]">
            <li>VERCEL_ACCESS_TOKEN</li>
            <li>VERCEL_PROJECT_ID</li>
            <li>VERCEL_TEAM_ID (optional)</li>
            <li>VERCEL_DEPLOY_HOOK_URL (optional, nur Redeploy)</li>
          </ul>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Flag ok={data.settings.hasToken} label="Token" />
            <Flag ok={data.settings.hasProjectId} label="Project ID" />
            <Flag ok={data.settings.hasTeamId} label="Team ID" />
            <Flag ok={data.settings.hasDeployHook} label="Deploy Hook" />
          </div>
          {"apiError" in data && data.apiError ? (
            <p className="mt-3 text-sm text-red-400/90">{data.apiError}</p>
          ) : null}
          <p className="mt-4 text-xs text-[var(--muted)]">
            <Link
              href="/dashboard/integrations"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Lokale Integrationen prüfen →
            </Link>
            {" · "}
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Vercel Dashboard ↗
            </a>
          </p>
        </section>

        <section className={`${cardClass} max-w-3xl`}>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Redeploy (Production)
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Startet einen neuen Build auf Vercel (Git-verbundenes Projekt oder
            Deploy Hook).
          </p>
          {data.project ? (
            <p className="mt-2 font-mono text-xs text-[var(--muted)]">
              Projekt: {data.project.name} ({data.project.id})
            </p>
          ) : null}
          <form action={redeployProduction} className="mt-4">
            <button
              type="submit"
              disabled={!data.redeployReady}
              className={`${btnClass} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Jetzt redeployen
            </button>
          </form>
        </section>

        {data.configured && data.deployments.length > 0 ? (
          <section className={`${cardClass} max-w-4xl`}>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Letzte Deployments
            </h2>
            <ul className="mt-4 space-y-3">
              {data.deployments.map((d) => (
                <li
                  key={d.uid}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-white/[0.02] px-4 py-3 text-sm"
                >
                  <span className="font-mono text-xs text-[var(--muted)]">
                    {d.target ?? "—"} · {d.state}
                  </span>
                  {d.url ? (
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:underline"
                    >
                      Öffnen ↗
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {data.configured ? (
          <section className={`${cardClass} max-w-3xl`}>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Domains
            </h2>
            {data.domains.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--muted)]">
                Noch keine Custom Domains im Projekt.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {data.domains.map((d) => (
                  <li
                    key={d.name}
                    className="rounded-xl border border-[var(--border)] px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-[var(--foreground)]">
                      {d.name}
                    </span>
                    <span
                      className={`ml-3 text-xs uppercase tracking-wider ${d.verified ? "text-emerald-300" : "text-amber-300"}`}
                    >
                      {d.verified ? "verifiziert" : "DNS ausstehend"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <form action={addVercelDomain} className="mt-6 flex flex-wrap items-end gap-3">
              <div className="min-w-[200px] flex-1">
                <label className={labelClass} htmlFor="domain">
                  Domain hinzufügen
                </label>
                <input
                  className={inputClass}
                  id="domain"
                  name="domain"
                  placeholder="www.orzuit.de"
                  required
                />
              </div>
              <button type="submit" className={btnClass}>
                Hinzufügen
              </button>
            </form>
          </section>
        ) : null}

        {data.configured ? (
          <section className={`${cardClass} max-w-4xl`}>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Umgebungsvariablen (Vercel)
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Verschlüsselte Werte können aus Sicherheitsgründen nicht gelesen
              werden — nur neu setzen. Nach Änderungen Redeploy ausführen.
            </p>

            {data.envVars.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--muted)]">
                      <th className="py-2 pr-4">Key</th>
                      <th className="py-2 pr-4">Target</th>
                      <th className="py-2 pr-4">Typ</th>
                      <th className="py-2">Aktion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.envVars.map((env) => (
                      <tr
                        key={env.id}
                        className="border-b border-[var(--border)]/60"
                      >
                        <td className="py-3 pr-4 font-mono text-xs">
                          {env.key}
                        </td>
                        <td className="py-3 pr-4 text-[var(--muted)]">
                          {env.target.join(", ")}
                        </td>
                        <td className="py-3 pr-4 text-[var(--muted)]">
                          {env.type}
                        </td>
                        <td className="py-3 text-right">
                          <VercelEnvRowMenu
                            envId={env.id}
                            envKey={env.key}
                            envType={env.type}
                            targets={env.target}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">
                Keine Variablen geladen.
              </p>
            )}

            <form action={upsertVercelEnv} className="mt-8 space-y-3 border-t border-[var(--border)] pt-6">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Variable setzen / aktualisieren
              </h3>
              <div>
                <label className={labelClass} htmlFor="env-key">
                  Key
                </label>
                <input
                  className={inputClass}
                  id="env-key"
                  name="key"
                  required
                  list="env-key-hints"
                  placeholder="RESEND_API_KEY"
                />
                <datalist id="env-key-hints">
                  {data.keyHints.map((k) => (
                    <option key={k} value={k} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className={labelClass} htmlFor="env-value">
                  Wert (wird verschlüsselt gespeichert wenn aktiviert)
                </label>
                <input
                  className={inputClass}
                  id="env-value"
                  name="value"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--foreground)]">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="sensitive" defaultChecked className="h-4 w-4" />
                  Verschlüsselt (Secret)
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="targetProduction" defaultChecked className="h-4 w-4" />
                  Production
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="targetPreview" className="h-4 w-4" />
                  Preview
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="targetDevelopment" className="h-4 w-4" />
                  Development
                </label>
              </div>
              <button type="submit" className={btnClass}>
                In Vercel speichern
              </button>
            </form>
          </section>
        ) : null}

        <section className={`${cardClass} max-w-3xl`}>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Laufzeit-Check (dieser Server)
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Was der aktuelle Deployment-Instanz bekannt ist — ohne Werte anzuzeigen.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Flag ok={data.localFlags.supabaseUrl} label="NEXT_PUBLIC_SUPABASE_URL" />
            <Flag ok={data.localFlags.supabaseService} label="SUPABASE_SERVICE_ROLE_KEY" />
            <Flag ok={data.localFlags.resend} label="RESEND_API_KEY" />
            <Flag ok={data.localFlags.adminEmails} label="ADMIN_EMAILS" />
          </div>
        </section>
      </div>
    </>
  );
}
