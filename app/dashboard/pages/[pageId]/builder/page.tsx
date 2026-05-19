import {
  createPageBlock,
  createPageSection,
  updatePageBlock,
  updatePageSection,
} from "@/actions/cms/page-builder";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { BuilderDangerActions } from "@/components/dashboard/page-builder-danger-actions";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getDynamicPages, buildPagePath } from "@/lib/dashboard/pages";
import { getPageBuilderForAdmin } from "@/lib/dashboard/page-builder";
import {
  DEFAULT_SECTION_ANIMATION,
  DEFAULT_SECTION_LAYOUT,
  DEFAULT_SECTION_RESPONSIVE,
  PAGE_BLOCK_REGISTRY,
  PAGE_BLOCK_TYPES,
  type PageBuilderBlock,
  type PageBuilderSectionWithBlocks,
} from "@/lib/page-builder/types";
import Link from "next/link";
import { notFound } from "next/navigation";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

type PageBuilderAdminPageProps = {
  params: Promise<{ pageId: string }>;
};

export default async function PageBuilderAdminPage({
  params,
}: PageBuilderAdminPageProps) {
  const { pageId } = await params;
  const [pages, sections] = await Promise.all([
    getDynamicPages(),
    getPageBuilderForAdmin(pageId),
  ]);
  const page = pages.find((item) => item.id === pageId);
  if (!page) notFound();

  const pagePath = buildPagePath(page, pages);
  const nextSectionSort =
    sections.length > 0
      ? Math.max(...sections.map((section) => section.sort_order), 0) + 1
      : 1;

  return (
    <>
      <DashboardPageHeader
        title={`Page Builder · ${page.title_de}`}
        description="Sektionen und Blöcke steuern: Reihenfolge, Sichtbarkeit, Layout, Responsive und Animation."
      />

      <div className="space-y-8 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--surface-elevated)_72%,transparent)] p-6">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Neue Sektion
            </h2>
            <SectionForm
              action={createPageSection}
              pageId={pageId}
              submitLabel="Sektion anlegen"
              defaultSort={nextSectionSort}
            />
          </section>

          <aside className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_84%,transparent)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Live-Vorschau
            </p>
            <Link
              href={pagePath}
              target="_blank"
              className="mt-3 inline-flex text-sm font-medium text-[var(--accent)] hover:underline"
            >
              {pagePath}
            </Link>
            <div className="mt-5 rounded-xl border border-[var(--border)] bg-black/20 p-4">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {page.title_de}
              </p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                {sections.length} Sektionen ·{" "}
                {sections.reduce((sum, section) => sum + section.blocks.length, 0)}{" "}
                Blöcke
              </p>
              <div className="mt-4 space-y-2">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]"
                  >
                    {section.visible ? "●" : "○"} {section.title_de}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {sections.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 text-sm text-[var(--muted)]">
            Noch keine Sektionen. Legen Sie oben die erste Sektion an.
          </div>
        ) : (
          sections.map((section) => (
            <SectionEditor key={section.id} pageId={pageId} section={section} />
          ))
        )}
      </div>
    </>
  );
}

function valueOf(record: Record<string, unknown>, key: string, fallback: string) {
  const value = record[key];
  return typeof value === "string" ? value : fallback;
}

function boolOf(record: Record<string, unknown>, key: string, fallback: boolean) {
  const value = record[key];
  return typeof value === "boolean" ? value : fallback;
}

