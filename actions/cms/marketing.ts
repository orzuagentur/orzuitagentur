"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import { CONTENT_SECTION_PATHS } from "@/lib/dashboard/content-sections";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import { normalizeNavHref } from "@/lib/navigation/section-scroll";
import { loadMarketingForAdmin, persistMarketing } from "@/lib/cms/persist";
import { hasServiceRoleConfig } from "@/lib/supabase/service";
import { marketingContentSchema } from "@/lib/cms/schema";
import type { ContactChannel, HeroStat } from "@/lib/cms/types";

function str(fd: FormData, key: string, max: number) {
  const v = fd.get(key);
  if (typeof v !== "string") return "";
  return v.slice(0, max).trim();
}

function optionalSuffix(fd: FormData, key: string) {
  const s = str(fd, key, 32);
  return s === "" ? undefined : s;
}

function splitList(raw: string, maxItems: number) {
  return raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

function readChecked(fd: FormData, key: string) {
  const raw = fd.get(key);
  return raw === "true" || raw === "on";
}

function readOrder(fd: FormData, key: string, fallback: number) {
  const raw = str(fd, key, 12);
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) ? value : fallback;
}

function readContactChannels(fd: FormData) {
  const keys = ["telegram", "whatsapp", "instagram", "linkedin", "email", "calendly"];
  return keys.map((key): ContactChannel => {
    const routeRaw = str(fd, `channel_${key}_route`, 20);
    const route: ContactChannel["route"] =
      routeRaw === "fab"
        ? "fab"
        : routeRaw === "footer"
          ? "footer"
          : routeRaw === "all"
            ? "all"
            : "contact";

    return {
      key,
      label: str(fd, `channel_${key}_label`, 120) || key,
      href: str(fd, `channel_${key}_href`, 1000),
      icon: str(fd, `channel_${key}_icon`, 80) || key,
      visible: readChecked(fd, `channel_${key}_visible`),
      route,
    };
  });
}

async function guard() {
  await requireDashboardUser();
  if (!hasServiceRoleConfig()) {
    throw new Error("SERVICE_ROLE");
  }
}

function logCmsError(context: string, e: unknown) {
  if (e instanceof DashboardAuthError) {
    console.warn(`[cms:${context}]`, e.message);
    return;
  }
  console.error(`[cms:${context}]`, e);
}

function revalidateMarketingPages() {
  revalidatePath("/");
  for (const path of CONTENT_SECTION_PATHS) {
    revalidatePath(path);
  }
  revalidatePath("/dashboard/content/hero");
  revalidatePath("/dashboard/content/sections");
  revalidatePath("/dashboard/content/nav-footer");
  revalidatePath("/dashboard/content/contact");
  revalidatePath("/dashboard/content/technologies");
}

export async function saveHeroContent(formData: FormData): Promise<void> {
  try {
    await guard();
    const m = await loadMarketingForAdmin();
    const stats: [HeroStat, HeroStat, HeroStat, HeroStat] = [
      {
        label: str(formData, "stat0_label", 120),
        value: str(formData, "stat0_value", 120),
        valueSuffix: optionalSuffix(formData, "stat0_suffix"),
        hint: str(formData, "stat0_hint", 200),
      },
      {
        label: str(formData, "stat1_label", 120),
        value: str(formData, "stat1_value", 120),
        valueSuffix: optionalSuffix(formData, "stat1_suffix"),
        hint: str(formData, "stat1_hint", 200),
      },
      {
        label: str(formData, "stat2_label", 120),
        value: str(formData, "stat2_value", 120),
        valueSuffix: optionalSuffix(formData, "stat2_suffix"),
        hint: str(formData, "stat2_hint", 200),
      },
      {
        label: str(formData, "stat3_label", 120),
        value: str(formData, "stat3_value", 120),
        valueSuffix: optionalSuffix(formData, "stat3_suffix"),
        hint: str(formData, "stat3_hint", 200),
      },
    ];

    const next = {
      ...m,
      hero: {
        ...m.hero,
        badge: str(formData, "badge", 200),
        titleBefore: str(formData, "titleBefore", 200),
        titleHighlight: str(formData, "titleHighlight", 120),
        titleAfter: str(formData, "titleAfter", 200),
        subtitle: str(formData, "subtitle", 2000),
        mediaUrl: str(formData, "hero_mediaUrl", 1000),
        mediaAlt: str(formData, "hero_mediaAlt", 300),
        animationPreset: str(formData, "hero_animationPreset", 80),
        animationIntensity: str(formData, "hero_animationIntensity", 40),
        primaryCta: {
          label: str(formData, "primaryCta_label", 120),
          href: str(formData, "primaryCta_href", 200),
        },
        secondaryCta: {
          label: str(formData, "secondaryCta_label", 120),
          href: str(formData, "secondaryCta_href", 200),
        },
        stats,
      },
    };
    marketingContentSchema.parse(next);
    await persistMarketing(next);
    revalidateMarketingPages();
    redirectWithToast("/dashboard/content/start", "hero_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveHeroContent", e);
  }
}

