import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type SeoRow = {
  path: string;
  title_de: string | null;
  description_de: string | null;
  og_image_url: string | null;
  updated_at: string;
};

export async function getSeoEntries(): Promise<SeoRow[]> {
  if (!hasServiceRoleConfig()) return [];
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("site_seo")
    .select("path,title_de,description_de,og_image_url,updated_at")
    .order("path");

  if (error) {
    console.error("[getSeoEntries]", error);
    return [];
  }
  return (data ?? []) as SeoRow[];
}
