import { z } from "zod";

const heroStatSchema = z.object({
  label: z.string().max(120),
  value: z.string().max(120),
  hint: z.string().max(200),
  valueSuffix: z.string().max(32).optional(),
});

const heroSchema = z.object({
  badge: z.string().max(200),
  titleBefore: z.string().max(200),
  titleHighlight: z.string().max(120),
  titleAfter: z.string().max(200),
  subtitle: z.string().max(2000),
  mediaUrl: z.string().max(1000).optional(),
  mediaAlt: z.string().max(300).optional(),
  animationPreset: z.string().max(80).optional(),
  animationIntensity: z.string().max(40).optional(),
  primaryCta: z.object({
    label: z.string().max(120),
    href: z.string().max(200),
  }),
  secondaryCta: z.object({
    label: z.string().max(120),
    href: z.string().max(200),
  }),
  stats: z.tuple([
    heroStatSchema,
    heroStatSchema,
    heroStatSchema,
    heroStatSchema,
  ]),
});

const navSchema = z.object({
  links: z
    .array(
      z.object({
        href: z.string().max(200),
        label: z.string().max(120),
        visible: z.boolean().optional(),
        sortOrder: z.number().int().min(-9999).max(9999).optional(),
      }),
    )
    .min(1)
    .max(20),
  ctaLabel: z.string().max(120),
  ctaHref: z.string().max(200).optional(),
});

const footerSocialLinkSchema = z.object({
  label: z.string().max(120),
  href: z.string().max(300),
  visible: z.boolean().optional(),
});

const footerSchema = z.object({
  tagline: z.string().max(1200),
  ctaLabel: z.string().max(120),
  ctaHref: z.string().max(200).optional(),
  navHeading: z.string().max(80),
  contactHeading: z.string().max(80),
  contactLead: z.string().max(600),
  email: z.string().max(200),
  locationLine: z.string().max(200),
  impressumLabel: z.string().max(80),
  privacyLabel: z.string().max(80),
  copyrightName: z.string().max(120),
  socialHeading: z.string().max(80).optional(),
  socialLinks: z.array(footerSocialLinkSchema).max(8).optional(),
});

const contactSchema = z.object({
  kicker: z.string().max(120),
  heading: z.string().max(400),
  intro: z.string().max(2000),
  asideTitle: z.string().max(200),
  asideText: z.string().max(2000),
  email: z.string().max(200),
  responseTime: z.string().max(200),
  privacyNote: z.string().max(2000),
  submittingTitle: z.string().max(400),
  submittingBody: z.string().max(2000),
  successTitle: z.string().max(400),
  successBody: z.string().max(2000),
  webhookUrl: z.string().max(1000).optional(),
  channels: z
    .array(
      z.object({
        key: z.string().max(80),
        label: z.string().max(120),
        href: z.string().max(1000),
        icon: z.string().max(80),
        visible: z.boolean(),
        route: z.enum(["fab", "footer", "contact", "all"]),
      }),
    )
    .max(20)
    .optional(),
});

const sectionIntroSchema = z.object({
  kicker: z.string().max(120),
  title: z.string().max(400),
  subtitle: z.string().max(2000),
});

const servicesSectionSchema = sectionIntroSchema.extend({
  subtitleRight: z.string().max(2000),
  footnote: z.string().max(2000),
  closing: z.string().max(2000),
  ctaLabel: z.string().max(120),
  ctaHref: z.string().max(200).optional(),
});

const portfolioSectionSchema = z.object({
  kicker: z.string().max(120),
  title: z.string().max(400),
  subtitleRight: z.string().max(2000),
  footnote: z.string().max(2000),
});

const testimonialsSectionSchema = sectionIntroSchema.extend({
  footnote: z.string().max(2000),
});

const techStackColSchema = z.object({
  title: z.string().max(200),
  description: z.string().max(2000),
  items: z.array(z.string().max(80)).min(1).max(40),
});

const technologiesSectionSchema = z.object({
  kicker: z.string().max(120),
  title: z.string().max(400),
  subtitle: z.string().max(2000),
  stacks: z.tuple([
    techStackColSchema,
    techStackColSchema,
    techStackColSchema,
  ]),
  marqueeKicker: z.string().max(200),
  marqueeItems: z.array(z.string().max(80)).min(1).max(80),
});

const designSystemSchema = z.object({
  accent: z.string().max(40),
  accent2: z.string().max(40),
  foreground: z.string().max(40),
  background: z.string().max(40),
  typographyScale: z.string().max(40),
  radius: z.string().max(40),
  spacingPreset: z.string().max(40),
  sectionPadding: z.string().max(40),
  shadowPreset: z.string().max(40),
  borderPreset: z.string().max(40),
  glassmorphism: z.boolean(),
  motionPreset: z.string().max(40),
  framerPreset: z.string().max(40),
  parallaxEnabled: z.boolean(),
  tiltEnabled: z.boolean(),
  glowEnabled: z.boolean(),
  reducedMotion: z.boolean(),
  scrollRevealIntensity: z.string().max(40),
});

const siteAssetsSchema = z.object({
  faviconUrl: z.string().max(1000),
  appleIconUrl: z.string().max(1000),
  ogFallbackImageUrl: z.string().max(1000),
});

const mediaPipelineSchema = z.object({
  autoWebp: z.boolean(),
  autoAvif: z.boolean(),
  preferredImageFormat: z.enum(["original", "webp", "avif"]),
  videoUploads: z.boolean(),
  maxUploadMb: z.number().int().min(1).max(100),
});

export const marketingContentSchema = z.object({
  hero: heroSchema,
  nav: navSchema,
  footer: footerSchema,
  contact: contactSchema,
  servicesSection: servicesSectionSchema,
  portfolioSection: portfolioSectionSchema,
  testimonialsSection: testimonialsSectionSchema,
  technologiesSection: technologiesSectionSchema,
  designSystem: designSystemSchema,
  siteAssets: siteAssetsSchema,
  mediaPipeline: mediaPipelineSchema,
});

export const homeSeoSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(320),
  ogImageUrl: z.string().max(2000).nullable(),
});
