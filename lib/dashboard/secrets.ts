import {
  createServiceRoleClient,
  hasServiceRoleConfig,
} from "@/lib/supabase/service";

export const SECRET_PROVIDERS = [
  "openai",
  "anthropic",
  "telegram",
  "smtp",
  "resend",
  "stripe",
  "supabase",
  "github",
  "vercel",
  "cloudflare",
] as const;

export type SecretProvider = (typeof SECRET_PROVIDERS)[number];

export type SecretRow = {
  provider: SecretProvider;
  label: string;
  masked_value: string | null;
  status: "empty" | "configured" | "rotating" | "disabled";
  last_rotated_at: string | null;
  updated_at: string | null;
};

const LABELS: Record<SecretProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  telegram: "Telegram",
  smtp: "SMTP",
  resend: "Resend",
  stripe: "Stripe",
  supabase: "Supabase",
  github: "GitHub",
  vercel: "Vercel",
  cloudflare: "Cloudflare",
};

export function defaultSecretRows(): SecretRow[] {
  return SECRET_PROVIDERS.map((provider) => ({
    provider,
    label: LABELS[provider],
    masked_value: null,
    status: "empty",
    last_rotated_at: null,
    updated_at: null,
  }));
}

export async function getSecretRows(): Promise<SecretRow[]> {
  const defaults = defaultSecretRows();
  if (!hasServiceRoleConfig()) return defaults;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("provider,label,masked_value,status,last_rotated_at,updated_at");

  if (error) {
    console.error("[getSecretRows]", error);
    return defaults;
  }

  return defaults.map((fallback) => {
    const row = (data ?? []).find((item) => item.provider === fallback.provider);
    return row ? ({ ...fallback, ...row } as SecretRow) : fallback;
  });
}
