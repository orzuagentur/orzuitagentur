import { createServiceRow, updateServiceRow } from "@/actions/cms/tables";
import { CardImageField } from "@/components/dashboard/card-image-field";
import { CardRowActions } from "@/components/dashboard/card-row-actions";
import { CardSortOrderPanel } from "@/components/dashboard/card-sort-order-panel";
import { CmsEmptyState } from "@/components/dashboard/cms-empty-state";
import {
  DashboardFormActions,
  DashboardFormCard,
} from "@/components/dashboard/dashboard-form-card";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getServices } from "@/lib/dashboard/cms-services";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

export default async function DashboardServicesPage() {
  const rows = await getServices();
  const nextSort =
    rows.length > 0 ? Math.max(...rows.map((row) => row.sort_order), 0) + 1 : 1;

  return (
    <>
      <DashboardPageHeader
        title="Leistungen"
        description="Einträge aus services. Erstes sort_order wird links als Hauptkarte dargestellt — Stapel rechts."
      />

      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <DashboardFormCard
          eyebrow="Neue Service-Karte"
          title="Leistung hinzufügen"
          description="Legt eine neue Karte im Leistungs-Karussell an. Der Slug wird automatisch aus dem Titel erzeugt, wenn Sie ihn leer lassen."
          previewHref="/#leistungen"
          previewLabel="Leistungen ansehen"
        >
          <form action={createServiceRow} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="new-service-title">
                  Titel
                </label>
                <input
                  className={inputClass}
                  id="new-service-title"
                  name="title_de"
                  required
                  placeholder="z. B. CRM Automatisierung"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="new-service-slug">
                  Slug (optional)
                </label>
                <input
                  className={inputClass}
                  id="new-service-slug"
                  name="slug"
                  placeholder="crm-automatisierung"
                />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="new-service-desc">
                Kurzbeschreibung
              </label>
              <textarea
                className={`${inputClass} min-h-[100px]`}
                id="new-service-desc"
                name="description_de"
                placeholder="Kurzer Text für die Vorderseite der Karte."
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="new-service-body">
                Detailtext (optional)
              </label>
              <textarea
                className={`${inputClass} min-h-[140px] text-[13px] leading-relaxed`}
                id="new-service-body"
                name="body_de"
                placeholder="Text für die Rückseite. Absätze mit Leerzeile trennen."
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="new-service-category">
                  Kategorie
                </label>
                <input
                  className={inputClass}
                  id="new-service-category"
                  name="category_de"
                  placeholder="Web • Automation"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="new-service-image">
                  Bild-URL (optional)
                </label>
                <input
                  className={inputClass}
                  id="new-service-image"
                  name="image_url"
                  type="url"
                  inputMode="url"
                  placeholder="https://…"
                />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="new-service-image-alt">
                Alt-Text für Bild
              </label>
              <input
                className={inputClass}
                id="new-service-image-alt"
                name="image_alt"
                maxLength={300}
                placeholder="Beschreibt das Bild für Screenreader und SEO."
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={inputClass} name="icon_name" placeholder="Icon Key (z. B. bot, code, shield)" />
              <input className={inputClass} name="tags" placeholder="Tags: KI, Web, CRM" />
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
                <label className={labelClass} htmlFor="new-service-url">
                  Link (optional)
                </label>
                <input
                  className={inputClass}
                  id="new-service-url"
                  name="project_url"
                  type="url"
                  inputMode="url"
                  placeholder="https://beispiel.de"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="new-service-sort">
                  sort_order
                </label>
                <input
                  className={`${inputClass} w-28`}
                  id="new-service-sort"
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
              submitLabel="Neue Leistung anlegen"
              pendingLabel="Angelegt"
              hint="Nach dem Anlegen können Sie oben ein Bild hochladen und die Karte weiter verfeinern."
            />
          </form>
        </DashboardFormCard>

        <CardSortOrderPanel
          kind="services"
          title="Reihenfolge der Leistungen"
          rows={rows.map((row) => ({
            id: row.id,
            title: row.title_de,
            sort_order: row.sort_order,
          }))}
        />

        {rows.length === 0 ? (
          <CmsEmptyState
            returnTo="/dashboard/services"
            tableLabel="services"
          />
        ) : (
          rows.map((s) => (
            <DashboardFormCard
              key={s.id}
              eyebrow="Service-Karte"
              title={s.title_de}
              description="Bearbeitet die Karte im Leistungs-Karussell: Vorderseite, Rückseite, Bild, Link und Veröffentlichungsstatus."
              meta={`${s.slug} · ID ${s.id}`}
              previewHref="/#leistungen"
              previewLabel="Leistungen ansehen"
            >
              <CardImageField
                table="services"
                id={s.id}
                slug={s.slug}
                title={s.title_de}
                imageUrl={s.image_url}
                imageAlt={s.image_alt}
                returnPath="/dashboard/services"
              />
              <form action={updateServiceRow} className="space-y-3">
                <div className="rounded-xl border border-[var(--border)] bg-white/[0.015] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                    Kartendaten
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Diese Felder werden zusammen gespeichert.
                  </p>
                </div>
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
                  <label className={labelClass} htmlFor={`simg-${s.id}`}>
                    Bild-URL (optional)
                  </label>
                  <input
                    className={inputClass}
                    id={`simg-${s.id}`}
                    name="image_url"
                    type="url"
                    inputMode="url"
                    defaultValue={s.image_url ?? ""}
                    placeholder="https://… oder Upload oben"
                  />
                  <label className={labelClass} htmlFor={`salt-${s.id}`}>
                    Alt-Text für Bild
                  </label>
                  <input
                    className={inputClass}
                    id={`salt-${s.id}`}
                    name="image_alt"
                    maxLength={300}
                    defaultValue={s.image_alt ?? ""}
                    placeholder="Kurze Bildbeschreibung für Screenreader und SEO."
                  />
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input className={inputClass} name="icon_name" defaultValue={s.icon_name ?? ""} placeholder="Icon Key" />
                    <input className={inputClass} name="tags" defaultValue={(s.tags ?? []).join(", ")} placeholder="Tags" />
                    <input className={inputClass} name="cta_label" defaultValue={s.cta_label ?? ""} placeholder="CTA Label" />
                    <input className={inputClass} name="animation_preset" defaultValue={s.animation_preset ?? ""} placeholder="Animation Preset" />
                    <input className={inputClass} name="video_url" defaultValue={s.video_url ?? ""} placeholder="Video URL" />
                    <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
                      <input type="checkbox" name="enable_3d" defaultChecked={s.enable_3d} className="h-4 w-4 rounded border-[var(--border-strong)]" />
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
                <DashboardFormActions
                  submitLabel="Leistung speichern"
                  hint="Änderungen wirken auf das Leistungs-Karussell und die Rückseite der Karte."
                />
              </form>
              <div className="mt-4 border-t border-[var(--border)] pt-4">
                <CardRowActions
                  kind="service"
                  id={s.id}
                  slug={s.slug}
                  title={s.title_de}
                />
              </div>
            </DashboardFormCard>
          ))
        )}
      </div>
    </>
  );
}
