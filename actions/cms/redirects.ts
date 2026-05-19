"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { writeAuditLog } from "@/lib/dashboard/audit";
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

function normalizeSource(value: string) {
  const path = value.startsWith("/") ? value : `/${value}`;
  return path.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
}

async function guard() {
  const user = await requireDashboardUser();
  if (!hasServiceRoleConfig()) throw new Error("SERVICE_ROLE");
  return user;
}

export async function saveRedirectRule(formData: FormData): Promise<void> {
  try {
    const user = await guard();
    const id = str(formData, "id", 64);
    const sourcePath = normalizeSource(str(formData, "source_path", 300));
    const targetUrl = str(formData, "target_url", 1000);
    const statusCode = str(formData, "status_code", 3) === "302" ? 302 : 301;
    if (!sourcePath || !targetUrl) return;

    const payload = {
      source_path: sourcePath,
      target_url: targetUrl,
      status_code: statusCode,
      enabled: bool(formData, "enabled"),
      note: str(formData, "note", 500) || null,
      updated_at: new Date().toISOString(),
    };

    const supabase = createServiceRoleClient();
    const query = id
      ? supabase.from("redirect_rules").update(payload).eq("id", id)
      : supabase.from("redirect_rules").upsert(payload, { onConflict: "source_path" });
    const { error } = await query;
    if (error) {
      console.error("[saveRedirectRule]", error);
      return;
    }

    await writeAuditLog({
      actorEmail: user.email,
      action: "redirect.saved",
      targetType: "redirect_rule",
      targetId: sourcePath,
      metadata: { targetUrl, statusCode },
    });
    revalidatePath("/dashboard/settings/seo");
    redirectWithToast("/dashboard/settings/seo", "redirect_saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[saveRedirectRule]", error);
  }
}

export async function deleteRedirectRule(formData: FormData): Promise<void> {
  try {
    const user = await guard();
    const id = str(formData, "id", 64);
    if (!id) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("redirect_rules").delete().eq("id", id);
    if (error) {
      console.error("[deleteRedirectRule]", error);
      return;
    }

    await writeAuditLog({
      actorEmail: user.email,
      action: "redirect.deleted",
      targetType: "redirect_rule",
      targetId: id,
    });
    revalidatePath("/dashboard/settings/seo");
    redirectWithToast("/dashboard/settings/seo", "redirect_deleted");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[deleteRedirectRule]", error);
  }
}
