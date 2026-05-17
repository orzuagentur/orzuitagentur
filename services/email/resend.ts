import { Resend } from "resend";
import type { LeadInput } from "@/lib/validations/lead";

export type LeadConfirmationCopy = {
  successTitle: string;
  successBody: string;
  teamEmail: string;
  responseTime: string;
};

type SendResult =
  | { sent: true }
  | { sent: false; reason: string };

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  const from =
    process.env.RESEND_FROM_EMAIL ?? "OrzuIT <onboarding@resend.dev>";

  return { apiKey, from, resend: new Resend(apiKey) };
}

export async function sendLeadEmail(data: LeadInput): Promise<SendResult> {
  const config = getResendConfig();
  if (!config) return { sent: false, reason: "no_api_key" };

  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!to) return { sent: false, reason: "no_recipient" };

  const companyLine = data.company?.trim() ? data.company.trim() : "—";

  const { error } = await config.resend.emails.send({
    from: config.from,
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
    console.error("[Resend:team]", error);
    return { sent: false, reason: "resend_error" };
  }

  return { sent: true };
}

export async function sendLeadConfirmationEmail(
  data: LeadInput,
  copy: LeadConfirmationCopy,
): Promise<SendResult> {
  const config = getResendConfig();
  if (!config) return { sent: false, reason: "no_api_key" };

  const teamEmail = copy.teamEmail.trim() || process.env.LEAD_NOTIFY_EMAIL;
  const replyTo = teamEmail ? [teamEmail] : undefined;

  const subject = copy.successTitle.trim() || "Ihre Anfrage bei OrzuIT";

  const bodyIntro = [
    `Hallo ${data.name},`,
    "",
    copy.successTitle,
    "",
    `${copy.successBody.trim()}${teamEmail ?? ""}.`,
    "",
    copy.responseTime ? copy.responseTime : "Wir melden uns zeitnah bei Ihnen.",
    "",
    "— Ihre übermittelte Nachricht —",
    data.message,
    "",
    "Mit freundlichen Grüßen",
    "OrzuIT",
  ].join("\n");

  const { error } = await config.resend.emails.send({
    from: config.from,
    to: [data.email],
    replyTo,
    subject,
    text: bodyIntro,
  });

  if (error) {
    console.error("[Resend:confirmation]", error);
    return { sent: false, reason: "resend_error" };
  }

  return { sent: true };
}
