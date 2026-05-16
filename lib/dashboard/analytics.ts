import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type AnalyticsEventRow = {
  id: number;
  event_name: string;
  created_at: string;
};

export type AnalyticsOverview = {
  configured: boolean;
  total: number | null;
  byEvent: { name: string; count: number }[];
  recent: AnalyticsEventRow[];
};

const MAX_SAMPLE = 800;

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  if (!hasServiceRoleConfig()) {
    return {
      configured: false,
      total: null,
      byEvent: [],
      recent: [],
    };
  }

  const supabase = createServiceRoleClient();

  const [{ count, error: countError }, { data: sample, error: sampleError }] =
    await Promise.all([
      supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("analytics_events")
        .select("id,event_name,created_at")
        .order("created_at", { ascending: false })
        .limit(MAX_SAMPLE),
    ]);

  if (countError) console.error("[getAnalyticsOverview] count", countError);
  if (sampleError) console.error("[getAnalyticsOverview] sample", sampleError);

  const rows = (sample ?? []) as AnalyticsEventRow[];
  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(row.event_name, (map.get(row.event_name) ?? 0) + 1);
  }
  const byEvent = [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const { data: recentRows, error: recentError } = await supabase
    .from("analytics_events")
    .select("id,event_name,created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  if (recentError) console.error("[getAnalyticsOverview] recent", recentError);

  return {
    configured: true,
    total: count ?? rows.length,
    byEvent,
    recent: (recentRows ?? []) as AnalyticsEventRow[],
  };
}
