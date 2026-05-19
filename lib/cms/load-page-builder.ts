import { cache } from "react";
import type {
  PageBuilderBlock,
  PageBuilderSection,
  PageBuilderSectionWithBlocks,
} from "@/lib/page-builder/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function hasPublicSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export const getPublicPageBuilder = cache(
  async (pageId: string): Promise<PageBuilderSectionWithBlocks[]> => {
    if (!hasPublicSupabaseEnv()) return [];

    try {
      const supabase = await createServerSupabaseClient();
      const [sectionsResult, blocksResult] = await Promise.all([
        supabase
          .from("page_sections")
          .select("id,page_id,title_de,section_key,visible,sort_order,layout,responsive,animation,updated_at")
          .eq("page_id", pageId)
          .eq("visible", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("page_blocks")
          .select("id,section_id,block_type,title_de,content_de,visible,sort_order,settings,updated_at")
          .eq("visible", true)
          .order("sort_order", { ascending: true }),
      ]);

      if (sectionsResult.error) return [];

      const sections = (sectionsResult.data ?? []) as PageBuilderSection[];
      const blocks = (blocksResult.data ?? []) as PageBuilderBlock[];

      return sections.map((section) => ({
        ...section,
        blocks: blocks.filter((block) => block.section_id === section.id),
      }));
    } catch {
      return [];
    }
  },
);
