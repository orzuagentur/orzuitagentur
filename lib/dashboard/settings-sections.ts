export type SettingsSection = {
  href: string;
  label: string;
  description: string;
};

/** System, SEO, Domains, Integrationen & Deploy — eine Leiste, eigene Unterseiten. */
export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    href: "/dashboard/settings/system",
    label: "System",
    description: "Zugriff, Site-URL und Datenhaltung im Überblick.",
  },
  {
    href: "/dashboard/settings/seo",
    label: "SEO",
    description: "Meta & Open Graph für die Startseite und weitere Pfade.",
  },
  {
    href: "/dashboard/settings/domains",
    label: "Domains",
    description: "Custom Domain, DNS-Einträge und Verbindungsstatus.",
  },
  {
    href: "/dashboard/settings/integrations",
    label: "Integrationen",
    description: "Supabase, Resend, Telegram und Vercel — Konfigurations-Check.",
  },
  {
    href: "/dashboard/settings/deploy",
    label: "Deploy",
    description: "Vercel Redeploy, Umgebungsvariablen und Deployments.",
  },
];

export const SETTINGS_SECTION_PATHS = [
  "/dashboard/settings",
  ...SETTINGS_SECTIONS.map((s) => s.href),
] as const;

export const SETTINGS_DEPLOY_PATH = "/dashboard/settings/deploy" as const;
export const SETTINGS_DOMAINS_PATH = "/dashboard/settings/domains" as const;

/** Alte Sidebar-URLs → neue Einstellungen-Unterseiten. */
export const SETTINGS_LEGACY_PATHS = [
  "/dashboard/seo",
  "/dashboard/domains",
  "/dashboard/integrations",
  "/dashboard/deploy",
] as const;

export function getSettingsPageMeta(pathname: string): {
  label: string;
  description: string;
} | null {
  const section = SETTINGS_SECTIONS.find((s) => pathname === s.href);
  if (section) {
    return {
      label: `Einstellungen · ${section.label}`,
      description: section.description,
    };
  }

  if (pathname.startsWith("/dashboard/settings")) {
    return {
      label: "Einstellungen",
      description: "System, SEO, Domains, Integrationen und Deploy.",
    };
  }

  return null;
}
