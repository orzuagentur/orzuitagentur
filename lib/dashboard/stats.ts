import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type DashboardStats = {
  configured: boolean;
  leads: number | null;
  services: number | null;
  portfolio: number | null;
  testimonials: number | null;
  analyticsEvents: number | null;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!hasServiceRoleConfig()) {
    return {
      configured: false,
      leads: null,
      services: null,
      portfolio: null,
      testimonials: null,
      analyticsEvents: null,
    };
  }

  const supabase = createServiceRoleClient();

  const [leads, services, portfolio, testimonials, analytics] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("portfolio_entries").select("id", { count: "exact", head: true }),
    supabase.from("testimonials").select("id", { count: "exact", head: true }),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }),
  ]);

  return {
    configured: true,
    leads: leads.count ?? 0,
    services: services.count ?? 0,
    portfolio: portfolio.count ?? 0,
    testimonials: testimonials.count ?? 0,
    analyticsEvents: analytics.count ?? 0,
  };
}
