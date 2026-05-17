"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { redirectWithToast } from "@/lib/dashboard/redirect-with-toast";
import { isNextRedirectError } from "@/lib/navigation/is-next-redirect";
import { isVercelApiReady } from "@/lib/vercel/config";
import {
  addProjectDomain,
  removeProjectDomain,
  verifyProjectDomain,
} from "@/lib/vercel/domains";

const domainSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/,
    "Ungültige Domain",
  );

function revalidateDomains() {
  revalidatePath("/dashboard/domains");
  revalidatePath("/dashboard/deploy");
}

export async function addVercelDomain(formData: FormData) {
  try {
    await requireDashboardUser();

    if (!isVercelApiReady()) {
      redirectWithToast("/dashboard/domains", "not_configured", "error");
    }

    const parsed = domainSchema.safeParse(formData.get("domain"));
    if (!parsed.success) {
      redirectWithToast("/dashboard/domains", "domain_validation", "error");
    }

    const redirectTo = formData.get("redirect");
    const redirectTarget =
      typeof redirectTo === "string" && redirectTo.trim() !== ""
        ? redirectTo.trim().toLowerCase()
        : undefined;

    await addProjectDomain(parsed.data, { redirect: redirectTarget });
    revalidateDomains();
    redirectWithToast("/dashboard/domains", "domain_added");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[vercel:addDomain]", e);
    redirectWithToast("/dashboard/domains", "domain_api", "error");
  }
}

export async function removeVercelDomain(formData: FormData) {
  try {
    await requireDashboardUser();

    if (!isVercelApiReady()) {
      redirectWithToast("/dashboard/domains", "not_configured", "error");
    }

    const parsed = domainSchema.safeParse(formData.get("domain"));
    if (!parsed.success) {
      redirectWithToast("/dashboard/domains", "domain_validation", "error");
    }

    await removeProjectDomain(parsed.data);
    revalidateDomains();
    redirectWithToast("/dashboard/domains", "domain_removed");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[vercel:removeDomain]", e);
    redirectWithToast("/dashboard/domains", "domain_api", "error");
  }
}

export async function verifyVercelDomain(formData: FormData) {
  try {
    await requireDashboardUser();

    if (!isVercelApiReady()) {
      redirectWithToast("/dashboard/domains", "not_configured", "error");
    }

    const parsed = domainSchema.safeParse(formData.get("domain"));
    if (!parsed.success) {
      redirectWithToast("/dashboard/domains", "domain_validation", "error");
    }

    await verifyProjectDomain(parsed.data);
    revalidateDomains();
    redirectWithToast("/dashboard/domains", "domain_verified");
  } catch (e) {
    if (isNextRedirectError(e)) throw e;
    if (e instanceof DashboardAuthError) redirect("/auth/login");
    console.error("[vercel:verifyDomain]", e);
    redirectWithToast("/dashboard/domains", "domain_verify_failed", "error");
  }
}
