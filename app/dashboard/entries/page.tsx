import Link from "next/link";
import { DashboardPageHeader } from "@/components/dashboard/page-header";

const ENTRY_AREAS = [
  {
    href: "/dashboard/services",
    label: "Leistungen",
    description:
      "Einzelne Service-Karten: Titel, Kurztext, Detail (Rückseite), Bild, Kategorie, Link, sort_order, Veröffentlicht.",
    siteAnchor: "#leistungen",
  },
  {
    href: "/dashboard/portfolio",
    label: "Portfolio",
    description:
      "Projekt-Karten: Titel, Zusammenfassung, Case-Study, Bild, Projekt-URL, Kategorie, Reihenfolge.",
    siteAnchor: "#portfolio",
  },
  {
    href: "/dashboard/testimonials",
    label: "Warum OrzuIT",
    description:
      "Karten im Abschnitt Arbeitsweise: Zitat, Autor, Rolle, Organisation.",
    siteAnchor: "#warum-orzuit",
  },
  {
    href: "/dashboard/media",
    label: "Medien-Bibliothek",
    description:
      "Zentrale Übersicht aller Kartenbilder mit Alt-Text-Status und direktem Bearbeiten-Link.",
    siteAnchor: "global",
  },
] as const;

export default function DashboardEntriesHubPage() {
  return (
    <>
      <DashboardPageHeader
        title="Einträge-Hub"
        description="Hier bearbeiten Sie einzelne Karten — nicht die Überschriften der Abschnitte. Intro-Texte finden Sie im Content-Hub."
      />

      <div className="px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          <Link href="/dashboard/content" className="font-medium text-[var(--accent)] hover:underline">
            ← Content-Hub
          </Link>{" "}
          für Sektions-Überschriften und Menü/Footer.
        </p>

        <ul className="grid gap-4 lg:grid-cols-4">
          {ENTRY_AREAS.map((area) => (
            <li key={area.href}>
              <Link
                href={area.href}
                className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_82%,transparent)] p-6 transition-[border-color,transform] hover:border-[color-mix(in_oklab,var(--accent)_28%,var(--border))] hover:-translate-y-0.5"
              >
                <span className="text-lg font-semibold text-[var(--foreground)]">
                  {area.label}
                </span>
                <span className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                  {area.description}
                </span>
                <span className="mt-4 font-mono text-xs text-[var(--muted)]">
                  Website: /{area.siteAnchor}
                </span>
                <span className="mt-4 text-xs font-semibold text-[var(--accent)]">
                  Einträge bearbeiten →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
