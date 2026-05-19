import { cache } from "react";
import { DEFAULT_PORTFOLIO_CARDS } from "@/lib/cms/defaults";
import { DEFAULT_PORTFOLIO_BODIES } from "@/lib/cms/portfolio-bodies";
import { visualClassForSlug } from "@/lib/cms/portfolio-visuals";
import type { PortfolioDetail } from "@/lib/cms/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function hasPublicSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function bodyForSlug(slug: string, summary: string, bodyFromDb: string | null | undefined) {
  const trimmed = bodyFromDb?.trim();
  if (trimmed) return trimmed;
  return DEFAULT_PORTFOLIO_BODIES[slug] ?? summary;
}

function detailFromDefaults(slug: string): PortfolioDetail | null {
  const index = DEFAULT_PORTFOLIO_CARDS.findIndex((c) => c.key === slug);
  if (index < 0) return null;
  const card = DEFAULT_PORTFOLIO_CARDS[index];
  return {
    slug,
    title: card.title,
    category: card.category,
    summary: card.description,
    body: bodyForSlug(slug, card.description, null),
    visualClass: visualClassForSlug(slug, index),
    imageUrl: card.imageUrl ?? null,
  };
}

export const getPublishedPortfolioSlugs = cache(async (): Promise<string[]> => {
  if (!hasPublicSupabaseEnv()) {
    return DEFAULT_PORTFOLIO_CARDS.map((c) => c.key);
  }
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("portfolio_entries")
      .select("slug")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) {
      return DEFAULT_PORTFOLIO_CARDS.map((c) => c.key);
    }
    return data.map((row) => row.slug);
  } catch {
    return DEFAULT_PORTFOLIO_CARDS.map((c) => c.key);
  }
});

export const getPortfolioBySlug = cache(
  async (slug: string): Promise<PortfolioDetail | null> => {
    if (!hasPublicSupabaseEnv()) {
      return detailFromDefaults(slug);
    }
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("portfolio_entries")
        .select("slug,title_de,summary_de,category_de,body_de,image_url,project_url,sort_order")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error || !data) {
        return detailFromDefaults(slug);
      }

      const index = Math.max(0, (data.sort_order ?? 1) - 1);
      const summary = data.summary_de ?? "";

      const row = data as Record<string, unknown>;
      const imageRaw = row.image_url;
      const imageUrl =
        typeof imageRaw === "string" && imageRaw.trim() ? imageRaw.trim() : null;

      return {
        slug: data.slug,
        title: data.title_de,
        category: data.category_de ?? "",
        summary,
        body: bodyForSlug(data.slug, summary, data.body_de),
        visualClass: visualClassForSlug(data.slug, index),
        imageUrl,
        projectUrl:
          (data as { project_url?: string | null }).project_url?.trim() || null,
      };
    } catch {
      return detailFromDefaults(slug);
    }
  },
);
