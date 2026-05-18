import { SettingsSubPage } from "../_shared";

export default function DashboardSettingsSystemPage() {
  return (
    <SettingsSubPage pathname="/dashboard/settings/system">
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
            für kanonische Links in E-Mails und Redirects. Nach Domain-Wechsel unter{" "}
            <strong className="font-medium text-[var(--foreground)]">Domains</strong> auch in
            Vercel setzen.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6 text-sm text-[var(--muted)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Datenhaltung
          </h2>
          <p className="mt-2 leading-relaxed">
            Marketing-Texte der Startseite: Bereich{" "}
            <strong className="font-medium text-[var(--foreground)]">Content</strong> im Menü.
            Rechtstexte: <strong className="font-medium text-[var(--foreground)]">Rechtliches</strong>.
            Leistungen, Portfolio und Karten: eigene CMS-Bereiche in der Sidebar.
          </p>
        </section>
      </div>
    </SettingsSubPage>
  );
}
