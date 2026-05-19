"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import {
  portfolioCreateSchema,
  portfolioRowSchema,
  serviceCreateSchema,
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

function readCheckbox(fd: FormData, key: string, fallback = false) {
  const raw = fd.get(key);
  if (raw == null) return fallback;
  return raw === "true" || raw === "on";
}

function readClearImage(fd: FormData) {
  const raw = fd.get("clear_image");
  return raw === "true" || raw === "on";
}

function splitTags(raw: string) {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
}

type SortableTable = "services" | "portfolio_entries" | "testimonials";

function tableFromKind(kind: string): SortableTable | null {
  if (kind === "services") return "services";
  if (kind === "portfolio") return "portfolio_entries";
  if (kind === "testimonials") return "testimonials";
  return null;
}

function dashboardPathForTable(table: SortableTable) {
  if (table === "services") return "/dashboard/services";
  if (table === "portfolio_entries") return "/dashboard/portfolio";
  return "/dashboard/testimonials";
}

function slugify(value: string, fallback: string) {
  const base = value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || fallback;
}

async function uniqueSlug(
  table: "services" | "portfolio_entries",
  preferred: string,
) {
  const supabase = createServiceRoleClient();
  const base = preferred || (table === "services" ? "service" : "project");
  let candidate = base;
  for (let i = 2; i <= 20; i += 1) {
    const { data, error } = await supabase
      .from(table)
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (error) return candidate;
    if (!data) return candidate;
    candidate = `${base}-${i}`;
  }
  return `${base}-${Date.now().toString(36)}`;
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

export async function saveCardSortOrder(formData: FormData): Promise<void> {
  try {
    await guard();
    const table = tableFromKind(str(formData, "kind", 40));
    if (!table) return;

    const updates = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("sort_"))
      .map(([key, value]) => {
        const id = key.slice("sort_".length);
        const order =
          typeof value === "string" ? Number.parseInt(value, 10) : Number.NaN;
        return { id, sort_order: order };
      })
      .filter((row) => row.id && Number.isFinite(row.sort_order));

    if (updates.length === 0) return;

    const supabase = createServiceRoleClient();
    const results = await Promise.all(
      updates.map((row) =>
        supabase
          .from(table)
          .update({ sort_order: row.sort_order })
          .eq("id", row.id),
      ),
    );
    const error = results.find((result) => result.error)?.error;
    if (error) {
      console.error("[cms:saveCardSortOrder]", error);
      return;
    }

    revalidatePath("/");
    const dashboardPath = dashboardPathForTable(table);
    revalidatePath(dashboardPath);
    redirectWithToast(dashboardPath, "sorted");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveCardSortOrder", e);
  }
}

export async function createServiceRow(formData: FormData): Promise<void> {
  try {
    await guard();

    const title = str(formData, "title_de", 400);
    const requestedSlug = str(formData, "slug", 120);
    const slug = await uniqueSlug(
      "services",
      slugify(requestedSlug || title, "service"),
    );

    const parsed = serviceCreateSchema.safeParse({
      slug,
      title_de: title,
      description_de: str(formData, "description_de", 4000) || null,
      body_de: str(formData, "body_de", 20000) || null,
      category_de: str(formData, "category_de", 200) || null,
      project_url: str(formData, "project_url", 500),
      image_url: str(formData, "image_url", 500),
      image_alt: str(formData, "image_alt", 300) || null,
      icon_name: str(formData, "icon_name", 120) || null,
      tags: splitTags(str(formData, "tags", 1000)),
      cta_label: str(formData, "cta_label", 120) || null,
      animation_preset: str(formData, "animation_preset", 80) || null,
      enable_3d: readCheckbox(formData, "enable_3d", true),
      video_url: str(formData, "video_url", 500),
      sort_order: parseIntSafe(str(formData, "sort_order", 12), 0),
      published: readPublished(formData),
    });
    if (!parsed.success) {
      console.warn("[cms:createServiceRow] Validierung fehlgeschlagen.");
      return;
    }

    const row = parsed.data;
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("services").insert({
      slug: row.slug,
      title_de: row.title_de,
      description_de: row.description_de,
      body_de: row.body_de,
      category_de: row.category_de,
      project_url: row.project_url,
      image_url: row.image_url,
      image_alt: row.image_alt,
      icon_name: row.icon_name,
      tags: row.tags,
      cta_label: row.cta_label,
      animation_preset: row.animation_preset,
      enable_3d: row.enable_3d,
      video_url: row.video_url,
      sort_order: row.sort_order,
      published: row.published,
    });

    if (error) {
      console.error("[cms:createServiceRow]", error);
      return;
    }

    revalidatePath("/");
    revalidatePath("/dashboard/services");
    redirectWithToast("/dashboard/services", "created");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("createServiceRow", e);
  }
}

