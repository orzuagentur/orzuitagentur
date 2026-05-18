"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTENT_SECTIONS } from "@/lib/dashboard/content-sections";

function linkClass(active: boolean) {
  return [
    "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
    active
      ? "border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--foreground)]"
      : "border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]",
  ].join(" ");
}

export function ContentSectionNav() {
  const pathname = usePathname();
  const onHub = pathname === "/dashboard/content";

  return (
    <nav
      aria-label="Content-Bereiche"
      className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_92%,transparent)] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-8 lg:px-10">
        <Link href="/dashboard/content" className={linkClass(onHub)}>
          Übersicht
        </Link>
        {CONTENT_SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={linkClass(pathname === section.href)}
          >
            {section.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
