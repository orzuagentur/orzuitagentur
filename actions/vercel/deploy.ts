"use server";

import { redirect } from "next/navigation";
import { DashboardAuthError, requireDashboardUser } from "@/lib/auth/dashboard-user";
import { triggerRedeploy } from "@/lib/vercel/deployments";
import { SETTINGS_DEPLOY_PATH } from "@/lib/dashboard/settings-sections";
import { isVercelRedeployReady } from "@/lib/vercel/config";

export async function redeployProduction() {
  try {
    await requireDashboardUser();

    if (!isVercelRedeployReady()) {
      redirect(`${SETTINGS_DEPLOY_PATH}?error=not_configured`);
    }

    const result = await triggerRedeploy();
    if (!result.ok) {
      redirect(
        `${SETTINGS_DEPLOY_PATH}?error=deploy&message=${encodeURIComponent(result.message)}`,
      );
    }

    const q = result.deploymentUrl
      ? `&deployment=${encodeURIComponent(result.deploymentUrl)}`
      : "";
    redirect(`${SETTINGS_DEPLOY_PATH}?redeployed=1${q}`);
  } catch (e) {
    if (e instanceof DashboardAuthError) {
      redirect("/auth/login");
    }
    if (e && typeof e === "object" && "digest" in e) {
      const digest = String((e as { digest?: string }).digest ?? "");
      if (digest.startsWith("NEXT_REDIRECT")) throw e;
    }
    console.error("[vercel:redeploy]", e);
    redirect(`${SETTINGS_DEPLOY_PATH}?error=deploy`);
  }
}