export async function saveNavAndFooter(formData: FormData): Promise<void> {
  try {
    await guard();
    const m = await loadMarketingForAdmin();
    const links = m.nav.links
      .map((link, i) => ({
        href: normalizeNavHref(str(formData, `nav_href_${i}`, 200) || link.href),
        label: str(formData, `nav_label_${i}`, 120) || link.label,
        visible: readChecked(formData, `nav_visible_${i}`),
        sortOrder: readOrder(formData, `nav_sort_${i}`, i + 1),
      }))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const socialLinks = (m.footer.socialLinks ?? [])
      .map((link, i) => ({
        label: str(formData, `footer_social_label_${i}`, 120) || link.label,
        href: str(formData, `footer_social_href_${i}`, 300),
        visible: readChecked(formData, `footer_social_visible_${i}`),
      }))
      .filter((link) => link.label || link.href);
    const preferredImageFormatRaw = str(formData, "media_preferredImageFormat", 20);
    const preferredImageFormat: "original" | "webp" | "avif" =
      preferredImageFormatRaw === "avif"
        ? "avif"
        : preferredImageFormatRaw === "original"
          ? "original"
          : "webp";
    const next = {
      ...m,
      nav: {
        links,
        ctaLabel: str(formData, "nav_ctaLabel", 120),
        ctaHref: normalizeNavHref(str(formData, "nav_ctaHref", 200) || "#kontakt"),
      },
      footer: {
        ...m.footer,
        tagline: str(formData, "footer_tagline", 1200),
        ctaLabel: str(formData, "footer_ctaLabel", 120),
        ctaHref: normalizeNavHref(str(formData, "footer_ctaHref", 200) || "#kontakt"),
        navHeading: str(formData, "footer_navHeading", 80),
        contactHeading: str(formData, "footer_contactHeading", 80),
        contactLead: str(formData, "footer_contactLead", 600),
        email: str(formData, "footer_email", 200),
        locationLine: str(formData, "footer_locationLine", 200),
        impressumLabel: str(formData, "footer_impressumLabel", 80),
        privacyLabel: str(formData, "footer_privacyLabel", 80),
        copyrightName: str(formData, "footer_copyrightName", 120),
        socialHeading: str(formData, "footer_socialHeading", 80),
        socialLinks,
      },
      designSystem: {
        accent: str(formData, "design_accent", 40) || m.designSystem.accent,
        accent2: str(formData, "design_accent2", 40) || m.designSystem.accent2,
        foreground:
          str(formData, "design_foreground", 40) || m.designSystem.foreground,
        background:
          str(formData, "design_background", 40) || m.designSystem.background,
        typographyScale:
          str(formData, "design_typographyScale", 40) ||
          m.designSystem.typographyScale,
        radius: str(formData, "design_radius", 40) || m.designSystem.radius,
        spacingPreset:
          str(formData, "design_spacingPreset", 40) ||
          m.designSystem.spacingPreset,
        sectionPadding:
          str(formData, "design_sectionPadding", 40) ||
          m.designSystem.sectionPadding,
        shadowPreset:
          str(formData, "design_shadowPreset", 40) ||
          m.designSystem.shadowPreset ||
          "soft",
        borderPreset:
          str(formData, "design_borderPreset", 40) ||
          m.designSystem.borderPreset ||
          "subtle",
        glassmorphism: readChecked(formData, "design_glassmorphism"),
        motionPreset:
          str(formData, "design_motionPreset", 40) ||
          m.designSystem.motionPreset ||
          "cinematic",
        framerPreset:
          str(formData, "design_framerPreset", 40) ||
          m.designSystem.framerPreset ||
          "smooth",
        parallaxEnabled: readChecked(formData, "design_parallaxEnabled"),
        tiltEnabled: readChecked(formData, "design_tiltEnabled"),
        glowEnabled: readChecked(formData, "design_glowEnabled"),
        reducedMotion: readChecked(formData, "design_reducedMotion"),
        scrollRevealIntensity:
          str(formData, "design_scrollRevealIntensity", 40) ||
          m.designSystem.scrollRevealIntensity ||
          "medium",
      },
      siteAssets: {
        faviconUrl: str(formData, "assets_faviconUrl", 1000),
        appleIconUrl: str(formData, "assets_appleIconUrl", 1000),
        ogFallbackImageUrl: str(formData, "assets_ogFallbackImageUrl", 1000),
      },
      mediaPipeline: {
        autoWebp: readChecked(formData, "media_autoWebp"),
        autoAvif: readChecked(formData, "media_autoAvif"),
        preferredImageFormat,
        videoUploads: readChecked(formData, "media_videoUploads"),
        maxUploadMb: readOrder(formData, "media_maxUploadMb", 25),
      },
    };
    marketingContentSchema.parse(next);
    await persistMarketing(next);
    revalidateMarketingPages();
    redirectWithToast("/dashboard/content/menu", "nav_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveNavAndFooter", e);
  }
}

