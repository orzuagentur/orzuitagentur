import { getIntegrationFlags } from "@/lib/dashboard/integrations";
import {
  getVercelSettings,
  isVercelApiReady,
  isVercelRedeployReady,
} from "@/lib/vercel/config";
import { listRecentDeployments } from "@/lib/vercel/deployments";
import { listProjectDomains } from "@/lib/vercel/domains";
import { getKnownEnvKeyHints, listProjectEnvVars } from "@/lib/vercel/env";
import { getVercelProject } from "@/lib/vercel/project";

export async function getDeployPanelData() {
  const settings = getVercelSettings();
  const localFlags = getIntegrationFlags();

  if (!isVercelApiReady() && !settings.deployHook) {
    return {
      configured: false as const,
      redeployReady: isVercelRedeployReady(),
      settings: {
        hasToken: Boolean(settings.token),
        hasProjectId: Boolean(settings.projectId),
        hasTeamId: Boolean(settings.teamId),
        hasDeployHook: Boolean(settings.deployHook),
      },
      localFlags,
      keyHints: getKnownEnvKeyHints(),
    };
  }

  try {
    const [project, deployments, domains, envVars] = await Promise.all([
      isVercelApiReady() ? getVercelProject() : Promise.resolve(null),
      isVercelApiReady()
        ? listRecentDeployments(8)
        : Promise.resolve([]),
      isVercelApiReady() ? listProjectDomains() : Promise.resolve([]),
      isVercelApiReady() ? listProjectEnvVars() : Promise.resolve([]),
    ]);

    return {
      configured: true as const,
      redeployReady: isVercelRedeployReady(),
      settings: {
        hasToken: Boolean(settings.token),
        hasProjectId: Boolean(settings.projectId),
        hasTeamId: Boolean(settings.teamId),
        hasDeployHook: Boolean(settings.deployHook),
      },
      localFlags,
      project,
      deployments,
      domains,
      envVars,
      keyHints: getKnownEnvKeyHints(),
    };
  } catch (e) {
    console.error("[vercel:panel]", e);
    return {
      configured: false as const,
      redeployReady: isVercelRedeployReady(),
      settings: {
        hasToken: Boolean(settings.token),
        hasProjectId: Boolean(settings.projectId),
        hasTeamId: Boolean(settings.teamId),
        hasDeployHook: Boolean(settings.deployHook),
      },
      localFlags,
      keyHints: getKnownEnvKeyHints(),
      apiError: e instanceof Error ? e.message : "Vercel API Fehler",
    };
  }
}

export type DeployPanelData = Awaited<ReturnType<typeof getDeployPanelData>>;
