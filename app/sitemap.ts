import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const { origin } = getSiteUrl();

  const now = new Date();

  return [
    {
      url: origin,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${origin}/impressum`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${origin}/datenschutz`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
