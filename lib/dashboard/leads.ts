import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  privacy_accepted: boolean;
  source: string;
  created_at: string;
};

export async function getRecentLeads(limit = 80): Promise<LeadRow[]> {
  if (!hasServiceRoleConfig()) return [];

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("leads")
    .select(
      "id,name,email,company,message,privacy_accepted,source,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getRecentLeads]", error);
    return [];
  }

  return (data ?? []) as LeadRow[];
}
