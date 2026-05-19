import Link from "next/link";
import { DashboardPageHeader } from "@/components/dashboard/page-header";

type GlossaryTerm = {
  term: string;
  short: string;
  details: string;
  example?: string;
  href?: string;
  hrefLabel?: string;
};

const glossaryGroups: {
  label: string;
  description: string;
  terms: GlossaryTerm[];
}[] = [
  {
    label: "Content-Grundlagen",
    description: "Die wichtigsten Begriffe, wenn Sie Texte und Karten ändern.",
    terms: [
      {
        term: "Content-Hub",
        short: "Zentrale Übersicht für Startseiten-Texte.",
        details:
          "Hier wählen Sie den Bereich der Startseite aus, dessen Überschrift, Text oder Button Sie bearbeiten möchten.",
        example: "Hero-Text, Kontakt-Text, Menü & Footer.",
        href: "/dashboard/content",
        hrefLabel: "Content-Hub öffnen",
      },
      {
        term: "Sektion / Abschnitt",
        short: "Ein sichtbarer Bereich der Website.",
        details:
          "Eine Sektion ist zum Beispiel Hero, Leistungen, Portfolio, Warum OrzuIT oder Kontakt. Sektions-Texte sind meist Überschrift und Einleitung.",
        example: "Leistungen · Intro ändert nicht einzelne Service-Karten.",
      },
      {
        term: "Karte / Eintrag",
        short: "Ein einzelnes Element innerhalb einer Sektion.",
        details:
          "Karten sind einzelne Leistungen, Portfolio-Projekte oder Warum-OrzuIT-Karten. Sie haben eigene Titel, Texte, Bilder, Links und Reihenfolge.",
        href: "/dashboard/entries",
        hrefLabel: "Einträge-Hub öffnen",
      },
      {
        term: "Intro",
        short: "Text über einer Sektion.",
        details:
          "Das Intro erklärt den Bereich, aber verändert nicht die einzelnen Karten darunter.",
        example: "Portfolio · Intro ist nicht gleich Portfolio · Projekte.",
      },
      {
        term: "CTA",
        short: "Call to Action, also eine Aktions-Schaltfläche.",
        details:
          "Ein CTA ist ein Button wie „Projekt anfragen“, „Mehr ansehen“ oder „Kontakt aufnehmen“.",
      },
    ],
  },
  {
    label: "Veröffentlichung & URLs",
    description: "Begriffe rund um Sichtbarkeit, Links und Seitenadressen.",
    terms: [
      {
        term: "Slug",
        short: "Technischer Kurzname für eine URL.",
        details:
          "Der Slug wird für Links und Detailseiten genutzt. Er sollte kurz, eindeutig und ohne Leerzeichen sein.",
        example: "portfolio/finsight → Slug: finsight",
      },
      {
        term: "Published / Veröffentlicht",
        short: "Legt fest, ob ein Eintrag sichtbar ist.",
        details:
          "Wenn der Haken aktiv ist, erscheint der Eintrag auf der Website. Ohne Haken bleibt er im Admin, aber Besucher sehen ihn nicht.",
      },
      {
        term: "sort_order",
        short: "Reihenfolge der Karten.",
        details:
          "Kleinere Zahlen erscheinen weiter vorne. Die erste Leistung oder das erste Projekt kann besonders hervorgehoben werden.",
        example: "1 = zuerst, 2 = danach.",
      },
      {
        term: "Projekt-URL",
        short: "Externer Link zu einem Projekt.",
        details:
          "Bei Portfolio und Leistungen kann dieser Link auf eine Live-Website, App oder Demo führen.",
      },
    ],
  },
  {
    label: "Medien & Design",
    description: "Bilder, Themes und visuelle Einstellungen.",
    terms: [
      {
        term: "Kartenbild",
        short: "Bild auf der Vorderseite einer Karte.",
        details:
          "Wenn ein Bild hochgeladen oder eine Bild-URL gesetzt ist, ersetzt es das farbige Theme der Karte.",
        href: "/dashboard/services",
        hrefLabel: "Leistungsbilder öffnen",
      },
      {
        term: "Bild-URL",
        short: "Direkter Link zu einem Bild.",
        details:
          "Alternativ zum Upload können Sie eine öffentliche Bildadresse eintragen. Upload ist für interne Bilder meist besser.",
      },
      {
        term: "Theme / visualClass",
        short: "Farbiger Fallback, wenn kein Bild gesetzt ist.",
        details:
          "Das System zeigt automatisch ein passendes Farb-Theme, solange keine eigene Karte ein Bild hat.",
      },
      {
        term: "Alt-Text",
        short: "Beschreibung für ein Bild.",
        details:
          "Wichtig für SEO und Barrierefreiheit. Wird später in der Medien-Bibliothek zentral gepflegt.",
      },
    ],
  },
  {
    label: "SEO & System",
    description: "Begriffe für Suchmaschinen, Domains und technische Anbindung.",
    terms: [
      {
        term: "SEO Title",
        short: "Titel, den Suchmaschinen und Browser anzeigen.",
        details:
          "Ein guter SEO Title ist kurz, klar und enthält den wichtigsten Begriff der Seite.",
        href: "/dashboard/settings/seo",
        hrefLabel: "SEO öffnen",
      },
      {
        term: "Meta Description",
        short: "Kurzbeschreibung für Suchergebnisse.",
        details:
          "Sie beschreibt die Seite in 1–2 Sätzen. Sie ist kein sichtbarer Website-Text.",
      },
      {
        term: "OpenGraph / OG",
        short: "Vorschau für Social Media.",
        details:
          "OG-Daten bestimmen Titel, Beschreibung und Bild, wenn eine Seite geteilt wird.",
      },
      {
        term: "Environment Variable",
        short: "Sicherer Server-Wert wie API-Key oder Token.",
        details:
          "Diese Werte werden nicht im Admin im Klartext gezeigt. Der Admin zeigt nur, ob sie gesetzt sind.",
        href: "/dashboard/settings/integrations",
        hrefLabel: "Integrationen prüfen",
      },
      {
        term: "Service Role",
        short: "Sicherer Supabase-Schlüssel für Server-Aktionen.",
        details:
          "Damit darf der Server CMS-Daten lesen und schreiben. Er darf nie öffentlich im Browser liegen.",
      },
      {
        term: "Deploy",
        short: "Neue Version der Website veröffentlichen.",
        details:
          "Nach Code- oder Env-Änderungen kann ein Deploy nötig sein. Content-Änderungen brauchen meist nur Cache-Aktualisierung.",
        href: "/dashboard/settings/deploy",
        hrefLabel: "Deploy öffnen",
      },
    ],
  },
  {
    label: "Business-Daten",
    description: "Leads, Analytics und Kontaktformular.",
    terms: [
      {
        term: "Lead",
        short: "Eine Anfrage über das Kontaktformular.",
        details:
          "Leads enthalten Name, E-Mail, Telefon, gewünschte Leistung und Nachricht.",
        href: "/dashboard/leads",
        hrefLabel: "Leads öffnen",
      },
      {
        term: "Source",
        short: "Quelle einer Anfrage oder eines Events.",
        details:
          "Damit lässt sich später erkennen, ob eine Anfrage von Website, Kampagne oder anderem Kanal kam.",
      },
      {
        term: "Analytics Event",
        short: "Ein gespeichertes Nutzerereignis.",
        details:
          "Zum Beispiel CTA-Klick, Formularstart oder Scroll-Tiefe. Dieser Bereich wird später erweitert.",
        href: "/dashboard/analytics",
        hrefLabel: "Analytics öffnen",
      },
    ],
  },
];

export default function DashboardGlossaryPage() {
  return (
    <>
      <DashboardPageHeader
        title="Admin-Glossar"
        description="Einfache Erklärungen für CMS-Begriffe, damit Sie sicher ohne Code arbeiten können."
      />

      <div className="space-y-10 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        {glossaryGroups.map((group) => (
          <section key={group.label}>
            <div className="max-w-3xl">
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                {group.label}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {group.description}
              </p>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {group.terms.map((item) => (
                <article
                  key={item.term}
                  className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_82%,transparent)] p-5"
                >
                  <h3 className="text-base font-semibold text-[var(--foreground)]">
                    {item.term}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-[var(--accent)]">
                    {item.short}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    {item.details}
                  </p>
                  {item.example ? (
                    <p className="mt-3 rounded-xl border border-[var(--border)] bg-white/[0.02] px-3 py-2 font-mono text-xs text-[var(--muted)]">
                      Beispiel: {item.example}
                    </p>
                  ) : null}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="mt-4 inline-flex text-xs font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
                    >
                      {item.hrefLabel ?? "Öffnen"} →
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
