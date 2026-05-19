import { SettingsSubPage } from "../_shared";
import {
  getProductionReadinessChecks,
  productionReadinessScore,
} from "@/lib/production/readiness";

export default function DashboardSettingsSystemPage() {
  const checks = getProductionReadinessChecks();
  const score = productionReadinessScore(checks);

  return (
    <SettingsSubPage pathname="/dashboard/settings/system">
      <div className="grid max-w-4xl gap-6 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Production Readiness
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Code-seitige Checks fuer Vercel, Supabase, Admin-Zugriff und
                Benachrichtigungen.
              </p>
            </div>
            <span className="rounded-full border border-[var(--border)] px-4 py-2 font-mono text-sm text-[var(--accent)]">
              {score}%
            </span>
          </div>
          <div className="mt-5 grid gap-3">
            {checks.map((check) => (
              <div
                key={check.label}
                className="rounded-xl border border-[var(--border)] bg-white/[0.02] p-4"
              >
                <p className="flex items-center justify-between gap-3 text-sm font-medium text-[var(--foreground)]">
                  {check.label}
                  <span
                    className={
                      check.ok
                        ? "text-emerald-300"
                        : "text-amber-300"
                    }
                  >
                    {check.ok ? "OK" : "fehlt"}
                  </span>
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                  {check.hint}
                </p>
              </div>
            ))}
          </div>
        </section>

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
