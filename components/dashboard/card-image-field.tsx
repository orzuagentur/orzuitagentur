import { uploadCardImage } from "@/actions/cms/upload-card-image";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";
import Image from "next/image";

const SUPABASE_PUBLIC_RE =
  /supabase\.co\/storage\/v1\/object\/public\//i;

type CardImageFieldProps = {
  table: "services" | "portfolio_entries";
  id: string;
  slug: string;
  title: string;
  imageUrl: string | null;
  returnPath: string;
};

const labelClass = "block text-xs font-medium text-[var(--muted)]";

export function CardImageField({
  table,
  id,
  slug,
  title,
  imageUrl,
  returnPath,
}: CardImageFieldProps) {
  const hasImage = Boolean(imageUrl?.trim());

  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Kartenbild
      </p>

      <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[#08080f]">
        {hasImage && imageUrl ? (
          SUPABASE_PUBLIC_RE.test(imageUrl) ? (
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className="aspect-[16/10] w-full object-cover"
            />
          )
        ) : (
          <div className="flex aspect-[16/10] items-center justify-center px-4 text-center text-xs text-[var(--muted)]">
            Kein Bild — es wird das farbige Theme der Karte angezeigt.
          </div>
        )}
      </div>

      <form action={uploadCardImage} encType="multipart/form-data" className="mt-3 space-y-2">
        <input type="hidden" name="table" value={table} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="return_path" value={returnPath} />
        <div>
          <label className={labelClass} htmlFor={`img-file-${id}`}>
            Bild hochladen (JPG, PNG, WebP, max. 5 MB)
          </label>
          <input
            id={`img-file-${id}`}
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="mt-1 block w-full text-sm text-[var(--muted)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--surface-elevated)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--foreground)]"
          />
        </div>
        <DashboardSubmitButton size="sm" pendingLabel="Wird hochgeladen…">
          Bild hochladen
        </DashboardSubmitButton>
      </form>

      <p className="mt-3 text-xs text-[var(--muted)]">
        Alternativ unten eine Bild-URL eintragen oder „Bild entfernen“ aktivieren.
      </p>
    </div>
  );
}
