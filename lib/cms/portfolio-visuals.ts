export const SLUG_TO_VISUAL: Record<string, string> = {
  finsight: "portfolio-visual-finsight",
  velo: "portfolio-visual-velo",
  aura: "portfolio-visual-aura",
  nexus: "portfolio-visual-nexus",
  vault: "portfolio-visual-vault",
  pulse: "portfolio-visual-pulse",
};

export const FALLBACK_VISUALS = [
  "portfolio-visual-finsight",
  "portfolio-visual-velo",
  "portfolio-visual-aura",
  "portfolio-visual-nexus",
  "portfolio-visual-vault",
  "portfolio-visual-pulse",
] as const;

export function visualClassForSlug(slug: string, index = 0): string {
  return SLUG_TO_VISUAL[slug] ?? FALLBACK_VISUALS[index % FALLBACK_VISUALS.length];
}
