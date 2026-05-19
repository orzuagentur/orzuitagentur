import { saveDesignSystem } from "@/actions/cms/marketing";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import type { CSSProperties } from "react";
import { loadMarketingForAdmin } from "@/lib/cms/persist";
import { SettingsSubPage } from "../_shared";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

export default async function DashboardDesignPage() {
  const { designSystem: d } = await loadMarketingForAdmin();
  const previewStyle = {
    "--preview-accent": d.accent,
    "--preview-accent-2": d.accent2,
    "--preview-foreground": d.foreground,
    "--preview-background": d.background,
  } as CSSProperties;

  return (
    <SettingsSubPage pathname="/dashboard/settings/design">
      <div className="grid gap-6 px-4 pb-16 pt-2 sm:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-10">
        <form
          action={saveDesignSystem}
          className="space-y-6 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6"
        >
          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Farben & Typografie
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Accent" name="design_accent" value={d.accent} />
              <Field label="Accent 2" name="design_accent2" value={d.accent2} />
              <Field label="Textfarbe" name="design_foreground" value={d.foreground} />
              <Field label="Hintergrund" name="design_background" value={d.background} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select name="design_typographyScale" label="Typografie" value={d.typographyScale} options={["compact", "comfortable", "large"]} />
              <Select name="design_radius" label="Radius" value={d.radius} options={["sharp", "rounded", "pill"]} />
              <Select name="design_spacingPreset" label="Spacing" value={d.spacingPreset} options={["compact", "luxury", "spacious"]} />
              <Select name="design_sectionPadding" label="Section Padding" value={d.sectionPadding} options={["small", "large", "cinematic"]} />
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Schatten, Borders & Glass
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select name="design_shadowPreset" label="Shadow" value={d.shadowPreset} options={["none", "soft", "deep", "neon"]} />
              <Select name="design_borderPreset" label="Border" value={d.borderPreset} options={["none", "subtle", "strong", "accent"]} />
              <Check name="design_glassmorphism" label="Glassmorphism" checked={d.glassmorphism} />
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Motion & Animation
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Select name="design_motionPreset" label="Motion Preset" value={d.motionPreset} options={["minimal", "smooth", "cinematic", "energetic"]} />
              <Select name="design_framerPreset" label="Framer Preset" value={d.framerPreset} options={["fade", "smooth", "spring", "depth"]} />
              <Select name="design_scrollRevealIntensity" label="Scroll Reveal" value={d.scrollRevealIntensity} options={["off", "low", "medium", "high"]} />
              <Check name="design_reducedMotion" label="Reduced Motion" checked={d.reducedMotion} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Check name="design_parallaxEnabled" label="Parallax global" checked={d.parallaxEnabled} />
              <Check name="design_tiltEnabled" label="Tilt global" checked={d.tiltEnabled} />
              <Check name="design_glowEnabled" label="Glow global" checked={d.glowEnabled} />
            </div>
          </section>

          <DashboardSubmitButton pendingLabel="Gespeichert">
            Design System speichern
          </DashboardSubmitButton>
        </form>

        <aside
          className="rounded-3xl border border-[var(--border)] p-5"
          style={previewStyle}
        >
          <div className="rounded-3xl border border-[color-mix(in_oklab,var(--preview-accent)_36%,transparent)] bg-[var(--preview-background)] p-6 text-[var(--preview-foreground)] shadow-[var(--site-card-shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--preview-accent)]">
              Live Theme Preview
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              OrzuIT Control Center
            </h2>
            <p className="mt-3 text-sm leading-6 opacity-75">
              Farben, Typografie, Motion, Glassmorphism und Schatten werden hier
              sofort als visuelles System geprüft.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-[color-mix(in_oklab,var(--preview-accent-2)_34%,transparent)] bg-white/5 p-4">
                <p className="text-sm font-medium">Premium Karte</p>
                <p className="mt-1 text-xs opacity-70">
                  {d.motionPreset} · {d.framerPreset} · reveal {d.scrollRevealIntensity}
                </p>
              </div>
              <button className="rounded-full bg-[var(--preview-accent)] px-5 py-3 text-sm font-semibold text-black">
                CTA Vorschau
              </button>
            </div>
          </div>
        </aside>
      </div>
    </SettingsSubPage>
  );
}

function Field({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <label className={labelClass}>
      {label}
      <input className={inputClass} name={name} defaultValue={value} />
    </label>
  );
}

function Select({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
}) {
  return (
    <label className={labelClass}>
      {label}
      <select className={inputClass} name={name} defaultValue={value}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Check({
  label,
  name,
  checked,
}: {
  label: string;
  name: string;
  checked: boolean;
}) {
  return (
    <label className="mt-6 flex items-center gap-2 text-sm text-[var(--foreground)]">
      <input type="checkbox" name={name} defaultChecked={checked} />
      {label}
    </label>
  );
}
