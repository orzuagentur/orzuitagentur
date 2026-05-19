"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { writeAuditLog } from "@/lib/dashboard/audit";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import { createServiceRoleClient, hasServiceRoleConfig } from "@/lib/supabase/service";

function bool(fd: FormData, key: string) {
  const raw = fd.get(key);
  return raw === "on" || raw === "true";
}

function str(fd: FormData, key: string, max: number) {
  const value = fd.get(key);
  if (typeof value !== "string") return "";
  return value.slice(0, max).trim();
}

export async function saveSitemapSettings(formData: FormData): Promise<void> {
  try {
    const user = await requireDashboardUser();
    if (!hasServiceRoleConfig()) return;

    const frequency = str(formData, "defaultChangeFrequency", 20);
    const value = {
      includeStatic: bool(formData, "includeStatic"),
      includePortfolio: bool(formData, "includePortfolio"),
      includeDynamicPages: bool(formData, "includeDynamicPages"),
      defaultChangeFrequency:
        frequency === "daily" ||
        frequency === "monthly" ||
        frequency === "yearly"
          ? frequency
          : "weekly",
    };

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "sitemap",
        value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
    if (error) {
      console.error("[saveSitemapSettings]", error);
      return;
    }

    await writeAuditLog({
      actorEmail: user.email,
      action: "sitemap.saved",
      targetType: "site_settings",
      targetId: "sitemap",
      metadata: value,
    });
    revalidatePath("/sitemap.xml");
    revalidatePath("/dashboard/settings/seo");
    redirectWithToast("/dashboard/settings/seo", "sitemap_saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[saveSitemapSettings]", error);
  }
}
