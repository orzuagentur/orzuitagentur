"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import {
  DEFAULT_SECTION_ANIMATION,
  DEFAULT_SECTION_LAYOUT,
  DEFAULT_SECTION_RESPONSIVE,
  PAGE_BLOCK_TYPES,
  type PageBlockType,
} from "@/lib/page-builder/types";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import { createServiceRoleClient, hasServiceRoleConfig } from "@/lib/supabase/service";

function str(fd: FormData, key: string, max: number) {
  const value = fd.get(key);
  if (typeof value !== "string") return "";
  return value.slice(0, max).trim();
}

function bool(fd: FormData, key: string) {
  const raw = fd.get(key);
  return raw === "true" || raw === "on";
}

function intValue(fd: FormData, key: string, fallback: number) {
  const value = Number.parseInt(str(fd, key, 12), 10);
  return Number.isFinite(value) ? value : fallback;
}

function blockType(value: string): PageBlockType {
  return PAGE_BLOCK_TYPES.includes(value as PageBlockType)
    ? (value as PageBlockType)
    : "markdown";
}

async function guard() {
  await requireDashboardUser();
  if (!hasServiceRoleConfig()) throw new Error("SERVICE_ROLE");
}

function builderPath(pageId: string) {
  return `/dashboard/pages/${pageId}/builder`;
}

function revalidateBuilder(pageId: string) {
  revalidatePath("/");
  revalidatePath("/dashboard/pages");
  revalidatePath(builderPath(pageId));
}

function layoutFromForm(fd: FormData) {
  return {
    paddingTop: str(fd, "layout_paddingTop", 40) || DEFAULT_SECTION_LAYOUT.paddingTop,
    paddingBottom:
      str(fd, "layout_paddingBottom", 40) || DEFAULT_SECTION_LAYOUT.paddingBottom,
    marginTop: str(fd, "layout_marginTop", 40) || DEFAULT_SECTION_LAYOUT.marginTop,
    background: str(fd, "layout_background", 120) || DEFAULT_SECTION_LAYOUT.background,
    gradient: str(fd, "layout_gradient", 500) || DEFAULT_SECTION_LAYOUT.gradient,
  };
}

function responsiveFromForm(fd: FormData) {
  return {
    mobile: str(fd, "responsive_mobile", 40) || DEFAULT_SECTION_RESPONSIVE.mobile,
    tablet: str(fd, "responsive_tablet", 40) || DEFAULT_SECTION_RESPONSIVE.tablet,
    desktop: str(fd, "responsive_desktop", 40) || DEFAULT_SECTION_RESPONSIVE.desktop,
  };
}

function animationFromForm(fd: FormData) {
  return {
    preset: str(fd, "animation_preset", 40) || DEFAULT_SECTION_ANIMATION.preset,
    intensity:
      str(fd, "animation_intensity", 40) || DEFAULT_SECTION_ANIMATION.intensity,
    scroll: bool(fd, "animation_scroll"),
  };
}

function settingsFromForm(fd: FormData) {
  return {
    buttonLabel: str(fd, "settings_buttonLabel", 120),
    buttonHref: str(fd, "settings_buttonHref", 300),
    sandbox: bool(fd, "settings_sandbox"),
    reactKey: str(fd, "settings_reactKey", 120),
  };
}

function logBuilderError(context: string, error: unknown) {
  if (error instanceof DashboardAuthError) {
    console.warn(`[page-builder:${context}]`, error.message);
    return;
  }
  console.error(`[page-builder:${context}]`, error);
}

export async function createPageSection(formData: FormData): Promise<void> {
  const pageId = str(formData, "page_id", 64);
  try {
    await guard();
    if (!pageId) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("page_sections").insert({
      page_id: pageId,
      title_de: str(formData, "title_de", 300) || "Neue Sektion",
      section_key: str(formData, "section_key", 120) || "section",
      visible: bool(formData, "visible"),
      sort_order: intValue(formData, "sort_order", 0),
      layout: layoutFromForm(formData),
      responsive: responsiveFromForm(formData),
      animation: animationFromForm(formData),
    });
    if (error) {
      console.error("[page-builder:createSection]", error);
      return;
    }

    revalidateBuilder(pageId);
    redirectWithToast(builderPath(pageId), "section_created");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    logBuilderError("createSection", error);
  }
}

