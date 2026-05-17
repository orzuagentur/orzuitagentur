"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { isVercelApiReady } from "@/lib/vercel/config";
import { addProjectDomain } from "@/lib/vercel/domains";

const domainSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/,
    "Ungültige Domain",
  );

export async function addVercelDomain(formData: FormData) {
  try {
    await requireDashboardUser();

    if (!isVercelApiReady()) {
      redirect("/dashboard/deploy?error=not_configured");
    }

    const parsed = domainSchema.safeParse(formData.get("domain"));
    if (!parsed.success) {
      redirect("/dashboard/deploy?error=domain_validation");
    }

    await addProjectDomain(parsed.data);
    revalidatePath("/dashboard/deploy");
    redirect("/dashboard/deploy?domain_added=1");
  } catch (e) {
    if (e instanceof DashboardAuthError) {
      redirect("/auth/login");
    }
    if (e && typeof e === "object" && "digest" in e) {
      const digest = String((e as { digest?: string }).digest ?? "");
      if (digest.startsWith("NEXT_REDIRECT")) throw e;
    }
    console.error("[vercel:addDomain]", e);
    redirect("/dashboard/deploy?error=domain_api");
  }
}
