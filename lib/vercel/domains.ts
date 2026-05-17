import { getVercelSettings, isVercelApiReady } from "@/lib/vercel/config";
import { vercelFetch } from "@/lib/vercel/client";
import { mergeDomainDetails } from "@/lib/vercel/domain-records";
import type {
  VercelDomain,
  VercelDomainConfig,
  VercelDomainDetails,
  VercelProjectDomain,
} from "@/lib/vercel/types";

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

export async function getProjectDomain(
  domain: string,
): Promise<VercelProjectDomain> {
  const { projectId } = getVercelSettings();
  return vercelFetch<VercelProjectDomain>(
    `/v9/projects/${encodeURIComponent(projectId!)}/domains/${encodeURIComponent(domain)}`,
  );
}

export async function getDomainConfig(domain: string): Promise<VercelDomainConfig> {
  return vercelFetch<VercelDomainConfig>(
    `/v6/domains/${encodeURIComponent(domain)}/config`,
  );
}

export async function listProjectDomainsWithDetails(): Promise<
  VercelDomainDetails[]
> {
  const domains = await listProjectDomains();
  const detailed = await Promise.all(
    domains.map(async (summary) => {
      try {
        const [projectDomain, config] = await Promise.all([
          getProjectDomain(summary.name),
          getDomainConfig(summary.name),
        ]);
        return mergeDomainDetails(summary, projectDomain, config);
      } catch (e) {
        console.warn(`[vercel:domain:${summary.name}]`, e);
        return mergeDomainDetails(summary, null, null);
      }
    }),
  );
  return detailed;
}

export async function addProjectDomain(
  domain: string,
  options?: { redirect?: string },
): Promise<void> {
  const { projectId } = getVercelSettings();
  const body: { name: string; redirect?: string } = {
    name: domain.trim().toLowerCase(),
  };
  if (options?.redirect?.trim()) {
    body.redirect = options.redirect.trim().toLowerCase();
  }

  await vercelFetch(`/v10/projects/${encodeURIComponent(projectId!)}/domains`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function removeProjectDomain(domain: string): Promise<void> {
  const { projectId } = getVercelSettings();
  await vercelFetch(
    `/v10/projects/${encodeURIComponent(projectId!)}/domains/${encodeURIComponent(domain)}`,
    { method: "DELETE" },
  );
}

export async function verifyProjectDomain(domain: string): Promise<void> {
  const { projectId } = getVercelSettings();
  await vercelFetch(
    `/v9/projects/${encodeURIComponent(projectId!)}/domains/${encodeURIComponent(domain)}/verify`,
    { method: "POST" },
  );
}
