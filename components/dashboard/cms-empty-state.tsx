import Link from "next/link";
import { seedCmsContent } from "@/actions/cms/seed";
import { hasServiceRoleConfig } from "@/lib/supabase/service";

type CmsEmptyStateProps = {
  returnTo: string;
  tableLabel: string;
};

export function CmsEmptyState({ returnTo, tableLabel }: CmsEmptyStateProps) {
  const hasServiceRole = hasServiceRoleConfig();

  return (
    <div className="max-w-2xl space-y-4 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] px-4 py-8 text-sm text-[var(--muted)]">
      {!hasServiceRole ? (
        <>
          <p>
            <strong className="text-[var(--foreground)]">Service-Role fehlt.</strong>{" "}
            Das Dashboard kann {tableLabel} nicht laden. In Vercel{" "}
            <code className="font-mono text-xs text-[var(--accent)]">
              SUPABASE_SERVICE_ROLE_KEY
            </code>{" "}
            setzen (Supabase → Settings → API → service_role) und neu deployen.
          </p>
          <Link
            href="/dashboard/integrations"
            className="inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Integrationen prüfen →
          </Link>
        </>
      ) : (
        <>
          <p>
            Die Tabelle <strong className="text-[var(--foreground)]">{tableLabel}</strong>{" "}
            ist leer. Laden Sie die Standard-Leistungen, Portfolio- und Referenz-Texte
            aus dem Projekt (ein Klick).
          </p>
          <form action={seedCmsContent}>
            <input type="hidden" name="returnTo" value={returnTo} />
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-5 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] transition-opacity hover:opacity-90"
            >
              Standard-Inhalte laden
            </button>
          </form>
          <p className="text-xs leading-relaxed">
            Alternativ: SQL-Datei{" "}
            <code className="font-mono text-[var(--accent)]">
              supabase/migrations/20260516120000_seed.sql
            </code>{" "}
            im Supabase SQL Editor ausführen.
          </p>
        </>
      )}
    </div>
  );
}
