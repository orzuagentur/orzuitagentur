const SERVICE_VISUALS = [
  "portfolio-visual-finsight",
  "portfolio-visual-velo",
  "portfolio-visual-aura",
  "portfolio-visual-nexus",
  "portfolio-visual-vault",
  "portfolio-visual-pulse",
] as const;

export function visualClassForService(slug: string, index: number): string {
  const fromSlug: Record<string, string> = {
    s1: SERVICE_VISUALS[0],
    s2: SERVICE_VISUALS[1],
    s3: SERVICE_VISUALS[2],
    s4: SERVICE_VISUALS[3],
    s5: SERVICE_VISUALS[4],
  };
  return fromSlug[slug] ?? SERVICE_VISUALS[index % SERVICE_VISUALS.length];
}