export async function updatePageSection(formData: FormData): Promise<void> {
  const pageId = str(formData, "page_id", 64);
  try {
    await guard();
    const id = str(formData, "id", 64);
    if (!pageId || !id) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("page_sections")
      .update({
        title_de: str(formData, "title_de", 300) || "Sektion",
        section_key: str(formData, "section_key", 120) || "section",
        visible: bool(formData, "visible"),
        sort_order: intValue(formData, "sort_order", 0),
        layout: layoutFromForm(formData),
        responsive: responsiveFromForm(formData),
        animation: animationFromForm(formData),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      console.error("[page-builder:updateSection]", error);
      return;
    }

    revalidateBuilder(pageId);
    redirectWithToast(builderPath(pageId), "section_updated");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    logBuilderError("updateSection", error);
  }
}

export async function deletePageSection(formData: FormData): Promise<void> {
  const pageId = str(formData, "page_id", 64);
  try {
    await guard();
    const id = str(formData, "id", 64);
    if (!pageId || !id) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("page_sections").delete().eq("id", id);
    if (error) {
      console.error("[page-builder:deleteSection]", error);
      return;
    }

    revalidateBuilder(pageId);
    redirectWithToast(builderPath(pageId), "section_deleted");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    logBuilderError("deleteSection", error);
  }
}

export async function duplicatePageSection(formData: FormData): Promise<void> {
  const pageId = str(formData, "page_id", 64);
  try {
    await guard();
    const id = str(formData, "id", 64);
    if (!pageId || !id) return;

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("page_sections")
      .select("title_de,section_key,visible,sort_order,layout,responsive,animation")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return;

    const { error: insertError } = await supabase.from("page_sections").insert({
      ...data,
      page_id: pageId,
      title_de: `${data.title_de} Kopie`,
      visible: false,
      sort_order: (data.sort_order ?? 0) + 1,
    });
    if (insertError) {
      console.error("[page-builder:duplicateSection]", insertError);
      return;
    }

    revalidateBuilder(pageId);
    redirectWithToast(builderPath(pageId), "section_duplicated");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    logBuilderError("duplicateSection", error);
  }
}

export async function createPageBlock(formData: FormData): Promise<void> {
  const pageId = str(formData, "page_id", 64);
  try {
    await guard();
    const sectionId = str(formData, "section_id", 64);
    if (!pageId || !sectionId) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("page_blocks").insert({
      section_id: sectionId,
      block_type: blockType(str(formData, "block_type", 40)),
      title_de: str(formData, "title_de", 300) || "Neuer Block",
      content_de: str(formData, "content_de", 40000) || null,
      visible: bool(formData, "visible"),
      sort_order: intValue(formData, "sort_order", 0),
      settings: settingsFromForm(formData),
    });
    if (error) {
      console.error("[page-builder:createBlock]", error);
      return;
    }

    revalidateBuilder(pageId);
    redirectWithToast(builderPath(pageId), "block_created");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    logBuilderError("createBlock", error);
  }
}

export async function updatePageBlock(formData: FormData): Promise<void> {
  const pageId = str(formData, "page_id", 64);
  try {
    await guard();
    const id = str(formData, "id", 64);
    if (!pageId || !id) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("page_blocks")
      .update({
        block_type: blockType(str(formData, "block_type", 40)),
        title_de: str(formData, "title_de", 300) || "Block",
        content_de: str(formData, "content_de", 40000) || null,
        visible: bool(formData, "visible"),
        sort_order: intValue(formData, "sort_order", 0),
        settings: settingsFromForm(formData),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      console.error("[page-builder:updateBlock]", error);
      return;
    }

    revalidateBuilder(pageId);
    redirectWithToast(builderPath(pageId), "block_updated");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    logBuilderError("updateBlock", error);
  }
}

export async function deletePageBlock(formData: FormData): Promise<void> {
  const pageId = str(formData, "page_id", 64);
  try {
    await guard();
    const id = str(formData, "id", 64);
    if (!pageId || !id) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("page_blocks").delete().eq("id", id);
    if (error) {
      console.error("[page-builder:deleteBlock]", error);
      return;
    }

    revalidateBuilder(pageId);
    redirectWithToast(builderPath(pageId), "block_deleted");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    logBuilderError("deleteBlock", error);
  }
}

export async function duplicatePageBlock(formData: FormData): Promise<void> {
  const pageId = str(formData, "page_id", 64);
  try {
    await guard();
    const id = str(formData, "id", 64);
    if (!pageId || !id) return;

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("page_blocks")
      .select("section_id,block_type,title_de,content_de,visible,sort_order,settings")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return;

    const { error: insertError } = await supabase.from("page_blocks").insert({
      ...data,
      title_de: `${data.title_de} Kopie`,
      visible: false,
      sort_order: (data.sort_order ?? 0) + 1,
    });
    if (insertError) {
      console.error("[page-builder:duplicateBlock]", insertError);
      return;
    }

    revalidateBuilder(pageId);
    redirectWithToast(builderPath(pageId), "block_duplicated");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    logBuilderError("duplicateBlock", error);
  }
}
