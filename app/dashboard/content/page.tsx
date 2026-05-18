import { ContentHub } from "@/components/dashboard/content-hub";
import { ContentServiceRoleBanner } from "@/components/dashboard/content-service-role-banner";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { hasServiceRoleConfig } from "@/lib/supabase/service";

export default function DashboardContentHubPage() {
  const canWrite = hasServiceRoleConfig();

  return (
    <>
      <DashboardPageHeader
        title="Content"
        description="Texte der öffentlichen Startseite — Bereich in der Leiste oben wählen."
      />
      {!canWrite ? <ContentServiceRoleBanner /> : null}
      <ContentHub />
    </>
  );
}
