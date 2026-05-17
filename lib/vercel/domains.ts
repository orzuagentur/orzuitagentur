import { getVercelSettings, isVercelApiReady } from "@/lib/vercel/config";
import { vercelFetch } from "@/lib/vercel/client";
import type { VercelDomain } from "@/lib/vercel/types";

type DomainsResponse = {
  domains: Array<{
    name: string;
    verified: boolean;
    verification?: VercelDomain["verification"];
  }>;
};

export async function listProjectDomains(): Promise<VercelDomain[]> {
  if (!isVercelApiReady()) return [];

  const { projectId } = getVercelSettings();
  const data = await vercelFetch<DomainsResponse>(
    `/v9/projects/${encodeURIComponent(projectId!)}/domains`,
  );

  return (data.domains ?? []).map((d) => ({
    name: d.name,
    verified: d.verified,
    verification: d.verification,
  }));
}

export async function addProjectDomain(domain: string): Promise<void> {
  const { projectId } = getVercelSettings();
  await vercelFetch(`/v10/projects/${encodeURIComponent(projectId!)}/domains`, {
    method: "POST",
    body: JSON.stringify({ name: domain.trim().toLowerCase() }),
  });
}
