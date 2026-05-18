"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import { loadMarketingForAdmin, persistMarketing } from "@/lib/cms/persist";
import { hasServiceRoleConfig } from "@/lib/supabase/service";
import { marketingContentSchema } from "@/lib/cms/schema";
import type { HeroStat } from "@/lib/cms/types";

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
    revalidatePath("/");
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard/content/hero");
    revalidatePath("/dashboard/content/nav-footer");
    revalidatePath("/dashboard/content/contact");
    revalidatePath("/dashboard/content/sections");
    revalidatePath("/dashboard/content/technologies");
    redirectWithToast("/dashboard/content", "hero_saved");
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
    const links = m.nav.links.map((link, i) => ({
      href: str(formData, `nav_href_${i}`, 200) || link.href,
      label: str(formData, `nav_label_${i}`, 120) || link.label,
    }));
    const next = {
      ...m,
      nav: { links, ctaLabel: str(formData, "nav_ctaLabel", 120) },
      footer: {
        ...m.footer,
        tagline: str(formData, "footer_tagline", 1200),
        ctaLabel: str(formData, "footer_ctaLabel", 120),
        navHeading: str(formData, "footer_navHeading", 80),
        contactHeading: str(formData, "footer_contactHeading", 80),
        contactLead: str(formData, "footer_contactLead", 600),
        email: str(formData, "footer_email", 200),
        locationLine: str(formData, "footer_locationLine", 200),
        impressumLabel: str(formData, "footer_impressumLabel", 80),
        privacyLabel: str(formData, "footer_privacyLabel", 80),
        copyrightName: str(formData, "footer_copyrightName", 120),
      },
    };
    marketingContentSchema.parse(next);
    await persistMarketing(next);
    revalidatePath("/");
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard/content/hero");
    revalidatePath("/dashboard/content/nav-footer");
    revalidatePath("/dashboard/content/contact");
    revalidatePath("/dashboard/content/sections");
    revalidatePath("/dashboard/content/technologies");
    redirectWithToast("/dashboard/content/nav-footer", "nav_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveNavAndFooter", e);
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
        successTitle: str(formData, "contact_successTitle", 400),
        successBody: str(formData, "contact_successBody", 2000),
      },
    };
    marketingContentSchema.parse(next);
    await persistMarketing(next);
    revalidatePath("/");
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard/content/hero");
    revalidatePath("/dashboard/content/nav-footer");
    revalidatePath("/dashboard/content/contact");
    revalidatePath("/dashboard/content/sections");
    revalidatePath("/dashboard/content/technologies");
    redirectWithToast("/dashboard/content", "contact_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveContactBlock", e);
  }
}

export async function saveSectionIntros(formData: FormData): Promise<void> {
  try {
    await guard();
    const m = await loadMarketingForAdmin();
    const next = {
      ...m,
      servicesSection: {
        kicker: str(formData, "svc_kicker", 120),
        title: str(formData, "svc_title", 400),
        subtitle: str(formData, "svc_subtitle", 2000),
        closing: str(formData, "svc_closing", 2000),
        ctaLabel: str(formData, "svc_ctaLabel", 120),
      },
      portfolioSection: {
        kicker: str(formData, "port_kicker", 120),
        title: str(formData, "port_title", 400),
        subtitleRight: str(formData, "port_subtitleRight", 2000),
        footnote: str(formData, "port_footnote", 2000),
      },
      testimonialsSection: {
        kicker: str(formData, "test_kicker", 120),
        title: str(formData, "test_title", 400),
        subtitle: str(formData, "test_subtitle", 2000),
        footnote: str(formData, "test_footnote", 2000),
      },
    };
    marketingContentSchema.parse(next);
    await persistMarketing(next);
    revalidatePath("/");
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard/content/hero");
    revalidatePath("/dashboard/content/nav-footer");
    revalidatePath("/dashboard/content/contact");
    revalidatePath("/dashboard/content/sections");
    revalidatePath("/dashboard/content/technologies");
    redirectWithToast("/dashboard/content/sections", "sections_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveSectionIntros", e);
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
    revalidatePath("/");
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard/content/hero");
    revalidatePath("/dashboard/content/nav-footer");
    revalidatePath("/dashboard/content/contact");
    revalidatePath("/dashboard/content/sections");
    revalidatePath("/dashboard/content/technologies");
    redirectWithToast("/dashboard/content", "tech_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveTechnologiesSection", e);
  }
}
