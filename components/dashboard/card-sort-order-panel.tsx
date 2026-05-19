import { saveCardSortOrder } from "@/actions/cms/tables";
import { DashboardSubmitButton } from "@/components/dashboard/dashboard-submit-button";

type SortRow = {
  id: string;
  title: string;
  sort_order: number;
};

type CardSortOrderPanelProps = {
  kind: "services" | "portfolio" | "testimonials";
  title: string;
  rows: SortRow[];
};

export function CardSortOrderPanel({
  kind,
  title,
  rows,
}: CardSortOrderPanelProps) {
  if (rows.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_76%,transparent)] p-5">
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        {title}
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Kleine Zahl = weiter oben / früher auf der Website. Mehrere Werte ändern
        und einmal speichern.
      </p>
      <form action={saveCardSortOrder} className="mt-4 space-y-3">
        <input type="hidden" name="kind" value={kind} />
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((row) => (
            <label
              key={row.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-white/[0.02] px-3 py-2"
            >
              <span className="min-w-0 truncate text-sm text-[var(--foreground)]">
                {row.title}
              </span>
              <input
                className="w-24 rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,black)] px-2 py-1 text-sm text-[var(--foreground)] outline-none focus:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]"
                name={`sort_${row.id}`}
                type="number"
                defaultValue={row.sort_order}
                aria-label={`Reihenfolge für ${row.title}`}
              />
            </label>
          ))}
        </div>
        <DashboardSubmitButton size="sm" pendingLabel="Sortiert">
          Reihenfolge speichern
        </DashboardSubmitButton>
      </form>
    </section>
  );
}
