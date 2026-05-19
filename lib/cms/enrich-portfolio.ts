import { DEFAULT_PORTFOLIO_CARDS } from "@/lib/cms/defaults";
import { DEFAULT_PORTFOLIO_BODIES } from "@/lib/cms/portfolio-bodies";
import {
  DEFAULT_FLIP_FALLBACK,
  DEFAULT_PORTFOLIO_FLIP,
} from "@/lib/cms/portfolio-flip-meta";
import type { PortfolioCard } from "@/lib/cms/types";

export function enrichPortfolioCard(
  card: PortfolioCard,
  bodyFromDb?: string | null,
): PortfolioCard {
  const meta = DEFAULT_PORTFOLIO_FLIP[card.key] ?? DEFAULT_FLIP_FALLBACK;
  const body =
    bodyFromDb?.trim() ||
    DEFAULT_PORTFOLIO_BODIES[card.key] ||
    card.description;

  return {
    ...card,
    body,
    technologies: card.tags?.length ? card.tags : meta.technologies,
    highlights: meta.highlights,
  };
}

export function enrichPortfolioCards(
  cards: PortfolioCard[],
  bodiesBySlug?: Record<string, string | null | undefined>,
): PortfolioCard[] {
  return cards.map((card) =>
    enrichPortfolioCard(card, bodiesBySlug?.[card.key]),
  );
}

export function enrichDefaultPortfolioCards(): PortfolioCard[] {
  return DEFAULT_PORTFOLIO_CARDS.map((card) => enrichPortfolioCard(card));
}
