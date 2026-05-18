export type PortfolioFlipMeta = {
  technologies: string[];
  highlights: string[];
};

export const DEFAULT_PORTFOLIO_FLIP: Record<string, PortfolioFlipMeta> = {
  finsight: {
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Realtime", "RBAC"],
    highlights: [
      "Live-Dashboards & Marktdaten",
      "Compliance-Trails & Rollen",
      "KI-Hinweise bei Anomalien",
    ],
  },
  velo: {
    technologies: ["IoT", "Digital Twin", "Python", "TimescaleDB", "Grafana"],
    highlights: [
      "Sensordaten-Harmonisierung",
      "Emissions-KPIs & Vergleiche",
      "Audit-fähige Exporte",
    ],
  },
  aura: {
    technologies: ["Next.js", "Headless CMS", "Stripe", "Edge", "Analytics"],
    highlights: [
      "Personalisierte Journeys",
      "Inventory-Sync",
      "Performance-Budget ab Tag 1",
    ],
  },
  nexus: {
    technologies: ["React", "Supabase", "DSGVO", "OpenAI API", "HL7/FHIR"],
    highlights: [
      "Patientenpfade & Termine",
      "KI-Triage mit Nachvollziehbarkeit",
      "Kliniknetzwerk-Integration",
    ],
  },
  vault: {
    technologies: ["Java", "PostgreSQL", "Kafka", "OAuth2", "Audit Logs"],
    highlights: [
      "Revisionssichere Trails",
      "Feingranulare Rollen",
      "Echtzeit-Alerts",
    ],
  },
  pulse: {
    technologies: ["Next.js", "Shopify", "Redis", "Segment", "Vercel"],
    highlights: [
      "Conversion-Dashboards",
      "Lager-Signale",
      "Kampagnen-Automation",
    ],
  },
};

export const DEFAULT_FLIP_FALLBACK: PortfolioFlipMeta = {
  technologies: ["Next.js", "TypeScript", "React", "Supabase"],
  highlights: ["Modulare Architektur", "Klare Übergabe", "Messbarer Nutzen"],
};
