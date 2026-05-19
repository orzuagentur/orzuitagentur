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
        description="Einträge aus services. Erstes sort_order wird rechts als Hauptkarte dargestellt — Stapel links."
      />

      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        {rows.length === 0 ? (
          <CmsEmptyState
            returnTo="/dashboard/services"
            tableLabel="services"
          />
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
                <input type="hidden" name="slug" value={s.slug} />
                <div>
                  <label className={labelClass} htmlFor={`stitle-${s.id}`}>
                    Titel
                  </label>
                  <input
                    className={inputClass}
                    id={`stitle-${s.id}`}
                    name="title_de"
                    defaultValue={s.title_de}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`sdesc-${s.id}`}>
                    Kurzbeschreibung (Vorderseite)
                  </label>
                  <textarea
                    className={`${inputClass} min-h-[100px]`}
                    id={`sdesc-${s.id}`}
                    name="description_de"
                    defaultValue={s.description_de ?? ""}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`pbody-${s.id}`}>
                    Detailtext (Rückseite, Absätze mit Leerzeile)
                  </label>
                  <textarea
                    className={`${inputClass} min-h-[200px] text-[13px] leading-relaxed`}
                    id={`pbody-${s.id}`}
                    name="body_de"
                    defaultValue={s.body_de ?? ""}
                    placeholder="Mehrere Absätze durch eine Leerzeile trennen."
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`purl-${s.id}`}>
                    Link (Besuchen / Projekt anfragen)
                  </label>
                  <input
                    className={inputClass}
                    id={`purl-${s.id}`}
                    name="project_url"
                    type="url"
                    inputMode="url"
                    defaultValue={s.project_url ?? ""}
                    placeholder="https://beispiel.de"
                  />
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Ohne URL verweist „Projekt anfragen“ auf #kontakt.
                  </p>
                </div>
                <div>
                  <label className={labelClass} htmlFor={`pcat-${s.id}`}>
                    Kategorie
                  </label>
                  <input
                    className={inputClass}
                    id={`pcat-${s.id}`}
                    name="category_de"
                    defaultValue={s.category_de ?? ""}
                  />
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label className={labelClass} htmlFor={`pord-${s.id}`}>
                      sort_order
                    </label>
                    <input
                      className={`${inputClass} w-28`}
                      id={`pord-${s.id}`}
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
