import { getVercelSettings, isVercelApiReady } from "@/lib/vercel/config";
import { vercelFetch } from "@/lib/vercel/client";
import type { VercelDeployment } from "@/lib/vercel/types";

type DeploymentsResponse = {
  deployments: Array<{
    uid: string;
    url?: string;
    state?: string;
    readyState?: string;
    createdAt?: number;
    target?: string | null;
  }>;
};

export async function listRecentDeployments(
  limit = 8,
): Promise<VercelDeployment[]> {
  if (!isVercelApiReady()) return [];

  const { projectId } = getVercelSettings();
  const data = await vercelFetch<DeploymentsResponse>(
    `/v6/deployments?projectId=${encodeURIComponent(projectId!)}&limit=${limit}`,
  );

  return (data.deployments ?? []).map((d) => ({
    uid: d.uid,
    url: d.url ? `https://${d.url}` : null,
    state: d.state ?? d.readyState ?? "unknown",
    readyState: d.readyState,
    createdAt: d.createdAt ?? 0,
    target: d.target ?? null,
  }));
}

export async function triggerRedeploy(): Promise<{
  ok: boolean;
  message: string;
  deploymentUrl?: string;
}> {
  const { deployHook, projectId, token } = getVercelSettings();

  if (deployHook) {
    const res = await fetch(deployHook, { method: "POST" });
    if (!res.ok) {
      return {
        ok: false,
        message: `Deploy Hook fehlgeschlagen (${res.status}).`,
      };
    }
    return {
      ok: true,
      message: "Redeploy über Deploy Hook gestartet.",
    };
  }

  if (!token || !projectId) {
    return {
      ok: false,
      message:
        "Setzen Sie VERCEL_DEPLOY_HOOK_URL oder VERCEL_ACCESS_TOKEN + VERCEL_PROJECT_ID.",
    };
  }

  const project = await vercelFetch<{ id: string; name: string }>(
    `/v9/projects/${encodeURIComponent(projectId)}`,
  );

  const deployment = await vercelFetch<{ url?: string; id?: string }>(
    "/v13/deployments",
    {
      method: "POST",
      body: JSON.stringify({
        name: project.name,
        project: projectId,
        target: "production",
      }),
    },
  );

  const url = deployment.url ? `https://${deployment.url}` : undefined;
  return {
    ok: true,
    message: "Production-Deployment wurde in Vercel angestoßen.",
    deploymentUrl: url,
  };
}
