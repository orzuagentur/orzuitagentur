const isDev = process.env.NODE_ENV !== "production";

function supabaseConnectOrigins(): string[] {
  const origins = new Set<string>([
    "https://*.supabase.co",
    "wss://*.supabase.co",
  ]);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (url) {
    try {
      const parsed = new URL(url);
      origins.add(parsed.origin);
      if (parsed.protocol === "https:") {
        origins.add(`wss://${parsed.host}`);
      }
    } catch {
      /* keep wildcards */
    }
  }

  return [...origins];
}

/**
 * Content-Security-Policy for the public site and dashboard.
 * Next.js requires 'unsafe-inline' for hydration and inline boot scripts (e.g. theme).
 * Vercel Analytics / Speed Insights use same-origin /_vercel/* in production.
 */
export function buildContentSecurityPolicy(): string {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "https://va.vercel-scripts.com",
    "https://www.orzux.com",
  ];
  const connectSrc = [
    "'self'",
    ...supabaseConnectOrigins(),
    "https://vitals.vercel-insights.com",
    "https://va.vercel-scripts.com",
    "https://www.orzux.com",
  ];

  if (isDev) {
    scriptSrc.push("'unsafe-eval'");
    connectSrc.push(
      "ws:",
      "wss:",
      "http://localhost:*",
      "http://127.0.0.1:*",
    );
  }

  const directives: string[] = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co",
    "font-src 'self' data:",
    `connect-src ${connectSrc.join(" ")}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "media-src 'self' blob: https://*.supabase.co",
  ];

  if (!isDev) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}
