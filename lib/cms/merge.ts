export function deepMerge(
  base: Record<string, unknown>,
  patch: unknown,
): Record<string, unknown> {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    return { ...base };
  }
  const p = patch as Record<string, unknown>;
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(p)) {
    const pk = p[key];
    const bk = out[key];
    if (Array.isArray(pk)) {
      out[key] = pk;
      continue;
    }
    if (
      pk &&
      typeof pk === "object" &&
      !Array.isArray(pk) &&
      bk &&
      typeof bk === "object" &&
      !Array.isArray(bk)
    ) {
      out[key] = deepMerge(bk as Record<string, unknown>, pk);
    } else if (pk !== undefined) {
      out[key] = pk;
    }
  }
  return out;
}

export function cloneMarketingDefault<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
