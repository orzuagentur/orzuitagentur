"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { writeAuditLog } from "@/lib/dashboard/audit";
import { ADMIN_ROLES, type AdminRole } from "@/lib/dashboard/security";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import { createServiceRoleClient, hasServiceRoleConfig } from "@/lib/supabase/service";

function str(fd: FormData, key: string, max: number) {
  const value = fd.get(key);
  if (typeof value !== "string") return "";
  return value.slice(0, max).trim();
}

function bool(fd: FormData, key: string) {
  const raw = fd.get(key);
  return raw === "on" || raw === "true";
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function roleFrom(value: string): AdminRole {
  return ADMIN_ROLES.includes(value as AdminRole) ? (value as AdminRole) : "viewer";
}

async function guard() {
  const user = await requireDashboardUser();
  if (!hasServiceRoleConfig()) throw new Error("SERVICE_ROLE");
  return user;
}

export async function saveAdminRole(formData: FormData): Promise<void> {
  try {
    const user = await guard();
    const email = str(formData, "email", 320).toLowerCase();
    if (!email) return;

    const payload = {
      email,
      role: roleFrom(str(formData, "role", 40)),
      permissions: splitList(str(formData, "permissions", 1000)),
      two_factor_required: bool(formData, "two_factor_required"),
      active: bool(formData, "active"),
      updated_at: new Date().toISOString(),
    };

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("admin_roles")
      .upsert(payload, { onConflict: "email" });
    if (error) {
      console.error("[saveAdminRole]", error);
      return;
    }

    await writeAuditLog({
      actorEmail: user.email,
      action: "admin_role.saved",
      targetType: "admin_role",
      targetId: email,
      metadata: { role: payload.role, permissions: payload.permissions },
    });
    revalidatePath("/dashboard/settings/security");
    redirectWithToast("/dashboard/settings/security", "security_role_saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[saveAdminRole]", error);
  }
}

export async function saveSecuritySetting(formData: FormData): Promise<void> {
  try {
    const user = await guard();
    const key = str(formData, "key", 80);
    if (!key) return;

    const value = {
      alias: str(formData, "alias", 200),
      enabled: bool(formData, "enabled"),
      required: bool(formData, "required"),
      issuer: str(formData, "issuer", 120),
      maxAgeHours: Number.parseInt(str(formData, "maxAgeHours", 12), 10) || 12,
      showDeviceList: bool(formData, "showDeviceList"),
      allowlist: splitList(str(formData, "allowlist", 2000)),
      blockedCountries: splitList(str(formData, "blockedCountries", 1000)),
      requestsPerMinute:
        Number.parseInt(str(formData, "requestsPerMinute", 12), 10) || 60,
      botProtection: bool(formData, "botProtection"),
    };

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("admin_security_settings").upsert(
      {
        key,
        value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
    if (error) {
      console.error("[saveSecuritySetting]", error);
      return;
    }

    await writeAuditLog({
      actorEmail: user.email,
      action: "security_setting.saved",
      targetType: "security_setting",
      targetId: key,
      metadata: value,
    });
    revalidatePath("/dashboard/settings/security");
    redirectWithToast("/dashboard/settings/security", "security_setting_saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[saveSecuritySetting]", error);
  }
}
