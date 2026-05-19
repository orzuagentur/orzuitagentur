import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type MediaAsset = {
  id: string;
  source: "services" | "portfolio_entries";
  sourceLabel: string;
  editHref: string;
  title: string;
  slug: string;
  image_url: string | null;
  image_alt: string | null;
  updated_at: string;
};

function asMediaAsset(
  source: MediaAsset["source"],
  row: {
    id: string;
    slug: string;
    title_de: string;
    image_url: string | null;
    image_alt?: string | null;
    updated_at: string;
  },
): MediaAsset {
  return {
    id: row.id,
    source,
    sourceLabel: source === "services" ? "Leistung" : "Portfolio",
    editHref: source === "services" ? "/dashboard/services" : "/dashboard/portfolio",
    title: row.title_de,
    slug: row.slug,
    image_url: row.image_url,
    image_alt: row.image_alt ?? null,
    updated_at: row.updated_at,
  };
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  if (!hasServiceRoleConfig()) return [];

  const supabase = createServiceRoleClient();
  const [services, portfolio] = await Promise.all([
    supabase
      .from("services")
      .select("id,slug,title_de,image_url,image_alt,updated_at")
      .order("updated_at", { ascending: false }),
    supabase
      .from("portfolio_entries")
      .select("id,slug,title_de,image_url,image_alt,updated_at")
      .order("updated_at", { ascending: false }),
  ]);

  if (services.error) console.error("[getMediaAssets:services]", services.error);
  if (portfolio.error) console.error("[getMediaAssets:portfolio]", portfolio.error);

  return [
    ...((services.data ?? []).map((row) => asMediaAsset("services", row)) ?? []),
    ...((portfolio.data ?? []).map((row) =>
      asMediaAsset("portfolio_entries", row),
    ) ?? []),
  ].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}
