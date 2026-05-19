import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type RobotsSettings = {
  body: string;
  updated_at: string | null;
};

const DEFAULT_ROBOTS_BODY = `User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /auth/

Sitemap: /sitemap.xml`;

export async function getRobotsSettings(): Promise<RobotsSettings> {
  if (!hasServiceRoleConfig()) {
    return { body: DEFAULT_ROBOTS_BODY, updated_at: null };
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value,updated_at")
    .eq("key", "robots")
    .maybeSingle();

  if (error || !data) return { body: DEFAULT_ROBOTS_BODY, updated_at: null };
  const body = data.value?.body;
  return {
    body: typeof body === "string" && body.trim() ? body : DEFAULT_ROBOTS_BODY,
    updated_at: data.updated_at ?? null,
  };
}
