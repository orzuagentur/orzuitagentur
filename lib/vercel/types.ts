export type VercelDeployment = {
  uid: string;
  url: string | null;
  state: string;
  readyState?: string;
  createdAt: number;
  target: string | null;
};

export type VercelDomain = {
  name: string;
  verified: boolean;
  verification?: { type: string; domain: string; value: string }[];
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
