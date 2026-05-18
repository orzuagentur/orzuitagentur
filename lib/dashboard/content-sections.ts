export type ContentSection = {
  href: string;
  label: string;
  description: string;
  siteAnchor: string;
};

export const CONTENT_SECTIONS: ContentSection[] = [
  {
    href: "/dashboard/content/hero",
    label: "Hero",
    description: "Startbereich mit Hauptüberschrift, CTAs und Kennzahlen.",
    siteAnchor: "#start",
  },
  {
    href: "/dashboard/content/nav-footer",
    label: "Menü & Footer",
    description: "Navigation, Footer-Texte und Kontaktzeile im Fußbereich.",
    siteAnchor: "global",
  },
  {
    href: "/dashboard/content/contact",
    label: "Kontakt",
    description: "Kontaktformular und Erfolgsmeldungen.",
    siteAnchor: "#kontakt",
  },
  {
    href: "/dashboard/content/sections",
    label: "Sektionen",
    description: "Überschriften für Leistungen, Portfolio und Warum OrzuIT.",
    siteAnchor: "#leistungen",
  },
  {
    href: "/dashboard/content/technologies",
    label: "Technologien",
    description: "Tech-Stack, Spalten und Marquee auf der Startseite.",
    siteAnchor: "#technologien",
  },
];

export const CONTENT_RELATED_CMS = [
  {
    href: "/dashboard/services",
    label: "Leistungen",
    description: "Einzelne Leistungskarten bearbeiten.",
  },
  {
    href: "/dashboard/portfolio",
    label: "Portfolio",
    description: "Projektbeispiele und Cases.",
  },
  {
    href: "/dashboard/testimonials",
    label: "Warum OrzuIT",
    description: "Karten im Abschnitt Arbeitsweise.",
  },
  {
    href: "/dashboard/seo",
    label: "SEO",
    description: "Titel, Beschreibung und OG-Bild der Startseite.",
  },
  {
    href: "/dashboard/legal",
    label: "Rechtliches",
    description: "Impressum und Datenschutz.",
  },
] as const;

export function getContentPageMeta(pathname: string): {
  label: string;
  description: string;
} | null {
  if (pathname === "/dashboard/content") {
    return {
      label: "Content",
      description: "Texte der öffentlichen Startseite — Bereich wählen.",
    };
  }

  const section = CONTENT_SECTIONS.find((s) => pathname === s.href);
  if (section) {
    return {
      label: `Content · ${section.label}`,
      description: section.description,
    };
  }

  if (pathname.startsWith("/dashboard/content/")) {
    return {
      label: "Content",
      description: "Texte der öffentlichen Startseite.",
    };
  }

  return null;
}
