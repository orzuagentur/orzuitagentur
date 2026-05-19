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
  badge: "Software · KI · Web",
  titleBefore: "",
  titleHighlight: "Individuelle Software",
  titleAfter:
    ", KI-Automatisierung und moderne Weblösungen für wachsende Unternehmen.",
  subtitle:
    "Wir planen, entwickeln und betreiben digitale Lösungen, die Prozesse vereinfachen und messbar Zeit oder Kosten sparen — von der ersten Idee bis zum stabilen Betrieb.",
  primaryCta: { label: "Projekt besprechen", href: "#kontakt" },
  secondaryCta: { label: "Leistungen ansehen", href: "#leistungen" },
  stats: [
    {
      label: "Umsetzung",
      value: "agil",
      hint: "in klaren Etappen",
    },
    {
      label: "Rückmeldung",
      value: "1–2",
      valueSuffix: " Tage",
      hint: "auf Anfragen",
    },
    {
      label: "Stack",
      value: "Next.js",
      hint: "& Cloud-nativ",
    },
    {
      label: "Sprache",
      value: "DE",
      hint: "EN auf Anfrage",
    },
  ],
};

export const DEFAULT_NAV: NavContent = {
  links: [
    { href: "#start", label: "Start" },
    { href: "#leistungen", label: "Leistungen" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#technologien", label: "Technologien" },
    { href: "#warum-orzuit", label: "Warum OrzuIT" },
    { href: "#kontakt", label: "Kontakt" },
  ],
  ctaLabel: "Projekt anfragen",
};

export const DEFAULT_FOOTER: FooterContent = {
  tagline:
    "Individuelle Software, KI-Automatisierung und moderne Weblösungen — verständlich geplant, sauber umgesetzt, zuverlässig betrieben.",
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
  heading: "Sprechen wir über Ihr Projekt.",
  intro:
    "Beschreiben Sie kurz Ziel, Zeitrahmen und aktuelle Situation — wir melden uns mit einem konkreten Vorschlag für das weitere Vorgehen.",
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
  title: "Was wir für Ihr Unternehmen umsetzen.",
  subtitle:
    "Klare Leistungen, verständliche Ergebnisse — für Teams, die digitale Prozesse verbessern wollen.",
  subtitleRight:
    "Wählen Sie eine Leistung — Details auf der Rückseite der Karte, Hauptfokus links.",
  footnote:
    "Klicken Sie die gestapelten Karten rechts oder nutzen Sie die Navigation — die aktive Leistung steht links.",
  closing:
    "Sie haben bereits ein Team oder Partner? Wir ergänzen gezielt — z. B. für Architektur, Umsetzung oder Betrieb.",
  ctaLabel: "Erstgespräch vereinbaren",
};

export const DEFAULT_PORTFOLIO_SECTION: PortfolioSectionContent = {
  kicker: "Portfolio",
  title: "Beispielhafte Projektideen.",
  subtitleRight:
    "Typische Szenarien, die wir umsetzen — als Orientierung, nicht als Liste echter Kundenreferenzen.",
  footnote:
    "Konkrete Referenzen und Details teilen wir im persönlichen Gespräch, sofern vorhanden und freigegeben.",
};

export const DEFAULT_TESTIMONIALS_SECTION: TestimonialsSectionContent = {
  kicker: "Arbeitsweise",
  title: "Warum Unternehmen mit OrzuIT arbeiten.",
  subtitle:
    "Keine erfundenen Kundenstimmen — stattdessen transparent, wie wir Projekte angehen und was Sie davon haben.",
  footnote:
    "Passt das zu Ihrem Vorhaben? Im Erstgespräch klären wir Scope, Budget-Rahmen und den sinnvollsten nächsten Schritt.",
};

export const DEFAULT_TECHNOLOGIES_SECTION: TechnologiesSectionContent = {
  kicker: "Technologien",
  title: "Technik, die zu Ihrem Projekt passt.",
  subtitle:
    "Bewährte Tools statt Hype: wartbarer Code, sichere Deployments und Automatisierung dort, wo sie Zeit spart.",
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
    title: "Individuelle Software",
    category: "Software • Prozesse",
    description:
      "Web-Apps und interne Tools für wachsende Unternehmen — z. B. Kundenportale, Verwaltung oder Prozessunterstützung. Ergebnis: weniger manuelle Arbeit, klarere Abläufe.",
    visualClass: "portfolio-visual-finsight",
  },
  {
    key: "s2",
    label: "02",
    title: "KI & Automatisierung",
    category: "KI • Workflows",
    description:
      "Assistenten, Dokumentenverarbeitung und Schnittstellen, die repetitive Aufgaben übernehmen. Für Teams mit viel Routine in Support, Backoffice oder Datenpflege.",
    visualClass: "portfolio-visual-velo",
  },
  {
    key: "s3",
    label: "03",
    title: "Websites & Webshops",
    category: "Web • Commerce",
    description:
      "Moderne, schnelle Websites und Shops, die Sie selbst pflegen können. Fokus: verständliche Struktur, gute Performance und saubere Anbindung an CRM oder Buchhaltung.",
    visualClass: "portfolio-visual-aura",
  },
  {
    key: "s4",
    label: "04",
    title: "Betrieb & Sicherheit",
    category: "Betrieb • DevOps",
    description:
      "Hosting, Updates, Backups und Monitoring — damit Ihre Lösung im Alltag stabil läuft. Inklusive klarer Zuständigkeiten und dokumentierter Übergabe.",
    visualClass: "portfolio-visual-nexus",
  },
  {
    key: "s5",
    label: "05",
    title: "Schnittstellen & Integration",
    category: "Integration • APIs",
    description:
      "APIs, ERP-Anbindungen und Datenflüsse zwischen bestehenden Systemen — stabil, dokumentiert und wartbar.",
    visualClass: "portfolio-visual-vault",
  },
];

