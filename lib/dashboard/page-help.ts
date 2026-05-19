export type DashboardPageHelp = {
  title: string;
  body: string;
  websiteHref?: string;
  websiteLabel?: string;
  nextHref?: string;
  nextLabel?: string;
};

const HELP_BY_EXACT_PATH: Record<string, DashboardPageHelp> = {
  "/dashboard": {
    title: "Was sehen Sie hier?",
    body: "Überblick über Zahlen, Status und die wichtigsten Admin-Bereiche.",
    nextHref: "/dashboard/content",
    nextLabel: "Content bearbeiten",
  },
  "/dashboard/glossary": {
    title: "Was lernen Sie hier?",
    body: "Das Glossar erklärt CMS-Begriffe in einfacher Sprache, damit Sie sicher ohne Code arbeiten können.",
    nextHref: "/dashboard/content",
    nextLabel: "Content-Hub öffnen",
  },
  "/dashboard/content": {
    title: "Was ändert sich hier?",
    body: "Der Content-Hub führt zu allen Textbereichen der Startseite. Einzelne Karten bearbeiten Sie im Einträge-Hub.",
    websiteHref: "/",
    websiteLabel: "Startseite ansehen",
    nextHref: "/dashboard/entries",
    nextLabel: "Karten bearbeiten",
  },
  "/dashboard/pages": {
    title: "Was ändert sich hier?",
    body: "Dynamische Seiten: Slug, Parent, Sprache, Template und Veröffentlichungsstatus ohne Code verwalten.",
    websiteHref: "/",
    websiteLabel: "Website ansehen",
    nextHref: "/dashboard/content",
    nextLabel: "Startseite bearbeiten",
  },
  "/dashboard/entries": {
    title: "Was ändert sich hier?",
    body: "Der Einträge-Hub führt zu einzelnen Leistungs-, Portfolio- und Warum-OrzuIT-Karten.",
    websiteHref: "/",
    websiteLabel: "Startseite ansehen",
    nextHref: "/dashboard/content",
    nextLabel: "Texte bearbeiten",
  },
  "/dashboard/services": {
    title: "Was ändert sich hier?",
    body: "Service-Karten im Leistungs-Karussell: Titel, Texte, Bild, Link, Kategorie und Veröffentlichungsstatus.",
    websiteHref: "/#leistungen",
    websiteLabel: "Leistungen ansehen",
    nextHref: "/dashboard/content/leistungen",
    nextLabel: "Intro-Texte bearbeiten",
  },
  "/dashboard/portfolio": {
    title: "Was ändert sich hier?",
    body: "Projekt-Karten im Portfolio: Bild, Case-Study, Projekt-URL, Kategorie und Reihenfolge.",
    websiteHref: "/#portfolio",
    websiteLabel: "Portfolio ansehen",
    nextHref: "/dashboard/content/portfolio",
    nextLabel: "Intro-Texte bearbeiten",
  },
  "/dashboard/testimonials": {
    title: "Was ändert sich hier?",
    body: "Karten im Abschnitt Warum OrzuIT. Interne Namen können noch Testimonials heißen, sichtbar ist es als Arbeitsweise.",
    websiteHref: "/#warum-orzuit",
    websiteLabel: "Warum OrzuIT ansehen",
    nextHref: "/dashboard/content/warum",
    nextLabel: "Intro-Texte bearbeiten",
  },
  "/dashboard/media": {
    title: "Was sehen Sie hier?",
    body: "Zentrale Übersicht aller Bilder aus Leistungs- und Portfolio-Karten inklusive Alt-Text-Status.",
    nextHref: "/dashboard/services",
    nextLabel: "Service-Bilder bearbeiten",
  },
  "/dashboard/leads": {
    title: "Was sehen Sie hier?",
    body: "Alle Kontaktanfragen aus dem Formular inkl. Telefon, Leistung, Nachricht und Quelle.",
    websiteHref: "/#kontakt",
    websiteLabel: "Kontaktformular ansehen",
    nextHref: "/dashboard/content/kontakt",
    nextLabel: "Formular-Texte bearbeiten",
  },
  "/dashboard/analytics": {
    title: "Was sehen Sie hier?",
    body: "Analytics-Ereignisse, Conversion, CTA-Klicks, Scroll-Tiefe, Web Vitals und Heatmap-Status.",
    nextHref: "/dashboard/settings/integrations",
    nextLabel: "Tracking prüfen",
  },
  "/dashboard/ai": {
    title: "Was erstellen Sie hier?",
    body: "AI-Entwürfe für Content, SEO, Übersetzungen, Lead-Zusammenfassungen und Admin-Hilfe. Inhalte bleiben kontrollierbar und müssen vor Veröffentlichung geprüft werden.",
    nextHref: "/dashboard/content",
    nextLabel: "Content bearbeiten",
  },
  "/dashboard/legal": {
    title: "Was ändert sich hier?",
    body: "Impressum und Datenschutz. Änderungen wirken auf die rechtlichen Seiten der Website.",
    websiteHref: "/impressum",
    websiteLabel: "Impressum ansehen",
  },
  "/dashboard/settings": {
    title: "Was sehen Sie hier?",
    body: "Produktions-Checkliste für System, SEO, Domains, Integrationen und Deploy. Sensible Werte werden nur als Status angezeigt.",
    nextHref: "/dashboard/settings/integrations",
    nextLabel: "Integrationen prüfen",
  },
  "/dashboard/settings/system": {
    title: "Was wird hier geprüft?",
    body: "Admin-Zugriff, öffentliche Site-URL und Datenhaltung. Hier stehen System-Regeln und Produktionshinweise.",
    nextHref: "/dashboard/settings/integrations",
    nextLabel: "Integrationen prüfen",
  },
  "/dashboard/settings/seo": {
    title: "Was ändert sich hier?",
    body: "Meta Title, Description und OpenGraph-Bild der Website. Später wird SEO pro dynamischer Seite erweitert.",
    websiteHref: "/",
    websiteLabel: "Startseite ansehen",
  },
  "/dashboard/settings/design": {
    title: "Was ändert sich hier?",
    body: "Globales Design System: Farben, Typografie, Schatten, Glassmorphism und Motion-Presets mit Live-Vorschau.",
    websiteHref: "/",
    websiteLabel: "Website ansehen",
  },
  "/dashboard/settings/domains": {
    title: "Was verwalten Sie hier?",
    body: "Custom Domains und DNS-Verbindungsstatus über Vercel. Voraussetzung ist die Vercel API-Konfiguration.",
    nextHref: "/dashboard/settings/deploy",
    nextLabel: "Vercel prüfen",
  },
  "/dashboard/settings/integrations": {
    title: "Was wird hier geprüft?",
    body: "Supabase, Resend, Telegram, Vercel und Admin-Env. Werte werden maskiert und nicht angezeigt.",
    nextHref: "/dashboard/settings/deploy",
    nextLabel: "Deploy öffnen",
  },
  "/dashboard/settings/secrets": {
    title: "Was verwalten Sie hier?",
    body: "API-Keys werden maskiert angezeigt und verschlüsselt gespeichert. Klartext wird nach dem Speichern nicht erneut ausgegeben.",
    nextHref: "/dashboard/settings/integrations",
    nextLabel: "Integrationen prüfen",
  },
  "/dashboard/settings/scaling": {
    title: "Was sehen Sie hier?",
    body: "Architektur- und Skalierungsfundament für Multi-Site, Client-Dashboards, CRM, Billing, Automationen und spätere SaaS-Funktionen.",
    nextHref: "/dashboard/settings/design",
    nextLabel: "Design System prüfen",
  },
  "/dashboard/settings/deploy": {
    title: "Was verwalten Sie hier?",
    body: "Vercel Deployments, Environment-Variablen und Production-Redeploy.",
    nextHref: "/dashboard/settings/domains",
    nextLabel: "Domains prüfen",
  },
};

