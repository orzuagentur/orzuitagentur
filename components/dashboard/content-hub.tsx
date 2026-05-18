import Link from "next/link";
import {
  CONTENT_RELATED_CMS,
  CONTENT_SECTIONS,
} from "@/lib/dashboard/content-sections";

export function ContentHub() {
  return (
    <div className="px-4 pb-16 pt-6 sm:px-8 lg:px-10">
      <p className="max-w-2xl text-sm text-[var(--muted)]">
        Wählen Sie einen Bereich der Startseite. Jeder Block hat eine eigene Seite —
        Texte werden in Supabase unter <code className="font-mono text-xs">marketing</code>{" "}
        gespeichert.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTENT_SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_85%,transparent)] p-5 transition-colors hover:border-[color-mix(in_oklab,var(--accent)_35%,var(--border))]"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
              {section.siteAnchor === "global" ? "Global" : section.siteAnchor}
            </p>
            <h2 className="mt-2 text-base font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
              {section.label}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {section.description}
            </p>
          </Link>
        ))}
      </div>

      <h3 className="mt-12 text-sm font-semibold text-[var(--foreground)]">
        Weitere Inhalte (eigene Bereiche)
      </h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {CONTENT_RELATED_CMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm transition-colors hover:border-[var(--border-strong)] hover:bg-white/[0.02]"
          >
            <span className="font-medium text-[var(--foreground)]">{item.label}</span>
            <span className="mt-1 block text-[var(--muted)]">{item.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
