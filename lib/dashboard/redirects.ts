import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export type RedirectRuleRow = {
  id: string;
  source_path: string;
  target_url: string;
  status_code: 301 | 302;
  enabled: boolean;
  note: string | null;
  updated_at: string;
};

export async function getRedirectRules(): Promise<RedirectRuleRow[]> {
  if (!hasServiceRoleConfig()) return [];

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("redirect_rules")
    .select("id,source_path,target_url,status_code,enabled,note,updated_at")
    .order("source_path");

  if (error) {
    console.error("[getRedirectRules]", error);
    return [];
  }

  return (data ?? []) as RedirectRuleRow[];
}
