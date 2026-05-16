import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";
import { DEFAULT_MARKETING } from "@/lib/cms/defaults";
import { deepMerge, cloneMarketingDefault } from "@/lib/cms/merge";
import { marketingContentSchema } from "@/lib/cms/schema";
import type { MarketingContent } from "@/lib/cms/types";

function marketingFromRow(raw: unknown): MarketingContent {
  const base = cloneMarketingDefault(DEFAULT_MARKETING);
  if (!raw || typeof raw !== "object") {
    const parsed = marketingContentSchema.safeParse(base);
    return parsed.success ? parsed.data : DEFAULT_MARKETING;
  }
  const merged = deepMerge(
    base as unknown as Record<string, unknown>,
    raw as Record<string, unknown>,
  );
  const parsed = marketingContentSchema.safeParse(merged);
  return parsed.success ? parsed.data : DEFAULT_MARKETING;
}

export async function loadMarketingForAdmin(): Promise<MarketingContent> {
  if (!hasServiceRoleConfig()) {
    return cloneMarketingDefault(DEFAULT_MARKETING);
  }
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "marketing")
    .maybeSingle();
  if (error || data?.value == null) {
    return cloneMarketingDefault(DEFAULT_MARKETING);
  }
  return marketingFromRow(data.value);
}

export async function persistMarketing(content: MarketingContent) {
  if (!hasServiceRoleConfig()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY fehlt.");
  }
  const parsed = marketingContentSchema.parse(content);
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("site_settings").upsert(
    {
      key: "marketing",
      value: parsed as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  if (error) throw error;
}
