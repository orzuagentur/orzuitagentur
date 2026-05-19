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

export async function saveAnalyticsSettings(formData: FormData): Promise<void> {
  try {
    const user = await requireDashboardUser();
    if (!hasServiceRoleConfig()) return;

    const value = {
      heatmapProvider: str(formData, "heatmapProvider", 80),
      heatmapProjectId: str(formData, "heatmapProjectId", 200),
      heatmapEnabled: bool(formData, "heatmapEnabled"),
      trackCtaClicks: bool(formData, "trackCtaClicks"),
      trackScrollDepth: bool(formData, "trackScrollDepth"),
      trackWebVitals: bool(formData, "trackWebVitals"),
    };

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "analytics",
        value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
    if (error) {
      console.error("[saveAnalyticsSettings]", error);
      return;
    }

    await writeAuditLog({
      actorEmail: user.email,
      action: "analytics.saved",
      targetType: "site_settings",
      targetId: "analytics",
      metadata: value,
    });
    revalidatePath("/dashboard/analytics");
    redirectWithToast("/dashboard/analytics", "analytics_saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[saveAnalyticsSettings]", error);
  }
}
