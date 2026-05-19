import {
  createTestimonialRow,
  updateTestimonialRow,
} from "@/actions/cms/tables";
import { CmsEmptyState } from "@/components/dashboard/cms-empty-state";
import { DeleteTestimonialButton } from "@/components/dashboard/delete-testimonial-button";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { getTestimonials } from "@/lib/dashboard/cms-testimonials";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

export default async function DashboardTestimonialsPage() {
  const rows = await getTestimonials();
  const nextSort =
    rows.length > 0
      ? Math.max(...rows.map((r) => r.sort_order), 0) + 1
      : 1;

  return (
    <>
      <DashboardPageHeader
        title="Warum OrzuIT"
        description="Karten für den Abschnitt #warum-orzuit auf der Startseite. Feld „Überschrift“ = Kartentitel, Feld „Text“ = Beschreibung."
      />

      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <section className="max-w-2xl rounded-2xl border border-dashed border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_70%,transparent)] p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Neue Karte hinzufügen
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Erscheint auf der Startseite unter #warum-orzuit, wenn „Veröffentlicht“
            aktiv ist.
          </p>
          <form action={createTestimonialRow} className="mt-4 space-y-3">
            <div>
              <label className={labelClass} htmlFor="new-quote">
                Text (Beschreibung)
              </label>
              <textarea
                className={`${inputClass} min-h-[120px]`}
                id="new-quote"
                name="quote_de"
                required
                placeholder="Was macht OrzuIT hier besonders?"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="new-author">
                  Überschrift
                </label>
                <input
                  className={inputClass}
                  id="new-author"
                  name="author_de"
                  required
                  placeholder="z. B. Klare Kommunikation"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="new-role">
                  Zusatz (optional)
                </label>
                <input
                  className={inputClass}
                  id="new-role"
                  name="role_de"
                  placeholder="Leer lassen, wenn nicht nötig"
                />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="new-org">
                Zusatz Zeile 2 (optional)
              </label>
              <input
                className={inputClass}
                id="new-org"
                name="org_de"
                placeholder="Leer lassen, wenn nicht nötig"
              />
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className={labelClass} htmlFor="new-sort">
                  Reihenfolge
                </label>
                <input
                  className={`${inputClass} w-28`}
                  id="new-sort"
                  name="sort_order"
                  type="number"
                  defaultValue={nextSort}
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
                <input
                  type="checkbox"
                  name="published"
                  value="true"
                  defaultChecked
                  className="h-4 w-4 rounded border-[var(--border-strong)]"
                />
                Veröffentlicht
              </label>
            </div>
            <DashboardSubmitButton pendingLabel="Hinzugefügt">
              Karte anlegen
            </DashboardSubmitButton>
          </form>
        </section>

        {rows.length === 0 ? (
          <CmsEmptyState
            returnTo="/dashboard/testimonials"
            tableLabel="Warum-OrzuIT-Karten"
          />
        ) : (
          rows.map((t) => (
            <div
              key={t.id}
              className="max-w-2xl rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-xs text-[var(--muted)]">ID {t.id}</p>
                <DeleteTestimonialButton id={t.id} authorLabel={t.author_de} />
              </div>
              <form action={updateTestimonialRow} className="mt-4 space-y-3">
                <input type="hidden" name="id" value={t.id} />
                <div>
                  <label className={labelClass} htmlFor={`q-${t.id}`}>
                    Text
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
                      Überschrift
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
                      Zusatz
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
                    Zusatz Zeile 2
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
