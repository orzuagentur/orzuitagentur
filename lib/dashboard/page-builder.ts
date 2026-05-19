import type {
  PageBuilderBlock,
  PageBuilderSection,
  PageBuilderSectionWithBlocks,
} from "@/lib/page-builder/types";
import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export async function getPageBuilderForAdmin(
  pageId: string,
): Promise<PageBuilderSectionWithBlocks[]> {
  if (!hasServiceRoleConfig()) return [];

  const supabase = createServiceRoleClient();
  const [sectionsResult, blocksResult] = await Promise.all([
    supabase
      .from("page_sections")
      .select("id,page_id,title_de,section_key,visible,sort_order,layout,responsive,animation,updated_at")
      .eq("page_id", pageId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("page_blocks")
      .select("id,section_id,block_type,title_de,content_de,visible,sort_order,settings,updated_at")
      .order("sort_order", { ascending: true }),
  ]);

  if (sectionsResult.error) {
    console.error("[getPageBuilderForAdmin:sections]", sectionsResult.error);
    return [];
  }
  if (blocksResult.error) {
    console.error("[getPageBuilderForAdmin:blocks]", blocksResult.error);
  }

  const sections = (sectionsResult.data ?? []) as PageBuilderSection[];
  const blocks = (blocksResult.data ?? []) as PageBuilderBlock[];

  return sections.map((section) => ({
    ...section,
    blocks: blocks.filter((block) => block.section_id === section.id),
  }));
}
