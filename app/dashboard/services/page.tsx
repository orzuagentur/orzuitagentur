import { updateServiceRow } from "@/actions/cms/tables";
import { CmsEmptyState } from "@/components/dashboard/cms-empty-state";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { getServices } from "@/lib/dashboard/cms-services";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

export default async function DashboardServicesPage() {
  const rows = await getServices();

  return (
    <>
      <DashboardPageHeader
        title="Leistungen"
        description="Einträge aus services. Änderungen wirken auf der Startseite nach Revalidation (sort_order, Veröffentlichung)."
      />

      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        {rows.length === 0 ? (
          <CmsEmptyState returnTo="/dashboard/services" tableLabel="services" />
        ) : (
          rows.map((s) => (
            <div
              key={s.id}
              className="max-w-2xl rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6"
            >
              <p className="font-mono text-xs text-[var(--muted)]">
                {s.slug} · ID {s.id}
              </p>
              <form action={updateServiceRow} className="mt-4 space-y-3">
                <input type="hidden" name="id" value={s.id} />
                <div>
                  <label className={labelClass} htmlFor={`title-${s.id}`}>
                    Titel
                  </label>
                  <input
                    className={inputClass}
                    id={`title-${s.id}`}
                    name="title_de"
                    defaultValue={s.title_de}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`desc-${s.id}`}>
                    Beschreibung
                  </label>
                  <textarea
                    className={`${inputClass} min-h-[100px]`}
                    id={`desc-${s.id}`}
                    name="description_de"
                    defaultValue={s.description_de ?? ""}
                  />
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label className={labelClass} htmlFor={`ord-${s.id}`}>
                      sort_order
                    </label>
                    <input
                      className={`${inputClass} w-28`}
                      id={`ord-${s.id}`}
                      name="sort_order"
                      type="number"
                      defaultValue={s.sort_order}
                    />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
                    <input
                      type="checkbox"
                      name="published"
                      value="true"
                      defaultChecked={s.published}
                      className="h-4 w-4 rounded border-[var(--border-strong)]"
                    />
                    Veröffentlicht
                  </label>
                </div>
                <DashboardSubmitButton pendingLabel="Gespeichert">
                  Speichern
                </DashboardSubmitButton>
              </form>
            </div>
          ))
        )}
      </div>
    </>
  );
}
