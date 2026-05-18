export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Übersicht", description: "KPIs & Schnellzugriff" },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    description: "Ereignisse & Trends",
  },
  { href: "/dashboard/leads", label: "Leads", description: "Anfragen & Pipeline" },
  {
    href: "/dashboard/content",
    label: "Content",
    description: "Seiten & Texte",
  },
  {
    href: "/dashboard/legal",
    label: "Rechtliches",
    description: "Impressum & Datenschutz",
  },
  {
    href: "/dashboard/services",
    label: "Leistungen",
    description: "CMS · Services",
  },
  {
    href: "/dashboard/portfolio",
    label: "Portfolio",
    description: "Cases & Projekte",
  },
  {
    href: "/dashboard/testimonials",
    label: "Warum OrzuIT",
    description: "Startseite · Arbeitsweise",
  },
  { href: "/dashboard/seo", label: "SEO", description: "Meta & OG" },
  {
    href: "/dashboard/domains",
    label: "Domains",
    description: "DNS · Custom Domain",
  },
  {
    href: "/dashboard/settings",
    label: "Einstellungen",
    description: "System & Marke",
  },
  {
    href: "/dashboard/integrations",
    label: "Integrationen",
    description: "Resend, Telegram, API",
  },
  {
    href: "/dashboard/deploy",
    label: "Deploy",
    description: "Vercel · Redeploy · Env",
  },
] as const;
