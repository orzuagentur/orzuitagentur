import type { LeadInput } from "@/lib/validations/lead";

export async function sendLeadTelegram(data: LeadInput) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { sent: false as const, reason: "no_config" };

  const companyLine = data.company?.trim() ? data.company.trim() : "—";
  const text = [
    "Neue OrzuIT-Anfrage",
    "",
    `Name: ${data.name}`,
    `E-Mail: ${data.email}`,
    `Telefon: ${data.phone}`,
    `Leistung: ${data.serviceInterest}`,
    `Unternehmen: ${companyLine}`,
    "",
    data.message.length > 3500
      ? `${data.message.slice(0, 3500)}…`
      : data.message,
  ].join("\n");

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    console.error("[Telegram]", await res.text());
    return { sent: false as const, reason: "telegram_http" };
  }

  return { sent: true as const };
}
