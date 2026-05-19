import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type PortfolioRow = {
  id: string;
  slug: string;
  title_de: string;
  summary_de: string | null;
  body_de: string | null;
  category_de: string | null;
  project_url: string | null;
  sort_order: number;
  published: boolean;
  updated_at: string;
};

export async function getPortfolioEntries(): Promise<PortfolioRow[]> {
  if (!hasServiceRoleConfig()) return [];
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("portfolio_entries")
    .select(
      "id,slug,title_de,summary_de,body_de,category_de,project_url,sort_order,published,updated_at",
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getPortfolioEntries]", error);
    return [];
  }
  return (data ?? []) as PortfolioRow[];
}
