"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTENT_SECTIONS } from "@/lib/dashboard/content-sections";

export function ContentSectionNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_55%,var(--background))]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 lg:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--muted)]">
          Startseite · Texte bearbeiten
        </p>
        <nav
          aria-label="Bereiche der Startseite"
          className="mt-3 inline-flex max-w-full flex-wrap gap-1 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_88%,transparent)] p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]"
        >
          {CONTENT_SECTIONS.map((section) => {
            const active = pathname === section.href;
            return (
              <Link
                key={section.href}
                href={section.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative rounded-xl px-3.5 py-2 text-xs font-medium transition-[color,background,box-shadow]",
                  active
                    ? "bg-[color-mix(in_oklab,var(--accent)_14%,var(--surface-elevated))] text-[var(--foreground)] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
                    : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--foreground)]",
                ].join(" ")}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