const CONTENT_HELP: Record<string, DashboardPageHelp> = {
  "/dashboard/content/start": {
    title: "Was ändert sich hier?",
    body: "Hero-Bereich: Überschrift, Untertitel, Buttons und Kennzahlen ganz oben auf der Startseite.",
    websiteHref: "/#start",
    websiteLabel: "Hero ansehen",
  },
  "/dashboard/content/leistungen": {
    title: "Was ändert sich hier?",
    body: "Nur Intro-Texte über dem Leistungs-Karussell. Einzelne Service-Karten bearbeiten Sie unter Leistungen.",
    websiteHref: "/#leistungen",
    websiteLabel: "Leistungen ansehen",
    nextHref: "/dashboard/services",
    nextLabel: "Service-Karten bearbeiten",
  },
  "/dashboard/content/portfolio": {
    title: "Was ändert sich hier?",
    body: "Nur Intro-Texte des Portfolio-Abschnitts. Einzelne Projekte bearbeiten Sie unter Portfolio.",
    websiteHref: "/#portfolio",
    websiteLabel: "Portfolio ansehen",
    nextHref: "/dashboard/portfolio",
    nextLabel: "Projekt-Karten bearbeiten",
  },
  "/dashboard/content/warum": {
    title: "Was ändert sich hier?",
    body: "Intro-Texte des Warum-OrzuIT-Abschnitts. Die einzelnen Karten liegen unter Warum OrzuIT.",
    websiteHref: "/#warum-orzuit",
    websiteLabel: "Warum OrzuIT ansehen",
    nextHref: "/dashboard/testimonials",
    nextLabel: "Karten bearbeiten",
  },
  "/dashboard/content/kontakt": {
    title: "Was ändert sich hier?",
    body: "Texte des Kontaktbereichs, Hinweise sowie Meldungen beim Senden und nach erfolgreicher Anfrage.",
    websiteHref: "/#kontakt",
    websiteLabel: "Kontakt ansehen",
  },
  "/dashboard/content/menu": {
    title: "Was ändert sich hier?",
    body: "Navigation, Footer und globale Kurztexte. Diese Inhalte wirken auf die gesamte Website.",
    websiteHref: "/",
    websiteLabel: "Website ansehen",
  },
};

export function getDashboardPageHelp(pathname: string): DashboardPageHelp {
  const exact = HELP_BY_EXACT_PATH[pathname] ?? CONTENT_HELP[pathname];
  if (exact) return exact;

  if (pathname.startsWith("/dashboard/content")) {
    return {
      title: "Was ändert sich hier?",
      body: "Content-Seite der Startseite. Speichern aktualisiert die sichtbaren Website-Texte.",
      websiteHref: "/",
      websiteLabel: "Website ansehen",
    };
  }

  if (pathname.startsWith("/dashboard/settings")) {
    return {
      title: "Was verwalten Sie hier?",
      body: "Systemeinstellungen für SEO, Domains, Integrationen und Deployments.",
      nextHref: "/dashboard/settings",
      nextLabel: "Einstellungen-Hub",
    };
  }

  return {
    title: "Was passiert hier?",
    body: "Dieser Bereich gehört zum OrzuIT Control Center. Änderungen wirken je nach Modul auf Website, Business-Daten oder Systemkonfiguration.",
  };
}
