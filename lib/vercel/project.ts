import { getVercelSettings, isVercelApiReady } from "@/lib/vercel/config";
import { vercelFetch } from "@/lib/vercel/client";
import type { VercelProject } from "@/lib/vercel/types";

export async function getVercelProject(): Promise<VercelProject | null> {
  if (!isVercelApiReady()) return null;

  const { projectId } = getVercelSettings();
  const data = await vercelFetch<{
    id: string;
    name: string;
    link?: { type: string; repo?: string } | null;
  }>(`/v9/projects/${encodeURIComponent(projectId!)}`);

  return {
    id: data.id,
    name: data.name,
    link: data.link ?? null,
  };
}
