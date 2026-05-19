import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type AnalyticsEventRow = {
  id: number;
  event_name: string;
  payload?: Record<string, unknown>;
  created_at: string;
};

export type AnalyticsOverview = {
  configured: boolean;
  total: number | null;
  pageViews: number;
  ctaClicks: number;
  scrollDepthEvents: number;
  webVitalEvents: number;
  leadsCount: number;
  conversionRate: number | null;
  topCtas: { label: string; count: number }[];
  scrollDepth: { depth: string; count: number }[];
  webVitals: { metric: string; value: number; rating: string }[];
  byEvent: { name: string; count: number }[];
  recent: AnalyticsEventRow[];
};

export type AnalyticsSettings = {
  heatmapProvider: string;
  heatmapProjectId: string;
  heatmapEnabled: boolean;
  trackCtaClicks: boolean;
  trackScrollDepth: boolean;
  trackWebVitals: boolean;
};

const MAX_SAMPLE = 800;

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  if (!hasServiceRoleConfig()) {
    return {
      configured: false,
      total: null,
      pageViews: 0,
      ctaClicks: 0,
      scrollDepthEvents: 0,
      webVitalEvents: 0,
      leadsCount: 0,
      conversionRate: null,
      topCtas: [],
      scrollDepth: [],
      webVitals: [],
      byEvent: [],
      recent: [],
    };
  }

  const supabase = createServiceRoleClient();

  const [
    { count, error: countError },
    { count: leadsCount, error: leadsError },
    { data: sample, error: sampleError },
  ] =
    await Promise.all([
      supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase
        .from("analytics_events")
        .select("id,event_name,payload,created_at")
        .order("created_at", { ascending: false })
        .limit(MAX_SAMPLE),
    ]);

  if (countError) console.error("[getAnalyticsOverview] count", countError);
  if (leadsError) console.error("[getAnalyticsOverview] leads", leadsError);
  if (sampleError) console.error("[getAnalyticsOverview] sample", sampleError);

  const rows = (sample ?? []) as AnalyticsEventRow[];
  const map = new Map<string, number>();
  const ctaMap = new Map<string, number>();
  const scrollMap = new Map<string, number>();
  const vitals: { metric: string; value: number; rating: string }[] = [];
  for (const row of rows) {
    map.set(row.event_name, (map.get(row.event_name) ?? 0) + 1);
    if (row.event_name === "cta_click") {
      const label =
        typeof row.payload?.label === "string" ? row.payload.label : "CTA";
      ctaMap.set(label, (ctaMap.get(label) ?? 0) + 1);
    }
    if (row.event_name === "scroll_depth") {
      const depth = typeof row.payload?.depth === "number" ? `${row.payload.depth}%` : "unknown";
      scrollMap.set(depth, (scrollMap.get(depth) ?? 0) + 1);
    }
    if (row.event_name === "web_vital") {
      const metric = typeof row.payload?.metric === "string" ? row.payload.metric : "metric";
      const value = typeof row.payload?.value === "number" ? row.payload.value : 0;
      const rating = typeof row.payload?.rating === "string" ? row.payload.rating : "unknown";
      vitals.push({ metric, value, rating });
    }
  }
  const byEvent = [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  const pageViews = map.get("page_view") ?? 0;
  const ctaClicks = map.get("cta_click") ?? 0;
  const leadTotal = leadsCount ?? 0;

  const { data: recentRows, error: recentError } = await supabase
    .from("analytics_events")
    .select("id,event_name,payload,created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  if (recentError) console.error("[getAnalyticsOverview] recent", recentError);

  return {
    configured: true,
    total: count ?? rows.length,
    pageViews,
    ctaClicks,
    scrollDepthEvents: map.get("scroll_depth") ?? 0,
    webVitalEvents: map.get("web_vital") ?? 0,
    leadsCount: leadTotal,
    conversionRate: pageViews > 0 ? (leadTotal / pageViews) * 100 : null,
    topCtas: [...ctaMap.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    scrollDepth: [...scrollMap.entries()]
      .map(([depth, count]) => ({ depth, count }))
      .sort((a, b) => Number.parseInt(a.depth, 10) - Number.parseInt(b.depth, 10)),
    webVitals: vitals.slice(0, 12),
    byEvent,
    recent: (recentRows ?? []) as AnalyticsEventRow[],
  };
}

export async function getAnalyticsSettings(): Promise<AnalyticsSettings> {
  const defaults: AnalyticsSettings = {
    heatmapProvider: "",
    heatmapProjectId: "",
    heatmapEnabled: false,
    trackCtaClicks: true,
    trackScrollDepth: true,
    trackWebVitals: true,
  };
  if (!hasServiceRoleConfig()) return defaults;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "analytics")
    .maybeSingle();
  if (error || !data) return defaults;
  return { ...defaults, ...(data.value as Partial<AnalyticsSettings>) };
}
