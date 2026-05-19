export const PAGE_BLOCK_TYPES = [
  "hero",
  "features",
  "services",
  "portfolio",
  "testimonials",
  "faq",
  "pricing",
  "cta",
  "stats",
  "team",
  "ai",
  "contact",
  "timeline",
  "markdown",
  "custom_html",
  "react",
] as const;

export type PageBlockType = (typeof PAGE_BLOCK_TYPES)[number];

export type PageBuilderSection = {
  id: string;
  page_id: string;
  title_de: string;
  section_key: string;
  visible: boolean;
  sort_order: number;
  layout: Record<string, unknown>;
  responsive: Record<string, unknown>;
  animation: Record<string, unknown>;
  updated_at: string;
};

export type PageBuilderBlock = {
  id: string;
  section_id: string;
  block_type: PageBlockType;
  title_de: string;
  content_de: string | null;
  visible: boolean;
  sort_order: number;
  settings: Record<string, unknown>;
  updated_at: string;
};

export type PageBuilderSectionWithBlocks = PageBuilderSection & {
  blocks: PageBuilderBlock[];
};

export const PAGE_BLOCK_REGISTRY: Record<
  PageBlockType,
  { label: string; description: string }
> = {
  hero: { label: "Hero", description: "Großer Einstieg mit Headline und CTA." },
  features: { label: "Features", description: "Vorteile oder Funktionen als Liste." },
  services: { label: "Services", description: "Leistungsblock oder Verweise auf Leistungen." },
  portfolio: { label: "Portfolio", description: "Projekt- oder Case-Study-Block." },
  testimonials: { label: "Testimonials", description: "Stimmen, Beweise oder Trust-Elemente." },
  faq: { label: "FAQ", description: "Fragen und Antworten." },
  pricing: { label: "Pricing", description: "Pakete, Preise oder Angebotslogik." },
  cta: { label: "CTA", description: "Call-to-Action mit Button." },
  stats: { label: "Stats", description: "Kennzahlen und Metriken." },
  team: { label: "Team", description: "Personen oder Rollen." },
  ai: { label: "AI", description: "KI-Assistent, Automation oder AI-Feature." },
  contact: { label: "Contact", description: "Kontaktblock oder Lead-Hinweis." },
  timeline: { label: "Timeline", description: "Ablauf, Roadmap oder Prozess." },
  markdown: { label: "Markdown", description: "Freitext mit einfacher Struktur." },
  custom_html: { label: "Custom HTML", description: "HTML in Sandbox-Vorschau." },
  react: { label: "React", description: "Reservierter React-Block für Entwickler." },
};

export const DEFAULT_SECTION_LAYOUT = {
  paddingTop: "lg",
  paddingBottom: "lg",
  marginTop: "none",
  background: "transparent",
  gradient: "",
};

export const DEFAULT_SECTION_RESPONSIVE = {
  mobile: "stack",
  tablet: "stack",
  desktop: "wide",
};

export const DEFAULT_SECTION_ANIMATION = {
  preset: "fade-up",
  intensity: "medium",
  scroll: true,
};
