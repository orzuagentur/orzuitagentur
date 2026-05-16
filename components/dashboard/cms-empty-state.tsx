import Link from "next/link";
import { seedCmsContent } from "@/actions/cms/seed";
import { hasServiceRoleConfig } from "@/lib/supabase/service";

const SEED_MESSAGES: Record<string, string> = {
  seeded:
    "Standard-Inhalte wurden geladen. Sie können sie jetzt bearbeiten.",
  already: "Inhalte existieren bereits — nichts erneut eingefügt.",
  service_role:
    "SUPABASE_SERVICE_ROLE_KEY fehlt in Vercel. Integrationen prüfen und Redeploy.",
  db: "Seed fehlgeschlagen. Wurde die SQL-Migration in Supabase ausgeführt?",
};

type CmsEmptyStateProps = {
  returnTo: string;
  tableLabel: string;
  seedStatus?: string | null;
};

export function CmsEmptyState({
  returnTo,
  tableLabel,
  seedStatus,
}: CmsEmptyStateProps) {
  const hasServiceRole = hasServiceRoleConfig();
  const statusMessage = seedStatus ? SEED_MESSAGES[seedStatus] : undefined;

  return (
    <div className="max-w-2xl space-y-4 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] px-4 py-8 text-sm text-[var(--muted)]">
      {statusMessage ? (
        <p
          className={
            seedStatus === "seeded" || seedStatus === "already"
              ? "text-[var(--accent)]"
              : "text-red-400/90"
          }
          role="status"
        >
          {statusMessage}
        </p>
      ) : null}

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
