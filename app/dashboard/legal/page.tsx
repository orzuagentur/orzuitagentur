import { LegalForms } from "@/components/dashboard/legal-forms";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { loadLegalForAdmin } from "@/lib/legal/cms";
import { hasServiceRoleConfig } from "@/lib/supabase/service";

export default async function DashboardLegalPage() {
  const legal = await loadLegalForAdmin();
  const canWrite = hasServiceRoleConfig();

  return (
    <>
      <DashboardPageHeader
        title="Rechtliches"
        description="Impressum und Datenschutzerklärung (site_settings · key „legal“). Abschnitte hinzufügen, bearbeiten oder entfernen."
      />

      {!canWrite ? (
        <div className="mx-4 mb-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90 sm:mx-8 lg:mx-10">
          SUPABASE_SERVICE_ROLE_KEY fehlt: Formulare zeigen Daten, Schreiben schlägt fehl.
        </div>
      ) : null}

      <LegalForms legal={legal} />
    </>
  );
}
