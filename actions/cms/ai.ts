"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { buildLocalAiDraft, AI_DRAFT_KINDS, type AiDraftKind } from "@/lib/dashboard/ai";
import { writeAuditLog } from "@/lib/dashboard/audit";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import { createServiceRoleClient, hasServiceRoleConfig } from "@/lib/supabase/service";

function str(fd: FormData, key: string, max: number) {
  const value = fd.get(key);
  if (typeof value !== "string") return "";
  return value.slice(0, max).trim();
}

function kindFrom(value: string): AiDraftKind {
  return AI_DRAFT_KINDS.includes(value as AiDraftKind)
    ? (value as AiDraftKind)
    : "content";
}

export async function createAiDraft(formData: FormData): Promise<void> {
  try {
    const user = await requireDashboardUser();
    if (!hasServiceRoleConfig()) return;

    const kind = kindFrom(str(formData, "kind", 40));
    const prompt = str(formData, "prompt", 8000);
    if (!prompt) return;

    const output = buildLocalAiDraft(kind, prompt);
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("ai_drafts").insert({
      kind,
      prompt,
      output,
      metadata: {
        mode: "local_baseline",
        providerReady: true,
      },
      created_by: user.email ?? null,
    });
    if (error) {
      console.error("[createAiDraft]", error);
      return;
    }

    await writeAuditLog({
      actorEmail: user.email,
      action: "ai_draft.created",
      targetType: "ai_draft",
      targetId: kind,
      metadata: { mode: "local_baseline" },
    });
    revalidatePath("/dashboard/ai");
    redirectWithToast("/dashboard/ai", "ai_draft_created");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[createAiDraft]", error);
  }
}
