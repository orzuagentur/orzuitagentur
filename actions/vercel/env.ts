"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { revalidateSettingsDashboard } from "@/lib/dashboard/revalidate-settings";
import { SETTINGS_DEPLOY_PATH } from "@/lib/dashboard/settings-sections";
import { isVercelApiReady } from "@/lib/vercel/config";
import { deleteProjectEnvVar, upsertProjectEnvVar } from "@/lib/vercel/env";
import {
  VERCEL_ENV_DELETE_COOKIE,
  buildDeleteCookiePayload,
  generateTenDigitCode,
  parseDeletePayload,
  serializeDeletePayload,
  verifyDeleteCode,
} from "@/lib/vercel/delete-confirmation";

const envUpsertSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1)
    .max(256)
    .regex(/^[A-Z][A-Z0-9_]*$/, "Nur GROSSBUCHSTABEN, Ziffern und _"),
  value: z.string().min(1).max(8000),
  sensitive: z.boolean(),
});

const deleteCodeSchema = z.string().regex(/^\d{10}$/, "Genau 10 Ziffern eingeben.");

function readTargets(fd: FormData): ("production" | "preview" | "development")[] {
  const targets: ("production" | "preview" | "development")[] = [];
  if (fd.get("targetProduction") === "on") targets.push("production");
  if (fd.get("targetPreview") === "on") targets.push("preview");
  if (fd.get("targetDevelopment") === "on") targets.push("development");
  return targets.length > 0 ? targets : ["production"];
}

export type IssueDeleteCodeResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

export async function issueDeleteVercelEnvCode(
  envId: string,
  envKey: string,
): Promise<IssueDeleteCodeResult> {
  try {
    await requireDashboardUser();

    if (!isVercelApiReady()) {
      return { ok: false, error: "Vercel API nicht konfiguriert." };
    }

    const id = envId.trim();
    if (!id) {
      return { ok: false, error: "Ungültige Variable." };
    }

    const code = generateTenDigitCode();
    const payload = buildDeleteCookiePayload(id, envKey.trim(), code);
    const cookieStore = await cookies();

    cookieStore.set(VERCEL_ENV_DELETE_COOKIE, serializeDeletePayload(payload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: SETTINGS_DEPLOY_PATH,
    });

    return { ok: true, code };
  } catch (e) {
    if (e instanceof DashboardAuthError) {
      return { ok: false, error: "Nicht angemeldet." };
    }
    console.error("[vercel:issueDeleteCode]", e);
    return { ok: false, error: "Code konnte nicht erstellt werden." };
  }
}

