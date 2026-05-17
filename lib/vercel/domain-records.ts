import type {
  DnsRecordRow,
  VercelDomainConfig,
  VercelProjectDomain,
} from "@/lib/vercel/types";

function firstCname(config: VercelDomainConfig | null): string | null {
  const entry = config?.recommendedCNAME?.[0]?.value;
  if (!entry) return "cname.vercel-dns.com";
  return entry.replace(/\.$/, "");
}

function firstIpv4(config: VercelDomainConfig | null): string | null {
  return config?.recommendedIPv4?.[0]?.value?.[0] ?? "76.76.21.21";
}

function relativeHost(recordDomain: string, apexName: string): string {
  if (recordDomain === apexName) return "@";
  if (recordDomain.endsWith(`.${apexName}`)) {
    return recordDomain.slice(0, -(apexName.length + 1));
  }
  return recordDomain;
}

export function buildDomainDnsRecords(
  projectDomain: VercelProjectDomain,
  config: VercelDomainConfig | null,
): DnsRecordRow[] {
  const records: DnsRecordRow[] = [];
  const { name, apexName } = projectDomain;
  const isApex = name === apexName;

  for (const v of projectDomain.verification ?? []) {
    records.push({
      id: `verify-${v.domain}-${v.type}`,
      purpose: "verification",
      type: v.type,
      host: relativeHost(v.domain, apexName),
      value: v.value,
      note: "Zur Bestätigung der Domain-Inhaberschaft",
    });
  }

  if (isApex) {
    records.push({
      id: "route-a",
      purpose: "routing",
      type: "A",
      host: "@",
      value: firstIpv4(config) ?? "76.76.21.21",
      note: "Apex-Domain (ohne www) auf Vercel zeigen",
    });
  } else {
    const cnameTarget = firstCname(config);
    const host =
      name === apexName
        ? "@"
        : name.endsWith(`.${apexName}`)
          ? name.slice(0, -(apexName.length + 1))
          : name;

    records.push({
      id: "route-cname",
      purpose: "routing",
      type: "CNAME",
      host: host || "www",
      value: cnameTarget ?? "cname.vercel-dns.com",
      note: "Subdomain auf Vercel zeigen",
    });
  }

  return records;
}

export function mergeDomainDetails(
  summary: { name: string; verified: boolean },
  projectDomain: VercelProjectDomain | null,
  config: VercelDomainConfig | null,
): import("@/lib/vercel/types").VercelDomainDetails {
  const apexName = projectDomain?.apexName ?? summary.name;
  const name = projectDomain?.name ?? summary.name;
  const isApex = name === apexName;

  const merged: VercelProjectDomain = projectDomain ?? {
    name,
    apexName,
    verified: summary.verified,
    verification: [],
  };

  return {
    name,
    apexName,
    verified: projectDomain?.verified ?? summary.verified,
    misconfigured: config?.misconfigured ?? !summary.verified,
    configuredBy: config?.configuredBy ?? null,
    redirect: projectDomain?.redirect ?? null,
    isApex,
    records: buildDomainDnsRecords(merged, config),
  };
}
