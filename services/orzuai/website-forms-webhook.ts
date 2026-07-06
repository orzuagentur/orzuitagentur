export type WebsiteFormWebhookPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source_url?: string;
  form_name?: string;
};

type SendResult =
  | { sent: true }
  | { sent: false; reason: string };

function getWebhookConfig(): { url: string; apiKey: string | null } | null {
  const url = process.env.ORZUAI_WEBSITE_FORMS_WEBHOOK_URL?.trim();
  if (!url) return null;

  const apiKey = process.env.ORZUAI_WEBSITE_FORMS_API_KEY?.trim() || null;
  return { url, apiKey };
}

/** Sends a public website form submission to OrzuAI Website Forms. */
export async function sendWebsiteFormsWebhook(
  payload: WebsiteFormWebhookPayload,
): Promise<SendResult> {
  const config = getWebhookConfig();
  if (!config) return { sent: false, reason: "no_webhook_url" };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (config.apiKey) {
    headers["X-OrzuAI-Api-Key"] = config.apiKey;
  }

  const body: Record<string, string> = {
    name: payload.name,
    email: payload.email,
    message: payload.message,
  };
  if (payload.phone?.trim()) {
    body.phone = payload.phone.trim();
  }
  if (payload.source_url?.trim()) {
    body.source_url = payload.source_url.trim();
  }
  if (payload.form_name?.trim()) {
    body.form_name = payload.form_name.trim();
  }

  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      const responseBody = await res.text().catch(() => "");
      console.error("[OrzuAI:website-forms]", res.status, responseBody);
      return { sent: false, reason: "webhook_http" };
    }

    return { sent: true };
  } catch (error) {
    console.error("[OrzuAI:website-forms]", error);
    return { sent: false, reason: "webhook_fetch" };
  }
}
