import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  DEFAULT_HOME_SEO,
  DEFAULT_MARKETING,
  DEFAULT_PORTFOLIO_CARDS,
  DEFAULT_SERVICES_CARDS,
  DEFAULT_TESTIMONIALS_CARDS,
} from "@/lib/cms/defaults";
import { deepMerge, cloneMarketingDefault } from "@/lib/cms/merge";
import { marketingContentSchema } from "@/lib/cms/schema";
import type {
  HomeSeo,
  MarketingContent,
  NavContent,
  PortfolioCard,
  ServiceCard,
  TestimonialCard,
} from "@/lib/cms/types";

function hasPublicSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function imageUrlFromRow(row: Record<string, unknown>): string | null {
  if (!("image_url" in row)) return null;
  const url = row.image_url;
  if (typeof url !== "string") return null;
  const trimmed = url.trim();
  return trimmed || null;
}

import { enrichDefaultPortfolioCards, enrichPortfolioCard } from "@/lib/cms/enrich-portfolio";
import { enrichDefaultServiceCards, enrichServiceCard } from "@/lib/cms/enrich-services";
import { visualClassForSlug } from "@/lib/cms/portfolio-visuals";
import { visualClassForService } from "@/lib/cms/service-visuals";
import { normalizeNavHref } from "@/lib/navigation/section-scroll";
function normalizeNavContent(nav: NavContent): NavContent {
  return {
    ...nav,
    links: nav.links.map((link) => ({
      ...link,
      href: normalizeNavHref(link.href),
    })),
  };
}

function marketingFromRow(
  raw: unknown,
): MarketingContent {
  const base = cloneMarketingDefault(DEFAULT_MARKETING);
  if (!raw || typeof raw !== "object") {
    const parsed = marketingContentSchema.safeParse(base);
    const marketing = parsed.success ? parsed.data : DEFAULT_MARKETING;
    return { ...marketing, nav: normalizeNavContent(marketing.nav) };
  }
  const merged = deepMerge(
    base as unknown as Record<string, unknown>,
    raw as Record<string, unknown>,
  );
  const parsed = marketingContentSchema.safeParse(merged);
  const marketing = parsed.success ? parsed.data : DEFAULT_MARKETING;
  return {
    ...marketing,
    nav: normalizeNavContent(marketing.nav),
  };
}

export const getMarketingContent = cache(async (): Promise<MarketingContent> => {
  if (!hasPublicSupabaseEnv()) return { ...DEFAULT_MARKETING, nav: normalizeNavContent(DEFAULT_MARKETING.nav) };
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "marketing")
      .maybeSingle();
    if (error || data?.value == null) {
      return { ...DEFAULT_MARKETING, nav: normalizeNavContent(DEFAULT_MARKETING.nav) };
    }
    return marketingFromRow(data.value);
  } catch {
    return { ...DEFAULT_MARKETING, nav: normalizeNavContent(DEFAULT_MARKETING.nav) };
  }
});

export const getHomeSeo = cache(async (): Promise<HomeSeo> => {
  if (!hasPublicSupabaseEnv()) {
    return {
      title: DEFAULT_HOME_SEO.title,
      description: DEFAULT_HOME_SEO.description,
      ogImageUrl: DEFAULT_HOME_SEO.ogImageUrl,
    };
  }
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("site_seo")
      .select("title_de,description_de,og_image_url")
      .eq("path", "/")
      .maybeSingle();
    if (error || !data) {
      return {
        title: DEFAULT_HOME_SEO.title,
        description: DEFAULT_HOME_SEO.description,
        ogImageUrl: DEFAULT_HOME_SEO.ogImageUrl,
      };
    }
    return {
      title: data.title_de?.trim() || DEFAULT_HOME_SEO.title,
      description: data.description_de?.trim() || DEFAULT_HOME_SEO.description,
      ogImageUrl: data.og_image_url?.trim() || null,
    };
  } catch {
    return {
      title: DEFAULT_HOME_SEO.title,
      description: DEFAULT_HOME_SEO.description,
      ogImageUrl: DEFAULT_HOME_SEO.ogImageUrl,
    };
  }
});

