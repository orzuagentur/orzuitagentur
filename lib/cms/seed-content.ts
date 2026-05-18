import {
  DEFAULT_HOME_SEO,
  DEFAULT_MARKETING,
  DEFAULT_PORTFOLIO_CARDS,
  DEFAULT_SERVICES_CARDS,
  DEFAULT_TESTIMONIALS_CARDS,
} from "@/lib/cms/defaults";
import { marketingContentSchema } from "@/lib/cms/schema";
import { DEFAULT_LEGAL } from "@/lib/legal/defaults";
import { legalContentSchema } from "@/lib/legal/schema";

export const SEED_SERVICES = DEFAULT_SERVICES_CARDS.map((card, index) => ({
  slug: card.key,
  title_de: card.title,
  description_de: card.description,
  sort_order: index + 1,
  published: true,
}));

export const SEED_PORTFOLIO = DEFAULT_PORTFOLIO_CARDS.map((card, index) => ({
  slug: card.key,
  title_de: card.title,
  summary_de: card.description,
  category_de: card.category,
  sort_order: index + 1,
  published: true,
}));

export const SEED_TESTIMONIALS = DEFAULT_TESTIMONIALS_CARDS.map((card, index) => ({
  quote_de: card.quote,
  author_de: card.author,
  role_de: card.role,
  org_de: card.org,
  sort_order: index + 1,
  published: true,
}));

export const SEED_MARKETING_VALUE = marketingContentSchema.parse(DEFAULT_MARKETING);

export const SEED_LEGAL_VALUE = legalContentSchema.parse(DEFAULT_LEGAL);

export const SEED_HOME_SEO = {
  path: "/",
  title_de: DEFAULT_HOME_SEO.title,
  description_de: DEFAULT_HOME_SEO.description,
  og_image_url: DEFAULT_HOME_SEO.ogImageUrl,
};
