export function seedStatusFromSearch(
  params: Record<string, string | string[] | undefined>,
): string | null {
  if (params.seeded === "1") return "seeded";
  if (params.seed_info === "already") return "already";
  if (params.seed_error === "service_role") return "service_role";
  if (params.seed_error === "db") return "db";
  return null;
}
