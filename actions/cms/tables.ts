"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import {
  portfolioRowSchema,
  serviceRowSchema,
  testimonialCreateSchema,
  testimonialRowSchema,
} from "@/lib/validations/cms-row";
import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

function str(fd: FormData, key: string, max: number) {
  const v = fd.get(key);
  if (typeof v !== "string") return "";
  return v.slice(0, max).trim();
}

function parseIntSafe(raw: string, fallback: number) {
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

function readPublished(fd: FormData) {
  const publishedRaw = fd.get("published");
  return publishedRaw === "true" || publishedRaw === "on";
}

async function guard() {
  await requireDashboardUser();
  if (!hasServiceRoleConfig()) {
    throw new Error("SERVICE_ROLE");
  }
}

function logCmsError(context: string, e: unknown) {
  if (e instanceof DashboardAuthError) {
    console.warn(`[cms:${context}]`, e.message);
    return;
  }
  console.error(`[cms:${context}]`, e);
}

export async function updateServiceRow(formData: FormData): Promise<void> {
  try {
    await guard();

    const parsed = serviceRowSchema.safeParse({
      id: str(formData, "id", 64),
      title_de: str(formData, "title_de", 400),
      description_de: str(formData, "description_de", 4000) || null,
      sort_order: parseIntSafe(str(formData, "sort_order", 12), 0),
      published: readPublished(formData),
    });
    if (!parsed.success) {
      console.warn("[cms:updateServiceRow] Validierung fehlgeschlagen.");
      return;
    }

    const row = parsed.data;
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("services")
      .update({
        title_de: row.title_de,
        description_de: row.description_de,
        sort_order: row.sort_order,
        published: row.published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (error) {
      console.error("[cms:updateServiceRow]", error);
      return;
    }
    revalidatePath("/");
    revalidatePath("/dashboard/services");
    redirectWithToast("/dashboard/services", "updated");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("updateServiceRow", e);
  }
}

export async function updatePortfolioRow(formData: FormData): Promise<void> {
  try {
    await guard();

    const parsed = portfolioRowSchema.safeParse({
      id: str(formData, "id", 64),
      slug: str(formData, "slug", 120),
      title_de: str(formData, "title_de", 400),
      summary_de: str(formData, "summary_de", 4000) || null,
      body_de: str(formData, "body_de", 20000) || null,
      category_de: str(formData, "category_de", 200) || null,
      project_url: str(formData, "project_url", 500),
      sort_order: parseIntSafe(str(formData, "sort_order", 12), 0),
      published: readPublished(formData),
    });
    if (!parsed.success) {
      console.warn("[cms:updatePortfolioRow] Validierung fehlgeschlagen.");
      return;
    }

    const row = parsed.data;
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("portfolio_entries")
      .update({
        title_de: row.title_de,
        summary_de: row.summary_de,
        body_de: row.body_de,
        category_de: row.category_de,
        project_url: row.project_url,
        sort_order: row.sort_order,
        published: row.published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (error) {
      console.error("[cms:updatePortfolioRow]", error);
      return;
    }
    revalidatePath("/");
    revalidatePath(`/portfolio/${row.slug}`);
    revalidatePath("/dashboard/portfolio");
    redirectWithToast("/dashboard/portfolio", "updated");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("updatePortfolioRow", e);
  }
}

export async function createTestimonialRow(formData: FormData): Promise<void> {
  try {
    await guard();

    const parsed = testimonialCreateSchema.safeParse({
      quote_de: str(formData, "quote_de", 4000),
      author_de: str(formData, "author_de", 200),
      role_de: str(formData, "role_de", 200) || null,
      org_de: str(formData, "org_de", 200) || null,
      sort_order: parseIntSafe(str(formData, "sort_order", 12), 0),
      published: readPublished(formData),
    });
    if (!parsed.success) {
      console.warn("[cms:createTestimonialRow] Validierung fehlgeschlagen.");
      return;
    }

    const row = parsed.data;
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("testimonials").insert({
      quote_de: row.quote_de,
      author_de: row.author_de,
      role_de: row.role_de,
      org_de: row.org_de,
      sort_order: row.sort_order,
      published: row.published,
    });

    if (error) {
      console.error("[cms:createTestimonialRow]", error);
      return;
    }
    revalidatePath("/");
    revalidatePath("/dashboard/testimonials");
    redirectWithToast("/dashboard/testimonials", "created");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("createTestimonialRow", e);
  }
}

export async function deleteTestimonialRow(formData: FormData): Promise<void> {
  try {
    await guard();
    const id = str(formData, "id", 64);
    if (!id) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      console.error("[cms:deleteTestimonialRow]", error);
      return;
    }
    revalidatePath("/");
    revalidatePath("/dashboard/testimonials");
    redirectWithToast("/dashboard/testimonials", "deleted");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("deleteTestimonialRow", e);
  }
}

export async function updateTestimonialRow(formData: FormData): Promise<void> {
  try {
    await guard();

    const parsed = testimonialRowSchema.safeParse({
      id: str(formData, "id", 64),
      quote_de: str(formData, "quote_de", 4000),
      author_de: str(formData, "author_de", 200),
      role_de: str(formData, "role_de", 200) || null,
      org_de: str(formData, "org_de", 200) || null,
      sort_order: parseIntSafe(str(formData, "sort_order", 12), 0),
      published: readPublished(formData),
    });
    if (!parsed.success) {
      console.warn("[cms:updateTestimonialRow] Validierung fehlgeschlagen.");
      return;
    }

    const row = parsed.data;
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("testimonials")
      .update({
        quote_de: row.quote_de,
        author_de: row.author_de,
        role_de: row.role_de,
        org_de: row.org_de,
        sort_order: row.sort_order,
        published: row.published,
      })
      .eq("id", row.id);

    if (error) {
      console.error("[cms:updateTestimonialRow]", error);
      return;
    }
    revalidatePath("/");
    revalidatePath("/dashboard/testimonials");
    redirectWithToast("/dashboard/testimonials", "updated");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("updateTestimonialRow", e);
  }
}
