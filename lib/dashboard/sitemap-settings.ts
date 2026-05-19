import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type SitemapSettings = {
  includeStatic: boolean;
  includePortfolio: boolean;
  includeDynamicPages: boolean;
  defaultChangeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  updated_at: string | null;
};

export const DEFAULT_SITEMAP_SETTINGS: SitemapSettings = {
  includeStatic: true,
  includePortfolio: true,
  includeDynamicPages: true,
  defaultChangeFrequency: "weekly",
  updated_at: null,
};

export async function getSitemapSettings(): Promise<SitemapSettings> {
  if (!hasServiceRoleConfig()) return DEFAULT_SITEMAP_SETTINGS;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value,updated_at")
    .eq("key", "sitemap")
    .maybeSingle();

  if (error || !data) return DEFAULT_SITEMAP_SETTINGS;
  const value = data.value ?? {};
  const defaultChangeFrequency =
    value.defaultChangeFrequency === "daily" ||
    value.defaultChangeFrequency === "monthly" ||
    value.defaultChangeFrequency === "yearly"
      ? value.defaultChangeFrequency
      : "weekly";

  return {
    includeStatic: value.includeStatic !== false,
    includePortfolio: value.includePortfolio !== false,
    includeDynamicPages: value.includeDynamicPages !== false,
    defaultChangeFrequency,
    updated_at: data.updated_at ?? null,
  };
}