function SectionEditor({
  pageId,
  section,
}: {
  pageId: string;
  section: PageBuilderSectionWithBlocks;
}) {
  const nextBlockSort =
    section.blocks.length > 0
      ? Math.max(...section.blocks.map((block) => block.sort_order), 0) + 1
      : 1;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Sektion · {section.section_key} · {section.visible ? "sichtbar" : "aus"}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
            {section.title_de}
          </h2>
        </div>
        <BuilderDangerActions
          kind="section"
          id={section.id}
          pageId={pageId}
          title={section.title_de}
        />
      </div>

      <SectionForm
        action={updatePageSection}
        pageId={pageId}
        section={section}
        submitLabel="Sektion speichern"
      />

      <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] p-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Neuen Block hinzufügen
        </h3>
        <BlockForm
          action={createPageBlock}
          pageId={pageId}
          sectionId={section.id}
          submitLabel="Block anlegen"
          defaultSort={nextBlockSort}
        />
      </div>

      {section.blocks.length > 0 ? (
        <div className="mt-6 space-y-4">
          {section.blocks.map((block) => (
            <BlockEditor
              key={block.id}
              pageId={pageId}
              sectionId={section.id}
              block={block}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function SectionForm({
  action,
  pageId,
  section,
  submitLabel,
  defaultSort = 0,
}: {
  action: (formData: FormData) => void | Promise<void>;
  pageId: string;
  section?: PageBuilderSectionWithBlocks;
  submitLabel: string;
  defaultSort?: number;
}) {
  const layout = section?.layout ?? DEFAULT_SECTION_LAYOUT;
  const responsive = section?.responsive ?? DEFAULT_SECTION_RESPONSIVE;
  const animation = section?.animation ?? DEFAULT_SECTION_ANIMATION;

  return (
    <form action={action} className="mt-4 space-y-4">
      <input type="hidden" name="page_id" value={pageId} />
      {section ? <input type="hidden" name="id" value={section.id} /> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className={labelClass}>Titel</label>
          <input
            className={inputClass}
            name="title_de"
            defaultValue={section?.title_de ?? ""}
            placeholder="Hero / FAQ / CTA"
          />
        </div>
        <div>
          <label className={labelClass}>Section Key</label>
          <input
            className={inputClass}
            name="section_key"
            defaultValue={section?.section_key ?? "section"}
            placeholder="hero"
          />
        </div>
        <div>
          <label className={labelClass}>Reihenfolge</label>
          <input
            className={inputClass}
            name="sort_order"
            type="number"
            defaultValue={section?.sort_order ?? defaultSort}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <SelectField
          name="layout_paddingTop"
          label="Padding oben"
          value={valueOf(layout, "paddingTop", DEFAULT_SECTION_LAYOUT.paddingTop)}
          options={["none", "sm", "md", "lg", "xl"]}
        />
        <SelectField
          name="layout_paddingBottom"
          label="Padding unten"
          value={valueOf(layout, "paddingBottom", DEFAULT_SECTION_LAYOUT.paddingBottom)}
          options={["none", "sm", "md", "lg", "xl"]}
        />
        <SelectField
          name="layout_marginTop"
          label="Margin oben"
          value={valueOf(layout, "marginTop", DEFAULT_SECTION_LAYOUT.marginTop)}
          options={["none", "sm", "md", "lg", "xl"]}
        />
        <SelectField
          name="layout_background"
          label="Hintergrund"
          value={valueOf(layout, "background", DEFAULT_SECTION_LAYOUT.background)}
          options={["transparent", "surface", "elevated", "dark", "accent"]}
        />
        <div>
          <label className={labelClass}>Gradient</label>
          <input
            className={inputClass}
            name="layout_gradient"
            defaultValue={valueOf(layout, "gradient", "")}
            placeholder="optional"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SelectField
          name="responsive_mobile"
          label="Mobile"
          value={valueOf(responsive, "mobile", DEFAULT_SECTION_RESPONSIVE.mobile)}
          options={["stack", "hide", "compact"]}
        />
        <SelectField
          name="responsive_tablet"
          label="Tablet"
          value={valueOf(responsive, "tablet", DEFAULT_SECTION_RESPONSIVE.tablet)}
          options={["stack", "grid", "compact"]}
        />
        <SelectField
          name="responsive_desktop"
          label="Desktop"
          value={valueOf(responsive, "desktop", DEFAULT_SECTION_RESPONSIVE.desktop)}
          options={["wide", "grid", "split", "narrow"]}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SelectField
          name="animation_preset"
          label="Animation"
          value={valueOf(animation, "preset", DEFAULT_SECTION_ANIMATION.preset)}
          options={["none", "fade-up", "fade", "scale", "slide", "parallax"]}
        />
        <SelectField
          name="animation_intensity"
          label="Intensität"
          value={valueOf(animation, "intensity", DEFAULT_SECTION_ANIMATION.intensity)}
          options={["low", "medium", "high"]}
        />
        <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            name="animation_scroll"
            value="true"
            defaultChecked={boolOf(animation, "scroll", true)}
            className="h-4 w-4 rounded border-[var(--border-strong)]"
          />
          Scroll Animation
        </label>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
        <input
          type="checkbox"
          name="visible"
          value="true"
          defaultChecked={section?.visible ?? true}
          className="h-4 w-4 rounded border-[var(--border-strong)]"
        />
        Sichtbar
      </label>

      <DashboardSubmitButton pendingLabel="Gespeichert">
        {submitLabel}
      </DashboardSubmitButton>
    </form>
  );
}

function BlockEditor({
  pageId,
  sectionId,
  block,
}: {
  pageId: string;
  sectionId: string;
  block: PageBuilderBlock;
}) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            {PAGE_BLOCK_REGISTRY[block.block_type].label} ·{" "}
            {block.visible ? "sichtbar" : "aus"}
          </p>
          <h3 className="mt-1 text-base font-semibold text-[var(--foreground)]">
            {block.title_de}
          </h3>
        </div>
        <BuilderDangerActions
          kind="block"
          id={block.id}
          pageId={pageId}
          title={block.title_de}
        />
      </div>
      <BlockForm
        action={updatePageBlock}
        pageId={pageId}
        sectionId={sectionId}
        block={block}
        submitLabel="Block speichern"
      />
    </article>
  );
}

function BlockForm({
  action,
  pageId,
  sectionId,
  block,
  submitLabel,
  defaultSort = 0,
}: {
  action: (formData: FormData) => void | Promise<void>;
  pageId: string;
  sectionId: string;
  block?: PageBuilderBlock;
  submitLabel: string;
  defaultSort?: number;
}) {
  const settings = block?.settings ?? {};

  return (
    <form action={action} className="mt-4 space-y-4">
      <input type="hidden" name="page_id" value={pageId} />
      <input type="hidden" name="section_id" value={sectionId} />
      {block ? <input type="hidden" name="id" value={block.id} /> : null}

      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className={labelClass}>Block-Typ</label>
          <select
            className={inputClass}
            name="block_type"
            defaultValue={block?.block_type ?? "markdown"}
          >
            {PAGE_BLOCK_TYPES.map((type) => (
              <option key={type} value={type}>
                {PAGE_BLOCK_REGISTRY[type].label}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Titel</label>
          <input
            className={inputClass}
            name="title_de"
            defaultValue={block?.title_de ?? ""}
            placeholder="Block-Titel"
          />
        </div>
        <div>
          <label className={labelClass}>Reihenfolge</label>
          <input
            className={inputClass}
            name="sort_order"
            type="number"
            defaultValue={block?.sort_order ?? defaultSort}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Content / Markdown / HTML</label>
        <textarea
          className={`${inputClass} min-h-[140px] text-[13px] leading-relaxed`}
          name="content_de"
          defaultValue={block?.content_de ?? ""}
          placeholder="Text, Markdown oder Custom HTML je nach Block-Typ."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className={labelClass}>Button Label</label>
          <input
            className={inputClass}
            name="settings_buttonLabel"
            defaultValue={valueOf(settings, "buttonLabel", "")}
          />
        </div>
        <div>
          <label className={labelClass}>Button Link</label>
          <input
            className={inputClass}
            name="settings_buttonHref"
            defaultValue={valueOf(settings, "buttonHref", "")}
          />
        </div>
        <div>
          <label className={labelClass}>React Key</label>
          <input
            className={inputClass}
            name="settings_reactKey"
            defaultValue={valueOf(settings, "reactKey", "")}
            placeholder="reserved"
          />
        </div>
        <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            name="settings_sandbox"
            value="true"
            defaultChecked={boolOf(settings, "sandbox", true)}
            className="h-4 w-4 rounded border-[var(--border-strong)]"
          />
          Sandbox
        </label>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
        <input
          type="checkbox"
          name="visible"
          value="true"
          defaultChecked={block?.visible ?? true}
          className="h-4 w-4 rounded border-[var(--border-strong)]"
        />
        Sichtbar
      </label>

      <DashboardSubmitButton pendingLabel="Gespeichert">
        {submitLabel}
      </DashboardSubmitButton>
    </form>
  );
}

function SelectField({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value: string;
  options: string[];
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select className={inputClass} name={name} defaultValue={value}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
