"use server";

import { revalidatePath } from "next/cache";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
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
    await requireDashboardUser();
    if (!hasServiceRoleConfig()) {
      console.warn("[cms:saveHomeSeo] Service-Role nicht konfiguriert.");
      return;
    }

    const title = str(formData, "seo_title", 120);
    const description = str(formData, "seo_description", 320);
    const ogRaw = str(formData, "seo_ogImageUrl", 2000);
    const ogImageUrl = ogRaw === "" ? null : ogRaw;

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
        updated_at: new Date().toISOString(),
      },
      { onConflict: "path" },
    );
    if (error) {
      console.error("[cms:saveHomeSeo]", error);
      return;
    }

    revalidatePath("/");
    revalidatePath("/dashboard/seo");
  } catch (e) {
    if (e instanceof DashboardAuthError) {
      console.warn("[cms:saveHomeSeo]", e.message);
      return;
    }
    console.error("[cms:saveHomeSeo]", e);
  }
}
