"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import {
  SEED_HOME_SEO,
  SEED_LEGAL_VALUE,
  SEED_MARKETING_VALUE,
  SEED_PORTFOLIO,
  SEED_SERVICES,
  SEED_TESTIMONIALS,
} from "@/lib/cms/seed-content";
import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

async function tableCount(table: "services" | "portfolio_entries" | "testimonials") {
  const supabase = createServiceRoleClient();
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function seedCmsContent(formData: FormData) {
  const returnRaw = formData.get("returnTo");
  const returnTo =
    typeof returnRaw === "string" && returnRaw.startsWith("/dashboard")
      ? returnRaw
      : "/dashboard/services";

  try {
    await requireDashboardUser();

    if (!hasServiceRoleConfig()) {
      redirect(`${returnTo}?seed_error=service_role`);
    }

    const supabase = createServiceRoleClient();
    const inserted: string[] = [];

    if ((await tableCount("services")) === 0) {
      const { error } = await supabase.from("services").insert(SEED_SERVICES);
      if (error) throw error;
      inserted.push("services");
    }

    if ((await tableCount("portfolio_entries")) === 0) {
      const { error } = await supabase.from("portfolio_entries").insert(SEED_PORTFOLIO);
      if (error) throw error;
      inserted.push("portfolio");
    }

    if ((await tableCount("testimonials")) === 0) {
      const { error } = await supabase.from("testimonials").insert(SEED_TESTIMONIALS);
      if (error) throw error;
      inserted.push("testimonials");
    }

    const { data: marketingRow } = await supabase
      .from("site_settings")
      .select("key")
      .eq("key", "marketing")
      .maybeSingle();

    if (!marketingRow) {
      const { error } = await supabase.from("site_settings").upsert({
        key: "marketing",
        value: SEED_MARKETING_VALUE as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      inserted.push("marketing");
    }

    const { data: legalRow } = await supabase
      .from("site_settings")
      .select("key")
      .eq("key", "legal")
      .maybeSingle();

    if (!legalRow) {
      const { error } = await supabase.from("site_settings").upsert({
        key: "legal",
        value: SEED_LEGAL_VALUE as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      inserted.push("legal");
    }

    const { data: seoRow } = await supabase
      .from("site_seo")
      .select("path")
      .eq("path", "/")
      .maybeSingle();

    if (!seoRow) {
      const { error } = await supabase.from("site_seo").upsert({
        ...SEED_HOME_SEO,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      inserted.push("seo");
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/services");
    revalidatePath("/dashboard/portfolio");
    revalidatePath("/dashboard/testimonials");
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard/legal");
    revalidatePath("/impressum");
    revalidatePath("/datenschutz");
    revalidatePath("/dashboard/seo");

    if (inserted.length === 0) {
      redirect(`${returnTo}?seed_info=already`);
    }

    redirect(`${returnTo}?seeded=1`);
  } catch (e) {
    if (e instanceof DashboardAuthError) {
      redirect("/auth/login");
    }
    if (e && typeof e === "object" && "digest" in e) {
      const digest = String((e as { digest?: string }).digest ?? "");
      if (digest.startsWith("NEXT_REDIRECT")) throw e;
    }
    console.error("[cms:seed]", e);
    redirect(`${returnTo}?seed_error=db`);
  }
}
