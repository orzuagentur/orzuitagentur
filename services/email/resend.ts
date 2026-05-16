import { Resend } from "resend";
import type { LeadInput } from "@/lib/validations/lead";

export async function sendLeadEmail(data: LeadInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false as const, reason: "no_api_key" };

  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!to) return { sent: false as const, reason: "no_recipient" };

  const from =
    process.env.RESEND_FROM_EMAIL ?? "OrzuIT <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const companyLine = data.company?.trim() ? data.company.trim() : "—";

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: `Neue Anfrage: ${data.name}`,
    text: [
      `Name: ${data.name}`,
      `E-Mail: ${data.email}`,
      `Unternehmen: ${companyLine}`,
      "",
      data.message,
    ].join("\n"),
  });

  if (error) {
    console.error("[Resend]", error);
    return { sent: false as const, reason: "resend_error" };
  }

  return { sent: true as const };
}
