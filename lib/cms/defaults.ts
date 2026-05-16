import type {
  ContactContent,
  FooterContent,
  HeroContent,
  MarketingContent,
  NavContent,
  PortfolioCard,
  PortfolioSectionContent,
  ServiceCard,
  ServicesSectionContent,
  TechnologiesSectionContent,
  TestimonialCard,
  TestimonialsSectionContent,
} from "@/lib/cms/types";

export const DEFAULT_HERO: HeroContent = {
  badge: "Luxus · KI · Engineering",
  titleBefore: "Software, die ",
  titleHighlight: "Licht",
  titleAfter: " ins Dunkel bringt.",
  subtitle:
    "Wir entwickeln produktbereite Systeme, intelligente Automatisierung und Interfaces, die sich premium anfühlen — von der ersten Zeile Code bis zur Live-Umgebung.",
  primaryCta: { label: "Projekt besprechen", href: "#kontakt" },
  secondaryCta: { label: "Leistungen entdecken", href: "#leistungen" },
  stats: [
    {
      label: "Präzision",
      value: "99.9",
      valueSuffix: "%",
      hint: "Verfügbarkeit-Ziel",
    },
    {
      label: "Tempo",
      value: "unter 100",
      valueSuffix: " ms",
      hint: "API-Antwort",
    },
    {
      label: "Teams",
      value: "24",
      valueSuffix: "/7",
      hint: "Support",
    },
    {
      label: "Fokus",
      value: "Enterprise",
      hint: "& Deep Tech",
    },
  ],
};

export const DEFAULT_NAV: NavContent = {
  links: [
    { href: "#start", label: "Start" },
    { href: "#leistungen", label: "Leistungen" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#technologien", label: "Technologien" },
    { href: "#referenzen", label: "Referenzen" },
    { href: "#kontakt", label: "Kontakt" },
  ],
  ctaLabel: "Projekt anfragen",
};

export const DEFAULT_FOOTER: FooterContent = {
  tagline:
    "Luxuriöse digitale Produkte, KI-gestützte Automatisierung und Engineering auf Enterprise-Niveau — präzise, skalierbar, partnerschaftlich.",
  ctaLabel: "Projekt anfragen",
  navHeading: "Navigation",
  contactHeading: "Kontakt",
  contactLead:
    "Persönliche Beratung, klare Roadmaps und messbare Ergebnisse.",
  email: "kontakt@orzuit.de",
  locationLine: "Deutschland · remote-first",
  impressumLabel: "Impressum",
  privacyLabel: "Datenschutz",
  copyrightName: "OrzuIT",
};

export const DEFAULT_CONTACT: ContactContent = {
  kicker: "Kontakt",
  heading: "Lassen Sie uns Ihr nächstes Kapitel bauen.",
  intro:
    "Erzählen Sie uns in wenigen Sätzen von Ziel, Zeitrahmen und Stakeholdern — wir melden uns persönlich mit einem klaren nächsten Schritt.",
  asideTitle: "Direkt ins Team",
  asideText:
    "Für Projektanfragen, Budget-Rahmen und strategische Gespräche — deutschsprachig, zeitnah, verbindlich.",
  email: "kontakt@orzuit.de",
  responseTime: "Antwort innerhalb von 1–2 Werktagen",
  privacyNote:
    "Ihre Angaben werden verschlüsselt übermittelt, serverseitig validiert und in der Datenbank gespeichert (sobald Supabase konfiguriert ist). Zusätzlich können E-Mail-, SMS- und Telegram-Benachrichtigungen aktiv sein.",
  successTitle: "Vielen Dank — Ihre Anfrage ist eingegangen.",
  successBody:
    "Wir melden uns zeitnah bei Ihnen. Bei Rückfragen erreichen Sie uns weiterhin unter ",
};

export const DEFAULT_SERVICES_SECTION: ServicesSectionContent = {
  kicker: "Leistungen",
  title: "Alles, was digitale Spitzenprodukte brauchen.",
  subtitle:
    "Ein zusammenhängendes Team, ein durchgängiger Standard — damit Ästhetik, Performance und Robustheit zusammenkommen.",
  closing:
    "Sie haben eine spezielle Roadmap? Wir integrieren uns in Ihr Team — als Embedded Unit oder als Accelerator.",
  ctaLabel: "Erstgespräch vereinbaren",
};

export const DEFAULT_PORTFOLIO_SECTION: PortfolioSectionContent = {
  kicker: "Portfolio",
  title: "Ausgewählte Cases mit Charakter.",
  subtitleRight:
    "Jedes Projekt wird als langfristige Partnerschaft geführt — Design, Engineering und Betrieb aus einer Hand.",
  footnote:
    "Weitere Referenzen und Detail-Storys auf Anfrage — NDA-sicher nach Bedarf.",
};

export const DEFAULT_TESTIMONIALS_SECTION: TestimonialsSectionContent = {
  kicker: "Referenzen",
  title: "Stimmen aus Projekten, die wir gemeinsam skalieren.",
  subtitle:
    "Echte Partnerschaften, klare Kommunikation und messbare Resultate — so arbeiten wir mit Teams, die mehr erwarten als „nur eine Website“.",
  footnote:
    "Weitere Referenzen und detaillierte Case-Storys stellen wir im persönlichen Gespräch zur Verfügung.",
};

export const DEFAULT_TECHNOLOGIES_SECTION: TechnologiesSectionContent = {
  kicker: "Technologien",
  title: "Ein Stack, der mitwächst — ohne Kompromisse bei Qualität.",
  subtitle:
    "Wir setzen auf bewährte Plattformen, strikte Typisierung und Automatisierung überall dort, wo Menschen sich wiederholen würden.",
  stacks: [
    {
      title: "Produkt & Interface",
      description:
        "Moderne Web-Apps mit klarem Component-Modell, Design Tokens und Performance-Budgets ab Tag eins.",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Cloud & Daten",
      description:
        "Robuste Deployments, typsichere APIs und observability — von der Edge bis in die Datenbank.",
      items: ["Vercel", "Supabase", "PostgreSQL", "Edge Functions"],
    },
    {
      title: "KI & Automatisierung",
      description:
        "Assistenten, Retrieval-Pipelines und Integrationen, die sich kontrolliert in Ihre Landschaft einfügen.",
      items: ["OpenAI API", "Python", "Server Actions", "Telegram API"],
    },
  ],
  marqueeKicker: "Im Einsatz · kontinuierlich erweitert",
  marqueeItems: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Vercel",
    "Supabase",
    "PostgreSQL",
    "Redis",
    "OpenAI",
    "Edge",
    "Docker",
    "GitHub Actions",
  ],
};

