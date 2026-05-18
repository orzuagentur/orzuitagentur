export type ContentSection = {
  href: string;
  label: string;
  description: string;
  siteAnchor: string;
};

/** Startseite — nur Marketing-Texte (site_settings · marketing), keine Karten/Einträge. */
export const CONTENT_SECTIONS: ContentSection[] = [
  {
    href: "/dashboard/content/start",
    label: "Start",
    description: "Hero: Überschrift, Untertitel, Buttons und Kennzahlen (#start).",
    siteAnchor: "#start",
  },
  {
    href: "/dashboard/content/leistungen",
    label: "Leistungen",
    description: "Nur Überschrift und Texte über dem Leistungs-Block — keine einzelnen Karten.",
    siteAnchor: "#leistungen",
  },
  {
    href: "/dashboard/content/portfolio",
    label: "Portfolio",
    description: "Nur Intro-Texte des Portfolio-Abschnitts — keine Projekt-Einträge.",
    siteAnchor: "#portfolio",
  },
  {
    href: "/dashboard/content/warum",
    label: "Warum OrzuIT",
    description: "Überschriften und Texte im Abschnitt Arbeitsweise — keine Karten-Inhalte.",
    siteAnchor: "#warum-orzuit",
  },
  {
    href: "/dashboard/content/technologien",
    label: "Technologien",
    description: "Tech-Stack, Spalten und Lauftext (#technologien).",
    siteAnchor: "#technologien",
  },
  {
    href: "/dashboard/content/kontakt",
    label: "Kontakt",
    description: "Kontaktformular und Erfolgsmeldungen (#kontakt).",
    siteAnchor: "#kontakt",
  },
  {
    href: "/dashboard/content/menu",
    label: "Menü & Footer",
    description: "Navigation, Footer und globale Kurztexte.",
    siteAnchor: "global",
  },
];

export const CONTENT_SECTION_PATHS = [
  "/dashboard/content",
  ...CONTENT_SECTIONS.map((s) => s.href),
] as const;

/** Legacy routes → new section URLs (bookmarks). */
export const CONTENT_LEGACY_REDIRECTS: Record<string, string> = {
  "/dashboard/content/hero": "/dashboard/content/start",
  "/dashboard/content/sections": "/dashboard/content/leistungen",
  "/dashboard/content/nav-footer": "/dashboard/content/menu",
  "/dashboard/content/contact": "/dashboard/content/kontakt",
  "/dashboard/content/technologies": "/dashboard/content/technologien",
};

export function getContentPageMeta(pathname: string): {
  label: string;
  description: string;
} | null {
  const section = CONTENT_SECTIONS.find((s) => pathname === s.href);
  if (section) {
    return {
      label: `Content · ${section.label}`,
      description: section.description,
    };
  }

  if (pathname.startsWith("/dashboard/content")) {
    return {
      label: "Content",
      description: "Texte der Startseite — Bereich in der Leiste wählen.",
    };
  }

  return null;
}
