"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { writeAuditLog } from "@/lib/dashboard/audit";
import { revalidateSettingsDashboard } from "@/lib/dashboard/revalidate-settings";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";
import { homeSeoSchema } from "@/lib/cms/schema";

function str(fd: FormData, key: string, max: number) {
  const v = fd.get(key);
  if (typeof v !== "string") return "";
  return v.slice(0, max).trim();
}

export async function saveHomeSeo(formData: FormData): Promise<void> {
  try {
    const user = await requireDashboardUser();
    if (!hasServiceRoleConfig()) {
      console.warn("[cms:saveHomeSeo] Service-Role nicht konfiguriert.");
      return;
    }

    const title = str(formData, "seo_title", 120);
    const description = str(formData, "seo_description", 320);
    const ogRaw = str(formData, "seo_ogImageUrl", 2000);
    const ogImageUrl = ogRaw === "" ? null : ogRaw;
    const canonicalUrl = str(formData, "seo_canonicalUrl", 1000) || null;
    const robotsIndex = formData.get("seo_robotsIndex") === "on";
    const ogGeneratedPrompt = str(formData, "seo_ogGeneratedPrompt", 1000) || null;
    const sitemapEnabled = formData.get("seo_sitemapEnabled") === "on";
    const schemaRaw = str(formData, "seo_schemaJson", 12000);
    let schemaJson: Record<string, unknown> = {};
    if (schemaRaw) {
      try {
        const parsedSchema = JSON.parse(schemaRaw);
        if (parsedSchema && typeof parsedSchema === "object" && !Array.isArray(parsedSchema)) {
          schemaJson = parsedSchema;
        }
      } catch {
        console.warn("[cms:saveHomeSeo] Schema JSON ungültig.");
      }
    }

    const parsed = homeSeoSchema.safeParse({
      title,
      description,
      ogImageUrl,
    });
    if (!parsed.success) {
      console.warn("[cms:saveHomeSeo] Validierung fehlgeschlagen.");
      return;
    }

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("site_seo").upsert(
      {
        path: "/",
        title_de: parsed.data.title,
        description_de: parsed.data.description,
        og_image_url: parsed.data.ogImageUrl ?? null,
        canonical_url: canonicalUrl,
        robots_index: robotsIndex,
        schema_json: schemaJson,
        og_generated_prompt: ogGeneratedPrompt,
        sitemap_enabled: sitemapEnabled,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "path" },
    );
    if (error) {
      console.error("[cms:saveHomeSeo]", error);
      return;
    }

    revalidatePath("/");
    revalidateSettingsDashboard();
    await writeAuditLog({
      actorEmail: user.email,
      action: "seo.saved",
      targetType: "site_seo",
      targetId: "/",
      metadata: { canonicalUrl, robotsIndex, sitemapEnabled },
    });
    redirectWithToast("/dashboard/settings/seo", "seo_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) {
      redirect("/auth/login");
    }
    console.error("[cms:saveHomeSeo]", e);
  }
}
