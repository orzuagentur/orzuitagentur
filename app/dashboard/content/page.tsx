import { loadMarketingForAdmin } from "@/lib/cms/persist";
import { MarketingForms } from "@/components/dashboard/marketing-forms";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { hasServiceRoleConfig } from "@/lib/supabase/service";

export default async function DashboardContentPage() {
  const marketing = await loadMarketingForAdmin();
  const canWrite = hasServiceRoleConfig();

  return (
    <>
      <DashboardPageHeader
        title="Content"
        description="Bearbeiten Sie Marketing-Texte (site_settings · key „marketing“). Ohne Service-Role werden nur die Standardwerte geladen — Speichern ist dann nicht möglich."
      />

      {!canWrite ? (
        <div className="mx-4 mb-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90 sm:mx-8 lg:mx-10">
          SUPABASE_SERVICE_ROLE_KEY fehlt: Formulare zeigen Daten, Schreiben schlägt fehl.
        </div>
      ) : null}

      <MarketingForms marketing={marketing} />
    </>
  );
}
