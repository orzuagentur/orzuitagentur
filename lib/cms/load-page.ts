import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { buildPagePath, type DynamicPageRow } from "@/lib/dashboard/pages";

function hasPublicSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export type PublicDynamicPage = DynamicPageRow & {
  path: string;
};

export const getPublicDynamicPages = cache(async (): Promise<PublicDynamicPage[]> => {
  if (!hasPublicSupabaseEnv()) return [];

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("pages")
      .select(
        "id,parent_id,slug,title_de,title_en,locale,status,template,excerpt_de,body_de,meta_description_de,seo_title,seo_description,canonical_url,robots_index,schema_json,og_image_url,og_generated_prompt,sitemap_enabled,scheduled_at,sort_order,updated_at",
      )
      .order("sort_order", { ascending: true });

    if (error) return [];

    const now = Date.now();
    const rows = ((data ?? []) as DynamicPageRow[]).filter((page) => {
      if (page.status === "published") return true;
      if (page.status !== "scheduled" || !page.scheduled_at) return false;
      return new Date(page.scheduled_at).getTime() <= now;
    });

    return rows.map((page) => ({
      ...page,
      path: buildPagePath(page, rows),
    }));
  } catch {
    return [];
  }
});

export async function getPublicDynamicPage(path: string) {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  const pages = await getPublicDynamicPages();
  return pages.find((page) => page.path === normalized) ?? null;
}
