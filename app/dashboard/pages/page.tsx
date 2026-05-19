import { createDynamicPage, updateDynamicPage } from "@/actions/cms/pages";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { DynamicPageActions } from "@/components/dashboard/dynamic-page-actions";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { buildPagePath, getDynamicPages } from "@/lib/dashboard/pages";
import Link from "next/link";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

export default async function DashboardPagesPage() {
  const pages = await getDynamicPages();
  const nextSort =
    pages.length > 0
      ? Math.max(...pages.map((page) => page.sort_order), 0) + 1
      : 1;

  return (
    <>
      <DashboardPageHeader
        title="Dynamische Seiten"
        description="Seiten anlegen, verschachteln, als Draft/Published/Scheduled steuern und Template/Locale wählen."
      />

      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <section className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_72%,transparent)] p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Neue Seite anlegen
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Startet als einfache CMS-Seite. Inhalte können später in den Page
            Builder übernommen werden.
          </p>
          <PageFields
            action={createDynamicPage}
            submitLabel="Seite anlegen"
            defaultSort={nextSort}
            pages={pages}
          />
        </section>

        {pages.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 text-sm text-[var(--muted)]">
            Noch keine dynamischen Seiten angelegt.
          </div>
        ) : (
          pages.map((page) => {
            const path = buildPagePath(page, pages);
            return (
              <section
                key={page.id}
                className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                      {page.locale.toUpperCase()} · {page.status} · {page.template}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                      {page.title_de}
                    </h2>
                    <Link
                      href={path}
                      target="_blank"
                      className="mt-1 inline-flex text-xs text-[var(--accent)] hover:underline"
                    >
                      {path}
                    </Link>
                    <Link
                      href={`/dashboard/pages/${page.id}/builder`}
                      className="ml-3 inline-flex text-xs text-[var(--accent)] hover:underline"
                    >
                      Page Builder öffnen
                    </Link>
                  </div>
                  <DynamicPageActions id={page.id} title={page.title_de} />
                </div>

                <PageFields
                  action={updateDynamicPage}
                  submitLabel="Seite speichern"
                  page={page}
                  pages={pages}
                />
              </section>
            );
          })
        )}
      </div>
    </>
  );
}

type PageFieldsProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  defaultSort?: number;
  page?: Awaited<ReturnType<typeof getDynamicPages>>[number];
  pages: Awaited<ReturnType<typeof getDynamicPages>>;
};

function PageFields({
  action,
  submitLabel,
  defaultSort = 0,
  page,
  pages,
}: PageFieldsProps) {
  const parentOptions = pages.filter((item) => item.id !== page?.id);

  return (
    <form action={action} className="mt-4 space-y-4">
      {page ? <input type="hidden" name="id" value={page.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor={`title-${page?.id ?? "new"}`}>
            Titel DE
          </label>
          <input
            className={inputClass}
            id={`title-${page?.id ?? "new"}`}
            name="title_de"
            required
            defaultValue={page?.title_de ?? ""}
            placeholder="z. B. Über OrzuIT"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`slug-${page?.id ?? "new"}`}>
            Slug
          </label>
          <input
            className={inputClass}
            id={`slug-${page?.id ?? "new"}`}
            name="slug"
            defaultValue={page?.slug ?? ""}
            placeholder="ueber-orzuit"
          />
        </div>
        <div>
          <label className={labelClass}>Titel EN</label>
          <input
            className={inputClass}
            name="title_en"
            defaultValue={page?.title_en ?? ""}
            placeholder="Optional"
          />
        </div>
        <div>
          <label className={labelClass}>Parent / Übergeordnete Seite</label>
          <select
            className={inputClass}
            name="parent_id"
            defaultValue={page?.parent_id ?? ""}
          >
            <option value="">Keine Parent-Seite</option>
            {parentOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title_de} ({buildPagePath(item, pages)})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select className={inputClass} name="status" defaultValue={page?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Geplant für</label>
          <input
            className={inputClass}
            name="scheduled_at"
            type="datetime-local"
            defaultValue={page?.scheduled_at?.slice(0, 16) ?? ""}
          />
        </div>
        <div>
          <label className={labelClass}>Locale</label>
          <select className={inputClass} name="locale" defaultValue={page?.locale ?? "de"}>
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Template</label>
          <select className={inputClass} name="template" defaultValue={page?.template ?? "blank"}>
            <option value="blank">Blank</option>
            <option value="landing">Landing</option>
            <option value="legal">Legal</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Reihenfolge</label>
          <input
            className={`${inputClass} w-28`}
            name="sort_order"
            type="number"
            defaultValue={page?.sort_order ?? defaultSort}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Kurzbeschreibung</label>
        <textarea
          className={`${inputClass} min-h-[80px]`}
          name="excerpt_de"
          defaultValue={page?.excerpt_de ?? ""}
        />
      </div>
      <div>
        <label className={labelClass}>SEO Description</label>
        <input
          className={inputClass}
          name="meta_description_de"
          defaultValue={page?.meta_description_de ?? ""}
        />
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          SEO Control Center
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>SEO Title</label>
            <input
              className={inputClass}
              name="seo_title"
              defaultValue={page?.seo_title ?? ""}
              placeholder="Optional, sonst Seitentitel"
            />
          </div>
          <div>
            <label className={labelClass}>Canonical URL</label>
            <input
              className={inputClass}
              name="canonical_url"
              defaultValue={page?.canonical_url ?? ""}
              placeholder="https://orzuit.de/..."
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>SEO Beschreibung</label>
            <textarea
              className={`${inputClass} min-h-[80px]`}
              name="seo_description"
              defaultValue={page?.seo_description ?? ""}
            />
          </div>
          <div>
            <label className={labelClass}>OG-Bild URL / Upload URL</label>
            <input
              className={inputClass}
              name="og_image_url"
              defaultValue={page?.og_image_url ?? ""}
              placeholder="https://.../og.png"
            />
          </div>
          <div>
            <label className={labelClass}>OG-Generator Prompt</label>
            <input
              className={inputClass}
              name="og_generated_prompt"
              defaultValue={page?.og_generated_prompt ?? ""}
              placeholder="Luxuriöses OrzuIT Titelbild..."
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Schema.org JSON-LD</label>
            <textarea
              className={`${inputClass} min-h-[120px] font-mono text-xs`}
              name="schema_json"
              defaultValue={
                page?.schema_json && Object.keys(page.schema_json).length > 0
                  ? JSON.stringify(page.schema_json, null, 2)
                  : ""
              }
              placeholder='{"@context":"https://schema.org","@type":"WebPage"}'
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              name="robots_index"
              defaultChecked={page?.robots_index ?? true}
            />
            Indexierung erlauben
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              name="sitemap_enabled"
              defaultChecked={page?.sitemap_enabled ?? true}
            />
            In Sitemap aufnehmen
          </label>
        </div>
      </div>
      <div>
        <label className={labelClass}>Seiteninhalt</label>
        <textarea
          className={`${inputClass} min-h-[180px] text-[13px] leading-relaxed`}
          name="body_de"
          defaultValue={page?.body_de ?? ""}
          placeholder="Absätze mit Leerzeile trennen."
        />
      </div>

      <DashboardSubmitButton pendingLabel="Gespeichert">
        {submitLabel}
      </DashboardSubmitButton>
    </form>
  );
}
