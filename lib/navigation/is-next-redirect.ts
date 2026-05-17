export function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("digest" in error)) {
    return false;
  }
  const digest = String((error as { digest?: string }).digest ?? "");
  return digest.startsWith("NEXT_REDIRECT");
}
