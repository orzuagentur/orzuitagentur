import { createHmac, randomInt, timingSafeEqual } from "crypto";

export const VERCEL_ENV_DELETE_COOKIE = "vercel_env_delete";
const TTL_MS = 10 * 60 * 1000;

type DeleteCookiePayload = {
  envId: string;
  envKey: string;
  codeHash: string;
  exp: number;
};

function getSecret(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.VERCEL_ACCESS_TOKEN ??
    "orzuit-env-delete-guard"
  );
}

export function generateTenDigitCode(): string {
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += randomInt(0, 10).toString();
  }
  return code;
}

function hashCode(code: string): string {
  return createHmac("sha256", getSecret()).update(code.trim()).digest("base64url");
}

export function buildDeleteCookiePayload(
  envId: string,
  envKey: string,
  code: string,
): DeleteCookiePayload {
  return {
    envId,
    envKey,
    codeHash: hashCode(code),
    exp: Date.now() + TTL_MS,
  };
}

export function serializeDeletePayload(payload: DeleteCookiePayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function parseDeletePayload(raw: string): DeleteCookiePayload | null {
  try {
    const payload = JSON.parse(
      Buffer.from(raw, "base64url").toString("utf8"),
    ) as DeleteCookiePayload;
    if (!payload.envId || !payload.codeHash || !payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function verifyDeleteCode(
  payload: DeleteCookiePayload,
  envId: string,
  enteredCode: string,
): boolean {
  if (payload.envId !== envId) return false;
  if (Date.now() > payload.exp) return false;

  const entered = hashCode(enteredCode);
  try {
    return timingSafeEqual(
      Buffer.from(payload.codeHash),
      Buffer.from(entered),
    );
  } catch {
    return false;
  }
}
