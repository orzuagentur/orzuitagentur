"use server";

import { revalidatePath } from "next/cache";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import {
  portfolioRowSchema,
  serviceRowSchema,
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
  } catch (e) {
    logCmsError("updateServiceRow", e);
  }
}

export async function updatePortfolioRow(formData: FormData): Promise<void> {
  try {
    await guard();

    const parsed = portfolioRowSchema.safeParse({
      id: str(formData, "id", 64),
      title_de: str(formData, "title_de", 400),
      summary_de: str(formData, "summary_de", 4000) || null,
      category_de: str(formData, "category_de", 200) || null,
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
        category_de: row.category_de,
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
    revalidatePath("/dashboard/portfolio");
  } catch (e) {
    logCmsError("updatePortfolioRow", e);
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
  } catch (e) {
    logCmsError("updateTestimonialRow", e);
  }
}
