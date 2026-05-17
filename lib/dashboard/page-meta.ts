import { DASHBOARD_NAV } from "@/components/dashboard/nav-config";

export type DashboardPageMeta = {
  label: string;
  description: string;
};

export function getDashboardPageMeta(pathname: string): DashboardPageMeta {
  const sorted = [...DASHBOARD_NAV].sort((a, b) => b.href.length - a.href.length);

  for (const item of sorted) {
    if (item.href === "/dashboard") {
      if (pathname === "/dashboard") {
        return { label: item.label, description: item.description };
      }
      continue;
    }
    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
      return { label: item.label, description: item.description };
    }
  }

  return {
    label: "Admin",
    description: "OrzuIT Control Center",
  };
}
