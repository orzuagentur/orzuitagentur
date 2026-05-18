import { cache } from "react";
import { z } from "zod";
import { deepMerge } from "@/lib/cms/merge";
import { DEFAULT_LEGAL, cloneLegalDefault } from "@/lib/legal/defaults";
import type { LegalContent } from "@/lib/legal/cms-types";
import { legalContentSchema, legalSectionSchema } from "@/lib/legal/schema";
import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function hasPublicSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function legalFromRow(raw: unknown): LegalContent {
  const base = cloneLegalDefault();
  if (!raw || typeof raw !== "object") {
    const parsed = legalContentSchema.safeParse(base);
    return parsed.success ? parsed.data : DEFAULT_LEGAL;
  }
  const merged = deepMerge(
    base as unknown as Record<string, unknown>,
    raw as Record<string, unknown>,
  );
  const parsed = legalContentSchema.safeParse(merged);
  return parsed.success ? parsed.data : DEFAULT_LEGAL;
}

export const getLegalContent = cache(async (): Promise<LegalContent> => {
  if (!hasPublicSupabaseEnv()) return cloneLegalDefault();
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "legal")
      .maybeSingle();
    if (error || data?.value == null) return cloneLegalDefault();
    return legalFromRow(data.value);
  } catch {
    return cloneLegalDefault();
  }
});

export async function loadLegalForAdmin(): Promise<LegalContent> {
  if (!hasServiceRoleConfig()) return cloneLegalDefault();
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "legal")
    .maybeSingle();
  if (error || data?.value == null) return cloneLegalDefault();
  return legalFromRow(data.value);
}

export async function persistLegal(content: LegalContent) {
  if (!hasServiceRoleConfig()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY fehlt.");
  }
  const parsed = legalContentSchema.parse(content);
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("site_settings").upsert(
    {
      key: "legal",
      value: parsed as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
  if (error) throw error;
}

export function parseSectionsField(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const json: unknown = JSON.parse(raw);
    const parsed = z.array(legalSectionSchema).max(40).safeParse(json);
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}
