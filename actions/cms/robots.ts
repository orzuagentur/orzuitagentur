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

export async function saveRobots(formData: FormData): Promise<void> {
  try {
    const user = await requireDashboardUser();
    if (!hasServiceRoleConfig()) return;

    const body = str(formData, "robots_body", 12000);
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("site_settings").upsert(
      {
        key: "robots",
        value: { body },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
    if (error) {
      console.error("[saveRobots]", error);
      return;
    }

    await writeAuditLog({
      actorEmail: user.email,
      action: "robots.saved",
      targetType: "site_settings",
      targetId: "robots",
    });
    revalidatePath("/robots.txt");
    revalidatePath("/dashboard/settings/seo");
    redirectWithToast("/dashboard/settings/seo", "robots_saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[saveRobots]", error);
  }
}
