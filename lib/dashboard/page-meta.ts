import { DASHBOARD_NAV } from "@/components/dashboard/nav-config";
import { getContentPageMeta } from "@/lib/dashboard/content-sections";
import { getSettingsPageMeta } from "@/lib/dashboard/settings-sections";

export type DashboardPageMeta = {
  label: string;
  description: string;
};

export function getDashboardPageMeta(pathname: string): DashboardPageMeta {
  const contentMeta = getContentPageMeta(pathname);
  if (contentMeta) return contentMeta;

  const settingsMeta = getSettingsPageMeta(pathname);
  if (settingsMeta) return settingsMeta;

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
