import { getVercelSettings, isVercelApiReady } from "@/lib/vercel/config";
import { vercelFetch } from "@/lib/vercel/client";
import type { VercelEnvVar } from "@/lib/vercel/types";

type EnvListResponse = {
  envs: Array<{
    id: string;
    key: string;
    type: VercelEnvVar["type"];
    target?: VercelEnvVar["target"];
    gitBranch?: string | null;
    value?: string;
  }>;
};

const KNOWN_KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_EMAILS",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "LEAD_NOTIFY_EMAIL",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "VERCEL_ACCESS_TOKEN",
  "VERCEL_PROJECT_ID",
  "VERCEL_TEAM_ID",
  "VERCEL_DEPLOY_HOOK_URL",
] as const;

export function getKnownEnvKeyHints(): readonly string[] {
  return KNOWN_KEYS;
}

export async function listProjectEnvVars(): Promise<VercelEnvVar[]> {
  if (!isVercelApiReady()) return [];

  const { projectId } = getVercelSettings();
  const data = await vercelFetch<EnvListResponse>(
    `/v9/projects/${encodeURIComponent(projectId!)}/env`,
  );

  return (data.envs ?? []).map((e) => ({
    id: e.id,
    key: e.key,
    type: e.type,
    target: e.target ?? ["production"],
    gitBranch: e.gitBranch ?? null,
    value:
      e.type === "encrypted" || e.type === "secret"
        ? undefined
        : e.value,
  }));
}

export async function upsertProjectEnvVar(input: {
  key: string;
  value: string;
  targets: ("production" | "preview" | "development")[];
  sensitive: boolean;
}): Promise<void> {
  const { projectId } = getVercelSettings();
  const existing = await listProjectEnvVars();
  const found = existing.find((e) => e.key === input.key);

  const type = input.sensitive ? "encrypted" : "plain";
  const body = {
    key: input.key,
    value: input.value,
    type,
    target: input.targets,
  };

  if (found) {
    await vercelFetch(
      `/v9/projects/${encodeURIComponent(projectId!)}/env/${found.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
    );
    return;
  }

  await vercelFetch(`/v10/projects/${encodeURIComponent(projectId!)}/env`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function deleteProjectEnvVar(envId: string): Promise<void> {
  const { projectId } = getVercelSettings();
  await vercelFetch(
    `/v9/projects/${encodeURIComponent(projectId!)}/env/${envId}`,
    { method: "DELETE" },
  );
}
