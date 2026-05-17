export const DASHBOARD_THEME_STORAGE_KEY = "orzuit-dashboard-theme";

export type DashboardTheme = "dark" | "light";

export function isDashboardTheme(value: string | null): value is DashboardTheme {
  return value === "dark" || value === "light";
}

export function readDashboardTheme(): DashboardTheme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(DASHBOARD_THEME_STORAGE_KEY);
    return isDashboardTheme(stored) ? stored : "dark";
  } catch {
    return "dark";
  }
}
