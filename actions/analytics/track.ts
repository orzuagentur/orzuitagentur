"use server";

import { createServiceRoleClient, hasServiceRoleConfig } from "@/lib/supabase/service";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "cta_click",
  "scroll_depth",
  "web_vital",
]);

export async function trackAnalyticsEvent(input: {
  eventName: string;
  payload?: Record<string, unknown>;
}) {
  if (!hasServiceRoleConfig() || !ALLOWED_EVENTS.has(input.eventName)) return;

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("analytics_events").insert({
    event_name: input.eventName,
    payload: input.payload ?? {},
  });
  if (error) console.error("[trackAnalyticsEvent]", error);
}
