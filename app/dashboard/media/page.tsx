import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getMediaAssets } from "@/lib/dashboard/media-library";
import Link from "next/link";

export default async function DashboardMediaPage() {
  const assets = await getMediaAssets();
  const withImages = assets.filter((asset) => asset.image_url);
  const withoutAlt = withImages.filter((asset) => !asset.image_alt?.trim());

  return (
    <>
      <DashboardPageHeader
        title="Medien-Bibliothek"
        description="Zentrale Übersicht der Bilder aus Leistungs- und Portfolio-Karten."
      />

      <div className="space-y-6 px-4 pb-16 pt-2 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Bilder gesamt" value={withImages.length} />
          <StatCard label="Ohne Alt-Text" value={withoutAlt.length} />
          <StatCard label="Verbunden mit Karten" value={assets.length} />
        </div>

        {assets.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 text-sm text-[var(--muted)]">
            Noch keine Medien gefunden. Laden Sie Bilder bei Leistungen oder Portfolio
            hoch.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {assets.map((asset) => (
              <article
                key={`${asset.source}-${asset.id}`}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_86%,black)]"
              >
                {asset.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.image_url}
                    alt={asset.image_alt?.trim() || asset.title}
                    className="aspect-[16/9] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center bg-white/[0.025] px-4 text-center text-xs text-[var(--muted)]">
                    Kein Bild hinterlegt
                  </div>
                )}

                <div className="space-y-3 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                        {asset.sourceLabel}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                        {asset.title}
                      </h2>
                      <p className="mt-1 text-xs text-[var(--muted)]">{asset.slug}</p>
                    </div>
                    <Link
                      href={asset.editHref}
                      className="rounded-full border border-[var(--border-strong)] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
                    >
                      Bearbeiten
                    </Link>
                  </div>

                  <div className="rounded-xl border border-[var(--border)] bg-white/[0.02] p-3">
                    <p className="text-xs font-semibold text-[var(--muted)]">
                      Alt-Text
                    </p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">
                      {asset.image_alt?.trim() ||
                        "Fehlt noch. Für Barrierefreiheit und SEO ergänzen."}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}
