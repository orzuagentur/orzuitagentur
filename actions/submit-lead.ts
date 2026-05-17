"use server";

import { leadSchema, type LeadInput } from "@/lib/validations/lead";
import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";
import { getMarketingContent } from "@/lib/cms/load-public";
import {
  sendLeadConfirmationEmail,
  sendLeadEmail,
} from "@/services/email/resend";
import { sendLeadTelegram } from "@/services/telegram/notify";

async function notifyLead(data: LeadInput) {
  const { contact } = await getMarketingContent();
  await Promise.allSettled([
    sendLeadEmail(data),
    sendLeadConfirmationEmail(data, {
      successTitle: contact.successTitle,
      successBody: contact.successBody,
      teamEmail: contact.email,
      responseTime: contact.responseTime,
    }),
    sendLeadTelegram(data),
  ]);
}

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; error: string };

function normalizeLeadInput(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const o = raw as Record<string, unknown>;
  const companyRaw = o.company;
  const company =
    typeof companyRaw === "string" && companyRaw.trim() !== ""
      ? companyRaw.trim()
      : undefined;

  return {
    name: o.name,
    email: o.email,
    company,
    message: o.message,
    privacyAccepted: o.privacyAccepted,
    source: o.source ?? "website",
  };
}

export async function submitLead(raw: unknown): Promise<SubmitLeadResult> {
  const parsed = leadSchema.safeParse(normalizeLeadInput(raw));
  if (!parsed.success) {
    return { ok: false, error: "Bitte alle Pflichtfelder korrekt ausfüllen." };
  }

  const data: LeadInput = parsed.data;

  if (!hasServiceRoleConfig()) {
    await notifyLead(data);
    return { ok: true };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("leads").insert({
    name: data.name,
    email: data.email,
    company: data.company ?? null,
    message: data.message,
    privacy_accepted: data.privacyAccepted,
    source: data.source,
  });

  if (error) {
    console.error("[leads]", error);
    return {
      ok: false,
      error:
        "Speichern fehlgeschlagen. Bitte später erneut versuchen oder uns direkt per E-Mail erreichen.",
    };
  }

  await notifyLead(data);

  return { ok: true };
}
