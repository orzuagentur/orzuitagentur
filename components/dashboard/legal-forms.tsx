import {
  resetLegalToDefaults,
  saveLegalDatenschutz,
  saveLegalImpressum,
  saveLegalOperator,
} from "@/actions/cms/legal";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { LegalSectionsEditor } from "@/components/dashboard/legal-sections-editor";
import type { LegalContent } from "@/lib/legal/cms-types";
import Link from "next/link";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

type LegalFormsProps = {
  legal: LegalContent;
};

function ResetButton({ target, label }: { target: string; label: string }) {
  return (
    <form action={resetLegalToDefaults} className="inline">
      <input type="hidden" name="reset_target" value={target} />
      <button
        type="submit"
        className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
      >
        {label}
      </button>
    </form>
  );
}

export function LegalForms({ legal }: LegalFormsProps) {
  const op = legal.operator;
  const imp = legal.impressum;
  const ds = legal.datenschutz;

  return (
    <div className="max-w-4xl space-y-10 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
      <div className="flex flex-wrap gap-3 text-xs text-[var(--muted)]">
        <Link
          href="/impressum"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline"
        >
          Impressum öffnen ↗
        </Link>
        <Link
          href="/datenschutz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:underline"
        >
          Datenschutz öffnen ↗
        </Link>
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Anbieter &amp; Kontakt
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Firmendaten für Impressum, Datenschutz und Verantwortlicher. Werden in Adressblöcken
              nicht automatisch eingefügt — dort Texte im Abschnittseditor pflegen.
            </p>
          </div>
          <ResetButton target="operator" label="Standardwerte" />
        </div>

        <form action={saveLegalOperator} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="op_brand">
                Marke / Anzeigename
              </label>
              <input className={inputClass} id="op_brand" name="op_brand" defaultValue={op.brand} />
            </div>
            <div>
              <label className={labelClass} htmlFor="op_company">
                Firma (TMG)
              </label>
              <input
                className={inputClass}
                id="op_company"
                name="op_company"
                defaultValue={op.company}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="op_representative">
                Vertreten durch
              </label>
              <input
                className={inputClass}
                id="op_representative"
                name="op_representative"
                defaultValue={op.representative}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="op_addressLine1">
                Adresse Zeile 1
              </label>
              <input
                className={inputClass}
                id="op_addressLine1"
                name="op_addressLine1"
                defaultValue={op.addressLine1}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="op_addressLine2">
                Adresse Zeile 2
              </label>
              <input
                className={inputClass}
                id="op_addressLine2"
                name="op_addressLine2"
                defaultValue={op.addressLine2}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="op_email">
                E-Mail
              </label>
              <input
                className={inputClass}
                id="op_email"
                name="op_email"
                type="email"
                defaultValue={op.email}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="op_phone">
                Telefon
              </label>
              <input className={inputClass} id="op_phone" name="op_phone" defaultValue={op.phone} />
            </div>
            <div>
              <label className={labelClass} htmlFor="op_vatId">
                USt-IdNr.
              </label>
              <input className={inputClass} id="op_vatId" name="op_vatId" defaultValue={op.vatId} />
            </div>
            <div>
              <label className={labelClass} htmlFor="op_registerCourt">
                Registergericht
              </label>
              <input
                className={inputClass}
                id="op_registerCourt"
                name="op_registerCourt"
                defaultValue={op.registerCourt}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="op_registerNumber">
                Registernummer
              </label>
              <input
                className={inputClass}
                id="op_registerNumber"
                name="op_registerNumber"
                defaultValue={op.registerNumber}
              />
            </div>
          </div>
          <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
            Anbieterdaten speichern
          </DashboardSubmitButton>
        </form>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">Impressum</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Seite /impressum — Abschnitte hinzufügen, bearbeiten oder löschen.
            </p>
          </div>
          <ResetButton target="impressum" label="Impressum zurücksetzen" />
        </div>

        <form action={saveLegalImpressum} className="mt-4 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="impressum_title">
                Seitentitel
              </label>
              <input
                className={inputClass}
                id="impressum_title"
                name="impressum_title"
                defaultValue={imp.title}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="impressum_metaDescription">
                Meta-Beschreibung (SEO)
              </label>
              <input
                className={inputClass}
                id="impressum_metaDescription"
                name="impressum_metaDescription"
                defaultValue={imp.metaDescription}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="impressum_intro">
                Einleitung
              </label>
              <textarea
                className={`${inputClass} min-h-[72px]`}
                id="impressum_intro"
                name="impressum_intro"
                defaultValue={imp.intro}
              />
            </div>
          </div>

          <LegalSectionsEditor name="impressum_sections" initialSections={imp.sections} />

          <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
            Impressum speichern
          </DashboardSubmitButton>
        </form>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Datenschutzerklärung
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Seite /datenschutz — vollständiger Text steuerbar.
            </p>
          </div>
          <ResetButton target="datenschutz" label="Datenschutz zurücksetzen" />
        </div>

        <form action={saveLegalDatenschutz} className="mt-4 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="datenschutz_title">
                Seitentitel
              </label>
              <input
                className={inputClass}
                id="datenschutz_title"
                name="datenschutz_title"
                defaultValue={ds.title}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="datenschutz_metaDescription">
                Meta-Beschreibung (SEO)
              </label>
              <input
                className={inputClass}
                id="datenschutz_metaDescription"
                name="datenschutz_metaDescription"
                defaultValue={ds.metaDescription}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="datenschutz_intro">
                Einleitung
              </label>
              <textarea
                className={`${inputClass} min-h-[72px]`}
                id="datenschutz_intro"
                name="datenschutz_intro"
                defaultValue={ds.intro}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <input
                  type="checkbox"
                  name="datenschutz_showUpdatedLabel"
                  defaultChecked={ds.showUpdatedLabel}
                  className="h-4 w-4 rounded border-[var(--border-strong)]"
                />
                Aktuelles Datum unter der Einleitung anzeigen
              </label>
            </div>
          </div>

          <LegalSectionsEditor
            name="datenschutz_sections"
            initialSections={ds.sections}
          />

          <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
            Datenschutz speichern
          </DashboardSubmitButton>
        </form>
      </section>

      <section className="rounded-2xl border border-dashed border-[var(--border)] p-4">
        <p className="text-xs text-[var(--muted)]">
          Gesamten Rechtstext (Anbieter + Impressum + Datenschutz) auf Werkstandards
          zurücksetzen:
        </p>
        <form action={resetLegalToDefaults} className="mt-3">
          <input type="hidden" name="reset_target" value="all" />
          <button
            type="submit"
            className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-100/90"
          >
            Alles auf Standard zurücksetzen
          </button>
        </form>
      </section>
    </div>
  );
}
