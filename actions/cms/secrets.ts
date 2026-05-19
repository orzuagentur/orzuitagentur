"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { writeAuditLog } from "@/lib/dashboard/audit";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import { SECRET_PROVIDERS, type SecretProvider } from "@/lib/dashboard/secrets";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import { createServiceRoleClient, hasServiceRoleConfig } from "@/lib/supabase/service";

function str(fd: FormData, key: string, max: number) {
  const value = fd.get(key);
  if (typeof value !== "string") return "";
  return value.slice(0, max).trim();
}

function providerFromForm(value: string): SecretProvider | null {
  return SECRET_PROVIDERS.includes(value as SecretProvider)
    ? (value as SecretProvider)
    : null;
}

function maskSecret(value: string) {
  if (!value) return "";
  if (value.length <= 8) return "••••";
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

function encryptSecret(value: string) {
  const keySource = process.env.SECRETS_ENCRYPTION_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const key = crypto.createHash("sha256").update(keySource).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

async function guard() {
  await requireDashboardUser();
  if (!hasServiceRoleConfig()) throw new Error("SERVICE_ROLE");
}

export async function saveSecret(formData: FormData): Promise<void> {
  try {
    const user = await requireDashboardUser();
    await guard();
    const provider = providerFromForm(str(formData, "provider", 40));
    const label = str(formData, "label", 120);
    const value = str(formData, "secret_value", 4000);
    if (!provider || !value) return;

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("api_keys").upsert(
      {
        provider,
        label,
        encrypted_value: encryptSecret(value),
        masked_value: maskSecret(value),
        status: "configured",
        last_rotated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "provider" },
    );

    if (error) {
      console.error("[saveSecret]", error);
      return;
    }

    await writeAuditLog({
      actorEmail: user.email,
      action: "secret.saved",
      targetType: "api_key",
      targetId: provider,
      metadata: { provider, masked: maskSecret(value) },
    });

    revalidatePath("/dashboard/settings/secrets");
    redirectWithToast("/dashboard/settings/secrets", "secret_saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (error instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[saveSecret]", error);
  }
}
