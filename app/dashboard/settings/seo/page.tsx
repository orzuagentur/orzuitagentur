import { saveHomeSeo } from "@/actions/cms/seo-home";
import { deleteRedirectRule, saveRedirectRule } from "@/actions/cms/redirects";
import { saveRobots } from "@/actions/cms/robots";
import { saveSitemapSettings } from "@/actions/cms/sitemap";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import { DEFAULT_HOME_SEO } from "@/lib/cms/defaults";
import { getSeoEntries } from "@/lib/dashboard/cms-seo";
import { getRedirectRules } from "@/lib/dashboard/redirects";
import { getRobotsSettings } from "@/lib/dashboard/robots";
import { getSitemapSettings } from "@/lib/dashboard/sitemap-settings";
import { SettingsSubPage } from "../_shared";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]";
const labelClass = "block text-xs font-medium text-[var(--muted)]";

export default async function DashboardSettingsSeoPage() {
  const [rows, robots, redirects, sitemap] = await Promise.all([
    getSeoEntries(),
    getRobotsSettings(),
    getRedirectRules(),
    getSitemapSettings(),
  ]);
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
            <div>
              <label className={labelClass} htmlFor="seo_canonicalUrl">
                Canonical URL
              </label>
              <input
                className={inputClass}
                id="seo_canonicalUrl"
                name="seo_canonicalUrl"
                defaultValue={home?.canonical_url ?? ""}
                placeholder="https://orzuit.de/"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="seo_ogGeneratedPrompt">
                OG-Generator Prompt
              </label>
              <input
                className={inputClass}
                id="seo_ogGeneratedPrompt"
                name="seo_ogGeneratedPrompt"
                defaultValue={home?.og_generated_prompt ?? ""}
                placeholder="Clean dark luxury tech cover..."
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="seo_schemaJson">
                Schema.org JSON-LD
              </label>
              <textarea
                className={`${inputClass} min-h-[120px] font-mono text-xs`}
                id="seo_schemaJson"
                name="seo_schemaJson"
                defaultValue={
                  home?.schema_json && Object.keys(home.schema_json).length > 0
                    ? JSON.stringify(home.schema_json, null, 2)
                    : ""
                }
                placeholder='{"@context":"https://schema.org","@type":"Organization"}'
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <input
                  type="checkbox"
                  name="seo_robotsIndex"
                  defaultChecked={home?.robots_index ?? true}
                />
                Indexierung erlauben
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <input
                  type="checkbox"
                  name="seo_sitemapEnabled"
                  defaultChecked={home?.sitemap_enabled ?? true}
                />
                In Sitemap aufnehmen
              </label>
            </div>
            <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
              Startseiten-SEO speichern
            </DashboardSubmitButton>
          </form>
        </div>
      </div>

      <div className="px-4 pb-6 pt-2 sm:px-8 lg:px-10">
        <div className="max-w-2xl rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            robots.txt
          </h2>
          <form action={saveRobots} className="mt-4 space-y-4">
            <textarea
              className={`${inputClass} min-h-[180px] font-mono text-xs`}
              name="robots_body"
              defaultValue={robots.body}
            />
            <DashboardSubmitButton size="md" pendingLabel="Gespeichert">
              robots.txt speichern
            </DashboardSubmitButton>
          </form>
        </div>
      </div>

      <div className="grid gap-6 px-4 pb-6 pt-2 sm:px-8 lg:grid-cols-2 lg:px-10">
        <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Redirects 301/302
          </h2>
          <form action={saveRedirectRule} className="mt-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={inputClass} name="source_path" placeholder="/alte-seite" />
              <input className={inputClass} name="target_url" placeholder="/neue-seite oder https://..." />
            </div>
            <div className="grid gap-3 sm:grid-cols-[120px_1fr_auto]">
              <select className={inputClass} name="status_code" defaultValue="301">
                <option value="301">301</option>
                <option value="302">302</option>
              </select>
              <input className={inputClass} name="note" placeholder="Interne Notiz" />
              <label className="mt-3 flex items-center gap-2 text-sm text-[var(--foreground)]">
                <input type="checkbox" name="enabled" defaultChecked />
                Aktiv
              </label>
            </div>
            <DashboardSubmitButton size="sm" pendingLabel="Gespeichert">
              Redirect speichern
            </DashboardSubmitButton>
          </form>
          <div className="mt-5 space-y-2">
            {redirects.map((rule) => (
              <form
                key={rule.id}
                action={saveRedirectRule}
                className="rounded-xl border border-[var(--border)] p-3"
              >
                <input type="hidden" name="id" value={rule.id} />
                <div className="grid gap-2 sm:grid-cols-2">
                  <input className={inputClass} name="source_path" defaultValue={rule.source_path} />
                  <input className={inputClass} name="target_url" defaultValue={rule.target_url} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <select className={inputClass} name="status_code" defaultValue={rule.status_code}>
                    <option value="301">301</option>
                    <option value="302">302</option>
                  </select>
                  <input className={inputClass} name="note" defaultValue={rule.note ?? ""} />
                  <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                    <input type="checkbox" name="enabled" defaultChecked={rule.enabled} />
                    Aktiv
                  </label>
                  <DashboardSubmitButton size="sm" pendingLabel="Speichert">
                    Speichern
                  </DashboardSubmitButton>
                  <button
                    formAction={deleteRedirectRule}
                    className="rounded-full border border-red-400/35 px-3 py-2 text-xs text-red-200 hover:bg-red-500/10"
                  >
                    Löschen
                  </button>
                </div>
              </form>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-6">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Sitemap-Steuerung
          </h2>
          <form action={saveSitemapSettings} className="mt-4 space-y-4">
            <div className="grid gap-3">
              <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <input type="checkbox" name="includeStatic" defaultChecked={sitemap.includeStatic} />
                Statische Seiten aufnehmen
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <input type="checkbox" name="includePortfolio" defaultChecked={sitemap.includePortfolio} />
                Portfolio-Seiten aufnehmen
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <input type="checkbox" name="includeDynamicPages" defaultChecked={sitemap.includeDynamicPages} />
                Dynamische CMS-Seiten aufnehmen
              </label>
            </div>
            <select
              className={inputClass}
              name="defaultChangeFrequency"
              defaultValue={sitemap.defaultChangeFrequency}
            >
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
              <option value="monthly">monthly</option>
              <option value="yearly">yearly</option>
            </select>
            <DashboardSubmitButton size="sm" pendingLabel="Gespeichert">
              Sitemap speichern
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
                  <th className="px-4 py-3 font-medium">Index</th>
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
                      {s.robots_index ? "index" : "noindex"}
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
