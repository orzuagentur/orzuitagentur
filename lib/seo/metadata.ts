import type { Metadata } from "next";
import { getCanonicalUrl, getSiteUrl } from "@/lib/site/url";

/** Default share image when CMS has no OG URL (Next.js app/icon or apple-icon). */
const DEFAULT_OG_IMAGE_PATH = "/apple-icon.png";

export type PageSeoInput = {
  path: string;
  title: string;
  description: string;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  schemaJson?: Record<string, unknown> | null;
  robots?: Metadata["robots"];
};

function resolveOgImageUrl(ogImageUrl: string | null | undefined, siteBase: URL): string {
  const trimmed = ogImageUrl?.trim();
  if (trimmed) {
    return new URL(trimmed, siteBase).toString();
  }
  return new URL(DEFAULT_OG_IMAGE_PATH, siteBase).toString();
}

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = input.canonicalUrl?.trim() || getCanonicalUrl(input.path);
  const imageUrl = resolveOgImageUrl(input.ogImageUrl, siteUrl);

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: canonical,
      siteName: "OrzuIT",
      title: input.title,
      description: input.description,
      images: [
        {
          url: imageUrl,
          alt: input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [imageUrl],
    },
    ...(input.schemaJson && Object.keys(input.schemaJson).length > 0
      ? { other: { "script:ld+json": JSON.stringify(input.schemaJson) } }
      : {}),
    ...(input.robots ? { robots: input.robots } : {}),
  };
}
