import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type DynamicPageRow = {
  id: string;
  parent_id: string | null;
  slug: string;
  title_de: string;
  title_en: string | null;
  locale: "de" | "en";
  status: "draft" | "published" | "scheduled";
  template: "landing" | "legal" | "blank";
  excerpt_de: string | null;
  body_de: string | null;
  meta_description_de: string | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  robots_index: boolean;
  schema_json: Record<string, unknown>;
  og_image_url: string | null;
  og_generated_prompt: string | null;
  sitemap_enabled: boolean;
  scheduled_at: string | null;
  sort_order: number;
  updated_at: string;
};

export function buildPagePath(
  page: Pick<DynamicPageRow, "id" | "parent_id" | "slug" | "locale">,
  pages: Pick<DynamicPageRow, "id" | "parent_id" | "slug" | "locale">[],
) {
  const parts = [page.slug];
  let parentId = page.parent_id;
  const seen = new Set<string>([page.id]);

  while (parentId) {
    const parent = pages.find((item) => item.id === parentId);
    if (!parent || seen.has(parent.id)) break;
    seen.add(parent.id);
    parts.unshift(parent.slug);
    parentId = parent.parent_id;
  }

  const prefix = page.locale === "en" ? "/en" : "";
  return `${prefix}/${parts.join("/")}`;
}

export async function getDynamicPages(): Promise<DynamicPageRow[]> {
  if (!hasServiceRoleConfig()) return [];

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("pages")
    .select(
      "id,parent_id,slug,title_de,title_en,locale,status,template,excerpt_de,body_de,meta_description_de,seo_title,seo_description,canonical_url,robots_index,schema_json,og_image_url,og_generated_prompt,sitemap_enabled,scheduled_at,sort_order,updated_at",
    )
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[getDynamicPages]", error);
    return [];
  }

  return (data ?? []) as DynamicPageRow[];
}
