import { updatePortfolioRow } from "@/actions/cms/tables";
import { CardImageField } from "@/components/dashboard/card-image-field";
import { CmsEmptyState } from "@/components/dashboard/cms-empty-state";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { getPortfolioEntries } from "@/lib/dashboard/cms-portfolio";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

export default async function DashboardPortfolioPage() {
  const rows = await getPortfolioEntries();

  return (
    <>
      <DashboardPageHeader
        title="Portfolio"
        description="Einträge aus portfolio_entries. Erstes sort_order wird auf der Startseite als „featured“ dargestellt."
      />

      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        {rows.length === 0 ? (
          <CmsEmptyState
            returnTo="/dashboard/portfolio"
            tableLabel="portfolio_entries"
          />
        ) : (
          rows.map((p) => (
            <div
              key={p.id}
              className="max-w-2xl rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6"
            >
              <p className="font-mono text-xs text-[var(--muted)]">
                {p.slug} · ID {p.id} ·{" "}
                <a
                  href={`/portfolio/${p.slug}`}
                  className="text-[var(--accent)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  /portfolio/{p.slug}
                </a>
              </p>
              <CardImageField
                table="portfolio_entries"
                id={p.id}
                slug={p.slug}
                title={p.title_de}
                imageUrl={p.image_url}
                returnPath="/dashboard/portfolio"
              />
              <form action={updatePortfolioRow} className="mt-4 space-y-3">
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="slug" value={p.slug} />
                <div>
                  <label className={labelClass} htmlFor={`ptitle-${p.id}`}>
                    Titel
                  </label>
                  <input
                    className={inputClass}
                    id={`ptitle-${p.id}`}
                    name="title_de"
                    defaultValue={p.title_de}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`psum-${p.id}`}>
                    Kurzbeschreibung
                  </label>
                  <textarea
                    className={`${inputClass} min-h-[100px]`}
                    id={`psum-${p.id}`}
                    name="summary_de"
                    defaultValue={p.summary_de ?? ""}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`pbody-${p.id}`}>
                    Case-Study Text (Absätze mit Leerzeile)
                  </label>
                  <textarea
                    className={`${inputClass} min-h-[200px] text-[13px] leading-relaxed`}
                    id={`pbody-${p.id}`}
                    name="body_de"
                    defaultValue={p.body_de ?? ""}
                    placeholder="Mehrere Absätze durch eine Leerzeile trennen."
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`pimg-${p.id}`}>
                    Bild-URL (optional)
                  </label>
                  <input
                    className={inputClass}
                    id={`pimg-${p.id}`}
                    name="image_url"
                    type="url"
                    inputMode="url"
                    defaultValue={p.image_url ?? ""}
                    placeholder="https://… oder Upload oben"
                  />
                  <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-[var(--muted)]">
                    <input
                      type="checkbox"
                      name="clear_image"
                      value="true"
                      className="h-4 w-4 rounded border-[var(--border-strong)]"
                    />
                    Bild entfernen (Theme-Farben anzeigen)
                  </label>
                </div>
                <div>
                  <label className={labelClass} htmlFor={`purl-${p.id}`}>
                    Projekt-URL (Besuchen)
                  </label>
                  <input
                    className={inputClass}
                    id={`purl-${p.id}`}
                    name="project_url"
                    type="url"
                    inputMode="url"
                    defaultValue={p.project_url ?? ""}
                    placeholder="https://beispiel.de"
                  />
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Öffnet sich in neuem Tab auf der Rückseite der Portfolio-Karte.
                  </p>
                </div>
                <div>
                  <label className={labelClass} htmlFor={`pcat-${p.id}`}>
                    Kategorie
                  </label>
                  <input
                    className={inputClass}
                    id={`pcat-${p.id}`}
                    name="category_de"
                    defaultValue={p.category_de ?? ""}
                  />
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label className={labelClass} htmlFor={`pord-${p.id}`}>
                      sort_order
                    </label>
                    <input
                      className={`${inputClass} w-28`}
                      id={`pord-${p.id}`}
                      name="sort_order"
                      type="number"
                      defaultValue={p.sort_order}
                    />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
                    <input
                      type="checkbox"
                      name="published"
                      value="true"
                      defaultChecked={p.published}
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
