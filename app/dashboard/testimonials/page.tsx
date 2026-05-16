import { updateTestimonialRow } from "@/actions/cms/tables";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getTestimonials } from "@/lib/dashboard/cms-testimonials";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";
const btnClass =
  "inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-4 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]";

export default async function DashboardTestimonialsPage() {
  const rows = await getTestimonials();

  return (
    <>
      <DashboardPageHeader
        title="Referenzen"
        description="Einträge aus testimonials — erscheinen im Referenzen-Block der Startseite."
      />

      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] px-4 py-8 text-sm text-[var(--muted)]">
            Keine Einträge oder Service-Role nicht konfiguriert.
          </p>
        ) : (
          rows.map((t) => (
            <div
              key={t.id}
              className="max-w-2xl rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6"
            >
              <p className="font-mono text-xs text-[var(--muted)]">ID {t.id}</p>
              <form action={updateTestimonialRow} className="mt-4 space-y-3">
                <input type="hidden" name="id" value={t.id} />
                <div>
                  <label className={labelClass} htmlFor={`q-${t.id}`}>
                    Zitat
                  </label>
                  <textarea
                    className={`${inputClass} min-h-[120px]`}
                    id={`q-${t.id}`}
                    name="quote_de"
                    defaultValue={t.quote_de}
                    required
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor={`a-${t.id}`}>
                      Name
                    </label>
                    <input
                      className={inputClass}
                      id={`a-${t.id}`}
                      name="author_de"
                      defaultValue={t.author_de}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor={`r-${t.id}`}>
                      Rolle
                    </label>
                    <input
                      className={inputClass}
                      id={`r-${t.id}`}
                      name="role_de"
                      defaultValue={t.role_de ?? ""}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor={`o-${t.id}`}>
                    Organisation
                  </label>
                  <input
                    className={inputClass}
                    id={`o-${t.id}`}
                    name="org_de"
                    defaultValue={t.org_de ?? ""}
                  />
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label className={labelClass} htmlFor={`tord-${t.id}`}>
                      sort_order
                    </label>
                    <input
                      className={`${inputClass} w-28`}
                      id={`tord-${t.id}`}
                      name="sort_order"
                      type="number"
                      defaultValue={t.sort_order}
                    />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
                    <input
                      type="checkbox"
                      name="published"
                      value="true"
                      defaultChecked={t.published}
                      className="h-4 w-4 rounded border-[var(--border-strong)]"
                    />
                    Veröffentlicht
                  </label>
                </div>
                <button type="submit" className={btnClass}>
                  Speichern
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </>
  );
}
