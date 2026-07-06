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
import { sendWebsiteFormsWebhook } from "@/services/orzuai/website-forms-webhook";

const CONTACT_FORM_NAME = "Kontaktformular";

function buildWebsiteFormMessage(data: LeadInput): string {
  const parts = [data.message];
  if (data.company?.trim()) {
    parts.push(`\n\nUnternehmen: ${data.company.trim()}`);
  }
  if (data.serviceInterest?.trim()) {
    parts.push(`\nGewünschte Leistung: ${data.serviceInterest.trim()}`);
  }
  return parts.join("");
}

async function notifyLead(data: LeadInput, sourceUrl?: string) {
  const { contact } = await getMarketingContent();
  const webhookUrl = contact.webhookUrl?.trim();
  await Promise.allSettled([
    sendLeadEmail(data),
    sendLeadConfirmationEmail(data, {
      successTitle: contact.successTitle,
      successBody: contact.successBody,
      teamEmail: contact.email,
      responseTime: contact.responseTime,
    }),
    sendLeadTelegram(data),
    sendWebsiteFormsWebhook({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: buildWebsiteFormMessage(data),
      source_url: sourceUrl,
      form_name: CONTACT_FORM_NAME,
    }),
    webhookUrl
      ? fetch(webhookUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            event: "lead.created",
            createdAt: new Date().toISOString(),
            lead: data,
          }),
        })
      : Promise.resolve(),
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

  const phoneRaw = o.phone;
  const phone =
    typeof phoneRaw === "string" && phoneRaw.trim() !== ""
      ? phoneRaw.trim()
      : undefined;

  const serviceRaw = o.serviceInterest;
  const serviceInterest =
    typeof serviceRaw === "string" && serviceRaw.trim() !== ""
      ? serviceRaw.trim()
      : undefined;

  return {
    name: o.name,
    email: o.email,
    phone,
    company,
    serviceInterest,
    message: o.message,
    privacyAccepted: o.privacyAccepted,
    source: o.source ?? "website",
  };
}

function extractSourceUrl(raw: unknown): string | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const sourceUrl = (raw as Record<string, unknown>).sourceUrl;
  return typeof sourceUrl === "string" && sourceUrl.trim() !== ""
    ? sourceUrl.trim()
    : undefined;
}

export async function submitLead(raw: unknown): Promise<SubmitLeadResult> {
  const sourceUrl = extractSourceUrl(raw);
  const parsed = leadSchema.safeParse(normalizeLeadInput(raw));
  if (!parsed.success) {
    return { ok: false, error: "Bitte alle Pflichtfelder korrekt ausfüllen." };
  }

  const data: LeadInput = parsed.data;

  if (!hasServiceRoleConfig()) {
    await notifyLead(data, sourceUrl);
    return { ok: true };
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("leads").insert({
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company ?? null,
    service_interest: data.serviceInterest,
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

  await notifyLead(data, sourceUrl);

  return { ok: true };
}
