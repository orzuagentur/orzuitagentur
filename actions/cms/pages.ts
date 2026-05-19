"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import { buildPagePath, getDynamicPages } from "@/lib/dashboard/pages";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import { createServiceRoleClient, hasServiceRoleConfig } from "@/lib/supabase/service";
import { pageCreateSchema, pageRowSchema } from "@/lib/validations/pages";

function str(fd: FormData, key: string, max: number) {
  const value = fd.get(key);
  if (typeof value !== "string") return "";
  return value.slice(0, max).trim();
}

function nullableStr(fd: FormData, key: string, max: number) {
  const value = str(fd, key, max);
  return value || null;
}

function bool(fd: FormData, key: string, fallback = false) {
  const raw = fd.get(key);
  if (raw === null) return fallback;
  return raw === "on" || raw === "true";
}

function jsonObject(fd: FormData, key: string) {
  const value = str(fd, key, 12000);
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function intValue(fd: FormData, key: string, fallback: number) {
  const value = Number.parseInt(str(fd, key, 12), 10);
  return Number.isFinite(value) ? value : fallback;
}

function slugify(value: string, fallback: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return slug || fallback;
}

async function guard() {
  await requireDashboardUser();
  if (!hasServiceRoleConfig()) throw new Error("SERVICE_ROLE");
}

function logPageError(context: string, error: unknown) {
  if (error instanceof DashboardAuthError) {
    console.warn(`[pages:${context}]`, error.message);
    return;
  }
  console.error(`[pages:${context}]`, error);
}

async function uniqueSlug(preferred: string, locale: string, ignoreId?: string) {
  const supabase = createServiceRoleClient();
  const base = slugify(preferred, "seite");
  let candidate = base;

  for (let i = 2; i <= 25; i += 1) {
    let query = supabase
      .from("pages")
      .select("id")
      .eq("slug", candidate)
      .eq("locale", locale);
    if (ignoreId) query = query.neq("id", ignoreId);
    const { data, error } = await query.maybeSingle();
    if (error || !data) return candidate;
    candidate = `${base}-${i}`;
  }

  return `${base}-${Date.now().toString(36)}`;
}

function readPageForm(formData: FormData, id?: string) {
  const locale = str(formData, "locale", 8) || "de";
  const title = str(formData, "title_de", 300);
  const requestedSlug = str(formData, "slug", 120) || title;
  return {
    id,
    parent_id: nullableStr(formData, "parent_id", 64),
    slug: requestedSlug,
    title_de: title,
    title_en: nullableStr(formData, "title_en", 300),
    locale,
    status: str(formData, "status", 20) || "draft",
    template: str(formData, "template", 20) || "blank",
    excerpt_de: nullableStr(formData, "excerpt_de", 1000),
    body_de: nullableStr(formData, "body_de", 40000),
    meta_description_de: nullableStr(formData, "meta_description_de", 500),
    seo_title: nullableStr(formData, "seo_title", 160),
    seo_description: nullableStr(formData, "seo_description", 500),
    canonical_url: nullableStr(formData, "canonical_url", 1000),
    robots_index: bool(formData, "robots_index", true),
    schema_json: jsonObject(formData, "schema_json"),
    og_image_url: nullableStr(formData, "og_image_url", 1000),
    og_generated_prompt: nullableStr(formData, "og_generated_prompt", 1000),
    sitemap_enabled: bool(formData, "sitemap_enabled", true),
    scheduled_at: nullableStr(formData, "scheduled_at", 80),
    sort_order: intValue(formData, "sort_order", 0),
  };
}

export async function createDynamicPage(formData: FormData): Promise<void> {
  try {
    await guard();
    const raw = readPageForm(formData);
    const slug = await uniqueSlug(raw.slug, raw.locale);
    const parsed = pageCreateSchema.safeParse({ ...raw, slug });
    if (!parsed.success) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("pages").insert(parsed.data);
    if (error) {
      console.error("[pages:create]", error);
      return;
    }

    revalidatePath("/dashboard/pages");
    redirectWithToast("/dashboard/pages", "page_created");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    logPageError("create", error);
  }
}

export async function updateDynamicPage(formData: FormData): Promise<void> {
  try {
    await guard();
    const raw = readPageForm(formData, str(formData, "id", 64));
    const slug = await uniqueSlug(raw.slug, raw.locale, raw.id);
    const parsed = pageRowSchema.safeParse({ ...raw, slug });
    if (!parsed.success) return;

    const row = parsed.data;
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("pages")
      .update({
        parent_id: row.parent_id,
        slug: row.slug,
        title_de: row.title_de,
        title_en: row.title_en,
        locale: row.locale,
        status: row.status,
        template: row.template,
        excerpt_de: row.excerpt_de,
        body_de: row.body_de,
        meta_description_de: row.meta_description_de,
        seo_title: row.seo_title,
        seo_description: row.seo_description,
        canonical_url: row.canonical_url,
        robots_index: row.robots_index,
        schema_json: row.schema_json,
        og_image_url: row.og_image_url,
        og_generated_prompt: row.og_generated_prompt,
        sitemap_enabled: row.sitemap_enabled,
        scheduled_at: row.scheduled_at,
        sort_order: row.sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    if (error) {
      console.error("[pages:update]", error);
      return;
    }

    const pages = await getDynamicPages();
    revalidatePath(buildPagePath(row, pages));
    revalidatePath("/dashboard/pages");
    redirectWithToast("/dashboard/pages", "page_updated");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    logPageError("update", error);
  }
}

export async function deleteDynamicPage(formData: FormData): Promise<void> {
  try {
    await guard();
    const id = str(formData, "id", 64);
    if (!id) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) {
      console.error("[pages:delete]", error);
      return;
    }

    revalidatePath("/dashboard/pages");
    redirectWithToast("/dashboard/pages", "page_deleted");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    logPageError("delete", error);
  }
}

export async function duplicateDynamicPage(formData: FormData): Promise<void> {
  try {
    await guard();
    const id = str(formData, "id", 64);
    if (!id) return;

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("pages")
      .select("parent_id,slug,title_de,title_en,locale,template,excerpt_de,body_de,meta_description_de,seo_title,seo_description,canonical_url,robots_index,schema_json,og_image_url,og_generated_prompt,sitemap_enabled,sort_order")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) {
      console.error("[pages:duplicate]", error);
      return;
    }

    const slug = await uniqueSlug(`${data.slug}-copy`, data.locale);
    const { error: insertError } = await supabase.from("pages").insert({
      ...data,
      slug,
      title_de: `${data.title_de} Kopie`,
      status: "draft",
      scheduled_at: null,
      sort_order: (data.sort_order ?? 0) + 1,
    });
    if (insertError) {
      console.error("[pages:duplicate:insert]", insertError);
      return;
    }

    revalidatePath("/dashboard/pages");
    redirectWithToast("/dashboard/pages", "page_duplicated");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    logPageError("duplicate", error);
  }
}
