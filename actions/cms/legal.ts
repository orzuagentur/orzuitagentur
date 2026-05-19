"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import {
  loadLegalForAdmin,
  parseSectionsField,
  persistLegal,
} from "@/lib/legal/cms";
import type { LegalOperator } from "@/lib/legal/cms-types";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import { cloneLegalDefault } from "@/lib/legal/defaults";
import { legalContentSchema } from "@/lib/legal/schema";
import type { LegalSection } from "@/lib/legal/types";
import { hasServiceRoleConfig } from "@/lib/supabase/service";

function str(fd: FormData, key: string, max: number) {
  const v = fd.get(key);
  if (typeof v !== "string") return "";
  return v.slice(0, max).trim();
}

function bool(fd: FormData, key: string) {
  return fd.get(key) === "on" || fd.get(key) === "true";
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

function revalidateLegalPaths() {
  revalidatePath("/impressum");
  revalidatePath("/datenschutz");
  revalidatePath("/");
  revalidatePath("/dashboard/legal");
}

function sanitizeSections(sections: LegalSection[]): LegalSection[] {
  return sections
    .map((section) => ({
      ...section,
      id: section.id.trim() || "abschnitt",
      title: section.title.trim(),
      blocks: section.blocks
        .map((block) => {
          if (block.type === "p") {
            return { ...block, text: block.text.trim() };
          }
          if (block.type === "ul") {
            return {
              ...block,
              items: block.items.map((i) => i.trim()).filter(Boolean),
            };
          }
          return {
            ...block,
            lines: block.lines.map((l) => l.trim()).filter(Boolean),
          };
        })
        .filter((block) => {
          if (block.type === "p") return block.text.length > 0;
          if (block.type === "ul") return block.items.length > 0;
          return block.lines.length > 0;
        }),
    }))
    .filter((section) => section.title.length > 0 && section.blocks.length > 0);
}

function parseOperator(fd: FormData): LegalOperator {
  return {
    brand: str(fd, "op_brand", 120),
    company: str(fd, "op_company", 200),
    representative: str(fd, "op_representative", 200),
    addressLine1: str(fd, "op_addressLine1", 300),
    addressLine2: str(fd, "op_addressLine2", 300),
    email: str(fd, "op_email", 200),
    phone: str(fd, "op_phone", 80),
    vatId: str(fd, "op_vatId", 80),
    registerCourt: str(fd, "op_registerCourt", 200),
    registerNumber: str(fd, "op_registerNumber", 80),
  };
}

export async function saveLegalOperator(formData: FormData): Promise<void> {
  try {
    await guard();
    const current = await loadLegalForAdmin();
    const next = {
      ...current,
      operator: parseOperator(formData),
    };
    legalContentSchema.parse(next);
    await persistLegal(next);
    revalidateLegalPaths();
    redirectWithToast("/dashboard/legal", "legal_operator_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveLegalOperator", e);
  }
}

export async function saveLegalImpressum(formData: FormData): Promise<void> {
  try {
    await guard();
    const current = await loadLegalForAdmin();
    const rawSections = parseSectionsField(formData.get("impressum_sections"));
    const sections =
      rawSections.length > 0
        ? sanitizeSections(rawSections)
        : current.impressum.sections;
    const next = {
      ...current,
      impressum: {
        title: str(formData, "impressum_title", 200) || "Impressum",
        intro: str(formData, "impressum_intro", 4000),
        metaDescription: str(formData, "impressum_metaDescription", 500),
        showUpdatedLabel: bool(formData, "impressum_showUpdatedLabel"),
        version: str(formData, "impressum_version", 80) || current.impressum.version,
        updatedAt:
          str(formData, "impressum_updatedAt", 40) ||
          new Date().toISOString().slice(0, 10),
        sections,
      },
    };
    legalContentSchema.parse(next);
    await persistLegal(next);
    revalidateLegalPaths();
    redirectWithToast("/dashboard/legal", "legal_impressum_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveLegalImpressum", e);
  }
}

export async function saveLegalDatenschutz(formData: FormData): Promise<void> {
  try {
    await guard();
    const current = await loadLegalForAdmin();
    const rawSections = parseSectionsField(formData.get("datenschutz_sections"));
    const sections =
      rawSections.length > 0
        ? sanitizeSections(rawSections)
        : current.datenschutz.sections;
    const next = {
      ...current,
      datenschutz: {
        title: str(formData, "datenschutz_title", 200) || "Datenschutzerklärung",
        intro: str(formData, "datenschutz_intro", 4000),
        metaDescription: str(formData, "datenschutz_metaDescription", 500),
        showUpdatedLabel: bool(formData, "datenschutz_showUpdatedLabel"),
        version:
          str(formData, "datenschutz_version", 80) ||
          current.datenschutz.version,
        updatedAt:
          str(formData, "datenschutz_updatedAt", 40) ||
          new Date().toISOString().slice(0, 10),
        sections,
      },
    };
    legalContentSchema.parse(next);
    await persistLegal(next);
    revalidateLegalPaths();
    redirectWithToast("/dashboard/legal", "legal_datenschutz_saved");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("saveLegalDatenschutz", e);
  }
}

export async function resetLegalToDefaults(formData: FormData): Promise<void> {
  const target = str(formData, "reset_target", 20);
  try {
    await guard();
    const defaults = cloneLegalDefault();
    const current = await loadLegalForAdmin();

    let next = current;
    if (target === "all") {
      next = defaults;
    } else if (target === "operator") {
      next = { ...current, operator: { ...defaults.operator } };
    } else if (target === "impressum") {
      next = { ...current, impressum: { ...defaults.impressum } };
    } else if (target === "datenschutz") {
      next = { ...current, datenschutz: { ...defaults.datenschutz } };
    }

    legalContentSchema.parse(next);
    await persistLegal(next);
    revalidateLegalPaths();
    redirectWithToast("/dashboard/legal", "legal_reset");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    logCmsError("resetLegalToDefaults", e);
  }
}
