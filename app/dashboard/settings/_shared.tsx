import type { ReactNode } from "react";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getSettingsPageMeta } from "@/lib/dashboard/settings-sections";

export function SettingsSubPage({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) {
  const meta = getSettingsPageMeta(pathname)!;

  return (
    <>
      <DashboardPageHeader title={meta.label} description={meta.description} />
      {children}
    </>
  );
}
