import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export const ADMIN_ROLES = [
  "owner",
  "admin",
  "editor",
  "designer",
  "ai_operator",
  "viewer",
] as const;

export const ADMIN_PERMISSIONS = [
  "content.read",
  "content.write",
  "pages.write",
  "media.write",
  "seo.write",
  "settings.write",
  "secrets.write",
  "security.write",
  "ai.use",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export type AdminRoleRow = {
  id: string;
  email: string;
  role: AdminRole;
  permissions: string[];
  two_factor_required: boolean;
  active: boolean;
  updated_at: string;
};

export type SecuritySettingRow = {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
};

export async function getAdminRoleRows(): Promise<AdminRoleRow[]> {
  if (!hasServiceRoleConfig()) return [];

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("admin_roles")
    .select("id,email,role,permissions,two_factor_required,active,updated_at")
    .order("email");

  if (error) {
    console.error("[getAdminRoleRows]", error);
    return [];
  }

  return (data ?? []) as AdminRoleRow[];
}

export async function getSecuritySettings(): Promise<SecuritySettingRow[]> {
  if (!hasServiceRoleConfig()) return [];

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("admin_security_settings")
    .select("key,value,updated_at")
    .order("key");

  if (error) {
    console.error("[getSecuritySettings]", error);
    return [];
  }

  return (data ?? []) as SecuritySettingRow[];
}