export async function updateServiceRow(formData: FormData): Promise<void> {
  try {
    await guard();

    const parsed = serviceRowSchema.safeParse({
      id: str(formData, "id", 64),
      slug: str(formData, "slug", 120),
      title_de: str(formData, "title_de", 400),
      description_de: str(formData, "description_de", 4000) || null,
      body_de: str(formData, "body_de", 20000) || null,
      category_de: str(formData, "category_de", 200) || null,
      project_url: str(formData, "project_url", 500),
      image_url: str(formData, "image_url", 500),
      image_alt: str(formData, "image_alt", 300) || null,
      icon_name: str(formData, "icon_name", 120) || null,
      tags: splitTags(str(formData, "tags", 1000)),
      cta_label: str(formData, "cta_label", 120) || null,
      animation_preset: str(formData, "animation_preset", 80) || null,
      enable_3d: readCheckbox(formData, "enable_3d"),
      video_url: str(formData, "video_url", 500),
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
        body_de: row.body_de,
        category_de: row.category_de,
        project_url: row.project_url,
        image_url: readClearImage(formData) ? null : row.image_url,
        image_alt: row.image_alt,
        icon_name: row.icon_name,
        tags: row.tags,
        cta_label: row.cta_label,
        animation_preset: row.animation_preset,
        enable_3d: row.enable_3d,
        video_url: row.video_url,
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

export async function deleteServiceRow(formData: FormData): Promise<void> {
  try {
    await guard();
    const id = str(formData, "id", 64);
    if (!id) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      console.error("[cms:deleteServiceRow]", error);
      return;
    }

    revalidatePath("/");
    revalidatePath("/dashboard/services");
    redirectWithToast("/dashboard/services", "deleted");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("deleteServiceRow", e);
  }
}

export async function duplicateServiceRow(formData: FormData): Promise<void> {
  try {
    await guard();
    const id = str(formData, "id", 64);
    if (!id) return;

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("services")
      .select("slug,title_de,description_de,body_de,category_de,project_url,image_url,image_alt,icon_name,tags,cta_label,animation_preset,enable_3d,video_url,sort_order,published")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      console.error("[cms:duplicateServiceRow]", error);
      return;
    }

    const nextSlug = await uniqueSlug("services", `${data.slug}-copy`);
    const { error: insertError } = await supabase.from("services").insert({
      slug: nextSlug,
      title_de: `${data.title_de} Kopie`,
      description_de: data.description_de,
      body_de: data.body_de,
      category_de: data.category_de,
      project_url: data.project_url,
      image_url: data.image_url,
      image_alt: data.image_alt,
      icon_name: data.icon_name,
      tags: data.tags,
      cta_label: data.cta_label,
      animation_preset: data.animation_preset,
      enable_3d: data.enable_3d,
      video_url: data.video_url,
      sort_order: (data.sort_order ?? 0) + 1,
      published: false,
    });

    if (insertError) {
      console.error("[cms:duplicateServiceRow:insert]", insertError);
      return;
    }

    revalidatePath("/");
    revalidatePath("/dashboard/services");
    redirectWithToast("/dashboard/services", "duplicated");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("duplicateServiceRow", e);
  }
}

export async function createPortfolioRow(formData: FormData): Promise<void> {
  try {
    await guard();

    const title = str(formData, "title_de", 400);
    const requestedSlug = str(formData, "slug", 120);
    const slug = await uniqueSlug(
      "portfolio_entries",
      slugify(requestedSlug || title, "project"),
    );

    const parsed = portfolioCreateSchema.safeParse({
      slug,
      title_de: title,
      summary_de: str(formData, "summary_de", 4000) || null,
      body_de: str(formData, "body_de", 20000) || null,
      category_de: str(formData, "category_de", 200) || null,
      project_url: str(formData, "project_url", 500),
      image_url: str(formData, "image_url", 500),
      image_alt: str(formData, "image_alt", 300) || null,
      icon_name: str(formData, "icon_name", 120) || null,
      tags: splitTags(str(formData, "tags", 1000)),
      cta_label: str(formData, "cta_label", 120) || null,
      animation_preset: str(formData, "animation_preset", 80) || null,
      enable_3d: readCheckbox(formData, "enable_3d", true),
      video_url: str(formData, "video_url", 500),
      sort_order: parseIntSafe(str(formData, "sort_order", 12), 0),
      published: readPublished(formData),
    });
    if (!parsed.success) {
      console.warn("[cms:createPortfolioRow] Validierung fehlgeschlagen.");
      return;
    }

    const row = parsed.data;
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("portfolio_entries").insert({
      slug: row.slug,
      title_de: row.title_de,
      summary_de: row.summary_de,
      body_de: row.body_de,
      category_de: row.category_de,
      project_url: row.project_url,
      image_url: row.image_url,
      image_alt: row.image_alt,
      icon_name: row.icon_name,
      tags: row.tags,
      cta_label: row.cta_label,
      animation_preset: row.animation_preset,
      enable_3d: row.enable_3d,
      video_url: row.video_url,
      sort_order: row.sort_order,
      published: row.published,
    });

    if (error) {
      console.error("[cms:createPortfolioRow]", error);
      return;
    }

    revalidatePath("/");
    revalidatePath("/dashboard/portfolio");
    redirectWithToast("/dashboard/portfolio", "created");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("createPortfolioRow", e);
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
      image_url: str(formData, "image_url", 500),
      image_alt: str(formData, "image_alt", 300) || null,
      icon_name: str(formData, "icon_name", 120) || null,
      tags: splitTags(str(formData, "tags", 1000)),
      cta_label: str(formData, "cta_label", 120) || null,
      animation_preset: str(formData, "animation_preset", 80) || null,
      enable_3d: readCheckbox(formData, "enable_3d"),
      video_url: str(formData, "video_url", 500),
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
        image_url: readClearImage(formData) ? null : row.image_url,
        image_alt: row.image_alt,
        icon_name: row.icon_name,
        tags: row.tags,
        cta_label: row.cta_label,
        animation_preset: row.animation_preset,
        enable_3d: row.enable_3d,
        video_url: row.video_url,
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

export async function deletePortfolioRow(formData: FormData): Promise<void> {
  try {
    await guard();
    const id = str(formData, "id", 64);
    const slug = str(formData, "slug", 120);
    if (!id) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("portfolio_entries")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("[cms:deletePortfolioRow]", error);
      return;
    }

    revalidatePath("/");
    if (slug) revalidatePath(`/portfolio/${slug}`);
    revalidatePath("/dashboard/portfolio");
    redirectWithToast("/dashboard/portfolio", "deleted");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("deletePortfolioRow", e);
  }
}

export async function duplicatePortfolioRow(formData: FormData): Promise<void> {
  try {
    await guard();
    const id = str(formData, "id", 64);
    if (!id) return;

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("portfolio_entries")
      .select("slug,title_de,summary_de,body_de,category_de,project_url,image_url,image_alt,icon_name,tags,cta_label,animation_preset,enable_3d,video_url,sort_order,published")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      console.error("[cms:duplicatePortfolioRow]", error);
      return;
    }

    const nextSlug = await uniqueSlug("portfolio_entries", `${data.slug}-copy`);
    const { error: insertError } = await supabase.from("portfolio_entries").insert({
      slug: nextSlug,
      title_de: `${data.title_de} Kopie`,
      summary_de: data.summary_de,
      body_de: data.body_de,
      category_de: data.category_de,
      project_url: data.project_url,
      image_url: data.image_url,
      image_alt: data.image_alt,
      icon_name: data.icon_name,
      tags: data.tags,
      cta_label: data.cta_label,
      animation_preset: data.animation_preset,
      enable_3d: data.enable_3d,
      video_url: data.video_url,
      sort_order: (data.sort_order ?? 0) + 1,
      published: false,
    });

    if (insertError) {
      console.error("[cms:duplicatePortfolioRow:insert]", insertError);
      return;
    }

    revalidatePath("/");
    revalidatePath("/dashboard/portfolio");
    redirectWithToast("/dashboard/portfolio", "duplicated");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("duplicatePortfolioRow", e);
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
