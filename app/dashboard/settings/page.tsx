import { DashboardPageHeader } from "@/components/dashboard/page-header";

export default function DashboardSettingsPage() {
  return (
    <>
      <DashboardPageHeader
        title="Einstellungen"
        description="System- und Marken-Konfiguration erfolgt aktuell über Umgebungsvariablen und Supabase. Hier die wichtigsten Hebel im Überblick."
      />

      <div className="grid max-w-4xl gap-6 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6 text-sm text-[var(--muted)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Zugriff &amp; Admins
          </h2>
          <p className="mt-2 leading-relaxed">
            <code className="font-mono text-xs text-[var(--accent)]">ADMIN_EMAILS</code>{" "}
            (kommagetrennte Liste) schränkt den Dashboard-Zugang auf definierte
            E-Mail/Passwort-Konten in Supabase ein. Leer lassen, um nur
            „eingeloggt“ zu prüfen (nicht empfohlen in Produktion).
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6 text-sm text-[var(--muted)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Öffentliche Site-URL
          </h2>
          <p className="mt-2 leading-relaxed">
            <code className="font-mono text-xs text-[var(--accent)]">NEXT_PUBLIC_SITE_URL</code>{" "}
            für kanonische Links in E-Mails und Redirects.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6 text-sm text-[var(--muted)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Datenhaltung
          </h2>
          <p className="mt-2 leading-relaxed">
            Globale JSON-Konfiguration kann perspektivisch über{" "}
            <code className="font-mono text-xs text-[var(--accent)]">site_settings</code>{" "}
            gepflegt werden. Aktuell keine UI — siehe Bereich Content.
          </p>
        </section>
      </div>
    </>
  );
}
