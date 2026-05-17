"use client";

import { removeVercelDomain, verifyVercelDomain } from "@/actions/vercel/domains";
import { CopyValueButton } from "@/components/dashboard/copy-value-button";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import type { VercelDomainDetails } from "@/lib/vercel/types";
import { FormEvent } from "react";

const cardClass =
  "rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6";

type DomainCardProps = {
  domain: VercelDomainDetails;
};

function StatusBadge({ domain }: { domain: VercelDomainDetails }) {
  if (domain.verified && !domain.misconfigured) {
    return (
      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
        Aktiv
      </span>
    );
  }
  if (domain.verified && domain.misconfigured) {
    return (
      <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200">
        DNS prüfen
      </span>
    );
  }
  return (
    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200">
      Verifizierung ausstehend
    </span>
  );
}

export function DomainCard({ domain }: DomainCardProps) {
  function onRemove(e: FormEvent<HTMLFormElement>) {
    if (
      !confirm(
        `Domain „${domain.name}“ aus dem Vercel-Projekt entfernen? Die Website ist danach unter dieser Adresse nicht mehr erreichbar.`,
      )
    ) {
      e.preventDefault();
    }
  }

  const routing = domain.records.filter((r) => r.purpose === "routing");
  const verification = domain.records.filter((r) => r.purpose === "verification");

  return (
    <article className={cardClass}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-mono text-lg font-semibold text-[var(--foreground)]">
            {domain.name}
          </h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {domain.isApex ? "Apex-Domain" : `Subdomain von ${domain.apexName}`}
            {domain.redirect ? ` · Redirect → ${domain.redirect}` : null}
            {domain.configuredBy ? ` · ${domain.configuredBy}` : null}
          </p>
        </div>
        <StatusBadge domain={domain} />
      </div>

      <div className="mt-6 space-y-6">
        {routing.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              DNS für Website (bei Ihrem Registrar)
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
              Tragen Sie diese Einträge bei Ihrem Domain-Anbieter (IONOS, GoDaddy,
              Cloudflare, …) ein. Propagation kann bis zu 48 Stunden dauern.
            </p>
            <DnsTable records={routing} />
          </div>
        ) : null}

        {verification.length > 0 ? (
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              Verifizierung (TXT)
            </h4>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Falls Vercel die Inhaberschaft noch prüft — zusätzlich zum Routing-Eintrag.
            </p>
            <DnsTable records={verification} />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
          <form action={verifyVercelDomain}>
            <input type="hidden" name="domain" value={domain.name} />
            <DashboardSubmitButton pendingLabel="Prüfe…">
              DNS erneut prüfen
            </DashboardSubmitButton>
          </form>
          <form action={removeVercelDomain} onSubmit={onRemove}>
            <input type="hidden" name="domain" value={domain.name} />
            <DashboardSubmitButton
              pendingLabel="Entfernt"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 text-xs font-semibold uppercase tracking-wider text-red-300/90"
            >
              Domain entfernen
            </DashboardSubmitButton>
          </form>
        </div>
      </div>
    </article>
  );
}

function DnsTable({ records }: { records: VercelDomainDetails["records"] }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-white/[0.02] text-xs uppercase tracking-wider text-[var(--muted)]">
            <th className="px-3 py-2">Typ</th>
            <th className="px-3 py-2">Name / Host</th>
            <th className="px-3 py-2">Wert</th>
            <th className="w-24 px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {records.map((row) => (
            <tr key={row.id} className="border-b border-[var(--border)]/60">
              <td className="px-3 py-3 font-mono text-xs text-[var(--accent)]">
                {row.type}
              </td>
              <td className="px-3 py-3 font-mono text-xs text-[var(--foreground)]">
                {row.host}
              </td>
              <td className="max-w-[14rem] truncate px-3 py-3 font-mono text-xs text-[var(--muted)] sm:max-w-xs">
                <span title={row.value}>{row.value}</span>
                {row.note ? (
                  <span className="mt-1 block font-sans text-[10px] text-[var(--muted)]">
                    {row.note}
                  </span>
                ) : null}
              </td>
              <td className="px-3 py-3">
                <CopyValueButton value={row.value} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
