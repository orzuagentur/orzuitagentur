export type VercelDeployment = {
  uid: string;
  url: string | null;
  state: string;
  readyState?: string;
  createdAt: number;
  target: string | null;
};

export type VercelDomainVerification = {
  type: string;
  domain: string;
  value: string;
  reason?: string;
};

export type VercelDomain = {
  name: string;
  verified: boolean;
  verification?: VercelDomainVerification[];
};

export type VercelProjectDomain = {
  name: string;
  apexName: string;
  verified: boolean;
  redirect?: string | null;
  verification?: VercelDomainVerification[];
};

export type VercelDomainConfig = {
  configuredBy?: "CNAME" | "A" | "http" | "dns-01" | null;
  misconfigured: boolean;
  recommendedIPv4?: { rank: number; value: string[] }[];
  recommendedCNAME?: { rank: number; value: string }[];
};

export type DnsRecordRow = {
  id: string;
  purpose: "verification" | "routing";
  type: string;
  host: string;
  value: string;
  note?: string;
};

export type VercelDomainDetails = {
  name: string;
  apexName: string;
  verified: boolean;
  misconfigured: boolean;
  configuredBy?: string | null;
  redirect?: string | null;
  isApex: boolean;
  records: DnsRecordRow[];
};

export type VercelEnvVar = {
  id: string;
  key: string;
  type: "plain" | "encrypted" | "secret" | "system";
  target: ("production" | "preview" | "development")[];
  gitBranch?: string | null;
  value?: string;
};

export type VercelProject = {
  id: string;
  name: string;
  link?: { type: string; repo?: string } | null;
};
