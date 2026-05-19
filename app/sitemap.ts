import type { MetadataRoute } from "next";
import { getPublicDynamicPages } from "@/lib/cms/load-page";
import { getPublishedPortfolioSlugs } from "@/lib/cms/load-portfolio-detail";
import { getSitemapSettings } from "@/lib/dashboard/sitemap-settings";
import { getSiteUrl } from "@/lib/site/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { origin } = getSiteUrl();
  const now = new Date();
  const [portfolioSlugs, dynamicPages, settings] = await Promise.all([
    getPublishedPortfolioSlugs(),
    getPublicDynamicPages(),
    getSitemapSettings(),
  ]);

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

  const portfolioRoutes: MetadataRoute.Sitemap = settings.includePortfolio
    ? portfolioSlugs.map((slug) => ({
        url: `${origin}/portfolio/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    : [];

  const dynamicRoutes: MetadataRoute.Sitemap = settings.includeDynamicPages
    ? dynamicPages
        .filter((page) => page.sitemap_enabled !== false && page.robots_index !== false)
        .map((page) => ({
          url: `${origin}${page.path}`,
          lastModified: new Date(page.updated_at),
          changeFrequency: settings.defaultChangeFrequency,
          priority: 0.6,
        }))
    : [];

  return [
    ...(settings.includeStatic ? staticRoutes : []),
    ...portfolioRoutes,
    ...dynamicRoutes,
  ];
}
