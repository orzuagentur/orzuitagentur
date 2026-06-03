export type WebsiteFormWebhookPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  form_name: string;
};

type SendResult =
  | { sent: true }
  | { sent: false; reason: string };

function getWebhookUrl(): string | null {
  const url = process.env.ORZUAI_WEBSITE_FORMS_WEBHOOK_URL?.trim();
  return url || null;
}

/** Sends a public website form submission to OrzuAI Website Forms. */
export async function sendWebsiteFormsWebhook(
  payload: WebsiteFormWebhookPayload,
): Promise<SendResult> {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) return { sent: false, reason: "no_webhook_url" };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[OrzuAI:website-forms]", res.status, body);
      return { sent: false, reason: "webhook_http" };
    }

    return { sent: true };
  } catch (error) {
    console.error("[OrzuAI:website-forms]", error);
    return { sent: false, reason: "webhook_fetch" };
  }
}
