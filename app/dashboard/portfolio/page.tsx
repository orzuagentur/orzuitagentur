import { createPortfolioRow, updatePortfolioRow } from "@/actions/cms/tables";
import { CardImageField } from "@/components/dashboard/card-image-field";
import { CardRowActions } from "@/components/dashboard/card-row-actions";
import { CardSortOrderPanel } from "@/components/dashboard/card-sort-order-panel";
import { CmsEmptyState } from "@/components/dashboard/cms-empty-state";
import {
  DashboardFormActions,
  DashboardFormCard,
} from "@/components/dashboard/dashboard-form-card";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getPortfolioEntries } from "@/lib/dashboard/cms-portfolio";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

export default async function DashboardPortfolioPage() {
  const rows = await getPortfolioEntries();
  const nextSort =
    rows.length > 0 ? Math.max(...rows.map((row) => row.sort_order), 0) + 1 : 1;

  return (
    <>
      <DashboardPageHeader
        title="Portfolio"
        description="Einträge aus portfolio_entries. Erstes sort_order wird auf der Startseite als „featured“ dargestellt."
      />

      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <DashboardFormCard
          eyebrow="Neues Portfolio-Projekt"
          title="Projekt hinzufügen"
          description="Legt eine neue Portfolio-Karte und Detailseite an. Der Slug wird automatisch aus dem Titel erzeugt, wenn Sie ihn leer lassen."
          previewHref="/#portfolio"
          previewLabel="Portfolio ansehen"
        >
          <form action={createPortfolioRow} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="new-portfolio-title">
                  Titel
                </label>
                <input
                  className={inputClass}
                  id="new-portfolio-title"
                  name="title_de"
                  required
                  placeholder="z. B. Kundenportal"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="new-portfolio-slug">
                  Slug (optional)
                </label>
                <input
                  className={inputClass}
                  id="new-portfolio-slug"
                  name="slug"
                  placeholder="kundenportal"
                />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="new-portfolio-summary">
                Kurzbeschreibung
              </label>
              <textarea
                className={`${inputClass} min-h-[100px]`}
                id="new-portfolio-summary"
                name="summary_de"
                placeholder="Kurzer Text für die Portfolio-Karte."
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="new-portfolio-body">
                Case-Study Text (optional)
              </label>
              <textarea
                className={`${inputClass} min-h-[140px] text-[13px] leading-relaxed`}
                id="new-portfolio-body"
                name="body_de"
                placeholder="Text für die Rückseite und Detailseite. Absätze mit Leerzeile trennen."
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="new-portfolio-category">
                  Kategorie
                </label>
                <input
                  className={inputClass}
                  id="new-portfolio-category"
                  name="category_de"
                  placeholder="Web App • CRM"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="new-portfolio-image">
                  Bild-URL (optional)
                </label>
                <input
                  className={inputClass}
                  id="new-portfolio-image"
                  name="image_url"
                  type="url"
                  inputMode="url"
                  placeholder="https://…"
                />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="new-portfolio-image-alt">
                Alt-Text für Bild
              </label>
              <input
                className={inputClass}
                id="new-portfolio-image-alt"
                name="image_alt"
                maxLength={300}
                placeholder="Beschreibt das Projektbild für Screenreader und SEO."
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={inputClass} name="icon_name" placeholder="Icon Key (z. B. web, crm)" />
              <input className={inputClass} name="tags" placeholder="Tags: SaaS, CRM, Automation" />
              <input className={inputClass} name="cta_label" placeholder="CTA Label (optional)" />
              <input className={inputClass} name="animation_preset" placeholder="Animation Preset" />
              <input className={inputClass} name="video_url" placeholder="Video URL (optional)" />
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
                <input type="checkbox" name="enable_3d" defaultChecked className="h-4 w-4 rounded border-[var(--border-strong)]" />
                3D-Effekt aktiv
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="new-portfolio-url">
                  Projekt-URL (optional)
                </label>
                <input
                  className={inputClass}
                  id="new-portfolio-url"
                  name="project_url"
                  type="url"
                  inputMode="url"
                  placeholder="https://beispiel.de"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="new-portfolio-sort">
                  sort_order
                </label>
                <input
                  className={`${inputClass} w-28`}
                  id="new-portfolio-sort"
                  name="sort_order"
                  type="number"
                  defaultValue={nextSort}
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
              <input
                type="checkbox"
                name="published"
                value="true"
                defaultChecked
                className="h-4 w-4 rounded border-[var(--border-strong)]"
              />
              Direkt veröffentlichen
            </label>
            <DashboardFormActions
              submitLabel="Neues Projekt anlegen"
              pendingLabel="Angelegt"
              hint="Nach dem Anlegen können Sie oben ein Bild hochladen und die Case-Study weiter ausbauen."
            />
          </form>
        </DashboardFormCard>

        <CardSortOrderPanel
          kind="portfolio"
          title="Reihenfolge der Portfolio-Projekte"
          rows={rows.map((row) => ({
            id: row.id,
            title: row.title_de,
            sort_order: row.sort_order,
          }))}
        />

        {rows.length === 0 ? (
          <CmsEmptyState
            returnTo="/dashboard/portfolio"
            tableLabel="portfolio_entries"
          />
        ) : (
          rows.map((p) => (
            <DashboardFormCard
              key={p.id}
              eyebrow="Portfolio-Projekt"
              title={p.title_de}
              description="Bearbeitet die Projekt-Karte, das Kartenbild, die Case-Study und den externen Projekt-Link."
              meta={`${p.slug} · ID ${p.id}`}
              previewHref={`/portfolio/${p.slug}`}
              previewLabel="Projekt ansehen"
            >
              <CardImageField
                table="portfolio_entries"
                id={p.id}
                slug={p.slug}
                title={p.title_de}
                imageUrl={p.image_url}
                imageAlt={p.image_alt}
                returnPath="/dashboard/portfolio"
              />
              <form action={updatePortfolioRow} className="space-y-3">
                <div className="rounded-xl border border-[var(--border)] bg-white/[0.015] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    Projektdaten
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Diese Felder werden zusammen gespeichert.
                  </p>
                </div>
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
                  <label className={labelClass} htmlFor={`palt-${p.id}`}>
                    Alt-Text für Bild
                  </label>
                  <input
                    className={inputClass}
                    id={`palt-${p.id}`}
                    name="image_alt"
                    maxLength={300}
                    defaultValue={p.image_alt ?? ""}
                    placeholder="Kurze Bildbeschreibung für Screenreader und SEO."
                  />
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input className={inputClass} name="icon_name" defaultValue={p.icon_name ?? ""} placeholder="Icon Key" />
                    <input className={inputClass} name="tags" defaultValue={(p.tags ?? []).join(", ")} placeholder="Tags" />
                    <input className={inputClass} name="cta_label" defaultValue={p.cta_label ?? ""} placeholder="CTA Label" />
                    <input className={inputClass} name="animation_preset" defaultValue={p.animation_preset ?? ""} placeholder="Animation Preset" />
                    <input className={inputClass} name="video_url" defaultValue={p.video_url ?? ""} placeholder="Video URL" />
                    <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
                      <input type="checkbox" name="enable_3d" defaultChecked={p.enable_3d} className="h-4 w-4 rounded border-[var(--border-strong)]" />
                      3D-Effekt aktiv
                    </label>
                  </div>
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
                <DashboardFormActions
                  submitLabel="Projekt speichern"
                  hint="Änderungen wirken auf Portfolio-Karten und die Projekt-Detailseite."
                />
              </form>
              <div className="mt-4 border-t border-[var(--border)] pt-4">
                <CardRowActions
                  kind="portfolio"
                  id={p.id}
                  slug={p.slug}
                  title={p.title_de}
                />
              </div>
            </DashboardFormCard>
          ))
        )}
      </div>
    </>
  );
}
