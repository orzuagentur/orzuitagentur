/** Production canonical host (www, not apex). */
const CANONICAL_HOST = "www.orzuit.com";

const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;

const HOSTS_NORMALIZED_TO_CANONICAL = new Set([
  "orzuit.com",
  "www.orzuit.com",
  "orzuit.de",
  "www.orzuit.de",
]);

function normalizeCanonicalOrigin(url: URL): URL {
  const host = url.hostname.toLowerCase();

  if (host === "localhost" || host === "127.0.0.1") {
    return url;
  }

  if (HOSTS_NORMALIZED_TO_CANONICAL.has(host)) {
    const canonical = new URL(url.pathname + url.search + url.hash, CANONICAL_ORIGIN);
    return canonical;
  }

  if (process.env.NODE_ENV === "production" && url.protocol === "http:") {
    const secure = new URL(url.toString());
    secure.protocol = "https:";
    return secure;
  }

  return url;
}

/** Canonical site origin for sitemap, robots, metadata, and Open Graph. */
export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  let url: URL;
  if (raw && (raw.startsWith("http://") || raw.startsWith("https://"))) {
    url = new URL(raw);
  } else if (process.env.NODE_ENV === "production") {
    url = new URL(`${CANONICAL_ORIGIN}/`);
  } else {
    url = new URL("http://localhost:3000");
  }

  return normalizeCanonicalOrigin(url);
}

export function getSiteOrigin(): string {
  return getSiteUrl().origin;
}

/** Absolute canonical URL for a path (e.g. `/`, `/impressum`). */
export function getCanonicalUrl(path = "/"): string {
  const base = getSiteUrl();
  const pathname = path.startsWith("/") ? path : `/${path}`;
  return new URL(pathname, base).toString();
}
