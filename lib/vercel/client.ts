import { getVercelSettings, isVercelApiReady } from "@/lib/vercel/config";

export class VercelApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "VercelApiError";
  }
}

export async function vercelFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  if (!isVercelApiReady()) {
    throw new VercelApiError("Vercel API nicht konfiguriert.", 0);
  }

  const { token, teamId } = getVercelSettings();
  const teamSuffix = teamId
    ? `${path.includes("?") ? "&" : "?"}teamId=${encodeURIComponent(teamId)}`
    : "";
  const url = `https://api.vercel.com${path}${teamSuffix}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = (await res.json()) as { error?: { message?: string } };
      detail = body.error?.message ?? detail;
    } catch {
      /* ignore */
    }
    throw new VercelApiError(detail, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
