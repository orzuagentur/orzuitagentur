import { AdminHubGrid } from "@/components/dashboard/admin-hub-grid";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { CONTENT_HUB_CARDS } from "@/lib/dashboard/admin-modules";

export default function DashboardContentHubPage() {
  const textCards = CONTENT_HUB_CARDS.filter((c) => c.kind === "text");

  return (
    <>
      <DashboardPageHeader
        title="Content-Hub"
        description="Alle Textbereiche der Startseite. Karten und Einzelprojekte bearbeiten Sie unter „Karten & Einträge“ oder direkt über die verlinkten Einträge unten."
      />

      <div className="px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <div className="mb-8 rounded-2xl border border-[color-mix(in_oklab,var(--accent)_22%,var(--border))] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] px-5 py-4 text-sm leading-relaxed text-[var(--muted)]">
          <p className="font-medium text-[var(--foreground)]">So funktioniert das CMS</p>
          <ul className="mt-3 list-inside list-disc space-y-1.5">
            <li>
              <strong className="text-[var(--foreground)]">Texte</strong> — Überschriften,
              Absätze, Buttons (ohne Code).
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Einträge</strong> — einzelne
              Leistungs-, Portfolio- und Warum-Karten inkl. Bild.
            </li>
            <li>
              Nach dem Speichern erscheinen Änderungen auf der Live-Website (Cache kann
              wenige Sekunden brauchen).
            </li>
          </ul>
        </div>

        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          Startseite · Texte
        </h2>
        <div className="mt-4">
          <AdminHubGrid cards={textCards} />
        </div>

        <h2 className="mt-12 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          Schnell zu Karten
        </h2>
        <div className="mt-4">
          <AdminHubGrid
            cards={CONTENT_HUB_CARDS.filter((c) => c.kind === "entries")}
          />
        </div>
      </div>
    </>
  );
}
