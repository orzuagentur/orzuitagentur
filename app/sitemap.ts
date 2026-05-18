import type { MetadataRoute } from "next";
import { getPublishedPortfolioSlugs } from "@/lib/cms/load-portfolio-detail";
import { getSiteUrl } from "@/lib/site/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { origin } = getSiteUrl();
  const now = new Date();
  const portfolioSlugs = await getPublishedPortfolioSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
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

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioSlugs.map((slug) => ({
    url: `${origin}/portfolio/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...portfolioRoutes];
}
