"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { isVercelApiReady } from "@/lib/vercel/config";
import { deleteProjectEnvVar, upsertProjectEnvVar } from "@/lib/vercel/env";

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

function readTargets(fd: FormData): ("production" | "preview" | "development")[] {
  const targets: ("production" | "preview" | "development")[] = [];
  if (fd.get("targetProduction") === "on") targets.push("production");
  if (fd.get("targetPreview") === "on") targets.push("preview");
  if (fd.get("targetDevelopment") === "on") targets.push("development");
  return targets.length > 0 ? targets : ["production"];
}

export async function upsertVercelEnv(formData: FormData) {
  try {
    await requireDashboardUser();

    if (!isVercelApiReady()) {
      redirect("/dashboard/deploy?error=not_configured");
    }

    const parsed = envUpsertSchema.safeParse({
      key: formData.get("key"),
      value: formData.get("value"),
      sensitive: formData.get("sensitive") === "on",
    });

    if (!parsed.success) {
      redirect("/dashboard/deploy?error=env_validation");
    }

    const targets = readTargets(formData);

    await upsertProjectEnvVar({
      key: parsed.data.key,
      value: parsed.data.value,
      targets,
      sensitive: parsed.data.sensitive,
    });

    revalidatePath("/dashboard/deploy");
    redirect("/dashboard/deploy?env_saved=1");
  } catch (e) {
    if (e instanceof DashboardAuthError) {
      redirect("/auth/login");
    }
    if (e && typeof e === "object" && "digest" in e) {
      const digest = String((e as { digest?: string }).digest ?? "");
      if (digest.startsWith("NEXT_REDIRECT")) throw e;
    }
    console.error("[vercel:upsertEnv]", e);
    redirect("/dashboard/deploy?error=env_api");
  }
}

export async function deleteVercelEnv(formData: FormData) {
  try {
    await requireDashboardUser();

    if (!isVercelApiReady()) {
      redirect("/dashboard/deploy?error=not_configured");
    }

    const id = formData.get("envId");
    if (typeof id !== "string" || !id.trim()) {
      redirect("/dashboard/deploy?error=env_validation");
    }

    await deleteProjectEnvVar(id.trim());
    revalidatePath("/dashboard/deploy");
    redirect("/dashboard/deploy?env_deleted=1");
  } catch (e) {
    if (e instanceof DashboardAuthError) {
      redirect("/auth/login");
    }
    if (e && typeof e === "object" && "digest" in e) {
      const digest = String((e as { digest?: string }).digest ?? "");
      if (digest.startsWith("NEXT_REDIRECT")) throw e;
    }
    console.error("[vercel:deleteEnv]", e);
    redirect("/dashboard/deploy?error=env_api");
  }
}
