import Link from "next/link";
import { addVercelDomain } from "@/actions/vercel/domains";
import { DomainCard } from "@/components/dashboard/domain-card";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { SETTINGS_DEPLOY_PATH } from "@/lib/dashboard/settings-sections";
import { getDomainsPanelData } from "@/lib/vercel/domains-panel-data";
import { SettingsSubPage } from "../_shared";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";
const cardClass =
  "rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6";

export default async function DashboardSettingsDomainsPage() {
  const data = await getDomainsPanelData();

  return (
    <SettingsSubPage pathname="/dashboard/settings/domains">
      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        {!data.configured ? (
          <section className={`${cardClass} max-w-3xl`}>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Vercel API erforderlich
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Für Domain-Verwaltung werden{" "}
              <code className="font-mono text-xs text-[var(--accent)]">
                VERCEL_ACCESS_TOKEN
              </code>{" "}
              und{" "}
              <code className="font-mono text-xs text-[var(--accent)]">
                VERCEL_PROJECT_ID
              </code>{" "}
              benötigt (wie unter Deploy).
            </p>
            {"apiError" in data && data.apiError ? (
              <p className="mt-3 text-sm text-red-400/90">{data.apiError}</p>
            ) : null}
            <Link
              href={SETTINGS_DEPLOY_PATH}
              className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
            >
              Zu Deploy &amp; Vercel →
            </Link>
          </section>
        ) : (
          <>
            <section className={`${cardClass} max-w-3xl`}>
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Anleitung
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[var(--muted)]">
                <li>Domain unten zum Vercel-Projekt hinzufügen.</li>
                <li>
                  DNS-Einträge (A oder CNAME) bei Ihrem Registrar eintragen — Werte
                  stehen bei jeder Domain.
                </li>
                <li>
                  Optional:{" "}
                  <code className="font-mono text-xs text-[var(--accent)]">
                    NEXT_PUBLIC_SITE_URL
                  </code>{" "}
                  in Vercel auf die Production-Domain setzen und redeployen.
                </li>
                <li>„DNS erneut prüfen“ klicken, bis der Status „Aktiv“ ist.</li>
              </ol>
              {data.productionUrl ? (
                <p className="mt-4 text-xs text-[var(--muted)]">
                  Vercel-Standard-URL:{" "}
                  <a
                    href={data.productionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[var(--accent)] hover:underline"
                  >
                    {data.productionUrl}
                  </a>
                </p>
              ) : null}
            </section>

            <section className={`${cardClass} max-w-3xl`}>
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Domain hinzufügen
              </h2>
              <form action={addVercelDomain} className="mt-4 space-y-4">
                <div>
                  <label className={labelClass} htmlFor="domain">
                    Domain
                  </label>
                  <input
                    className={inputClass}
                    id="domain"
                    name="domain"
                    placeholder="www.orzuit.de"
                    required
                  />
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Apex (orzuit.de) oder Subdomain (www.orzuit.de).
                  </p>
                </div>
                <div>
                  <label className={labelClass} htmlFor="redirect">
                    Redirect (optional)
                  </label>
                  <input
                    className={inputClass}
                    id="redirect"
                    name="redirect"
                    placeholder="orzuit.de"
                  />
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    z. B. www → Apex: hier die Ziel-Apex-Domain eintragen.
                  </p>
                </div>
                <DashboardSubmitButton size="md" pendingLabel="Hinzugefügt">
                  Domain verbinden
                </DashboardSubmitButton>
              </form>
            </section>

            <section className="max-w-4xl space-y-6">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Verbundene Domains
              </h2>
              {data.domains.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">
                  Noch keine Custom Domain — oben eine Domain hinzufügen.
                </p>
              ) : (
                data.domains.map((d) => <DomainCard key={d.name} domain={d} />)
              )}
            </section>
          </>
        )}
      </div>
    </SettingsSubPage>
  );
}