export async function upsertVercelEnv(formData: FormData) {
  try {
    await requireDashboardUser();

    if (!isVercelApiReady()) {
      redirect(`${SETTINGS_DEPLOY_PATH}?error=not_configured`);
    }

    const parsed = envUpsertSchema.safeParse({
      key: formData.get("key"),
      value: formData.get("value"),
      sensitive: formData.get("sensitive") === "on",
    });

    if (!parsed.success) {
      redirect(`${SETTINGS_DEPLOY_PATH}?error=env_validation`);
    }

    const targets = readTargets(formData);

    await upsertProjectEnvVar({
      key: parsed.data.key,
      value: parsed.data.value,
      targets,
      sensitive: parsed.data.sensitive,
    });

    revalidateSettingsDashboard();
    redirect(`${SETTINGS_DEPLOY_PATH}?env_saved=1`);
  } catch (e) {
    if (e instanceof DashboardAuthError) {
      redirect("/auth/login");
    }
    if (e && typeof e === "object" && "digest" in e) {
      const digest = String((e as { digest?: string }).digest ?? "");
      if (digest.startsWith("NEXT_REDIRECT")) throw e;
    }
    console.error("[vercel:upsertEnv]", e);
    redirect(`${SETTINGS_DEPLOY_PATH}?error=env_api`);
  }
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function upsertVercelEnvModal(formData: FormData): Promise<ActionResult> {
  try {
    await requireDashboardUser();

    if (!isVercelApiReady()) {
      return { ok: false, error: "Vercel API nicht konfiguriert." };
    }

    const parsed = envUpsertSchema.safeParse({
      key: formData.get("key"),
      value: formData.get("value"),
      sensitive: formData.get("sensitive") === "on",
    });

    if (!parsed.success) {
      return { ok: false, error: "Ungültige Eingabe." };
    }

    const targets = readTargets(formData);

    await upsertProjectEnvVar({
      key: parsed.data.key,
      value: parsed.data.value,
      targets,
      sensitive: parsed.data.sensitive,
    });

    revalidateSettingsDashboard();
    return { ok: true };
  } catch (e) {
    if (e instanceof DashboardAuthError) {
      return { ok: false, error: "Nicht angemeldet." };
    }
    console.error("[vercel:upsertEnvModal]", e);
    return { ok: false, error: "Speichern fehlgeschlagen." };
  }
}

export async function confirmDeleteVercelEnvModal(
  envId: string,
  confirmCode: string,
): Promise<ActionResult> {
  try {
    await requireDashboardUser();

    if (!isVercelApiReady()) {
      return { ok: false, error: "Vercel API nicht konfiguriert." };
    }

    const id = envId.trim();
    const parsedCode = deleteCodeSchema.safeParse(confirmCode.trim());
    if (!id || !parsedCode.success) {
      return { ok: false, error: "Ungültiger Code oder Variable." };
    }

    const cookieStore = await cookies();
    const raw = cookieStore.get(VERCEL_ENV_DELETE_COOKIE)?.value;
    if (!raw) {
      return { ok: false, error: "Bestätigung abgelaufen. Bitte erneut starten." };
    }

    const payload = parseDeletePayload(raw);
    if (!payload || !verifyDeleteCode(payload, id, parsedCode.data)) {
      return { ok: false, error: "Falscher Code." };
    }

    await deleteProjectEnvVar(id);
    cookieStore.delete(VERCEL_ENV_DELETE_COOKIE);
    revalidateSettingsDashboard();
    return { ok: true };
  } catch (e) {
    if (e instanceof DashboardAuthError) {
      return { ok: false, error: "Nicht angemeldet." };
    }
    console.error("[vercel:confirmDeleteEnvModal]", e);
    return { ok: false, error: "Löschen fehlgeschlagen." };
  }
}

export async function confirmDeleteVercelEnv(formData: FormData) {
  try {
    await requireDashboardUser();

    if (!isVercelApiReady()) {
      redirect(`${SETTINGS_DEPLOY_PATH}?error=not_configured`);
    }

    const envId = formData.get("envId");
    const codeRaw = formData.get("confirmCode");

    if (typeof envId !== "string" || !envId.trim()) {
      redirect(`${SETTINGS_DEPLOY_PATH}?error=env_validation`);
    }

    const parsedCode = deleteCodeSchema.safeParse(
      typeof codeRaw === "string" ? codeRaw.trim() : "",
    );
    if (!parsedCode.success) {
      redirect(`${SETTINGS_DEPLOY_PATH}?error=env_delete_code`);
    }

    const cookieStore = await cookies();
    const raw = cookieStore.get(VERCEL_ENV_DELETE_COOKIE)?.value;
    if (!raw) {
      redirect(`${SETTINGS_DEPLOY_PATH}?error=env_delete_expired`);
    }

    const payload = parseDeletePayload(raw);
    if (!payload || !verifyDeleteCode(payload, envId.trim(), parsedCode.data)) {
      redirect(`${SETTINGS_DEPLOY_PATH}?error=env_delete_code`);
    }

    await deleteProjectEnvVar(envId.trim());
    cookieStore.delete(VERCEL_ENV_DELETE_COOKIE);

    revalidateSettingsDashboard();
    redirect(`${SETTINGS_DEPLOY_PATH}?env_deleted=1`);
  } catch (e) {
    if (e instanceof DashboardAuthError) {
      redirect("/auth/login");
    }
    if (e && typeof e === "object" && "digest" in e) {
      const digest = String((e as { digest?: string }).digest ?? "");
      if (digest.startsWith("NEXT_REDIRECT")) throw e;
    }
    console.error("[vercel:confirmDeleteEnv]", e);
    redirect(`${SETTINGS_DEPLOY_PATH}?error=env_api`);
  }
}
