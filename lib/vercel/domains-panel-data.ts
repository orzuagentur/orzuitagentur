import { getVercelSettings, isVercelApiReady } from "@/lib/vercel/config";
import { listProjectDomainsWithDetails } from "@/lib/vercel/domains";
import { getVercelProject } from "@/lib/vercel/project";

export async function getDomainsPanelData() {
  const settings = getVercelSettings();

  if (!isVercelApiReady()) {
    return {
      configured: false as const,
      settings: {
        hasToken: Boolean(settings.token),
        hasProjectId: Boolean(settings.projectId),
        hasTeamId: Boolean(settings.teamId),
      },
    };
  }

  try {
    const [project, domains] = await Promise.all([
      getVercelProject(),
      listProjectDomainsWithDetails(),
    ]);

    return {
      configured: true as const,
      settings: {
        hasToken: Boolean(settings.token),
        hasProjectId: Boolean(settings.projectId),
        hasTeamId: Boolean(settings.teamId),
      },
      project,
      domains,
      productionUrl: project?.name
        ? `https://${project.name}.vercel.app`
        : null,
    };
  } catch (e) {
    console.error("[vercel:domains-panel]", e);
    return {
      configured: false as const,
      settings: {
        hasToken: Boolean(settings.token),
        hasProjectId: Boolean(settings.projectId),
        hasTeamId: Boolean(settings.teamId),
      },
      apiError: e instanceof Error ? e.message : "Vercel API Fehler",
    };
  }
}

export type DomainsPanelData = Awaited<ReturnType<typeof getDomainsPanelData>>;