export const getServiceCards = cache(async (): Promise<ServiceCard[]> => {
  if (!hasPublicSupabaseEnv()) return enrichDefaultServiceCards();
  try {
    const supabase = await createServerSupabaseClient();
    const withImage = await supabase
      .from("services")
      .select(
        "slug,title_de,description_de,body_de,category_de,project_url,image_url,sort_order",
      )
      .eq("published", true)
      .order("sort_order", { ascending: true });

    const withUrl = withImage.error
      ? await supabase
          .from("services")
          .select(
            "slug,title_de,description_de,body_de,category_de,project_url,sort_order",
          )
          .eq("published", true)
          .order("sort_order", { ascending: true })
      : null;

    const fallback = withImage.error && withUrl?.error
      ? await supabase
          .from("services")
          .select("slug,title_de,description_de,body_de,category_de,sort_order")
          .eq("published", true)
          .order("sort_order", { ascending: true })
      : null;

    const data = withImage.error
      ? withUrl?.error
        ? fallback?.data
        : withUrl?.data
      : withImage.data;
    const error = withImage.error
      ? withUrl?.error
        ? fallback?.error
        : withUrl?.error
      : withImage.error;
    if (error || !data?.length) return enrichDefaultServiceCards();

    return data.map((row, index) => {
      const slug = row.slug;
      const visual = visualClassForService(slug, index);
      const defaults = DEFAULT_SERVICES_CARDS.find((c) => c.key === slug);
      const base: ServiceCard = {
        key: slug,
        label: defaults?.label ?? String(row.sort_order ?? index + 1).padStart(2, "0"),
        title: row.title_de,
        category: row.category_de ?? defaults?.category ?? "",
        description: row.description_de ?? "",
        visualClass: visual,
        imageUrl: imageUrlFromRow(row as Record<string, unknown>),
        projectUrl:
          "project_url" in row
            ? String((row as { project_url?: string | null }).project_url ?? "").trim() ||
              null
            : null,
      };
      return enrichServiceCard(base, row.body_de);
    });
  } catch {
    return enrichDefaultServiceCards();
  }
});

export const getPortfolioCards = cache(async (): Promise<PortfolioCard[]> => {
  if (!hasPublicSupabaseEnv()) return enrichDefaultPortfolioCards();
  try {
    const supabase = await createServerSupabaseClient();
    const withImage = await supabase
      .from("portfolio_entries")
      .select(
        "slug,title_de,summary_de,body_de,category_de,project_url,image_url,sort_order",
      )
      .eq("published", true)
      .order("sort_order", { ascending: true });

    const withUrl = withImage.error
      ? await supabase
          .from("portfolio_entries")
          .select(
            "slug,title_de,summary_de,body_de,category_de,project_url,sort_order",
          )
          .eq("published", true)
          .order("sort_order", { ascending: true })
      : null;

    const fallback = withImage.error && withUrl?.error
      ? await supabase
          .from("portfolio_entries")
          .select("slug,title_de,summary_de,body_de,category_de,sort_order")
          .eq("published", true)
          .order("sort_order", { ascending: true })
      : null;

    const data = withImage.error
      ? withUrl?.error
        ? fallback?.data
        : withUrl?.data
      : withImage.data;
    const error = withImage.error
      ? withUrl?.error
        ? fallback?.error
        : withUrl?.error
      : withImage.error;
    if (error || !data?.length) return enrichDefaultPortfolioCards();
    return data.map((row, index) => {
      const slug = row.slug;
      const visual = visualClassForSlug(slug, index);
      const base: PortfolioCard = {
        key: slug,
        title: row.title_de,
        category: row.category_de ?? "",
        description: row.summary_de ?? "",
        visualClass: visual,
        imageUrl: imageUrlFromRow(row as Record<string, unknown>),
        size: index === 0 ? ("featured" as const) : ("compact" as const),
        projectUrl:
          "project_url" in row
            ? String((row as { project_url?: string | null }).project_url ?? "").trim() ||
              null
            : null,
      };
      return enrichPortfolioCard(base, row.body_de);
    });
  } catch {
    return enrichDefaultPortfolioCards();
  }
});

export const getTestimonialCards = cache(
  async (): Promise<TestimonialCard[]> => {
    if (!hasPublicSupabaseEnv()) return DEFAULT_TESTIMONIALS_CARDS;
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("testimonials")
        .select("id,quote_de,author_de,role_de,org_de,sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) return DEFAULT_TESTIMONIALS_CARDS;
      if (!data?.length) return DEFAULT_TESTIMONIALS_CARDS;
      return data.map((row) => ({
        key: String(row.id),
        quote: row.quote_de,
        author: row.author_de,
        role: row.role_de ?? "",
        org: row.org_de ?? "",
      }));
    } catch {
      return DEFAULT_TESTIMONIALS_CARDS;
    }
  },
);
