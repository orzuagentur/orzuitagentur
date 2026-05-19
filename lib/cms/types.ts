export type NavLinkContent = {
  href: string;
  label: string;
  visible?: boolean;
  sortOrder?: number;
};

export type FooterSocialLink = {
  label: string;
  href: string;
  visible?: boolean;
};

export type ContactChannel = {
  key: string;
  label: string;
  href: string;
  icon: string;
  visible: boolean;
  route: "fab" | "footer" | "contact" | "all";
};

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
  mediaUrl?: string;
  mediaAlt?: string;
  animationPreset?: string;
  animationIntensity?: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: [HeroStat, HeroStat, HeroStat, HeroStat];
};

export type DesignSystemContent = {
  accent: string;
  accent2: string;
  foreground: string;
  background: string;
  typographyScale: string;
  radius: string;
  spacingPreset: string;
  sectionPadding: string;
  shadowPreset: string;
  borderPreset: string;
  glassmorphism: boolean;
  motionPreset: string;
  framerPreset: string;
  parallaxEnabled: boolean;
  tiltEnabled: boolean;
  glowEnabled: boolean;
  reducedMotion: boolean;
  scrollRevealIntensity: string;
};

export type SiteAssetsContent = {
  faviconUrl: string;
  appleIconUrl: string;
  ogFallbackImageUrl: string;
};

export type MediaPipelineContent = {
  autoWebp: boolean;
  autoAvif: boolean;
  preferredImageFormat: "original" | "webp" | "avif";
  videoUploads: boolean;
  maxUploadMb: number;
};

export type NavContent = {
  links: NavLinkContent[];
  ctaLabel: string;
  ctaHref?: string;
};

export type FooterContent = {
  tagline: string;
  ctaLabel: string;
  ctaHref?: string;
  navHeading: string;
  contactHeading: string;
  contactLead: string;
  email: string;
  locationLine: string;
  impressumLabel: string;
  privacyLabel: string;
  copyrightName: string;
  socialHeading?: string;
  socialLinks?: FooterSocialLink[];
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
  submittingTitle: string;
  submittingBody: string;
  successTitle: string;
  successBody: string;
  webhookUrl?: string;
  channels?: ContactChannel[];
};

export type SectionIntro = {
  kicker: string;
  title: string;
  subtitle: string;
};

export type ServicesSectionContent = {
  kicker: string;
  title: string;
  subtitle: string;
  subtitleRight: string;
  footnote: string;
  closing: string;
  ctaLabel: string;
  ctaHref?: string;
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
  designSystem: DesignSystemContent;
  siteAssets: SiteAssetsContent;
  mediaPipeline: MediaPipelineContent;
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
  category: string;
  description: string;
  visualClass: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  iconName?: string | null;
  tags?: string[];
  ctaLabel?: string | null;
  animationPreset?: string | null;
  enable3d?: boolean;
  videoUrl?: string | null;
  body?: string;
  technologies?: string[];
  highlights?: string[];
  projectUrl?: string | null;
};

export type PortfolioCard = {
  key: string;
  title: string;
  category: string;
  description: string;
  visualClass: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  iconName?: string | null;
  tags?: string[];
  ctaLabel?: string | null;
  animationPreset?: string | null;
  enable3d?: boolean;
  videoUrl?: string | null;
  size: "featured" | "compact";
  /** Full case-study copy for flip-card back */
  body?: string;
  technologies?: string[];
  highlights?: string[];
  /** Live project URL for the Besuchen CTA */
  projectUrl?: string | null;
};

export type PortfolioDetail = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  visualClass: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  videoUrl?: string | null;
  projectUrl?: string | null;
};

export type TestimonialCard = {
  key: string;
  quote: string;
  author: string;
  role: string;
  org: string;
};
