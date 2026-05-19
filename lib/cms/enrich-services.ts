import { DEFAULT_SERVICES_CARDS } from "@/lib/cms/defaults";
import { DEFAULT_SERVICE_BODIES } from "@/lib/cms/service-bodies";
import {
  DEFAULT_SERVICE_FLIP,
  DEFAULT_SERVICE_FLIP_FALLBACK,
} from "@/lib/cms/service-flip-meta";
import type { ServiceCard } from "@/lib/cms/types";

export function enrichServiceCard(
  card: ServiceCard,
  bodyFromDb?: string | null,
): ServiceCard {
  const meta = DEFAULT_SERVICE_FLIP[card.key] ?? DEFAULT_SERVICE_FLIP_FALLBACK;
  const body =
    bodyFromDb?.trim() ||
    DEFAULT_SERVICE_BODIES[card.key] ||
    card.description;

  return {
    ...card,
    body,
    technologies: card.tags?.length ? card.tags : meta.technologies,
    highlights: meta.highlights,
  };
}

export function enrichDefaultServiceCards(): ServiceCard[] {
  return DEFAULT_SERVICES_CARDS.map((card) => enrichServiceCard(card));
}
