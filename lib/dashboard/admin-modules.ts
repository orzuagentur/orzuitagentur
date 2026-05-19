export type AdminNavItem = {
  href: string;
  label: string;
  description: string;
};

export type AdminNavGroup = {
  id: string;
  label: string;
  description: string;
  items: AdminNavItem[];
};

/** Gruppierte Sidebar — logische Bereiche für Nicht-Entwickler. */
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    id: "overview",
    label: "Übersicht",
    description: "KPIs und Schnellzugriff",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        description: "Zahlen, Bereiche und Status auf einen Blick",
      },
      {
        href: "/dashboard/glossary",
        label: "Admin-Glossar",
        description: "Begriffe im CMS einfach erklärt",
      },
    ],
  },
  {
    id: "website",
    label: "Website · Startseite",
    description: "Texte und Abschnitte der Homepage",
    items: [
      {
        href: "/dashboard/content",
        label: "Content-Hub",
        description: "Alle Startseiten-Bereiche — Überschriften & Texte",
      },
      {
        href: "/dashboard/pages",
        label: "Dynamische Seiten",
        description: "Neue Seiten, Slugs, Templates und Veröffentlichungen",
      },
    ],
  },
  {
    id: "entries",
    label: "Karten & Einträge",
    description: "Einzelne Leistungen, Projekte und Karten",
    items: [
      {
        href: "/dashboard/entries",
        label: "Einträge-Hub",
        description: "Übersicht: Leistungen, Portfolio, Warum OrzuIT",
      },
      {
        href: "/dashboard/services",
        label: "Leistungen",
        description: "Service-Karten inkl. Bild und Detailtext",
      },
      {
        href: "/dashboard/portfolio",
        label: "Portfolio",
        description: "Projekt-Karten und Case-Study-Texte",
      },
      {
        href: "/dashboard/testimonials",
        label: "Warum OrzuIT",
        description: "Karten im Abschnitt Arbeitsweise",
      },
      {
        href: "/dashboard/media",
        label: "Medien-Bibliothek",
        description: "Alle Kartenbilder und Alt-Texte im Überblick",
      },
    ],
  },
  {
    id: "business",
    label: "Business & AI",
    description: "Anfragen, Statistik und Automatisierung",
    items: [
      {
        href: "/dashboard/leads",
        label: "Leads",
        description: "Kontaktanfragen aus dem Formular",
      },
      {
        href: "/dashboard/analytics",
        label: "Analytics",
        description: "Ereignisse und Trends",
      },
      {
        href: "/dashboard/ai",
        label: "AI Automation",
        description: "Content, SEO, Leads und Admin-Assistent",
      },
    ],
  },
  {
    id: "legal",
    label: "Rechtliches",
    description: "Impressum und Datenschutz",
    items: [
      {
        href: "/dashboard/legal",
        label: "Rechtstexte",
        description: "Impressum & Datenschutzerklärung",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    description: "SEO, Domains, Integrationen, Deploy",
    items: [
      {
        href: "/dashboard/settings",
        label: "Einstellungen",
        description: "System, SEO, Domains, APIs, Vercel",
      },
    ],
  },
];

/** Flache Liste für Meta-Titel und Kompatibilität. */
export const DASHBOARD_NAV: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap(
  (group) => group.items,
);

export type AdminHubCard = {
  href: string;
  label: string;
  description: string;
  siteAnchor?: string;
  kind: "text" | "entries" | "system";
};

export const CONTENT_HUB_CARDS: AdminHubCard[] = [
  {
    href: "/dashboard/content/start",
    label: "Start / Hero",
    description: "Überschrift, Untertitel, Buttons, Kennzahlen",
    siteAnchor: "#start",
    kind: "text",
  },
  {
    href: "/dashboard/content/leistungen",
    label: "Leistungen · Intro",
    description: "Nur Texte über dem Leistungs-Karussell",
    siteAnchor: "#leistungen",
    kind: "text",
  },
  {
    href: "/dashboard/services",
    label: "Leistungen · Karten",
    description: "Einzelne Service-Karten, Bilder, Links",
    siteAnchor: "#leistungen",
    kind: "entries",
  },
  {
    href: "/dashboard/content/portfolio",
    label: "Portfolio · Intro",
    description: "Nur Intro-Texte des Portfolio-Blocks",
    siteAnchor: "#portfolio",
    kind: "text",
  },
  {
    href: "/dashboard/portfolio",
    label: "Portfolio · Projekte",
    description: "Projekt-Karten, Bilder, Case-Study",
    siteAnchor: "#portfolio",
    kind: "entries",
  },
  {
    href: "/dashboard/content/warum",
    label: "Warum OrzuIT · Intro",
    description: "Überschriften des Abschnitts",
    siteAnchor: "#warum-orzuit",
    kind: "text",
  },
  {
    href: "/dashboard/testimonials",
    label: "Warum OrzuIT · Karten",
    description: "Einzelne Karten bearbeiten",
    siteAnchor: "#warum-orzuit",
    kind: "entries",
  },
  {
    href: "/dashboard/content/kontakt",
    label: "Kontakt",
    description: "Formular-Texte und Erfolgsmeldungen",
    siteAnchor: "#kontakt",
    kind: "text",
  },
  {
    href: "/dashboard/content/menu",
    label: "Menü & Footer",
    description: "Navigation, Footer, globale Kurztexte",
    siteAnchor: "global",
    kind: "text",
  },
  {
    href: "/dashboard/pages",
    label: "Dynamische Seiten",
    description: "Neue Landing-, Legal- oder Blank-Seiten anlegen",
    siteAnchor: "global",
    kind: "system",
  },
  {
    href: "/dashboard/media",
    label: "Medien-Bibliothek",
    description: "Alle Kartenbilder und fehlende Alt-Texte prüfen",
    siteAnchor: "global",
    kind: "system",
  },
];
