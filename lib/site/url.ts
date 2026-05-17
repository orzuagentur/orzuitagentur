/** Canonical site origin for sitemap, robots, and metadata. */
export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw && (raw.startsWith("http://") || raw.startsWith("https://"))) {
    return new URL(raw);
  }
  return new URL("http://localhost:3000");
}
