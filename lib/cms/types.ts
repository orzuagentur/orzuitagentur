export type HeroStat = {
  label: string;
  value: string;
  hint: string;
  /** Optional kleiner Nachsatz (z. B. „%“, „ ms“) — visuell gedimmt. */
  valueSuffix?: string;
};

export type HeroContent = {
  badge: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: [HeroStat, HeroStat, HeroStat, HeroStat];
};

export type NavContent = {
  links: { href: string; label: string }[];
  ctaLabel: string;
};

export type FooterContent = {
  tagline: string;
  ctaLabel: string;
  navHeading: string;
  contactHeading: string;
  contactLead: string;
  email: string;
  locationLine: string;
  impressumLabel: string;
  privacyLabel: string;
  copyrightName: string;
};

export type ContactContent = {
  kicker: string;
  heading: string;
  intro: string;
  asideTitle: string;
  asideText: string;
  email: string;
  responseTime: string;
  privacyNote: string;
  successTitle: string;
  successBody: string;
};

export type SectionIntro = {
  kicker: string;
  title: string;
  subtitle: string;
};

export type ServicesSectionContent = SectionIntro & {
  closing: string;
  ctaLabel: string;
};

export type PortfolioSectionContent = {
  kicker: string;
  title: string;
  subtitleRight: string;
  footnote: string;
};

export type TestimonialsSectionContent = SectionIntro & {
  footnote: string;
};

export type TechStackCol = {
  title: string;
  description: string;
  items: string[];
};

export type TechnologiesSectionContent = {
  kicker: string;
  title: string;
  subtitle: string;
  stacks: [TechStackCol, TechStackCol, TechStackCol];
  marqueeKicker: string;
  marqueeItems: string[];
};

export type MarketingContent = {
  hero: HeroContent;
  nav: NavContent;
  footer: FooterContent;
  contact: ContactContent;
  servicesSection: ServicesSectionContent;
  portfolioSection: PortfolioSectionContent;
  testimonialsSection: TestimonialsSectionContent;
  technologiesSection: TechnologiesSectionContent;
};

export type HomeSeo = {
  title: string;
  description: string;
  ogImageUrl: string | null;
};

export type ServiceCard = {
  key: string;
  label: string;
  title: string;
  description: string;
};

export type PortfolioCard = {
  key: string;
  title: string;
  category: string;
  description: string;
  visualClass: string;
  size: "featured" | "compact";
};

export type TestimonialCard = {
  key: string;
  quote: string;
  author: string;
  role: string;
  org: string;
};