export async function saveDesignSystem(formData: FormData): Promise<void> {
  try {
    await guard();
    const m = await loadMarketingForAdmin();
    const next = {
      ...m,
      designSystem: {
        accent: str(formData, "design_accent", 40) || m.designSystem.accent,
        accent2: str(formData, "design_accent2", 40) || m.designSystem.accent2,
        foreground:
          str(formData, "design_foreground", 40) || m.designSystem.foreground,
        background:
          str(formData, "design_background", 40) || m.designSystem.background,
        typographyScale:
          str(formData, "design_typographyScale", 40) ||
          m.designSystem.typographyScale,
        radius: str(formData, "design_radius", 40) || m.designSystem.radius,
        spacingPreset:
          str(formData, "design_spacingPreset", 40) ||
          m.designSystem.spacingPreset,
        sectionPadding:
          str(formData, "design_sectionPadding", 40) ||
          m.designSystem.sectionPadding,
        shadowPreset:
          str(formData, "design_shadowPreset", 40) ||
          m.designSystem.shadowPreset ||
          "soft",
        borderPreset:
          str(formData, "design_borderPreset", 40) ||
          m.designSystem.borderPreset ||
          "subtle",
        glassmorphism: readChecked(formData, "design_glassmorphism"),
        motionPreset:
          str(formData, "design_motionPreset", 40) ||
          m.designSystem.motionPreset ||
          "cinematic",
        framerPreset:
          str(formData, "design_framerPreset", 40) ||
          m.designSystem.framerPreset ||
          "smooth",
        parallaxEnabled: readChecked(formData, "design_parallaxEnabled"),
        tiltEnabled: readChecked(formData, "design_tiltEnabled"),
        glowEnabled: readChecked(formData, "design_glowEnabled"),
        reducedMotion: readChecked(formData, "design_reducedMotion"),
        scrollRevealIntensity:
          str(formData, "design_scrollRevealIntensity", 40) ||
          m.designSystem.scrollRevealIntensity ||
          "medium",
      },
    };
    marketingContentSchema.parse(next);
    await persistMarketing(next);
    revalidateMarketingPages();
    revalidatePath("/dashboard/settings/design");
    redirectWithToast("/dashboard/settings/design", "design_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveDesignSystem", e);
  }
}