export const DEFAULT_PORTFOLIO_CARDS: PortfolioCard[] = [
  {
    key: "finsight",
    title: "FinSight Nexus",
    category: "Finanz • Echtzeit",
    description:
      "Rollensichere Steuerzentrale mit Live-Marktdaten, Compliance-Trails und KI-gestützten Anomalie-Hinweisen.",
    visualClass: "portfolio-visual-finsight",
    size: "featured",
  },
  {
    key: "velo",
    title: "VeloCarbon Ops",
    category: "Nachhaltigkeit • IoT",
    description:
      "Digital Twin für Emissionsketten – Sensordaten harmonisieren, KPIs vergleichen, Audit Trails exportieren.",
    visualClass: "portfolio-visual-velo",
    size: "compact",
  },
  {
    key: "aura",
    title: "Aura Commerce",
    category: "Retail • Plattform",
    description:
      "Headless Commerce mit personalisierten Journeys, Inventory-Sync und Performance-Budget ab Tag eins.",
    visualClass: "portfolio-visual-aura",
    size: "compact",
  },
  {
    key: "nexus",
    title: "Nexus Health",
    category: "Gesundheit • KI",
    description:
      "Patientenpfade, Terminlogik und KI-Triage in einer DSGVO-konformen Plattform für Kliniknetzwerke.",
    visualClass: "portfolio-visual-nexus",
    size: "compact",
  },
  {
    key: "vault",
    title: "Vault Ledger",
    category: "Compliance • Security",
    description:
      "Revisionssichere Audit Trails, Rollenmodelle und Echtzeit-Alerts für regulierte Finanzprozesse.",
    visualClass: "portfolio-visual-vault",
    size: "compact",
  },
  {
    key: "pulse",
    title: "Pulse Retail",
    category: "E-Commerce • Analytics",
    description:
      "Conversion-Dashboards, Lager-Signale und Kampagnen-Automation in einer Headless-Storefront.",
    visualClass: "portfolio-visual-pulse",
    size: "compact",
  },
];

/** Value cards for „Warum OrzuIT“ (author = heading, quote = body). */
export const DEFAULT_WHY_CARDS: TestimonialCard[] = [
  {
    key: "why-1",
    author: "Verständlich statt Fachchinesisch",
    quote:
      "Wir erklären Optionen, Aufwand und Risiken in normaler Sprache — damit Sie fundiert entscheiden können, ohne ein eigenes IT-Team zu brauchen.",
    role: "",
    org: "",
  },
  {
    key: "why-2",
    author: "Ein Ansprechpartner, ein Plan",
    quote:
      "Vom Kick-off über Umsetzung bis Übergabe: klare Meilensteine, feste Ansprechpartner und nachvollziehbare Prioritäten statt endloser Abstimmungsrunden.",
    role: "",
    org: "",
  },
  {
    key: "why-3",
    author: "Lösungen, die im Alltag funktionieren",
    quote:
      "Sauberer Code, Dokumentation und Betrieb — damit Ihre Software nicht nur beim Launch gut wirkt, sondern Monate später noch wartbar bleibt.",
    role: "",
    org: "",
  },
];

export const DEFAULT_TESTIMONIALS_CARDS = DEFAULT_WHY_CARDS;

export const DEFAULT_HOME_SEO = {
  title: "OrzuIT — Software, KI & Web für wachsende Unternehmen",
  description:
    "Individuelle Software, KI-Automatisierung und moderne Weblösungen: OrzuIT plant, entwickelt und betreibt digitale Produkte mit klarem Nutzen für Ihr Team.",
  ogImageUrl: null as string | null,
};
