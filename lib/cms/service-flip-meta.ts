export type ServiceFlipMeta = {
  technologies: string[];
  highlights: string[];
};

export const DEFAULT_SERVICE_FLIP: Record<string, ServiceFlipMeta> = {
  s1: {
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "REST", "Docker"],
    highlights: [
      "Web-Apps & interne Tools",
      "Klare Rollen & Prozesse",
      "Weniger manuelle Arbeit",
    ],
  },
  s2: {
    technologies: ["OpenAI API", "Python", "n8n", "Supabase", "Webhooks"],
    highlights: [
      "KI-Assistenten & Dokumenten-Flows",
      "Automatisierung im Backoffice",
      "Messbare Zeitersparnis",
    ],
  },
  s3: {
    technologies: ["Next.js", "Headless CMS", "Stripe", "Vercel", "SEO"],
    highlights: [
      "Schnelle, wartbare Websites",
      "Shop & CMS für Ihr Team",
      "Performance & Conversion",
    ],
  },
  s4: {
    technologies: ["Docker", "GitHub Actions", "Monitoring", "Backups", "TLS"],
    highlights: [
      "Hosting & Updates",
      "Monitoring & Alerts",
      "Dokumentierte Übergabe",
    ],
  },
  s5: {
    technologies: ["REST", "GraphQL", "Kafka", "OAuth2", "ETL"],
    highlights: [
      "ERP- & CRM-Anbindungen",
      "Stabile Datenflüsse",
      "Versionierte APIs",
    ],
  },
};

export const DEFAULT_SERVICE_FLIP_FALLBACK: ServiceFlipMeta = {
  technologies: ["Next.js", "TypeScript", "React", "Supabase"],
  highlights: ["Verständliche Umsetzung", "Klare Meilensteine", "Saubere Übergabe"],
};