export async function saveContactBlock(formData: FormData): Promise<void> {
  try {
    await guard();
    const m = await loadMarketingForAdmin();
    const next = {
      ...m,
      contact: {
        kicker: str(formData, "contact_kicker", 120),
        heading: str(formData, "contact_heading", 400),
        intro: str(formData, "contact_intro", 2000),
        asideTitle: str(formData, "contact_asideTitle", 200),
        asideText: str(formData, "contact_asideText", 2000),
        email: str(formData, "contact_email", 200),
        responseTime: str(formData, "contact_responseTime", 200),
        privacyNote: str(formData, "contact_privacyNote", 2000),
        submittingTitle: str(formData, "contact_submittingTitle", 400),
        submittingBody: str(formData, "contact_submittingBody", 2000),
        successTitle: str(formData, "contact_successTitle", 400),
        successBody: str(formData, "contact_successBody", 2000),
        webhookUrl: str(formData, "contact_webhookUrl", 1000),
        channels: readContactChannels(formData),
      },
    };
    marketingContentSchema.parse(next);
    await persistMarketing(next);
    revalidateMarketingPages();
    redirectWithToast("/dashboard/content/kontakt", "contact_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveContactBlock", e);
  }
}

export async function saveServicesIntro(formData: FormData): Promise<void> {
  try {
    await guard();
    const m = await loadMarketingForAdmin();
    const next = {
      ...m,
      servicesSection: {
        kicker: str(formData, "svc_kicker", 120),
        title: str(formData, "svc_title", 400),
        subtitle: str(formData, "svc_subtitle", 2000),
        subtitleRight: str(formData, "svc_subtitleRight", 2000),
        footnote: str(formData, "svc_footnote", 2000),
        closing: str(formData, "svc_closing", 2000),
        ctaLabel: str(formData, "svc_ctaLabel", 120),
        ctaHref: normalizeNavHref(str(formData, "svc_ctaHref", 200) || "#kontakt"),
      },
    };
    marketingContentSchema.parse(next);
    await persistMarketing(next);
    revalidateMarketingPages();
    redirectWithToast("/dashboard/content/leistungen", "leistungen_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveServicesIntro", e);
  }
}

export async function savePortfolioIntro(formData: FormData): Promise<void> {
  try {
    await guard();
    const m = await loadMarketingForAdmin();
    const next = {
      ...m,
      portfolioSection: {
        kicker: str(formData, "port_kicker", 120),
        title: str(formData, "port_title", 400),
        subtitleRight: str(formData, "port_subtitleRight", 2000),
        footnote: str(formData, "port_footnote", 2000),
      },
    };
    marketingContentSchema.parse(next);
    await persistMarketing(next);
    revalidateMarketingPages();
    redirectWithToast("/dashboard/content/portfolio", "portfolio_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("savePortfolioIntro", e);
  }
}

export async function saveWarumIntro(formData: FormData): Promise<void> {
  try {
    await guard();
    const m = await loadMarketingForAdmin();
    const next = {
      ...m,
      testimonialsSection: {
        kicker: str(formData, "test_kicker", 120),
        title: str(formData, "test_title", 400),
        subtitle: str(formData, "test_subtitle", 2000),
        footnote: str(formData, "test_footnote", 2000),
      },
    };
    marketingContentSchema.parse(next);
    await persistMarketing(next);
    revalidateMarketingPages();
    redirectWithToast("/dashboard/content/warum", "warum_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveWarumIntro", e);
  }
}

export async function saveTechnologiesSection(formData: FormData): Promise<void> {
  try {
    await guard();
    const m = await loadMarketingForAdmin();
    const stacks = [0, 1, 2].map((i) => ({
      title: str(formData, `tech_stack_${i}_title`, 200),
      description: str(formData, `tech_stack_${i}_desc`, 2000),
      items: splitList(str(formData, `tech_stack_${i}_items`, 4000), 40),
    })) as [
      (typeof m.technologiesSection.stacks)[0],
      (typeof m.technologiesSection.stacks)[1],
      (typeof m.technologiesSection.stacks)[2],
    ];

    const next = {
      ...m,
      technologiesSection: {
        kicker: str(formData, "tech_kicker", 120),
        title: str(formData, "tech_title", 400),
        subtitle: str(formData, "tech_subtitle", 2000),
        stacks,
        marqueeKicker: str(formData, "tech_marqueeKicker", 200),
        marqueeItems: splitList(str(formData, "tech_marqueeItems", 4000), 80),
      },
    };
    marketingContentSchema.parse(next);
    await persistMarketing(next);
    revalidateMarketingPages();
    redirectWithToast("/dashboard/content/technologien", "tech_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveTechnologiesSection", e);
  }
}
