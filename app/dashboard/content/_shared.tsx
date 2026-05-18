import type { ReactNode } from "react";
import { ContentServiceRoleBanner } from "@/components/dashboard/content-service-role-banner";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { loadMarketingForAdmin } from "@/lib/cms/persist";
import { hasServiceRoleConfig } from "@/lib/supabase/service";
import { getContentPageMeta } from "@/lib/dashboard/content-sections";

export async function ContentSubPage({
  pathname,
  children,
}: {
  pathname: string;
  children: (marketing: Awaited<ReturnType<typeof loadMarketingForAdmin>>) => ReactNode;
}) {
  const marketing = await loadMarketingForAdmin();
  const canWrite = hasServiceRoleConfig();
  const meta = getContentPageMeta(pathname)!;

  return (
    <>
      <DashboardPageHeader title={meta.label} description={meta.description} />
      {!canWrite ? <ContentServiceRoleBanner /> : null}
      {children(marketing)}
    </>
  );
}
