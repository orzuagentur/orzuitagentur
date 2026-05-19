import Link from "next/link";
import type { AdminHubCard } from "@/lib/dashboard/admin-modules";

const kindLabel: Record<AdminHubCard["kind"], string> = {
  text: "Texte",
  entries: "Einträge",
  system: "System",
};

type AdminHubGridProps = {
  cards: AdminHubCard[];
  previewBase?: string;
};

export function AdminHubGrid({ cards, previewBase = "/" }: AdminHubGridProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <li key={card.href}>
          <Link
            href={card.href}
            className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_82%,transparent)] p-5 transition-[border-color,transform] hover:border-[color-mix(in_oklab,var(--accent)_28%,var(--border))] hover:-translate-y-0.5"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              {kindLabel[card.kind]}
            </span>
            <span className="mt-2 text-base font-semibold text-[var(--foreground)]">
              {card.label}
            </span>
            <span className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
              {card.description}
            </span>
            {card.siteAnchor && card.siteAnchor !== "global" ? (
              <span className="mt-4 text-xs font-mono text-[var(--muted)]">
                Website:{" "}
                <span className="text-[var(--foreground)]">
                  {previewBase}
                  {card.siteAnchor}
                </span>
              </span>
            ) : card.siteAnchor === "global" ? (
              <span className="mt-4 text-xs text-[var(--muted)]">
                Gilt auf der gesamten Startseite
              </span>
            ) : null}
            <span className="mt-4 text-xs font-semibold text-[var(--accent)] group-hover:underline">
              Bearbeiten →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
