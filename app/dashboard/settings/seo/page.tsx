import { saveHomeSeo } from "@/actions/cms/seo-home";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { DEFAULT_HOME_SEO } from "@/lib/cms/defaults";
import { getSeoEntries } from "@/lib/dashboard/cms-seo";
import { SettingsSubPage } from "../_shared";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

export default async function DashboardSettingsSeoPage() {
  const rows = await getSeoEntries();
  const home = rows.find((r) => r.path === "/");

  return (
    <SettingsSubPage pathname="/dashboard/settings/seo">
      <div className="px-4 pb-6 pt-2 sm:px-8 lg:px-10">
        <div className="max-w-2xl rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Startseite (Pfad <code className="font-mono text-xs">/</code>)
          </h2>
          <form action={saveHomeSeo} className="mt-4 space-y-4">
            <div>
              <label className={labelClass} htmlFor="seo_title">
                Titel
              </label>
              <input
                className={inputClass}
                id="seo_title"
                name="seo_title"
                defaultValue={home?.title_de ?? DEFAULT_HOME_SEO.title}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="seo_description">
                Beschreibung
              </label>
              <textarea
                className={`${inputClass} min-h-[90px]`}
                id="seo_description"
                name="seo_description"
                defaultValue={home?.description_de ?? DEFAULT_HOME_SEO.description}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="seo_ogImageUrl">
                OG-Bild-URL (optional)
              </label>
              <input
                className={inputClass}
                id="seo_ogImageUrl"
                name="seo_ogImageUrl"
                defaultValue={home?.og_image_url ?? ""}
                placeholder="https://…"
              />
            </div>
            <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
              Startseiten-SEO speichern
            </DashboardSubmitButton>
          </form>
        </div>
      </div>

      <div className="px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] px-4 py-8 text-sm text-[var(--muted)]">
            Keine weiteren SEO-Zeilen geladen — Service-Role prüfen oder Zeilen in
            Supabase anlegen.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-white/[0.02] text-xs uppercase tracking-wider text-[var(--muted)]">
                  <th className="px-4 py-3 font-medium">Pfad</th>
                  <th className="px-4 py-3 font-medium">Titel</th>
                  <th className="px-4 py-3 font-medium">Beschreibung</th>
                  <th className="px-4 py-3 font-medium">OG-Bild-URL</th>
                  <th className="px-4 py-3 font-medium">Aktualisiert</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr
                    key={s.path}
                    className="border-b border-[var(--border)] align-top last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[var(--foreground)]">
                      {s.path}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-[var(--foreground)]">
                      {s.title_de ?? "—"}
                    </td>
                    <td className="max-w-md px-4 py-3 text-[var(--muted)]">
                      <span className="line-clamp-3">{s.description_de ?? "—"}</span>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-xs text-[var(--accent)]">
                      {s.og_image_url ? (
                        <a
                          href={s.og_image_url}
                          className="underline-offset-4 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Link
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">
                      {new Intl.DateTimeFormat("de-DE", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(s.updated_at))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SettingsSubPage>
  );
}