export const DEFAULT_MARKETING: MarketingContent = {
  hero: DEFAULT_HERO,
  nav: DEFAULT_NAV,
  footer: DEFAULT_FOOTER,
  contact: DEFAULT_CONTACT,
  servicesSection: DEFAULT_SERVICES_SECTION,
  portfolioSection: DEFAULT_PORTFOLIO_SECTION,
  testimonialsSection: DEFAULT_TESTIMONIALS_SECTION,
  technologiesSection: DEFAULT_TECHNOLOGIES_SECTION,
};

export const DEFAULT_SERVICES_CARDS: ServiceCard[] = [
  {
    key: "s1",
    label: "01",
    title: "Produkt & Plattform",
    description:
      "Skalierbare Webanwendungen, APIs und Cloud-Architekturen — von der ersten Architektur bis zum Go-live.",
  },
  {
    key: "s2",
    label: "02",
    title: "KI & Automatisierung",
    description:
      "Intelligente Workflows, Daten-Pipelines und Assistenten, die sich nahtlos in Ihre Systeme einfügen.",
  },
  {
    key: "s3",
    label: "03",
    title: "Design & Experience",
    description:
      "Premium Interfaces, Design Systems und Motion — konsistent, barrierebewusst, markenstark.",
  },
  {
    key: "s4",
    label: "04",
    title: "Betrieb & Sicherheit",
    description:
      "CI/CD, Observability und harte Sicherheitsstandards, damit Ihr Produkt zuverlässig bleibt.",
  },
];

export const DEFAULT_PORTFOLIO_CARDS: PortfolioCard[] = [
  {
    key: "finsight",
    title: "FinSight Nexus",
    category: "Finanz · Echtzeit",
    description:
      "Rollensichere Steuerzentrale mit Live-Marktdaten, Compliance-Trails und KI-gestützten Anomalie-Hinweisen.",
    visualClass: "portfolio-visual-finsight",
    size: "featured",
  },
  {
    key: "velo",
    title: "VeloCarbon Ops",
    category: "Nachhaltigkeit · IoT",
    description:
      "Digital Twin für Emissionsketten — Sensordaten harmonisieren, KPIs vergleichen, Audit Trails exportieren.",
    visualClass: "portfolio-visual-velo",
    size: "compact",
  },
  {
    key: "aura",
    title: "Aura Commerce",
    category: "E-Commerce · Experience",
    description:
      "Headless Storefront mit millisekundenschnellen Seiten, Edge-Personalisierung und Storytelling.",
    visualClass: "portfolio-visual-aura",
    size: "compact",
  },
];

export const DEFAULT_TESTIMONIALS_CARDS: TestimonialCard[] = [
  {
    key: "t1",
    quote:
      "Die Liefergeschwindigkeit war ungewöhnlich — aber nie auf Kosten von Stabilität. Wir haben endlich einen Stack, der mit unserer Regulatorik mithält.",
    author: "Elena Vogt",
    role: "CTO",
    org: "Nordlicht Capital",
  },
  {
    key: "t2",
    quote:
      "Vom ersten Wireframe bis zum Livegang: ein durchgängiges Niveau, das sich wie eine Marke anfühlt — nicht wie ein Flickenteppich aus Agenturen.",
    author: "Jonas Malik",
    role: "Head of Product",
    org: "VeloCarbon GmbH",
  },
  {
    key: "t3",
    quote:
      "Integrationen, Monitoring, Incident-Playbooks — alles dokumentiert und wartbar. Genau das, was Operations braucht, wenn Umsatz auf dem Spiel steht.",
    author: "Priya N.",
    role: "Director Operations",
    org: "Aura Commerce",
  },
];

export const DEFAULT_HOME_SEO = {
  title: "OrzuIT — Premium IT & KI-Lösungen",
  description:
    "Luxuriöse digitale Erlebnisse, zukunftsweisende Software und KI — OrzuIT entwickelt Ihre Vision mit Präzision und Klarheit.",
  ogImageUrl: null as string | null,
};
